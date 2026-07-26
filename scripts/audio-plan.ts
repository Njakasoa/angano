/**
 * Production plan for every generated sound — the data behind both
 * `generate-audio.ts` and `docs/audio-a-generer.md`.
 *
 * Keys must match `src/audio/manifest.ts`; `check-assets.ts` enforces that, so a
 * renamed key cannot silently leave the game mute.
 */
import type { PackLine } from "../src/audio/packs/line.ts";
import { ALL as LANTERNES, PACK_ID as LANTERNES_ID } from "../src/audio/packs/lanternes-mangrove.ts";
import { ALL as BARRIERE, PACK_ID as BARRIERE_ID } from "../src/audio/packs/barriere-rompue.ts";

/** Shared style bed, so the whole soundtrack reads as one world. */
export const SFX_STYLE =
  "dark Malagasy folk-tale atmosphere, organic acoustic sources (wood, breath, water, earth, raffia, animal skin drum), " +
  "no synths, no music, no speech, close-up and dry, cinematic and premium";

export interface SfxSpec { key: string; file: string; seconds: number; prompt: string }
export interface VoiceSpec { key: string; file: string; text: string }
export interface AmbianceSpec { key: string; file: string; seconds: number; prompt: string }

/** One-shot effects fired off game events. */
export const SFX: SfxSpec[] = [
  { key: "tap", file: "sfx_tap.mp3", seconds: 0.8, prompt: `${SFX_STYLE}. A single soft wooden tap on a taut drum skin, very short, dry, intimate.` },
  { key: "role_reveal", file: "sfx_role_reveal.mp3", seconds: 2.2, prompt: `${SFX_STYLE}. A card of stiff woven raffia turning over, followed by a low warm resonant swell, revelation, intimate.` },
  { key: "night_fall", file: "sfx_night_fall.mp3", seconds: 3.5, prompt: `${SFX_STYLE}. Night falling over a village: a low descending wooden flute breath, crickets rising, a distant zebu lowing, dread settling in.` },
  { key: "death", file: "sfx_death.mp3", seconds: 2.8, prompt: `${SFX_STYLE}. A death stinger: a dull heavy thud on earth, a sharp breath cut short, a low mournful resonance fading.` },
  { key: "vote_cast", file: "sfx_vote_cast.mp3", seconds: 1.0, prompt: `${SFX_STYLE}. A small smooth stone dropped into a hollow wooden bowl, single dry clack.` },
  { key: "vote_result", file: "sfx_vote_result.mp3", seconds: 2.5, prompt: `${SFX_STYLE}. A verdict: a single deep drum strike followed by an uneasy low drone, judgement passed.` },
  { key: "discovery", file: "sfx_discovery.mp3", seconds: 2.0, prompt: `${SFX_STYLE}. Divination seeds scattering on a woven mat, then a soft bright shimmer of understanding, secret revealed.` },
  { key: "blocked", file: "sfx_blocked.mp3", seconds: 1.8, prompt: `${SFX_STYLE}. A curse smothering a power: a dry rattle of bones and a sickly downward swallow, energy snuffed out.` },
  { key: "mission_request", file: "sfx_mission_request.mp3", seconds: 1.2, prompt: `${SFX_STYLE}. A discreet attention chime made of two struck hardwood sticks, polite and short.` },
  { key: "mission_validated", file: "sfx_mission_validated.mp3", seconds: 2.0, prompt: `${SFX_STYLE}. A warm approving flourish: a soft ascending thumb-piano figure with a gentle bright bloom, an honour granted.` },
  { key: "your_turn", file: "sfx_your_turn.mp3", seconds: 1.5, prompt: `${SFX_STYLE}. A close intimate whisper-breath of wind and a single soft bell tap, someone calling you in the dark.` },
  { key: "timer_last", file: "sfx_timer_last.mp3", seconds: 1.2, prompt: `${SFX_STYLE}. An urgent dry wooden tick-tick-tick, accelerating, time running out.` },
  { key: "victory_village", file: "sfx_victory_village.mp3", seconds: 3.5, prompt: `${SFX_STYLE}. Dawn triumph: warm drums, a bright rising communal exhale of relief, sunlight breaking, hopeful.` },
  { key: "victory_songomby", file: "sfx_victory_songomby.mp3", seconds: 3.5, prompt: `${SFX_STYLE}. Dark triumph: a beast's low guttural growl of satisfaction, heavy drums, the village falling silent, ominous.` },
];

/**
 * Static spoken lines. Fixed text ships as a file — only the AI-written legend is
 * synthesized at runtime (core-api). Written as displayed; the generator respells
 * Malagasy names phonetically before sending them upstream.
 */
