/** One recorded line of narration: the file to play, why it plays, and what it says. */
export interface PackLine {
  /** File under `public/assets/audio/`, unique across every pack. */
  file: string;
  /** Prose lines name their phase; cues name the game event that fires them. */
  label: string;
  /** Exactly what was synthesised — for prose, exactly what the server sends. */
  text: string;
}
