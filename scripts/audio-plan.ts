/**
 * Production plan for every generated sound — the data behind both
 * `generate-audio.ts` and `docs/audio-a-generer.md`.
 *
 * Keys must match `src/audio/manifest.ts`; `check-assets.ts` enforces that, so a
 * renamed key cannot silently leave the game mute.
 */

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
 * Looping phase ambiance. Optional (`--ambiance`): generated beds are capped at 22s
 * upstream and do not loop seamlessly, so the recycled placeholders may still sound
 * better. Listen before committing these.
 */
export const AMBIANCE: AmbianceSpec[] = [
  { key: "salon", file: "salon.mp3", seconds: 22, prompt: `${SFX_STYLE}. Calm village evening bed: distant voices, a crackling fire, soft night insects, waiting, unhurried.` },
  { key: "legende", file: "legende.mp3", seconds: 22, prompt: `${SFX_STYLE}. A storyteller's hush before the tale: slow breathing drum, soft raffia rustle, anticipation, mysterious.` },
  { key: "nuit_zazavavindrano", file: "nuit_zazavavindrano.mp3", seconds: 22, prompt: `${SFX_STYLE}. River spirit night bed: flowing water, dripping, wet reeds, an eerie feminine hum far away, beautiful and unsettling.` },
  { key: "nuit_mpamosavy", file: "nuit_mpamosavy.mp3", seconds: 22, prompt: `${SFX_STYLE}. Sorcery night bed: dry bone rattles, ash and embers, a whispered malevolent incantation texture, sickly and creeping.` },
  { key: "nuit_mpisikidy", file: "nuit_mpisikidy.mp3", seconds: 22, prompt: `${SFX_STYLE}. Divination night bed: seeds falling on a mat in slow patterns, faint smoke, a serene low drone, contemplative.` },
  { key: "nuit_kalanoro", file: "nuit_kalanoro.mp3", seconds: 22, prompt: `${SFX_STYLE}. Wet forest night bed: dripping leaves, small quick footsteps in mud, a tiny creature's breath, watchful.` },
  { key: "nuit_kinoly", file: "nuit_kinoly.mp3", seconds: 22, prompt: `${SFX_STYLE}. Revenant night bed: an oppressive silence, a slow dragging step, a faint cold exhale, the dead walking among the living.` },
  { key: "nuit_songomby", file: "nuit_songomby.mp3", seconds: 22, prompt: `${SFX_STYLE}. Predator night bed: heavy hooves in rice-paddy mud, low guttural breathing, reeds parting, imminent danger.` },
  { key: "nuit_ombiasy", file: "nuit_ombiasy.mp3", seconds: 22, prompt: `${SFX_STYLE}. Healer night bed: clinking amulets and small vials, warm embers, crushed herbs, careful hands, protective.` },
  { key: "aube", file: "aube.mp3", seconds: 22, prompt: `${SFX_STYLE}. Dawn bed: first birds, a rooster far off, cool air, the village stirring, fragile relief.` },
  { key: "debat", file: "debat.mp3", seconds: 22, prompt: `${SFX_STYLE}. Daytime assembly bed: a murmuring crowd, wind over rice terraces, restless tension, accusation brewing.` },
  { key: "vote", file: "vote.mp3", seconds: 22, prompt: `${SFX_STYLE}. Judgement bed: a slow insistent drum pulse, tightening breath, stones shifting, decision approaching.` },
  { key: "revelation", file: "revelation.mp3", seconds: 22, prompt: `${SFX_STYLE}. Revelation bed: a long resonant gong decay, ancestral voices sighing, the truth laid bare, solemn.` },
];
