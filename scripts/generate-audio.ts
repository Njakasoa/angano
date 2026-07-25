/**
 * Generate the game's sound assets from `audio-plan.ts` via ElevenLabs.
 *
 *   ELEVENLABS_API_KEY=sk_... bun scripts/generate-audio.ts [--sfx] [--voice]
 *                                                           [--ambiance] [--force]
 *
 * Default (no flag) produces sfx + voice: the two families that map cleanly onto
 * what the API does well. Ambiance is opt-in — see the note in audio-plan.ts.
 *
 * Existing files are skipped unless `--force`, so a re-run costs nothing and you
 * can regenerate a single sound by deleting it. Nothing is written unless the
 * response is a non-trivial audio payload, so a quota error cannot leave a broken
 * stub behind that the fallback chain would then happily "resolve".
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import { AMBIANCE, SFX, VOICE } from "./audio-plan.ts";

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_NARRATOR ?? "qCDtdqQv5bdcrgWED5k8"; // Arthur Martin (fr)
const MODEL = process.env.ELEVENLABS_MODEL ?? "eleven_flash_v2_5";
const BASE = process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io";
const OUT = new URL("../public/assets/audio/", import.meta.url).pathname;

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const picked = ["--sfx", "--voice", "--ambiance"].filter((f) => args.has(f));
const want = picked.length ? new Set(picked) : new Set(["--sfx", "--voice"]);

/**
 * Mirrors core-api's `pronunciation.ts`. Duplicated rather than shared because the
 * repos ship separately — keep the two in step when adding a role.
 */
const PHONETIC: Record<string, string> = {
  songomby: "sougoumbi", mpisikidy: "mpissikidi", ombiasy: "oumbiassi", fanany: "fanani",
  zazavavindrano: "zazavavindranou", kalanoro: "kalanourou", kinoly: "kinouli",
  mpamosavy: "mpamoussavi", mponina: "mpounina", angano: "anganou", razana: "razana",
  sikidy: "sikidi", fady: "fadi", ody: "oudi",
};
const PATTERN = new RegExp(`\\b(${Object.keys(PHONETIC).sort((a, b) => b.length - a.length).join("|")})\\b`, "gi");
const speakable = (text: string) =>
  text.replace(PATTERN, (w) => {
    const r = PHONETIC[w.toLowerCase()]!;
    return w[0] === w[0]?.toUpperCase() ? r[0]!.toUpperCase() + r.slice(1) : r;
  });

const exists = (path: string) => access(path).then(() => true, () => false);

async function post(url: string, body: unknown): Promise<Uint8Array | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "xi-api-key": KEY!, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`  ✗ HTTP ${res.status} — ${(await res.text()).slice(0, 180)}`);
    return null;
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength < 512) { // an error page or a truncated stream, never real audio
    console.error(`  ✗ suspiciously small payload (${bytes.byteLength} B) — not written`);
    return null;
  }
  return bytes;
}

async function produce(label: string, file: string, make: () => Promise<Uint8Array | null>) {
  const path = OUT + file;
  if (!force && (await exists(path))) { console.log(`  ⏭  ${file} (déjà présent)`); return "skipped" as const; }
  const bytes = await make();
  if (!bytes) return "failed" as const;
  await writeFile(path, bytes);
  console.log(`  ✓ ${file} — ${(bytes.byteLength / 1024).toFixed(0)} Ko  · ${label}`);
  return "written" as const;
}

async function main() {
  if (!KEY) {
    console.error("ELEVENLABS_API_KEY manquant.\n" +
      "  ELEVENLABS_API_KEY=sk_... bun scripts/generate-audio.ts");
    process.exit(1);
  }
  await mkdir(OUT, { recursive: true });
  const tally = { written: 0, skipped: 0, failed: 0 };
  const count = (r: "written" | "skipped" | "failed") => { tally[r]++; };

  if (want.has("--sfx")) {
    console.log(`\n🔊 Bruitages (${SFX.length})`);
    for (const s of SFX) {
      count(await produce(s.key, s.file, () =>
        post(`${BASE}/v1/sound-generation`, { text: s.prompt, duration_seconds: s.seconds, prompt_influence: 0.6 })));
    }
  }

  if (want.has("--voice")) {
    console.log(`\n🎙️  Voix off (${VOICE.length})`);
    for (const v of VOICE) {
      count(await produce(v.text.slice(0, 48) + "…", v.file, () =>
        post(`${BASE}/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
          { text: speakable(v.text), model_id: MODEL })));
    }
  }

  if (want.has("--ambiance")) {
    console.log(`\n🌙 Ambiances (${AMBIANCE.length}) — non bouclées proprement, à écouter avant de committer`);
    for (const a of AMBIANCE) {
      count(await produce(a.key, a.file, () =>
        post(`${BASE}/v1/sound-generation`, { text: a.prompt, duration_seconds: a.seconds, prompt_influence: 0.5 })));
    }
  }

  console.log(`\n${tally.written} écrits · ${tally.skipped} ignorés · ${tally.failed} en échec`);
  if (tally.failed) process.exit(1);
}

await main();
