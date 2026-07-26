import type { PackLine } from "./line.ts";
import { PACK_ID as LJ_ID, PROSE as LJ_PROSE, CUES as LJ_CUES } from "./lac-jarres-blanches.ts";

/**
 * Recorded narration packs, selected by the `storyId` the server sends.
 *
 * A pack is written for one legend, so it is used only when the server confirms that
 * exact preset. An AI-written story carries no id and therefore gets no pack — reading
 * recorded prose over a different legend would be worse than reading none.
 */

export interface StoryPack {
  id: string;
  /** The legend's own prose, found by the text the server sends. */
  prose: Map<string, string>;
  /** Lines written for the pack, found by event label. */
  cues: Map<string, string>;
}

/**
 * Text is matched, not keyed, so it has to survive the trip: the presets use curly
 * apostrophes and the hand-written cues use straight ones, and whitespace is not
 * worth a missed line.
 */
export function normalizeLine(text: string): string {
  return text.trim().replace(/\s+/g, " ").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').toLowerCase();
}

const build = (id: string, prose: PackLine[], cues: PackLine[]): StoryPack => ({
  id,
  prose: new Map(prose.map((l) => [normalizeLine(l.text), l.file])),
  cues: new Map(cues.map((l) => [l.label, l.file])),
});

/**
 * Each legend gets its own teller — see `docs/direction-sonore.md`.
 *
 * Only one legend is recorded today. Two others were written, recorded and then
 * rejected on listening; their text survives in `docs/pack-*.md` and in git, and the
 * prose is regenerated from core-api's preset by script, so re-recording them is
 * cheap. A legend with no pack is not a broken state: the browser simply falls back
 * to the runtime voice, or to text.
 */
const PACKS: Record<string, StoryPack> = {
  [LJ_ID]: build(LJ_ID, LJ_PROSE, LJ_CUES),
};

export function packFor(storyId: string | undefined): StoryPack | null {
  return storyId ? PACKS[storyId] ?? null : null;
}

/** File for a line of the legend's own prose, if this pack recorded it. */
export function proseFile(pack: StoryPack | null, text: string | undefined): string | undefined {
  return pack && text ? pack.prose.get(normalizeLine(text)) : undefined;
}

/** File for an event cue (`aube_une_mort`, `reveal_mpisikidy`, …). */
export function cueFile(pack: StoryPack | null, label: string): string | undefined {
  return pack?.cues.get(label);
}
