/**
 * Fail the build when a referenced asset has no file behind it.
 *
 *   bun scripts/check-assets.ts
 *
 * Most art and audio is addressed by a *key* the API sends, not by an import, so
 * nothing in the bundle ever mentions the file — a rename or a typo used to surface
 * only as a blank banner or silence in production, with nothing in the console. This
 * closes that gap:
 *
 *   - **error** — a music key whose whole fallback chain is missing (that phase
 *     would be silent), or a role/power image that does not exist.
 *   - **warning** — a not-yet-produced sfx or voice line. The engine handles these
 *     gracefully, so they must not block a build; `generate-audio.ts` fills them in.
 */
import { access } from "node:fs/promises";
import { MUSIC, SFX, VOICE } from "../src/audio/manifest.ts";
import { ROLES } from "../src/core/roles.ts";
import { PACKS } from "./audio-plan.ts";

const AUDIO = new URL("../public/assets/audio/", import.meta.url).pathname;
const IMAGES = new URL("../public/assets/images/", import.meta.url).pathname;

const exists = (path: string) => access(path).then(() => true, () => false);

const errors: string[] = [];
const warnings: string[] = [];

/** Scene art the client references directly (the API sends these stems too). */
const SCENE_IMAGES = [
  "scene_menu", "scene_aube", "scene_debat", "scene_vote",
  "scene_victory_village", "scene_victory_songomby",
];
/** Brand assets stay PNG — favicons and social scrapers consume them, not players. */
const BRAND_IMAGES = ["brand_icon", "brand_og"];

async function main() {
  // ── music: every key needs at least one file in its chain ──
  for (const [key, candidates] of Object.entries(MUSIC)) {
    const found = [];
    for (const file of candidates) if (await exists(AUDIO + file)) found.push(file);
    if (!found.length) errors.push(`music "${key}" — aucun fichier (${candidates.join(", ")}) → phase muette`);
    else if (found[0] !== candidates[0]) warnings.push(`music "${key}" — repli sur ${found[0]} (${candidates[0]} pas encore produit)`);
  }

  // ── one-shots and static voice: missing is tolerated, just report it ──
  for (const [key, candidates] of Object.entries(SFX)) {
    if (!(await exists(AUDIO + candidates[0]!))) warnings.push(`sfx "${key}" — ${candidates[0]} absent`);
  }
  for (const [key, candidates] of Object.entries(VOICE)) {
    if (!(await exists(AUDIO + candidates[0]!))) warnings.push(`voix "${key}" — ${candidates[0]} absent`);
  }

  // ── images: a missing background-image fails silently, so treat it as an error ──
  for (const role of Object.values(ROLES)) {
    if (!(await exists(`${IMAGES}${role.asset}.webp`))) errors.push(`role "${role.id}" — ${role.asset}.webp absent`);
    for (const power of role.powers ?? []) {
      if (!(await exists(`${IMAGES}${power.art}.webp`))) warnings.push(`pouvoir "${power.art}.webp" absent (${role.id} — codex incomplet)`);
    }
  }
  for (const stem of SCENE_IMAGES) {
    if (!(await exists(`${IMAGES}${stem}.webp`))) errors.push(`scène "${stem}.webp" absente`);
  }
  for (const stem of BRAND_IMAGES) {
    if (!(await exists(`${IMAGES}${stem}.png`))) errors.push(`marque "${stem}.png" absente`);
  }

  // ── recorded narration packs ──
  // A pack line is played by file name off a text match, so a missing file is silent
  // narration at a dramatic beat. And a recording cannot interpolate, so a stray
  // placeholder means a line that would be spoken literally as "{victim}".
  // Packs share one audio directory, so a copy-pasted file prefix would have one
  // legend quietly playing the other's lines: collisions are an error too.
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
    for (const line of pack.lines) {
      if (!(await exists(AUDIO + line.file))) errors.push(`pack "${pack.id}" — ${line.file} absent (${line.label})`);
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
  }

  for (const w of warnings) console.warn(`⚠️  ${w}`);
  for (const e of errors) console.error(`❌ ${e}`);
  console.log(`\n${errors.length} erreur(s) · ${warnings.length} avertissement(s)`);
  if (errors.length) process.exit(1);
}

await main();
