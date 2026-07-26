/**
 * Production plan for every generated sound — the data behind both
 * `generate-audio.ts` and `docs/audio-a-generer.md`.
 *
 * Keys must match `src/audio/manifest.ts`; `check-assets.ts` enforces that, so a
 * renamed key cannot silently leave the game mute.
 */
import type { PackLine } from "../src/audio/packs/line.ts";
import { ALL as LAC, PACK_ID as LAC_ID } from "../src/audio/packs/lac-jarres-blanches.ts";

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
  { id: LAC_ID, voice: "0dPqNXnhg2bmxQv1WKDp", lines: LAC },               // Grandpa Storyteller Oxley
];

/**
 * Foley beds for the night — the alternative the `soundscape` option selects, and
 * the default one.
 *
 * A composed bed is beautiful and says nothing. Around one table every player has
 * their eyes shut, and what should reach them is the *place*: water closing, embers
 * breathing, reeds parting. So these are recorded as sound, not as music — the same
 * seamless-loop treatment, none of the instrumentation.
 *
 * They sit in front of the composed beds in the manifest chain rather than replacing
 * them: an unproduced foley bed falls back to its music, so the option ships before
 * the audio does. Only the seven night turns get one; the day keeps its score.
 */
export const FOLEY_STYLE =
  "field-recorded natural ambience, no music, no instruments, no melody, no vocals, no speech. " +
  "Malagasy night: humid air, distant insects, close organic detail. Dry, intimate, cinematic. " +
  "Seamless looping bed — constant intensity, no build, no fade, no ending";

export const FOLEY: AmbianceSpec[] = [
  { key: "nuit_zazavavindrano_foley", file: "nuit_zazavavindrano_foley.mp3", seconds: 20, prompt: `${FOLEY_STYLE}. A still river under the moon: slow water lapping at reeds, a faint deep swirl below the surface, dripping, wet stone.` },
  { key: "nuit_mpamosavy_foley", file: "nuit_mpamosavy_foley.mp3", seconds: 20, prompt: `${FOLEY_STYLE}. A sorcerer's fire: embers ticking and breathing, fine ash falling, dry bones and beads shifting, an occasional low exhale of air over coals.` },
  { key: "nuit_mpisikidy_foley", file: "nuit_mpisikidy_foley.mp3", seconds: 20, prompt: `${FOLEY_STYLE}. A diviner's mat: seeds shifting in a wooden bowl, a woven mat creaking, thin smoke, a very soft slow breath.` },
  { key: "nuit_kalanoro_foley", file: "nuit_kalanoro_foley.mp3", seconds: 20, prompt: `${FOLEY_STYLE}. The forest floor at night: wet earth, dripping leaves, a small creature moving through undergrowth then stopping, crickets thinning out.` },
  { key: "nuit_kinoly_foley", file: "nuit_kinoly_foley.mp3", seconds: 20, prompt: `${FOLEY_STYLE}. Underground stillness: muffled air inside stone tombs, a very distant slow breathing, faint grit falling, almost silence.` },
  { key: "nuit_songomby_foley", file: "nuit_songomby_foley.mp3", seconds: 20, prompt: `${FOLEY_STYLE}. Reeds in a rice paddy: a heavy animal breathing low and close, wet hooves in mud, reeds pushed aside, water disturbed.` },
  { key: "nuit_ombiasy_foley", file: "nuit_ombiasy_foley.mp3", seconds: 20, prompt: `${FOLEY_STYLE}. A healer's hut: amulets and beads clicking softly, a glass vial set down on wood, dried plants rustling, warm coals nearby.` },
];

/**
 * Two one-shots per night turn: `wake_*` as the turn opens, `act_*` the instant its
 * actor has chosen (core-api's `acted`).
 *
 * These carry the night for a table playing with its eyes shut, so each has to be
 * *recognisable on its own* — a different material per role, not seven variations of
 * a rustle. `wake` says who is awake; `act` says the deed is done, and lands harder.
 */
export const NIGHT_SFX: SfxSpec[] = [
  { key: "wake_zazavavindrano", file: "sfx_wake_zazavavindrano.mp3", seconds: 2.5, prompt: `${SFX_STYLE}. Water parting as something rises: a smooth swell breaking the surface, streaming droplets, held open.` },
  { key: "act_zazavavindrano", file: "sfx_act_zazavavindrano.mp3", seconds: 2.0, prompt: `${SFX_STYLE}. The water closes over: a single soft swallow of the surface, then stillness. A vow sealed underwater.` },

  { key: "wake_mpamosavy", file: "sfx_wake_mpamosavy.mp3", seconds: 2.5, prompt: `${SFX_STYLE}. Coals stirred awake: embers cracking, a breath blown across ash, a faint sickly hiss.` },
  { key: "act_mpamosavy", file: "sfx_act_mpamosavy.mp3", seconds: 2.0, prompt: `${SFX_STYLE}. A curse laid: a handful of ash thrown onto fire, one sharp flare, then a dead hush.` },

  { key: "wake_mpisikidy", file: "sfx_wake_mpisikidy.mp3", seconds: 2.5, prompt: `${SFX_STYLE}. Divination seeds gathered: a wooden bowl lifted, seeds shifting and settling in cupped hands.` },
  { key: "act_mpisikidy", file: "sfx_act_mpisikidy.mp3", seconds: 2.0, prompt: `${SFX_STYLE}. The sikidy is cast: seeds scattered sharply across a woven mat, then one clear soft chime of understanding.` },

  { key: "wake_kalanoro", file: "sfx_wake_kalanoro.mp3", seconds: 2.5, prompt: `${SFX_STYLE}. Something small moves in the undergrowth: quick light steps on wet leaves, a branch flicking back.` },
  { key: "act_kalanoro", file: "sfx_act_kalanoro.mp3", seconds: 2.0, prompt: `${SFX_STYLE}. The trail is read: two wet footsteps in mud, then a sudden stop. Silence where the next step should be.` },

  { key: "wake_kinoly", file: "sfx_wake_kinoly.mp3", seconds: 3.0, prompt: `${SFX_STYLE}. Something wakes underground: stone grinding faintly, dry earth trickling, one long slow breath drawn where there should be none.` },
  { key: "act_kinoly", file: "sfx_act_kinoly.mp3", seconds: 2.0, prompt: `${SFX_STYLE}. A haunting settles on a sleeper: a cold exhale very close to the ear, long fingernails dragging once on wood.` },

  { key: "wake_songomby", file: "sfx_wake_songomby.mp3", seconds: 3.0, prompt: `${SFX_STYLE}. The beast rises in the reeds: heavy nostrils snorting, reeds pushed apart, a hoof pulling out of thick mud.` },
  { key: "act_songomby", file: "sfx_act_songomby.mp3", seconds: 2.2, prompt: `${SFX_STYLE}. The prey is chosen: a sudden lunge through water and reeds, cut short. No cry — the night simply closes.` },

  { key: "wake_ombiasy", file: "sfx_wake_ombiasy.mp3", seconds: 2.5, prompt: `${SFX_STYLE}. Amulets taken down: ody charms and beads clicking together on cord, dried plants rustling, a lid unstoppered.` },
  { key: "act_ombiasy", file: "sfx_act_ombiasy.mp3", seconds: 2.0, prompt: `${SFX_STYLE}. The rite is done: a glass vial set firmly down on wood, one warm resonant hum fading out.` },
];
