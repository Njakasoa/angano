/**
 * Generate the game's sound assets from `audio-plan.ts` via ElevenLabs.
 *
 *   ELEVENLABS_API_KEY=sk_... bun scripts/generate-audio.ts [--sfx] [--voice]
 *                                     [--ambiance] [--pack[=<id>]] [--force]
 *
 * Default (no flag) produces sfx + voice: the two families that map cleanly onto
 * what the API does well. Ambiance is opt-in — see the note in audio-plan.ts.
 * `--pack` covers every recorded legend; `--pack=<id>` narrows it to one, which is
 * what you want with `--force`.
 *
 * Existing files are skipped unless `--force`, so a re-run costs nothing and you
 * can regenerate a single sound by deleting it. Nothing is written unless the
 * response is a non-trivial audio payload, so a quota error cannot leave a broken
 * stub behind that the fallback chain would then happily "resolve".
 */
import { mkdir, writeFile, access, unlink } from "node:fs/promises";
import { AMBIANCE, PACKS, SFX, VOICE } from "./audio-plan.ts";

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_NARRATOR ?? "qCDtdqQv5bdcrgWED5k8"; // Arthur Martin (fr)
/**
 * Keep this in step with core-api's ELEVENLABS_MODEL. These lines are heard in the
 * same breath as the runtime narration, and the same voice renders differently
 * from one model to the next.
 */
const MODEL = process.env.ELEVENLABS_MODEL ?? "eleven_multilingual_v2";
const BASE = process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io";
const OUT = new URL("../public/assets/audio/", import.meta.url).pathname;

/** Voice settings — omitted ones keep the voice's own defaults. */
function voiceSettings(): Record<string, number> | undefined {
  const read = (name: string) => {
    const raw = process.env[name];
    return raw === undefined || raw === "" ? undefined : Number(raw);
  };
  const settings: Record<string, number> = {};
  const stability = read("ELEVENLABS_STABILITY");
  const similarity = read("ELEVENLABS_SIMILARITY");
  const style = read("ELEVENLABS_STYLE");
  const speed = read("ELEVENLABS_SPEED");
  if (stability !== undefined) settings.stability = stability;
  if (similarity !== undefined) settings.similarity_boost = similarity;
  if (style !== undefined) settings.style = style;
  if (speed !== undefined) settings.speed = speed;
  return Object.keys(settings).length ? settings : undefined;
}
const SETTINGS = voiceSettings();

const argv = process.argv.slice(2);
const args = new Set(argv.map((a) => a.split("=")[0]!));
const force = args.has("--force");
const picked = ["--sfx", "--voice", "--ambiance", "--pack"].filter((f) => args.has(f));
const want = picked.length ? new Set(picked) : new Set(["--sfx", "--voice"]);
/** `--pack=barriere-rompue` narrows to one legend — a `--force` re-record of every
 *  pack is otherwise a large, and entirely avoidable, bill. */
const onlyPack = argv.find((a) => a.startsWith("--pack="))?.slice("--pack=".length);

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

/** Seconds of overlap used to close a loop. Long enough to hide a seam, short
 *  enough not to eat the phrase. */
const LOOP_CROSSFADE_S = 3;

/**
 * Close a generated bed into a seamless loop.
 *
 * A composed clip starts and ends cold, so `audio.loop = true` clicks audibly every
 * time round. Crossfading the tail back over the head removes the seam at build
 * time, which keeps the player simple — the browser just loops the file.
 *
 * Returns the input untouched if ffmpeg is unavailable: a bed with an audible seam
 * still beats no bed at all.
 */
