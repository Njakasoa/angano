/**
 * Banc d'essai ElevenLabs — pour choisir la voix du conteur **à l'oreille**.
 *
 *   ELEVENLABS_API_KEY=sk_... bun scripts/audition-voice.ts <commande> [options]
 *
 * Tout sort dans `audition/` (gitignoré), avec des noms de fichiers explicites :
 * tu ouvres le dossier, tu écoutes dans l'ordre, tu gardes le meilleur.
 *
 * ── Commandes ────────────────────────────────────────────────────────────────
 *   list                     Liste les voix du compte (--fr pour ne garder que le français)
 *   voices <id,id,...>       La même réplique, dite par chaque voix
 *   models  [--voice <id>]   La même réplique, par chaque modèle
 *   sweep <param>            Balaye un réglage : stability | style | speed | similarity
 *   one                      Un seul rendu, avec les réglages passés en option
 *
 * ── Options ──────────────────────────────────────────────────────────────────
 *   --voice <id>             Voix à utiliser              (défaut : Arthur Martin)
 *   --model <id>             eleven_v3 | eleven_multilingual_v2 | eleven_flash_v2_5
 *   --text "..."             Réplique à dire             (défaut : l'intro de légende)
 *   --sample <clé>           Réplique du jeu : intro | songomby | kinoly | fanany | mort | victoire
 *   --stability <0..1>       Bas = expressif, haut = monotone
 *   --style <0..1>           Exagération du jeu d'acteur (peut déstabiliser au-delà de .6)
 *   --speed <0.7..1.2>       < 1 = plus lent, plus grave
 *   --similarity <0..1>      Fidélité au timbre d'origine
 *
 * ── Exemples ─────────────────────────────────────────────────────────────────
 *   bun scripts/audition-voice.ts list --fr
 *   bun scripts/audition-voice.ts voices id1,id2,id3 --sample intro
 *   bun scripts/audition-voice.ts models --voice id1
 *   bun scripts/audition-voice.ts sweep stability --voice id1 --model eleven_v3
 *   bun scripts/audition-voice.ts one --voice id1 --stability 0.35 --style 0.55 --speed 0.92
 */
import { mkdir, writeFile } from "node:fs/promises";

const KEY = process.env.ELEVENLABS_API_KEY;
const BASE = process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io";
const OUT = new URL("../audition/", import.meta.url).pathname;

/** Arthur Martin — le défaut actuel, celui que tu veux justement remplacer. */
const DEFAULT_VOICE = "qCDtdqQv5bdcrgWED5k8";
const DEFAULT_MODEL = "eleven_v3";

/** Répliques réelles du jeu : juger sur le vrai texte, pas sur un « bonjour ». */
const SAMPLES: Record<string, string> = {
  intro:
    "Le village d'Ambohitra dort sous une lune rouge. Depuis trois nuits, les tombeaux " +
    "murmurent, et personne n'ose plus traverser la rizière après le crépuscule. " +
    "Cette nuit, quelque chose viendra chercher son dû.",
  songomby: "Les Songomby quittent les roseaux. Choisissez votre proie.",
  kinoly: "Tu es Kinoly, un revenant qui s'ignore encore. La première mort de la nuit te réveillera.",
  fanany: "Tu es Fanany, serpent des ancêtres. Marque un joueur. Si tu tombes, les Razana l'emporteront avec toi.",
  mort: "À l'aube, on a retrouvé son lamba au bord de l'eau. Le corps, lui, n'est jamais revenu.",
  victoire: "Le village a chassé tous les monstres. L'aube, enfin, est douce.",
};

/** Mêmes règles que core-api/src/games/angano/pronunciation.ts. */
const PHONETIC: Record<string, string> = {
  songomby: "sougoumbi", mpisikidy: "mpissikidi", ombiasy: "oumbiassi", fanany: "fanani",
  zazavavindrano: "zazavavindranou", kalanoro: "kalanourou", kinoly: "kinouli",
  mpamosavy: "mpamoussavi", mponina: "mpounina", angano: "anganou", razana: "razana",
  sikidy: "sikidi", fady: "fadi", ody: "oudi", ambohitra: "ambouitra",
};
const PATTERN = new RegExp(`\\b(${Object.keys(PHONETIC).sort((a, b) => b.length - a.length).join("|")})\\b`, "gi");
const speakable = (t: string) =>
  t.replace(PATTERN, (w) => {
    const r = PHONETIC[w.toLowerCase()]!;
    return w[0] === w[0]?.toUpperCase() ? r[0]!.toUpperCase() + r.slice(1) : r;
  });

// ── args ────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const command = argv[0] ?? "";
const positional = argv[1] && !argv[1].startsWith("--") ? argv[1] : "";
const flag = (name: string): string | undefined => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const has = (name: string) => argv.includes(`--${name}`);
const num = (name: string): number | undefined => {
  const v = flag(name);
  return v === undefined ? undefined : Number(v);
};

interface Settings { stability?: number; similarity_boost?: number; style?: number; speed?: number; use_speaker_boost?: boolean }

function settingsFromFlags(): Settings {
  const s: Settings = {};
  if (num("stability") !== undefined) s.stability = num("stability");
  if (num("similarity") !== undefined) s.similarity_boost = num("similarity");
  if (num("style") !== undefined) s.style = num("style");
  if (num("speed") !== undefined) s.speed = num("speed");
  return s;
}

const label = (parts: (string | number | undefined)[]) =>
  parts.filter((p) => p !== undefined && p !== "").join("_").replace(/[^a-zA-Z0-9_.-]/g, "-");

