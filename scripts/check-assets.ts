/**
 * Fail the build when a referenced asset has no file behind it.
 *
 *   bun scripts/check-assets.ts
 *
 * Most art and audio is addressed by a *key* the API sends, not by an import, so
 * nothing in the bundle ever mentions the file — a rename or a typo used to surface
 * only as a blank banner or silence in production, with nothing in the console.
 *
 * What counts as an error lives in `asset-inventory.ts`, next to the list itself, so
 * that this script and `check-live.ts` cannot disagree about what a healthy build
 * looks like. This one adds the checks that only make sense on the source: a pack's
 * text has to survive the trip to the recording booth.
 */
import { access } from "node:fs/promises";
import {
  foleyAssets, imageAssets, musicChains, oneShotAssets, packAssets, type AssetRef,
} from "./asset-inventory.ts";
import { PACKS } from "./audio-plan.ts";

const ASSETS = new URL("../public/assets/", import.meta.url).pathname;

const exists = (path: string) => access(path).then(() => true, () => false);

const errors: string[] = [];
const warnings: string[] = [];

/** Route a missing file to the bucket the inventory picked for it. */
function report(ref: AssetRef, detail: string) {
  (ref.severity === "error" ? errors : warnings).push(`${ref.label} — ${detail}`);
}

async function main() {
  // ── files, by severity ──
  for (const ref of [...imageAssets(), ...foleyAssets(), ...oneShotAssets(), ...packAssets()]) {
    if (!(await exists(ASSETS + ref.path))) report(ref, `${ref.path.split("/").pop()} absent`);
  }

  // ── music: a key resolves as long as one file in its chain does ──
  for (const chain of musicChains()) {
    const found = [];
    for (const file of chain.files) if (await exists(`${ASSETS}audio/${file}`)) found.push(file);
    if (!found.length) errors.push(`music "${chain.key}" — aucun fichier (${chain.files.join(", ")}) → phase muette`);
    else if (found[0] !== chain.files[0]) warnings.push(`music "${chain.key}" — repli sur ${found[0]} (${chain.files[0]} pas encore produit)`);
  }

  // ── recorded narration packs: the text, not just the files ──
  // A recording cannot interpolate, so a stray placeholder means a line that would be
  // spoken literally as "{victim}". Packs share one audio directory, so a copy-pasted
  // file prefix would have one legend quietly playing the other's lines: collisions
  // are an error too.
  //
  // A `direction` is what actually gets synthesised, while `text` is what the browser
  // matches on — so the two must say the same words. Drift there is invisible at every
  // other layer: the file exists, the match succeeds, and the voice says something
  // else. Tags and punctuation may differ; nothing else may.
  const words = (t: string) =>
    t.replace(/\[[^\]]*\]/g, " ").toLowerCase()
     .replace(/[’‘]/g, "'").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  /** eleven_v3 *performs* these rather than interpreting them — audibly, and badly. */
  const NON_VERBAL = /\[(sighs?|laughs?|gasps?|coughs?|clears throat|breathes?)\]/i;

  const seen = new Map<string, string>();
  for (const pack of PACKS) {
    // A pack with *nothing* recorded is a different animal from a pack with gaps:
    // that means the id is wrong, and no line will ever be found.
    let recorded = 0;
    for (const line of pack.lines) {
      if (await exists(`${ASSETS}audio/${line.file}`)) recorded++;
      if (/\{[a-zA-Z_]+\}/.test(line.text)) errors.push(`pack "${pack.id}" — ${line.label} contient un placeholder, impossible à enregistrer`);
      if (/\[[^\]]*\]/.test(line.text)) errors.push(`pack "${pack.id}" — ${line.label} : une balise dans "text" ferait échouer l'appariement`);
      if (line.direction) {
        if (words(line.direction) !== words(line.text)) errors.push(`pack "${pack.id}" — ${line.label} : la direction ne dit pas le même texte`);
        if (NON_VERBAL.test(line.direction)) errors.push(`pack "${pack.id}" — ${line.label} : balise non-verbale, jouée littéralement`);
      }
      const owner = seen.get(line.file);
      if (owner) errors.push(`pack "${pack.id}" — ${line.file} déjà utilisé par "${owner}"`);
      else seen.set(line.file, pack.id);
    }
    if (!recorded) errors.push(`pack "${pack.id}" — aucune ligne enregistrée : l'id ne correspond à rien de produit`);
  }

  for (const w of warnings) console.warn(`⚠️  ${w}`);
  for (const e of errors) console.error(`❌ ${e}`);
  console.log(`\n${errors.length} erreur(s) · ${warnings.length} avertissement(s)`);
  if (errors.length) process.exit(1);
}

await main();
