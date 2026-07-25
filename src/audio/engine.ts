import { MUSIC, SFX, VOICE, audioUrl, musicCandidates, type SfxKey } from "./manifest.ts";

/**
 * Three-bus audio engine: looping `music`, polyphonic one-shot `sfx`, and an
 * exclusive `voice` that ducks the music under it.
 *
 * Built on plain `HTMLAudioElement` rather than WebAudio on purpose: the voice bus
 * plays clips streamed from the API, and routing a cross-origin element through
 * `createMediaElementSource` would drag in CORS and tainting rules for no gain.
 * Bus gain is therefore plain arithmetic — `master × bus × duck`.
 *
 * Two failure modes are treated as normal, because they are:
 *   - **a missing file.** Keys resolve through a candidate chain and remember the
 *     miss, so an unproduced asset costs one 404 and then stays quiet.
 *   - **blocked autoplay.** Browsers refuse sound before a gesture, and the page
 *     can be reached with none at all (auto-rejoin after a reload). The engine
 *     tracks that state and reports it so the UI can offer to switch sound on,
 *     instead of the old behaviour: swallowing the error and staying mute forever.
 */

export type Bus = "music" | "sfx" | "voice";

const DUCK_GAIN = 0.25; // music level while a voice line plays
const FADE_MS = 600;
const LOAD_TIMEOUT_MS = 8_000;
const STORE_KEY = "angano_audio";

interface Prefs {
  muted: boolean;
  music: number;
  voice: number;
  sfx: number;
}

const DEFAULT_PREFS: Prefs = { muted: false, music: 0.55, voice: 1, sfx: 0.7 };

export class AudioEngine {
  private prefs: Prefs = loadPrefs();
  private resolved = new Map<string, string | null>(); // candidate list → winning url (null = none)
  private music?: HTMLAudioElement;
  private musicKey = "";
  private voice?: HTMLAudioElement;
  private ducked = false;
  private unlocked = false;
  private gestureBound = false;

  /** Fires when playback becomes possible (or is found to be blocked). */
  onUnlockedChange?: (unlocked: boolean) => void;

  constructor() {
    this.bindFirstGesture();
  }

  // ── preferences ───────────────────────────────────────
  get isMuted() { return this.prefs.muted; }
  get isUnlocked() { return this.unlocked; }
  volume(bus: Bus) { return this.prefs[bus]; }

  setMuted(muted: boolean) {
    this.prefs.muted = muted;
    savePrefs(this.prefs);
    this.applyGain();
    if (!muted) void this.tryUnlock();
  }

  setVolume(bus: Bus, value: number) {
    this.prefs[bus] = Math.max(0, Math.min(1, value));
    savePrefs(this.prefs);
    this.applyGain();
  }

  // ── music ─────────────────────────────────────────────
  /**
   * Crossfade to the ambiance for `key`. Re-requesting the current key is a no-op,
   * which is what makes consecutive night turns sharing one track seamless.
   */
  async playMusic(key: string) {
    if (!key || key === this.musicKey) return;
    this.musicKey = key;

    const src = await this.resolve(musicCandidates(key));
    if (!src || this.musicKey !== key) return; // nothing to play, or superseded

    const next = new Audio(src);
    next.loop = true;
    next.volume = 0;
    const previous = this.music;
    this.music = next;
    await this.start(next);
    fade(next, this.gain("music"), FADE_MS);
    if (previous) fade(previous, 0, FADE_MS, () => stop(previous));
  }

  stopMusic() {
    const previous = this.music;
    this.music = undefined;
    this.musicKey = "";
    if (previous) fade(previous, 0, 400, () => stop(previous));
  }

  // ── one-shots ─────────────────────────────────────────
  /** Fire an effect. Unknown or unproduced keys are silently ignored. */
  async sfx(key: SfxKey) {
    const src = await this.resolve(SFX[key]);
    if (!src) return;
    const el = new Audio(src);
    el.volume = this.gain("sfx");
    void this.start(el);
  }

  /**
   * Speak a clip, ducking the music under it. `source` is either a static VOICE key
   * or a URL from the API. A new line interrupts the previous one — narration
   * should never stack into gibberish.
   *
   * Resolves with the clip length in ms (0 if it could not be played), so callers
   * can keep a visual beat on screen for exactly as long as the line lasts.
   */
  async speak(source: string): Promise<number> {
    const src = source.startsWith("/") || source.startsWith("http")
      ? source
      : await this.resolve(VOICE[source] ?? [`${source}.mp3`]);
    if (!src) return 0;

    this.voice?.pause();
    const el = new Audio(src);
    this.voice = el;
    el.volume = this.gain("voice");

    const restore = () => {
      if (this.voice !== el) return; // another line took over — it owns the duck
      this.voice = undefined;
      this.duck(false);
    };
    el.addEventListener("ended", restore, { once: true });
    el.addEventListener("error", restore, { once: true });

    this.duck(true);
    const ok = await this.start(el);
    if (!ok) { restore(); return 0; }
    return await duration(el);
  }

  stopVoice() {
    const el = this.voice;
    this.voice = undefined;
    if (el) stop(el);
    this.duck(false);
  }

