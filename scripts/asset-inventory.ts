/**
 * Every file the game can ask for, derived from the same tables the client reads.
 *
 * Two checkers consume this: `check-assets.ts` looks for the files on disk before a
 * build, `check-live.ts` looks for them on the deployed site. They used to share
 * nothing, which is how production ended up serving a codex with five holes in it
 * while the build was green — the list of what to look for lived in one script only.
 *
 * Severity is decided here, once, so the two answers cannot drift:
 *   - **error** — the player sees a hole (a blank banner) or hears silence.
 *   - **warning** — the engine degrades on purpose (a chain falls back, a one-shot
 *     that has not been produced simply does not fire).
 */
import { MUSIC, SFX, VOICE, musicCandidates } from "../src/audio/manifest.ts";
import { ROLES } from "../src/core/roles.ts";
import { FOLEY, PACKS } from "./audio-plan.ts";

export type Severity = "error" | "warning";

/** One file to look for, and what to say if it is not there. */
export interface AssetRef {
  /** Path under `/assets/` — `images/role_fanany.webp`, `audio/aube.mp3`. */
  path: string;
  label: string;
  severity: Severity;
}

/** A music key and its candidates, most-wanted first. Missing = the phase is silent. */
export interface MusicChain {
  key: string;
  files: string[];
}

/** Scene art the client references directly (the API sends these stems too). */
export const SCENE_IMAGES = [
  "scene_menu", "scene_aube", "scene_debat", "scene_vote",
  "scene_victory_village", "scene_victory_songomby",
];

/** Brand assets stay PNG — favicons and social scrapers consume them, not players. */
export const BRAND_IMAGES = ["brand_icon", "brand_og"];

/**
 * Every visual, all of them errors.
 *
 * A missing `background-image` throws nothing and logs nothing: the tile just goes
 * black. Power art used to be a warning here, from the months when the paintings did
 * not exist yet — and that tolerance is exactly what shipped `power_fanany_marque`
 * and four others to production as empty squares. They all exist now, so the gap
 * closes with the gap.
 */
export function imageAssets(): AssetRef[] {
  const out: AssetRef[] = [];
  for (const role of Object.values(ROLES)) {
    out.push({ path: `images/${role.asset}.webp`, label: `rôle "${role.id}"`, severity: "error" });
    for (const power of role.powers ?? []) {
      out.push({ path: `images/${power.art}.webp`, label: `pouvoir "${power.label}" (${role.id})`, severity: "error" });
    }
  }
  for (const stem of SCENE_IMAGES) out.push({ path: `images/${stem}.webp`, label: `scène "${stem}"`, severity: "error" });
  for (const stem of BRAND_IMAGES) out.push({ path: `images/${stem}.png`, label: `marque "${stem}"`, severity: "error" });
  return out;
}

/** Looping ambiance, by key. A key resolves as long as one file in its chain exists. */
export function musicChains(): MusicChain[] {
  return Object.keys(MUSIC).map((key) => ({ key, files: musicCandidates(key, "musique") }));
}

/**
 * The night's foley beds — errors.
 *
 * They sit in front of the composed beds in the chain, so a missing one is not
 * silence. It is worse in a way: the night quietly reverts to music and nobody
 * notices, which is the state production is in right now. `scenarios.mjs` asserts the
 * beds play; this makes the build agree.
 */
export function foleyAssets(): AssetRef[] {
  return FOLEY.map((f) => ({ path: `audio/${f.file}`, label: `lit foley "${f.key}"`, severity: "error" as const }));
}

/** One-shots and static voice lines — the engine simply skips what it cannot load. */
export function oneShotAssets(): AssetRef[] {
  const out: AssetRef[] = [];
  for (const [key, files] of Object.entries(SFX)) {
    out.push({ path: `audio/${files[0]}`, label: `sfx "${key}"`, severity: "warning" });
  }
  for (const [key, files] of Object.entries(VOICE)) {
    out.push({ path: `audio/${files[0]}`, label: `voix "${key}"`, severity: "warning" });
  }
  return out;
}

/**
 * Recorded narration packs.
 *
 * A line with no file is a production gap, not a break: the browser falls back to the
 * runtime voice, or to text. The triage loop — listen, delete what does not work,
 * re-record — lives entirely in that gap, so these stay warnings.
 */
export function packAssets(): AssetRef[] {
  return PACKS.flatMap((pack) =>
    pack.lines.map((line) => ({
      path: `audio/${line.file}`,
      label: `pack "${pack.id}" — ${line.label}`,
      severity: "warning" as const,
    })),
  );
}
