/**
 * Recorded narration for the `lanternes-mangrove` legend (*Ankivy des Eaux Grises*).
 * Approved text: `docs/pack-lanternes-mangrove.md`.
 *
 * Two kinds of line, because they are found two different ways:
 *
 *   - **PROSE** — the legend's own text, extracted verbatim from the preset. The
 *     server already sends these strings in `phase.text`, so the browser matches on
 *     the text itself. No event mapping, and no way for a key to drift from what is
 *     actually spoken.
 *   - **CUES** — written for this pack; the server never sends them as text, so they
 *     hang off game events instead (a dawn with no death, a role revealed, a verdict).
 *
 * Nothing here may contain a `{placeholder}`: a recording cannot interpolate. The
 * generator refuses to build the pack if one appears.
 */

import type { PackLine } from "./line.ts";

export const PACK_ID = "lanternes-mangrove";

/** The legend's own prose — matched against what the server sends. */
export const PROSE: PackLine[] = [
  { file: "vo_lm_prose_01.mp3", label: "intro", text: "Au bord des eaux saumâtres, les pirogues glissent sans bruit, et les lanternes s’éloignent dans le soir. Les racines dressent leurs doigts de noir, les crabes se taisent dans le miroir. Quand la brume prend le chemin, le village entend battre le destin." },
  { file: "vo_lm_prose_02.mp3", label: "ambiance_night", text: "La mangrove se ferme, et les lanternes fuient la rive dans un soupir sans bruit." },
  { file: "vo_lm_prose_03.mp3", label: "ambiance_dawn", text: "L’aube vient en eau pâle, et chaque pirogue semble compter ses peurs à voix basse." },
  { file: "vo_lm_prose_04.mp3", label: "ambiance_debate", text: "Les langues claquent comme des rames, et le doute roule du cœur au bord du cœur." },
  { file: "vo_lm_prose_05.mp3", label: "ambiance_vote", text: "Quand le vote se lève, le silence pèse lourd, et le destin cherche sa porte sans retard." },
  { file: "vo_lm_prose_06.mp3", label: "nuit_zazavavindrano", text: "L’esprit des eaux choisit une rive, et le fady se noue dans la brume sans bruit." },
  { file: "vo_lm_prose_07.mp3", label: "nuit_mpamosavy", text: "Le sorcier des lanternes glisse sa malédiction, et le pouvoir ciblé s’éteint sans éclat." },
  { file: "vo_lm_prose_08.mp3", label: "nuit_mpisikidy", text: "Le devin lit les cauris, et les signes s’ouvrent ou se cachent dans l’ombre du soir." },
  { file: "vo_lm_prose_09.mp3", label: "nuit_kalanoro", text: "Le pisteur suit une trace nouvelle, et la vase dit si la place a changé de part." },
  { file: "vo_lm_prose_10.mp3", label: "nuit_kinoly", text: "Le dormant respire sous l’eau noire, puis l’oubli recule et son rêve devient combat." },
  { file: "vo_lm_prose_11.mp3", label: "nuit_songomby", text: "La bête rassemble sa faim, et les racines frémissent sous sa morsure sans fin." },
  { file: "vo_lm_prose_12.mp3", label: "nuit_ombiasy", text: "Le gardien trace son rite, et le remède ou l’exil se lève au bord du temps." },
  { file: "vo_lm_prose_13.mp3", label: "jour_night_0", text: "La mangrove avale les pas, et la nuit tresse ses liens dans le sel et le bruit." },
  { file: "vo_lm_prose_14.mp3", label: "jour_night_1", text: "Une lampe dérive au loin, et chaque rame hésite entre la peur et le destin." },
  { file: "vo_lm_prose_15.mp3", label: "jour_night_2", text: "Sous les racines, les secrets s’accrochent comme des crabes à la vase du soir." },
  { file: "vo_lm_prose_16.mp3", label: "jour_dawn_0", text: "Au matin, les pirogues reviennent plus légères, mais le rivage porte un manque net." },
  { file: "vo_lm_prose_17.mp3", label: "jour_dawn_1", text: "La brume s’ouvre à peine, et les regards cherchent une vérité dans le vent." },
  { file: "vo_lm_prose_18.mp3", label: "jour_dawn_2", text: "Les premiers soupçons montent avec la marée, lents et durs comme une dette ancienne." },
  { file: "vo_lm_prose_19.mp3", label: "jour_debate_0", text: "Le village se rassemble, et chaque voix veut devenir le chemin." },
  { file: "vo_lm_prose_20.mp3", label: "jour_debate_1", text: "Les récits se heurtent, les certitudes chancellent, et le doute prend la main." },
  { file: "vo_lm_prose_21.mp3", label: "jour_debate_2", text: "Plus le jour avance, plus le masque craque, et la foule entend battre le sort." },
  { file: "vo_lm_prose_22.mp3", label: "jour_vote_0", text: "La fin approche, et le choix devient lourd comme un filet plein d’ombre." },
  { file: "vo_lm_prose_23.mp3", label: "jour_vote_1", text: "Les noms tombent au milieu du cercle, et le silence répond sans détour." },
  { file: "vo_lm_prose_24.mp3", label: "jour_vote_2", text: "Quand la sentence se fait, chacun sait que la mangrove garde la mémoire de la mort." },
  { file: "vo_lm_prose_25.mp3", label: "victoire_village", text: "Le village tient la rive, et les songomby s’effacent dans l’écume et le bruit. Les pirogues rentrent une à une, et la mangrove rend enfin son soupir au jour." },
  { file: "vo_lm_prose_26.mp3", label: "victoire_songomby", text: "Les songomby referment la nuit, et les voix du village se noient dans le bruit. Les lanternes s’éloignent pour de bon, et la mangrove ne laisse qu’un chemin de mort." },];