  /**
   * Resolve every ambiance and effect up front, so no cue waits on the network at
   * the moment it fires — a one-shot that arrives late has missed its beat. Probes
   * request metadata only, and each chain is resolved once per session.
   */
  async warm() {
    await Promise.all([
      ...Object.keys(MUSIC).map((k) => this.resolve(musicCandidates(k))),
      ...Object.values(SFX).map((candidates) => this.resolve(candidates)),
    ]);
  }

  // ── internals ─────────────────────────────────────────
  private gain(bus: Bus): number {
    if (this.prefs.muted) return 0;
    const duck = bus === "music" && this.ducked ? DUCK_GAIN : 1;
    return this.prefs[bus] * duck;
  }

  private applyGain() {
    if (this.music) this.music.volume = this.gain("music");
    if (this.voice) this.voice.volume = this.gain("voice");
  }

  private duck(on: boolean) {
    if (this.ducked === on) return;
    this.ducked = on;
    if (this.music) fade(this.music, this.gain("music"), 260);
  }

  /** First candidate that loads wins; the answer (including "none") is cached. */
  private async resolve(candidates: string[]): Promise<string | null> {
    const cacheKey = candidates.join("|");
    const known = this.resolved.get(cacheKey);
    if (known !== undefined) return known;

    let winner: string | null = null;
    for (const file of candidates) {
      if (await canLoad(audioUrl(file))) { winner = audioUrl(file); break; }
    }
    this.resolved.set(cacheKey, winner);
    return winner;
  }

  /** Play, remembering whether the browser is still withholding autoplay. */
  private async start(el: HTMLAudioElement): Promise<boolean> {
    try {
      await el.play();
      this.setUnlocked(true);
      return true;
    } catch {
      this.setUnlocked(false);
      this.bindFirstGesture();
      return false;
    }
  }

  private setUnlocked(value: boolean) {
    if (this.unlocked === value) return;
    this.unlocked = value;
    this.onUnlockedChange?.(value);
  }

  /** Retry the current ambiance as soon as the player touches anything. */
  private bindFirstGesture() {
    if (this.gestureBound || typeof document === "undefined") return;
    this.gestureBound = true;
    const onGesture = () => {
      this.gestureBound = false;
      document.removeEventListener("pointerdown", onGesture);
      document.removeEventListener("keydown", onGesture);
      void this.tryUnlock();
    };
    document.addEventListener("pointerdown", onGesture, { once: true });
    document.addEventListener("keydown", onGesture, { once: true });
  }

  private async tryUnlock() {
    if (this.music) {
      const ok = await this.start(this.music);
      if (ok) this.music.volume = this.gain("music");
      return;
    }
    if (this.musicKey) { const key = this.musicKey; this.musicKey = ""; await this.playMusic(key); }
  }
}

// ── helpers ─────────────────────────────────────────────
function canLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const probe = new Audio();
    const done = (ok: boolean) => {
      clearTimeout(timer);
      probe.removeEventListener("loadedmetadata", onOk);
      probe.removeEventListener("error", onFail);
      resolve(ok);
    };
    const onOk = () => done(true);
    const onFail = () => done(false);
    const timer = setTimeout(() => done(false), LOAD_TIMEOUT_MS);
    probe.addEventListener("loadedmetadata", onOk, { once: true });
    probe.addEventListener("error", onFail, { once: true });
    probe.preload = "metadata";
    probe.src = url;
  });
}

/** Ramp `el` to `to` over `ms`. Re-fading the same element cancels the old ramp. */
const fades = new WeakMap<HTMLAudioElement, number>();
function fade(el: HTMLAudioElement, to: number, ms: number, done?: () => void) {
  const previous = fades.get(el);
  if (previous) clearInterval(previous);
  const from = el.volume;
  const steps = 12;
  let i = 0;
  const id = window.setInterval(() => {
    i++;
    el.volume = clamp(from + (to - from) * (i / steps));
    if (i >= steps) { clearInterval(id); fades.delete(el); done?.(); }
  }, ms / steps);
  fades.set(el, id);
}

/** Clip length in ms once metadata lands; 0 if it never does. */
function duration(el: HTMLAudioElement): Promise<number> {
  const ms = () => (Number.isFinite(el.duration) ? Math.round(el.duration * 1000) : 0);
  if (ms()) return Promise.resolve(ms());
  return new Promise((resolve) => {
    const done = () => { clearTimeout(timer); resolve(ms()); };
    const timer = setTimeout(() => resolve(0), 4_000);
    el.addEventListener("loadedmetadata", done, { once: true });
    el.addEventListener("error", () => { clearTimeout(timer); resolve(0); }, { once: true });
  });
}

function stop(el: HTMLAudioElement) {
  try { el.pause(); el.currentTime = 0; } catch { /* already gone */ }
}

const clamp = (v: number) => Math.max(0, Math.min(1, v));

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { ...DEFAULT_PREFS };
    const saved = JSON.parse(raw) as Partial<Prefs>;
    return {
      muted: !!saved.muted,
      music: clamp(saved.music ?? DEFAULT_PREFS.music),
      voice: clamp(saved.voice ?? DEFAULT_PREFS.voice),
      sfx: clamp(saved.sfx ?? DEFAULT_PREFS.sfx),
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function savePrefs(prefs: Prefs) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(prefs)); } catch { /* private mode */ }
}