export const VOICE: VoiceSpec[] = [
  { key: "vo_role_mponina", file: "vo_role_mponina.mp3", text: "Tu es Mponina. Un villageois sans pouvoir. Tes seules armes sont tes yeux, ta voix et ton vote." },
  { key: "vo_role_songomby", file: "vo_role_songomby.mp3", text: "Tu es Songomby. La bête qui dévore. Chaque nuit, choisis ta proie." },
  { key: "vo_role_mpisikidy", file: "vo_role_mpisikidy.mp3", text: "Tu es Mpisikidy. Les graines du sikidy te parlent. Chaque nuit, lis les signes d'un joueur." },
  { key: "vo_role_ombiasy", file: "vo_role_ombiasy.mp3", text: "Tu es Ombiasy. Un remède, un rituel d'exil. Chacun ne servira qu'une fois." },
  { key: "vo_role_fanany", file: "vo_role_fanany.mp3", text: "Tu es Fanany, serpent des ancêtres. Marque un joueur. Si tu tombes, les Razana l'emporteront avec toi." },
  { key: "vo_role_zazavavindrano", file: "vo_role_zazavavindrano.mp3", text: "Tu es Zazavavindrano, esprit des eaux. Pose ton fady, et sens qui vient le troubler." },
  { key: "vo_role_kalanoro", file: "vo_role_kalanoro.mp3", text: "Tu es Kalanoro. Tes pieds sont inversés, tes traces aussi. Suis les pas d'un joueur dans la nuit." },
  { key: "vo_role_kinoly", file: "vo_role_kinoly.mp3", text: "Tu es Kinoly, un revenant qui s'ignore encore. La première mort de la nuit te réveillera." },
  { key: "vo_role_mpamosavy", file: "vo_role_mpamosavy.mp3", text: "Tu es Mpamosavy, sorcier de l'ombre. Maudis un joueur, et son pouvoir échouera." },
  { key: "vo_victory_village", file: "vo_victory_village.mp3", text: "Le village a chassé tous les monstres. L'aube, enfin, est douce." },
  { key: "vo_victory_songomby", file: "vo_victory_songomby.mp3", text: "Les Songomby ont fait taire le village. Plus personne ne racontera cette nuit." },
];

/**
 * Shared musical bed for every phase, so the score reads as one world. These go
 * through `/v1/music` (a composer), not the sound-effects model: a bed needs
 * instrumentation and pulse, not dripping leaves.
 *
 * Malagasy instrumentation is the anchor — valiha and marovany (zithers), kabosy,
 * sodina (flute), hazolahy frame drums, katsa shakers.
 */
export const MUSIC_STYLE =
  "instrumental only, absolutely no vocals, no singing, no words. Dark Malagasy folk score: " +
  "valiha and marovany plucked zithers, kabosy, sodina bamboo flute, deep hazolahy frame drum, " +
  "katsa shaker, low drone. Sparse, cinematic, patient, unresolved. Seamless looping bed for a " +
  "game phase — no intro build, no final cadence, constant intensity throughout";

/**
 * Looping phase ambiance, one per phase key. Generated at `seconds` then closed
 * into a seamless loop with an ffmpeg crossfade, so the browser's `loop` never
 * clicks at the seam.
 */
export const AMBIANCE: AmbianceSpec[] = [
  { key: "salon", file: "salon.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: a village evening before the tale begins — warm, unhurried, gently expectant. Slow valiha arpeggio, soft shaker, no drums.` },
  { key: "legende", file: "legende.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: the storyteller draws breath — hushed anticipation, a single low drum heartbeat under a lone sodina line.` },
  { key: "nuit_zazavavindrano", file: "nuit_zazavavindrano.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: the river spirit — liquid descending zither figures, glassy high harmonics, beautiful and cold, almost weightless.` },
  { key: "nuit_mpamosavy", file: "nuit_mpamosavy.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: sorcery — dissonant detuned zither, dry rattling percussion, a sickly bent-note drone creeping upward.` },
  { key: "nuit_mpisikidy", file: "nuit_mpisikidy.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: divination — sparse contemplative marovany, seeds-on-mat percussion as rhythm, serene and searching.` },
  { key: "nuit_kalanoro", file: "nuit_kalanoro.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: the wet forest — small skittering plucks, damp muted percussion, curious and watchful, never settling.` },
  { key: "nuit_kinoly", file: "nuit_kinoly.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: the revenant — near silence, one sustained low drone, a slow single drum step, oppressive stillness.` },
  { key: "nuit_songomby", file: "nuit_songomby.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: the predator closing in — low insistent frame-drum gallop, growling bass drone, real danger, taut.` },
  { key: "nuit_ombiasy", file: "nuit_ombiasy.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: the healer at work — warm low zither, gentle bell-like amulet chimes, protective and grave.` },
  { key: "aube", file: "aube.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: dawn after a hard night — a fragile major-leaning sodina melody over soft strings, relief that has not fully arrived.` },
  { key: "debat", file: "debat.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: the village assembly — restless mid-tempo zither ostinato, murmuring low percussion, suspicion tightening.` },
  { key: "vote", file: "vote.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: judgement approaching — slow relentless drum pulse, rising tension, a held unresolved chord.` },
  { key: "revelation", file: "revelation.mp3", seconds: 30, prompt: `${MUSIC_STYLE}. Mood: the truth laid bare — a long resonant gong-like decay, ancestral low strings, solemn and final.` },
];

/**
 * Recorded narration packs and the voice that tells each one.
 *
 * One legend, one teller: the voice is a property of the pack, not of the run, so
 * regenerating everything cannot accidentally re-record one legend in the other's
 * voice. The ids are ElevenLabs voice ids — public identifiers, not secrets.
 */
export interface PackSpec { id: string; voice: string; lines: PackLine[] }
export const PACKS: PackSpec[] = [
  { id: LANTERNES_ID, voice: "LOF1yccpEMqzvhfbLTGh", lines: LANTERNES },   // Njaka (voix clonée)
  { id: BARRIERE_ID, voice: "EMuO6fFLrXKOryHzij6K", lines: BARRIERE },     // Grandma Clo – Warm Storyteller
];
