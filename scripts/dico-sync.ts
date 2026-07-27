/**
 * Publish `pronunciation-rules.ts` to ElevenLabs as a pronunciation dictionary.
 *
 *   ELEVENLABS_API_KEY=sk_... bun run dico:sync            # crée un dictionnaire
 *   ELEVENLABS_API_KEY=sk_... bun run dico:sync --id <id>  # remplace les règles d'un existant
 *
 * Prints the id and version to put in `ELEVENLABS_DICT_ID` / `ELEVENLABS_DICT_VERSION`
 * on both sides — core-api uses them for the runtime narration, this repo's
 * `generate-audio.ts` for the recorded packs.
 *
 * **A new version invalidates nothing on disk.** Files already recorded keep the
 * pronunciation they were made with; only the next generation changes. core-api folds
 * the version into its cache key, so its runtime clips do refresh.
 */
import { rules, ALL } from "./pronunciation-rules.ts";

const KEY = process.env.ELEVENLABS_API_KEY;
const BASE = process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io";

if (!KEY) {
  console.error("ELEVENLABS_API_KEY manquant.");
  process.exit(1);
}

const argv = process.argv.slice(2);
const existing = argv[argv.indexOf("--id") + 1];
const updating = argv.includes("--id") && existing && !existing.startsWith("--");

const body = rules();
const path = updating
  ? `/v1/pronunciation-dictionaries/${existing}/set-rules`
  : "/v1/pronunciation-dictionaries/add-from-rules";
const payload = updating
  ? { rules: body }
  : {
      name: "Angano — malgache",
      description: "Rôles, mots courants et noms de lieux malgaches, respellés pour une voix française.",
      rules: body,
    };

const res = await fetch(BASE + path, {
  method: "POST",
  headers: { "xi-api-key": KEY, "content-type": "application/json" },
  body: JSON.stringify(payload),
});
const text = await res.text();
if (!res.ok) {
  console.error(`✗ HTTP ${res.status} — ${text.slice(0, 400)}`);
  process.exit(1);
}
const out = JSON.parse(text) as { id: string; version_id: string };

console.log(`✓ ${updating ? "règles remplacées" : "dictionnaire créé"} — ${body.length} règles pour ${Object.keys(ALL).length} termes`);
console.log(`\nÀ reporter dans core-api/.env ET angano/.env :`);
console.log(`  ELEVENLABS_DICT_ID=${out.id}`);
console.log(`  ELEVENLABS_DICT_VERSION=${out.version_id}`);
console.log(`\nLes fichiers déjà enregistrés gardent leur prononciation — seule la prochaine`);
console.log(`génération en profite. Pour tout refaire : supprimer les .mp3 concernés.`);