/**
 * Lines written for this pack, fired off game events.
 *
 * The narrator never speaks a player's name — the legend's own death lines carry a
 * `{victim}` placeholder that no recording can fill, so the voice says *what*
 * happened and the screen says *to whom*.
 *
 * Deliberately absent: the Kinoly's awakening and the Ombiasy's remedy. Both travel
 * narrator-only, and in same-room mode this voice plays out loud to the whole table —
 * announcing either would reveal that the role is in play and has just acted. They
 * already read correctly as `aube_personne`.
 */
export const CUES: PackLine[] = [
  { file: "vo_lm_aube_personne.mp3", label: "aube_personne", text: "Toutes les pirogues sont rentrées. Cette nuit, la mangrove n'a rien pris — et personne n'ose encore dire merci." },
  { file: "vo_lm_aube_une_mort.mp3", label: "aube_une_mort", text: "Une place est vide sur la rive. L'eau grise ne rend jamais ce qu'elle prend, et la brume s'est refermée sur un nom de moins." },
  { file: "vo_lm_aube_plusieurs_morts.mp3", label: "aube_plusieurs_morts", text: "Plusieurs lanternes se sont éteintes avant le jour. La mangrove a bu large, et le village compte ses absents à voix basse." },

  { file: "vo_lm_reveal_mponina.mp3", label: "reveal_mponina", text: "Sous le lamba, rien qu'un villageois. Pas de pouvoir, pas de secret — juste une vie que la nuit a prise sans raison." },
  { file: "vo_lm_reveal_songomby.mp3", label: "reveal_songomby", text: "Sous le lamba, le pelage et les crocs : un Songomby est tombé. La bête ne fendra plus les racines." },
  { file: "vo_lm_reveal_mpisikidy.mp3", label: "reveal_mpisikidy", text: "Les cauris se sont répandus dans la vase. Le Mpisikidy s'est tu, et les signes avec lui." },
  { file: "vo_lm_reveal_ombiasy.mp3", label: "reveal_ombiasy", text: "Les ody pendent sans maître. L'Ombiasy s'en est allé, et plus personne ne retiendra la main du sort." },
  { file: "vo_lm_reveal_fanany.mp3", label: "reveal_fanany", text: "Un serpent a glissé hors du corps froid : c'était le Fanany. Les Razana ont vu tomber leur gardien." },
  { file: "vo_lm_reveal_zazavavindrano.mp3", label: "reveal_zazavavindrano", text: "L'eau a repris la sienne. La Zazavavindrano ne nouera plus de fady, et la rivière, ce matin, est muette." },
  { file: "vo_lm_reveal_kalanoro.mp3", label: "reveal_kalanoro", text: "De petits pas s'arrêtent net dans la vase. Le Kalanoro est mort, et les traces inversées ne diront plus rien." },
  { file: "vo_lm_reveal_kinoly.mp3", label: "reveal_kinoly", text: "La peau grise ne se relèvera pas deux fois. Le Kinoly est tombé pour de bon, et le revenant retourne à sa tombe." },
  { file: "vo_lm_reveal_mpamosavy.mp3", label: "reveal_mpamosavy", text: "Les cendres et les os roulent hors du lamba : c'était le Mpamosavy. Une malédiction de moins sur la mangrove." },

  { file: "vo_lm_vote_sentence.mp3", label: "vote_sentence", text: "Le cercle s'est refermé. Le village a tranché, et la mangrove va garder ce nom-là." },
  { file: "vo_lm_vote_personne.mp3", label: "vote_personne", text: "Le cercle s'est défait sans sentence. Personne ne tombe aujourd'hui, et la nuit reviendra plus lourde." },

  { file: "vo_lm_razana_vengeance.mp3", label: "razana_vengeance", text: "La Marque funeste s'est refermée. Le Fanany est tombé, et les Razana ont emporté avec lui celui qu'il avait désigné." },
];

export const ALL: PackLine[] = [...PROSE, ...CUES];
