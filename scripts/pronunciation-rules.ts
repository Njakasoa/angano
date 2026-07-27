/**
 * How Malagasy is pronounced by a French voice — the source of truth.
 *
 * These rules used to live as a regex table in three places (core-api's
 * `pronunciation.ts`, this repo's generator, and the audition bench) and had already
 * drifted: only one copy knew `Ambohitra`, and no copy knew a single village name.
 * They are now uploaded once to ElevenLabs as a pronunciation dictionary and applied
 * by the API, so the text we send is the text as written.
 *
 * That makes *this file* the thing to keep honest. The dictionary is opaque once
 * uploaded — ElevenLabs' download endpoint currently answers 500 — so a rule that
 * only exists over there is a rule nobody can read. Edit here, run `bun run
 * dico:sync`, put the printed ids in both `.env` files.
 *
 * The respelling is French orthography, not IPA: `o` → `ou`, final `y` → `i`,
 * `j` → `dz`. Alias rules rather than phoneme rules, because phoneme rules are not
 * supported on every model and alias rules are.
 */

/** Role names and the words the legends use. */
export const TERMS: Record<string, string> = {
  songomby: "sougoumbi",
  mpisikidy: "mpissikidi",
  ombiasy: "oumbiassi",
  fanany: "fanani",
  zazavavindrano: "zazavavindranou",
  kalanoro: "kalanourou",
  kinoly: "kinouli",
  mpamosavy: "mpamoussavi",
  mponina: "mpounina",
  angano: "anganou",
  razana: "razana",
  sikidy: "sikidi",
  fady: "fadi",
  ody: "oudi",
};

/**
 * Place names — the gap that started this. No table covered them, so every legend
 * opened on a village name read as French.
 */
export const PLACES: Record<string, string> = {
  ambohijanaka: "ambouidzanaka",   // Ambohijanaka des Enclos
  ankareno: "ankarenou",           // Ankareno
  ankivy: "ankivi",                // Ankivy des Eaux Grises
  ambohitra: "ambouitra",
  "rano masina": "ranou masina",   // « eau sacrée » — dans l'intro du Lac
  "antsahon'ny vato": "antsahouni vatou",
};

export const ALL: Record<string, string> = { ...TERMS, ...PLACES };

/** Capitalise each word, so a proper noun opening a sentence stays capitalised. */
const cap = (s: string) => s.replace(/(^|[ '])([a-z])/g, (_, p: string, c: string) => p + c.toUpperCase());

export interface AliasRule {
  type: "alias";
  string_to_replace: string;
  alias: string;
  case_sensitive: boolean;
  word_boundaries: boolean;
}

/**
 * Two case-sensitive rules per term rather than one loose rule: an alias is inserted
 * verbatim, so a single lowercase rule would drop the capital on a proper noun.
 */
export function rules(): AliasRule[] {
  return Object.entries(ALL).flatMap(([from, to]) => [
    { type: "alias" as const, string_to_replace: cap(from), alias: cap(to), case_sensitive: true, word_boundaries: true },
    { type: "alias" as const, string_to_replace: from, alias: to, case_sensitive: true, word_boundaries: true },
  ]);
}
