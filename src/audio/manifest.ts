/**
 * Single source of truth for every sound the game can play.
 *
 * The server decides *which* key to play (`PHASE_ASSET` in core-api); this file
 * decides *what file* a key resolves to. Two mechanisms keep that safe:
 *
 *   - **fallback chains** — a key lists candidate files in priority order. The
 *     engine plays the first that loads, so a track that has not been produced yet
 *     degrades to a placeholder instead of silence.
 *   - **legacy aliases** — the old Loup-Garou key set still resolves, so the front
 *     and the API can deploy in either order without a silent gap.
 *
 * `scripts/generate-audio.ts` reads the prompts below to produce the real assets,
 * and `npm run check:assets` fails the build if a chain has no file at all.
 */

/**
 * Looping per-phase ambiance. Keys mirror core-api's `PHASE_ASSET[*].audio`.
 *
 * Every phase now owns a composed bed, so the chains hold a single entry — the
 * recycled Loup-Garou placeholders they used to fall back on are gone. The chain
 * shape stays: a new phase can name an unproduced track and list a stand-in behind
 * it, and `check:assets` fails the build if a chain resolves to nothing.
 */
export const MUSIC: Record<string, string[]> = {
  salon: ["salon.mp3"],
  legende: ["legende.mp3"],
  nuit_zazavavindrano: ["nuit_zazavavindrano.mp3"],
  nuit_mpamosavy: ["nuit_mpamosavy.mp3"],
  nuit_mpisikidy: ["nuit_mpisikidy.mp3"],
  nuit_kalanoro: ["nuit_kalanoro.mp3"],
  nuit_kinoly: ["nuit_kinoly.mp3"],
  nuit_songomby: ["nuit_songomby.mp3"],
  nuit_ombiasy: ["nuit_ombiasy.mp3"],
  aube: ["aube.mp3"],
  debat: ["debat.mp3"],
  vote: ["vote.mp3"],
  revelation: ["revelation.mp3"],
};

/**
 * Pre-canonical keys the API used to send. An older core-api still works: its key
 * maps onto the phase that used to share that track.
 */
export const LEGACY_AUDIO_ALIAS: Record<string, string> = {
  introduction: "salon",
  cupidon: "nuit_zazavavindrano", // the lovers mechanic is long gone
  sorciere: "nuit_mpamosavy",
  voyante: "nuit_mpisikidy",
  loupgarou: "nuit_songomby",
};

/**
 * The seven night turns, in the order core-api runs them. Each owns a foley bed and
 * a pair of one-shots; the phase name *is* the role name, which is what lets the
 * client derive every key from the phase the server sends.
 */
export const NIGHT_ROLES = [
  "zazavavindrano", "mpamosavy", "mpisikidy", "kalanoro", "kinoly", "songomby", "ombiasy",
] as const;

/** Which bed plays under the night — chosen when the game is created. */
export type Soundscape = "foley" | "musique";

