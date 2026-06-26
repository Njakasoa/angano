/**
 * Per-phase ambiance, played from the recycled `.mp3` tracks. Crossfades between
 * phases and fails silently if a track is missing (so the game never breaks on a
 * 404). Muted until the first user gesture (browser autoplay policy).
 */
export class Ambiance {
  private current?: HTMLAudioElement;
  private currentKey = "";
  private muted = false;

  setMuted(m: boolean) {
    this.muted = m;
    if (this.current) this.current.muted = m;
  }
  get isMuted() { return this.muted; }

  play(key: string) {
    if (!key || key === this.currentKey) return;
    this.currentKey = key;
    const next = new Audio(`/assets/audio/${key}.mp3`);
    next.loop = true;
    next.muted = this.muted;
    next.volume = 0;
    next.play().catch(() => { /* autoplay blocked or missing — ignore */ });
    this.fade(next, 0.55, 600);
    const prev = this.current;
    if (prev) this.fade(prev, 0, 600, () => { try { prev.pause(); } catch { /* */ } });
    this.current = next;
  }

  stop() {
    const prev = this.current; this.current = undefined; this.currentKey = "";
    if (prev) this.fade(prev, 0, 400, () => { try { prev.pause(); } catch { /* */ } });
  }

  private fade(el: HTMLAudioElement, to: number, ms: number, done?: () => void) {
    const from = el.volume, steps = 12, dt = ms / steps;
    let i = 0;
    const tick = () => {
      i++;
      el.volume = Math.max(0, Math.min(1, from + (to - from) * (i / steps)));
      if (i < steps) setTimeout(tick, dt); else done?.();
    };
    tick();
  }
}
