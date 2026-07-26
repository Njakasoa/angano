/**
 * Recorded narration for the `barriere-rompue` legend (*Ambohijanaka des Enclos*),
 * told by a second voice — see `docs/pack-barriere-rompue.md`.
 *
 * Same two kinds of line as every pack: PROSE is the legend's own text, extracted
 * verbatim from the preset and matched on the text the server sends; CUES are written
 * for the pack and hang off game events. Neither may contain a `{placeholder}` — a
 * recording cannot interpolate, and `check:assets` fails the build if one appears.
 */

import type { PackLine } from "./line.ts";

export const PACK_ID = "barriere-rompue";

/** The legend's own prose — matched against what the server sends. */
export const PROSE: PackLine[] = [
  { file: "vo_br_prose_01.mp3", label: "intro", text: "À Ambohijanaka des Enclos, les cornes peintes brillent sous la lune et les sabots battent la poussière. Une barrière rompue laisse entrer le souffle des mauvais soirs, et le parc à zébus devient chemin de sort. Ce village chante bas pour garder son cœur, mais déjà la nuit mord le chemin." },
  { file: "vo_br_prose_02.mp3", label: "ambiance_night", text: "La nuit tombe sur l’enclos, et la poussière boit le bruit; les cornes peintes luisent, et le silence devient bruit." },
  { file: "vo_br_prose_03.mp3", label: "ambiance_dawn", text: "À l’aube, la barrière rompue grince encore, et chaque sabot laissé dans la terre raconte un sort." },
  { file: "vo_br_prose_04.mp3", label: "ambiance_debate", text: "Le jour se lève sur des regards de peur et des paroles de cœur; qui ment, qui tient, qui perd son chemin?" },
  { file: "vo_br_prose_05.mp3", label: "ambiance_vote", text: "Quand les voix s’alignent, le village choisit son destin; une faute de main, et c’est la mort au matin." },
  { file: "vo_br_prose_06.mp3", label: "nuit_zazavavindrano", text: "L’esprit des eaux noue un fady discret, et la surface frissonne comme un secret." },
  { file: "vo_br_prose_07.mp3", label: "nuit_mpamosavy", text: "Le sorcier souffle sa cendre sur une cible, et le pouvoir visé s’égare dans la nuit fragile." },
  { file: "vo_br_prose_08.mp3", label: "nuit_mpisikidy", text: "Le devin lit les cauris dans l’ombre, et la poussière lui répond sans détour ni sombre." },
  { file: "vo_br_prose_09.mp3", label: "nuit_kalanoro", text: "Le pisteur compare les traces et les pas, puis voit si la place a changé ou non, tout bas." },
  { file: "vo_br_prose_10.mp3", label: "nuit_kinoly", text: "Le revenant dort encore sous la tombe et le lamba, puis l’aube décidera s’il se lève ou s’effondre." },
  { file: "vo_br_prose_11.mp3", label: "nuit_songomby", text: "Les Songomby flairent la peur, se consultent sans bruit, puis désignent une victime à la morsure de la nuit." },
  { file: "vo_br_prose_12.mp3", label: "nuit_ombiasy", text: "Le gardien des souffles choisit un geste de salut ou d’exil, et le vieux remède tient bon au bord du péril." },
  { file: "vo_br_prose_13.mp3", label: "jour_night_0", text: "La première nuit s’étire sur les parcs à zébus, et la barrière rompue laisse entrer le froid du sort." },
  { file: "vo_br_prose_14.mp3", label: "jour_night_1", text: "Les cornes peintes gardent le silence, mais déjà les sabots de la peur tassent la poussière du chemin." },
  { file: "vo_br_prose_15.mp3", label: "jour_night_2", text: "Plus la nuit avance, plus les voix se font minces, comme un lamba qu’on serre contre son cœur." },
  { file: "vo_br_prose_16.mp3", label: "jour_dawn_0", text: "Au matin, on compte les traces, les pas, les absents, et le village cherche la faille dans la clôture." },
  { file: "vo_br_prose_17.mp3", label: "jour_dawn_1", text: "Si le soleil monte, la poussière révèle ce que le noir cachait; chaque regard devient preuve ou détour." },
  { file: "vo_br_prose_18.mp3", label: "jour_dawn_2", text: "Quand l’aube est trop lourde, un seul nom peut faire basculer la cour, et le marché entier retient son souffle." },
  { file: "vo_br_prose_19.mp3", label: "jour_debate_0", text: "On parle d’abord des faits, puis des peurs, puis des silences qui collent aux bottes comme la boue au destin." },
  { file: "vo_br_prose_20.mp3", label: "jour_debate_1", text: "Les soupçons tournent autour de l’enclos, et chacun défend sa voix comme on défend une lampe au vent." },
  { file: "vo_br_prose_21.mp3", label: "jour_debate_2", text: "Si la parole tremble, la foule se durcit; si la parole tient, elle peut encore sauver le village." },
  { file: "vo_br_prose_22.mp3", label: "jour_vote_0", text: "Le vote s’avance comme un zébu vers la porte, lent au début, puis lourd de conséquence." },
  { file: "vo_br_prose_23.mp3", label: "jour_vote_1", text: "Une erreur de trait sur le sable, et la barrière du jour se rompt avec la nuit d’après." },
  { file: "vo_br_prose_24.mp3", label: "jour_vote_2", text: "Quand la majorité tranche, le sort se referme; il faut viser juste, sinon le village se perd en route." },
  { file: "vo_br_prose_25.mp3", label: "victoire_village", text: "Le village gagne quand tous les Songomby sont chassés; alors l’enclos se referme, la poussière se tait, et le matin rend son chemin." },
  { file: "vo_br_prose_26.mp3", label: "victoire_songomby", text: "Les Songomby gagnent à la parité; alors la barrière rompt pour de bon, et la nuit boit le village jusqu’au dernier souffle." },
];

