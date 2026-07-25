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

  for (const w of warnings) console.warn(`⚠️  ${w}`);
  for (const e of errors) console.error(`❌ ${e}`);
  console.log(`\n${errors.length} erreur(s) · ${warnings.length} avertissement(s)`);
  if (errors.length) process.exit(1);
}

await main();