async function synth(text: string, voice: string, model: string, settings: Settings, file: string) {
  const body: Record<string, unknown> = { text: speakable(text), model_id: model };
  if (Object.keys(settings).length) body.voice_settings = settings;

  const res = await fetch(`${BASE}/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": KEY!, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.log(`  ✗ ${file} — HTTP ${res.status} ${(await res.text()).slice(0, 160)}`);
    return;
  }
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength < 512) { console.log(`  ✗ ${file} — réponse vide`); return; }
  await writeFile(OUT + file, bytes);
  console.log(`  ✓ ${file}  (${(bytes.byteLength / 1024).toFixed(0)} Ko)`);
}

async function listVoices() {
  const res = await fetch(`${BASE}/v2/voices?page_size=100`, { headers: { "xi-api-key": KEY! } });
  const data = (await res.json()) as { voices?: Record<string, never>[] };
  const rows = (data.voices ?? []) as unknown as {
    voice_id: string; name: string; category: string;
    labels?: Record<string, string>; verified_languages?: { language?: string }[];
  }[];

  const onlyFr = has("fr");
  console.log(`\n${"VOICE ID".padEnd(24)} ${"NOM".padEnd(42)} ${"LANG".padEnd(8)} EMPLOI`);
  console.log("─".repeat(110));
  for (const v of rows) {
    const langs = new Set([v.labels?.language, ...(v.verified_languages ?? []).map((l) => l.language)].filter(Boolean));
    const isFr = [...langs].some((l) => /^(fr|french)/i.test(String(l)));
    if (onlyFr && !isFr) continue;
    const lang = [...langs].slice(0, 2).join("/") || "—";
    const use = [v.labels?.use_case, v.labels?.descriptive, v.labels?.age, v.labels?.gender].filter(Boolean).join(", ");
    console.log(`${v.voice_id.padEnd(24)} ${(v.name ?? "").slice(0, 42).padEnd(42)} ${lang.slice(0, 8).padEnd(8)} ${use}`);
  }
  console.log(`\n${onlyFr ? "Voix françaises" : "Toutes les voix"} — ajoute --fr pour filtrer.`);
  console.log("⚠️  Une voix peut être désactivée par son propriétaire : teste-la avant de la retenir.");
}

async function main() {
  if (!KEY) { console.error("ELEVENLABS_API_KEY manquant."); process.exit(1); }
  if (command === "list") return listVoices();

  await mkdir(OUT, { recursive: true });
  const voice = flag("voice") ?? DEFAULT_VOICE;
  const model = flag("model") ?? DEFAULT_MODEL;
  const sample = flag("sample") ?? "intro";
  const text = flag("text") ?? SAMPLES[sample] ?? SAMPLES.intro!;
  const base = settingsFromFlags();

  console.log(`\nTexte : « ${text.slice(0, 70)}… »`);
  console.log(`Sortie : ${OUT}\n`);

  switch (command) {
    case "voices": {
      const ids = positional.split(",").map((s) => s.trim()).filter(Boolean);
      if (!ids.length) { console.error("Usage : voices <id1,id2,...>"); process.exit(1); }
      console.log(`🎙️  ${ids.length} voix · modèle ${model}`);
      for (const [i, id] of ids.entries()) {
        await synth(text, id, model, base, `${label(["voix", String(i + 1).padStart(2, "0"), id.slice(0, 8), sample])}.mp3`);
      }
      break;
    }
    case "models": {
      const models = ["eleven_v3", "eleven_multilingual_v2", "eleven_flash_v2_5"];
      console.log(`🎚️  ${models.length} modèles · voix ${voice}`);
      for (const m of models) await synth(text, voice, m, base, `${label(["modele", m, sample])}.mp3`);
      break;
    }
    case "sweep": {
      const param = positional;
      // eleven_v3 n'accepte que 3 paliers de stability (Creative / Natural / Robust).
      const ranges: Record<string, number[]> = {
        stability: model === "eleven_v3" ? [0, 0.5, 1] : [0.15, 0.35, 0.55, 0.75],
        style: [0, 0.3, 0.5, 0.7],
        speed: [0.85, 0.92, 1, 1.08],
        similarity: [0.5, 0.75, 0.95],
      };
      const values = ranges[param];
      if (!values) { console.error(`Paramètre inconnu : ${param}. Choix : ${Object.keys(ranges).join(", ")}`); process.exit(1); }
      console.log(`🎛️  Balayage de ${param} · voix ${voice} · modèle ${model}`);
      for (const v of values) {
        const key = param === "similarity" ? "similarity_boost" : param;
        await synth(text, voice, model, { ...base, [key]: v }, `${label(["sweep", param, v, sample])}.mp3`);
      }
      break;
    }
    case "one": {
      console.log(`🎙️  voix ${voice} · modèle ${model} · ${JSON.stringify(base)}`);
      await synth(text, voice, model, base, `${label(["essai", voice.slice(0, 8), model, sample, base.stability, base.style, base.speed])}.mp3`);
      break;
    }
    default:
      console.error("Commandes : list | voices <ids> | models | sweep <param> | one\n" +
        "Détail des options en tête de scripts/audition-voice.ts");
      process.exit(1);
  }

  console.log(`\n▶ Écoute : ${OUT}`);
  console.log("   Une fois la voix choisie : ELEVENLABS_VOICE_NARRATOR=<id> dans core-api/.env,");
  console.log("   puis `bun run gen:audio --voice --force` pour refaire les 11 voix off statiques.");
}

await main();