/**
 * Lines written for this pack, fired off game events.
 *
 * As in every pack, the narrator never speaks a player's name, and the Kinoly's
 * awakening and the Ombiasy's remedy stay unvoiced: both travel narrator-only, and
 * this voice plays out loud to the whole table in same-room mode.
 */
export const CUES: PackLine[] = [
  { file: "vo_br_aube_personne.mp3", label: "aube_personne", text: "Toutes les bêtes sont rentrées, et pas un nom ne manque à l'appel. Cette nuit, la barrière a tenu — mais personne n'ose encore le dire tout haut." },
  { file: "vo_br_aube_une_mort.mp3", label: "aube_une_mort", text: "Une place est vide à l'ombre du parc. La poussière a bu ce qu'elle devait boire, et le village se réveille avec un nom de moins." },
  { file: "vo_br_aube_plusieurs_morts.mp3", label: "aube_plusieurs_morts", text: "Plusieurs n'ont pas répondu à l'appel du matin. La brèche a laissé passer large, et la cour entière sent le fer et la peur." },
  { file: "vo_br_reveal_mponina.mp3", label: "reveal_mponina", text: "Sous le lamba, rien qu'un villageois. Pas de pouvoir, pas de secret — seulement des mains usées par les enclos, et une vie prise pour rien." },
  { file: "vo_br_reveal_songomby.mp3", label: "reveal_songomby", text: "Sous le lamba, le pelage et les crocs : un Songomby est tombé. La bête ne battra plus la poussière du parc." },
  { file: "vo_br_reveal_mpisikidy.mp3", label: "reveal_mpisikidy", text: "Les cauris se sont répandus dans la terre rouge. Le Mpisikidy s'est tu, et les signes se sont tus avec lui." },
  { file: "vo_br_reveal_ombiasy.mp3", label: "reveal_ombiasy", text: "Les ody pendent sans maître. L'Ombiasy s'en est allé, et plus personne ne retiendra la main du sort." },
  { file: "vo_br_reveal_fanany.mp3", label: "reveal_fanany", text: "Un serpent a glissé hors du corps froid : c'était le Fanany. Les Razana ont vu tomber leur gardien." },
  { file: "vo_br_reveal_zazavavindrano.mp3", label: "reveal_zazavavindrano", text: "L'eau a repris la sienne. La Zazavavindrano ne nouera plus de fady, et l'abreuvoir, ce matin, est muet." },
  { file: "vo_br_reveal_kalanoro.mp3", label: "reveal_kalanoro", text: "De petits pas s'arrêtent net dans la poussière. Le Kalanoro est mort, et les traces retournées ne diront plus rien." },
  { file: "vo_br_reveal_kinoly.mp3", label: "reveal_kinoly", text: "La peau grise ne se relèvera pas deux fois. Le Kinoly est tombé pour de bon, et le revenant retourne sous sa pierre." },
  { file: "vo_br_reveal_mpamosavy.mp3", label: "reveal_mpamosavy", text: "Les cendres et les os roulent hors du lamba : c'était le Mpamosavy. Une malédiction de moins sur les enclos." },
  { file: "vo_br_vote_sentence.mp3", label: "vote_sentence", text: "Le cercle s'est refermé. Le village a tranché, et la poussière gardera ce nom-là." },
  { file: "vo_br_vote_personne.mp3", label: "vote_personne", text: "Le cercle s'est défait sans sentence. Personne ne tombe aujourd'hui, et la nuit reviendra plus lourde." },
  { file: "vo_br_razana_vengeance.mp3", label: "razana_vengeance", text: "La Marque funeste s'est refermée. Le Fanany est tombé, et les Razana ont emporté avec lui celui qu'il avait désigné." },
];

export const ALL: PackLine[] = [...PROSE, ...CUES];
