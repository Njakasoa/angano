/**
 * Ask the deployed site what it actually serves.
 *
 *   bun scripts/check-live.ts                       # angano.njakasoa.xyz
 *   ANGANO_LIVE=http://localhost:4173 bun scripts/check-live.ts
 *
 * `check-assets.ts` proves the files exist in the repository. That is a different
 * question from whether they exist *in production*, and the gap between the two is
 * invisible from both ends: art is addressed by a key the API sends, so a file that
 * never got deployed shows up as a blank tile on a phone and as nothing at all in the
 * console or in a build log.
 *
 * Two traps this script exists to avoid:
 *   - **the SPA fallback.** An unknown path does not 404 — the host answers the app's
 *     `index.html` with `200 text/html`. A status check alone therefore passes on a
 *     missing image. The content type is what tells the truth.
 *   - **the stale deploy.** `/version.json` (emitted by the build, see `vite.config.ts`)
 *     says which commit is live, so "the fix is deployed" stops being a guess.
 */
import { execFileSync } from "node:child_process";
import {
  foleyAssets, imageAssets, musicChains, oneShotAssets, packAssets, type AssetRef,
} from "./asset-inventory.ts";

const BASE = (process.env.ANGANO_LIVE || "https://angano.njakasoa.xyz").replace(/\/+$/, "");
const CONCURRENCY = 8;

const git = (...args: string[]): string | null => {
  try { return execFileSync("git", args, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim() || null; }
  catch { return null; }
};

/** A file is served when the answer is not an error *and* not the app's own HTML. */
async function served(path: string): Promise<{ ok: boolean; why: string }> {
  try {
    const res = await fetch(`${BASE}/assets/${path}`, { method: "HEAD", redirect: "follow" });
    const type = res.headers.get("content-type") ?? "";
    if (res.status >= 400) return { ok: false, why: `HTTP ${res.status}` };
    if (type.startsWith("text/html")) return { ok: false, why: "fallback SPA (jamais déployé)" };
    return { ok: true, why: type };
  } catch (e) {
    return { ok: false, why: `injoignable (${(e as Error).message})` };
  }
}

/** Run `jobs` a few at a time — the whole inventory is ~130 requests. */
async function pooled<T>(jobs: (() => Promise<T>)[]): Promise<T[]> {
  const out: T[] = new Array(jobs.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, async () => {
    for (let i = next++; i < jobs.length; i = next++) out[i] = await jobs[i]!();
  }));
  return out;
}

const errors: string[] = [];
const warnings: string[] = [];

async function reportDeployedCommit() {
  let stamp: { sha?: string; branch?: string; builtAt?: string } | null = null;
  try {
    const res = await fetch(`${BASE}/version.json`, { headers: { "cache-control": "no-cache" } });
    if (res.ok && (res.headers.get("content-type") ?? "").includes("json")) stamp = await res.json();
  } catch { /* reported below */ }

  if (!stamp?.sha) {
    warnings.push("aucun /version.json en ligne — build antérieur à l'empreinte, ou déploiement partiel");
    return;
  }
  console.log(`📦 en ligne : ${stamp.sha} (${stamp.branch ?? "?"}) · construit le ${stamp.builtAt ?? "?"}`);

  const head = git("rev-parse", "--short", "HEAD");
  if (stamp.sha === head) { console.log("   ✅ identique à HEAD local"); return; }
  // `main` is what deploys, so that is the distance worth printing.
  const behind = git("rev-list", "--count", `${stamp.sha}..main`);
  if (behind && behind !== "0") console.log(`   ⏳ ${behind} commit(s) de main pas encore en ligne`);
  else if (!behind) console.log(`   ℹ️  commit inconnu localement (HEAD = ${head ?? "?"}) — dépôt pas à jour ?`);
}

async function main() {
  console.log(`🌐 ${BASE}`);
  console.log("   (l'inventaire est celui des sources locales : sur un déploiement en retard, tout ce qui suit décrit ce qui manquerait aujourd'hui)\n");
  await reportDeployedCommit();

  const refs: AssetRef[] = [...imageAssets(), ...foleyAssets(), ...oneShotAssets(), ...packAssets()];
  const results = await pooled(refs.map((ref) => async () => ({ ref, res: await served(ref.path) })));
  for (const { ref, res } of results) {
    if (res.ok) continue;
    (ref.severity === "error" ? errors : warnings).push(`${ref.label} — ${ref.path} : ${res.why}`);
  }

  // A music key is fine as long as one file in its chain is served.
  const chains = musicChains();
  const chainResults = await pooled(chains.map((chain) => async () => {
    for (const file of chain.files) if ((await served(`audio/${file}`)).ok) return file;
    return null;
  }));
  chains.forEach((chain, i) => {
    const found = chainResults[i];
    if (!found) errors.push(`music "${chain.key}" — aucun fichier en ligne (${chain.files.join(", ")}) → phase muette pour ce manifeste`);
    else if (found !== chain.files[0]) warnings.push(`music "${chain.key}" — repli sur ${found}`);
  });

  // Warnings arrive by the dozen when a whole family is missing; keep the tail short.
  const MAX_WARNINGS = 8;
  for (const w of warnings.slice(0, MAX_WARNINGS)) console.warn(`⚠️  ${w}`);
  if (warnings.length > MAX_WARNINGS) console.warn(`⚠️  … et ${warnings.length - MAX_WARNINGS} autre(s)`);
  for (const e of errors) console.error(`❌ ${e}`);

  console.log(`\n${refs.length + chains.length} clé(s) sondée(s) · ${errors.length} erreur(s) · ${warnings.length} avertissement(s)`);
  if (errors.length) process.exit(1);
}

await main();
