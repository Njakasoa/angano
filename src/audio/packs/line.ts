/** One recorded line of narration: the file to play, why it plays, and what it says. */
export interface PackLine {
  /** File under `public/assets/audio/`, unique across every pack. */
  file: string;
  /** Prose lines name their phase; cues name the game event that fires them. */
  label: string;
  /**
   * The line as the game knows it — for prose, byte-for-byte what the server sends,
   * because that is what the browser matches on. Never put an audio tag in here: a
   * `[whispers]` would make the match fail and the line would simply go silent.
   */
  text: string;
  /**
   * The same line, marked up for eleven_v3 — used only at generation time.
   *
   * Direction is otherwise derived from the label, which can only place one tag at
   * the very front. That is enough for a one-clause line and too blunt for a legend
   * that has to hush, then turn, then land. Two rules, both learned the hard way at
   * the audition bench: no non-verbal tag (`[sighs]` is *performed*, audibly and
   * badly), and nothing that changes the words — `check:assets` compares the two
   * strings word by word, so only tags and punctuation may differ.
   */
  direction?: string;
}