/** One-shot effects, fired by the client off game events. */
export const SFX = {
  tap: ["sfx_tap.mp3"],
  role_reveal: ["sfx_role_reveal.mp3"],
  night_fall: ["sfx_night_fall.mp3"],
  death: ["sfx_death.mp3"],
  vote_cast: ["sfx_vote_cast.mp3"],
  vote_result: ["sfx_vote_result.mp3"],
  discovery: ["sfx_discovery.mp3"],
  blocked: ["sfx_blocked.mp3"],
  mission_request: ["sfx_mission_request.mp3"],
  mission_validated: ["sfx_mission_validated.mp3"],
  your_turn: ["sfx_your_turn.mp3"],
  timer_last: ["sfx_timer_last.mp3"],
  victory_village: ["sfx_victory_village.mp3"],
  victory_songomby: ["sfx_victory_songomby.mp3"],

  // ── the night, heard rather than read ──
  // Two per turn: `wake_*` opens it, `act_*` closes it on the deed. Around one table
  // every player has their eyes shut, so this pair is the only thing that tells them
  // whose turn it is and when it is over. Neither leaks: core-api builds the night
  // from the living roles, so the turn's very existence is already public.
  wake_zazavavindrano: ["sfx_wake_zazavavindrano.mp3"],
  act_zazavavindrano: ["sfx_act_zazavavindrano.mp3"],
  wake_mpamosavy: ["sfx_wake_mpamosavy.mp3"],
  act_mpamosavy: ["sfx_act_mpamosavy.mp3"],
  wake_mpisikidy: ["sfx_wake_mpisikidy.mp3"],
  act_mpisikidy: ["sfx_act_mpisikidy.mp3"],
  wake_kalanoro: ["sfx_wake_kalanoro.mp3"],
  act_kalanoro: ["sfx_act_kalanoro.mp3"],
  wake_kinoly: ["sfx_wake_kinoly.mp3"],
  act_kinoly: ["sfx_act_kinoly.mp3"],
  wake_songomby: ["sfx_wake_songomby.mp3"],
  act_songomby: ["sfx_act_songomby.mp3"],
  wake_ombiasy: ["sfx_wake_ombiasy.mp3"],
  act_ombiasy: ["sfx_act_ombiasy.mp3"],
} satisfies Record<string, string[]>;

export type SfxKey = keyof typeof SFX;

/** `wake_songomby` / `act_songomby` from a phase, or nothing if it is not a night turn. */
export function nightSfx(phase: string, moment: "wake" | "act"): SfxKey | undefined {
  const key = `${moment}_${phase}`;
  return key in SFX ? (key as SfxKey) : undefined;
}

/**
 * Static spoken lines — fixed text, so they ship as files rather than costing a
 * runtime synthesis. Only the AI-written legend is voiced live (see core-api).
 */
export const VOICE: Record<string, string[]> = {
  vo_role_mponina: ["vo_role_mponina.mp3"],
  vo_role_songomby: ["vo_role_songomby.mp3"],
  vo_role_mpisikidy: ["vo_role_mpisikidy.mp3"],
  vo_role_ombiasy: ["vo_role_ombiasy.mp3"],
  vo_role_fanany: ["vo_role_fanany.mp3"],
  vo_role_zazavavindrano: ["vo_role_zazavavindrano.mp3"],
  vo_role_kalanoro: ["vo_role_kalanoro.mp3"],
  vo_role_kinoly: ["vo_role_kinoly.mp3"],
  vo_role_mpamosavy: ["vo_role_mpamosavy.mp3"],
  vo_victory_village: ["vo_victory_village.mp3"],
  vo_victory_songomby: ["vo_victory_songomby.mp3"],
};

/** Art stems the API used to send, remapped onto the current files. */
export const LEGACY_IMAGE_ALIAS: Record<string, string> = {
  power_kinoly_imposture: "power_kinoly_hantise",
};

export const audioUrl = (file: string) => `/assets/audio/${file}`;

/** Canonical key for whatever the server sent. */
export function canonicalAudioKey(key: string): string {
  return LEGACY_AUDIO_ALIAS[key] ?? key;
}

/**
 * Candidate files for a music key, most-wanted first.
 *
 * In `foley` mode a night key prefers its foley bed — water, embers, reeds — and the
 * chain carries the composed bed right behind it. That is the whole safety net: a
 * foley bed that has not been produced yet degrades to the music instead of silence,
 * so the option can ship before the beds do.
 */
export function musicCandidates(key: string, soundscape: Soundscape = "foley"): string[] {
  const canonical = canonicalAudioKey(key);
  const chain = MUSIC[canonical] ?? [`${canonical}.mp3`];
  const nightly = (NIGHT_ROLES as readonly string[]).some((r) => canonical === `nuit_${r}`);
  return soundscape === "foley" && nightly ? [`${canonical}_foley.mp3`, ...chain] : chain;
}