async function seamlessLoop(bytes: Uint8Array): Promise<Uint8Array> {
  const tmp = `${OUT}.loop-tmp-${Date.now()}`;
  const src = `${tmp}-in.mp3`;
  const dst = `${tmp}-out.mp3`;
  try {
    await writeFile(src, bytes);
    const probe = Bun.spawn(
      ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
      { stdout: "pipe", stderr: "ignore" },
    );
    const duration = Number((await new Response(probe.stdout).text()).trim());
    if (!Number.isFinite(duration) || duration <= LOOP_CROSSFADE_S * 2) return bytes;

    const mid = duration - LOOP_CROSSFADE_S;
    const filter =
      `[0]atrim=start=${LOOP_CROSSFADE_S}:end=${mid},asetpts=N/SR/TB[mid];` +
      `[0]atrim=start=${mid},asetpts=N/SR/TB[tail];` +
      `[0]atrim=start=0:end=${LOOP_CROSSFADE_S},asetpts=N/SR/TB[head];` +
      `[tail][head]acrossfade=d=${LOOP_CROSSFADE_S}:c1=tri:c2=tri[xf];` +
      `[mid][xf]concat=n=2:v=0:a=1[out]`;
    const ff = Bun.spawn(
      ["ffmpeg", "-v", "error", "-y", "-i", src, "-filter_complex", filter, "-map", "[out]", "-c:a", "libmp3lame", "-b:a", "128k", dst],
      { stdout: "ignore", stderr: "ignore" },
    );
    if ((await ff.exited) !== 0) { console.warn("  ⚠️  ffmpeg indisponible — boucle non refermée"); return bytes; }
    return new Uint8Array(await Bun.file(dst).arrayBuffer());
  } catch {
    return bytes;
  } finally {
    await Promise.all([unlink(src).catch(() => {}), unlink(dst).catch(() => {})]);
  }
}

/**
 * Fallback performance direction, derived from the line's role.
 *
 * Applied at generation time rather than baked into the text: the approved wording in
 * the pack stays exactly what was reviewed, and re-directing a whole pack is one edit
 * here instead of forty. A line that carries its own `direction` overrides this —
 * this can only place one tag at the very front.
 */
function direction(label: string): string {
  if (/^nuit_|^ambiance_night$/.test(label)) return "[whispers] ";
  if (/^(vote_|jour_vote_|ambiance_vote$|razana_|victoire_)/.test(label)) return "[dramatically] ";
  if (/^(jour_debate_|ambiance_debate$)/.test(label)) return "";
  return "[solemn] ";   // intro, dawn, deaths, reveals
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
    console.log(`\n🎙️  Voix off (${VOICE.length}) — ${MODEL}${SETTINGS ? ` · ${JSON.stringify(SETTINGS)}` : " · réglages par défaut de la voix"}`);
    for (const v of VOICE) {
      count(await produce(v.text.slice(0, 48) + "…", v.file, () =>
        post(`${BASE}/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
          { text: speakable(v.text), model_id: MODEL, ...(SETTINGS ? { voice_settings: SETTINGS } : {}) })));
    }
  }

  if (want.has("--ambiance")) {
    console.log(`\n🌙 Ambiances (${AMBIANCE.length}) — composées puis refermées en boucle`);
    for (const a of AMBIANCE) {
      count(await produce(a.key, a.file, async () => {
        const raw = await post(`${BASE}/v1/music`, { prompt: a.prompt, music_length_ms: a.seconds * 1000 });
        return raw ? await seamlessLoop(raw) : null;
      }));
    }
  }

  if (want.has("--pack")) {
    const packModel = process.env.ELEVENLABS_PACK_MODEL ?? "eleven_v3";
    const packs = onlyPack ? PACKS.filter((p) => p.id === onlyPack) : PACKS;
    if (onlyPack && !packs.length) {
      console.error(`Pack inconnu « ${onlyPack} » — connus : ${PACKS.map((p) => p.id).join(", ")}`);
      process.exit(1);
    }
    for (const pack of packs) {
      // The voice belongs to the pack, not to the run: one legend, one teller.
      const packVoice = process.env.ELEVENLABS_PACK_VOICE ?? pack.voice;
      console.log(`\n📖 Pack « ${pack.id} » (${pack.lines.length} lignes) — ${packModel} · voix ${packVoice}`);
      for (const line of pack.lines) {
        if (/\{[a-zA-Z_]+\}/.test(line.text)) {   // a recording cannot interpolate
          console.error(`  ✗ ${line.label} contient un placeholder — pack refusé`);
          process.exit(1);
        }
        const spoken = line.direction ?? direction(line.label) + line.text;
        count(await produce(line.label, line.file, () =>
          post(`${BASE}/v1/text-to-speech/${packVoice}?output_format=mp3_44100_128`,
            { text: speakable(spoken), model_id: packModel })));
      }
    }
  }

  console.log(`\n${tally.written} écrits · ${tally.skipped} ignorés · ${tally.failed} en échec`);
  if (tally.failed) process.exit(1);
}

await main();
