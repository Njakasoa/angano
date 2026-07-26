/**
 * Recorded narration for the `lac-jarres-blanches` legend (*Ankareno*), told by
 * Grandpa Storyteller Oxley — see `docs/pack-lac-jarres-blanches.md`.
 *
 * The first pack written with an explicit `direction` per line: the label alone can
 * only place one tag at the very front, which is enough for a single clause and too
 * blunt for a legend that has to hush, then turn, then land. The words never differ
 * between `text` and `direction` — `check:assets` compares them word by word.
 */

import type { PackLine } from "./line.ts";

export const PACK_ID = "lac-jarres-blanches";

/** The legend's own prose — matched against what the server sends. */
export const PROSE: PackLine[] = [
  { file: "vo_lj_prose_01.mp3", label: "intro", text: "Au bord du rano masina, les jarres blanches chantaient sous la lune au loin. Des pièces, du miel et du sel dormaient sur l’eau, promesse de paix et de peur mêlées au même cœur. Mais quand le reflet se fend, le sort devient mordant, et chaque nuit réclame son tribut, lentement ou brusquement.", direction: "[slowly] [solemn] Au bord du rano masina, les jarres blanches chantaient sous la lune au loin… [softly] Des pièces, du miel et du sel dormaient sur l’eau, promesse de paix et de peur mêlées au même cœur. [ominous] Mais quand le reflet se fend, le sort devient mordant, [dramatically] et chaque nuit réclame son tribut, lentement ou brusquement." },
  { file: "vo_lj_prose_02.mp3", label: "ambiance_night", text: "La lune boit dans le lac, et le vent rend la peur plus dure que le bruit.", direction: "[whispers] La lune boit dans le lac, [ominous] et le vent rend la peur plus dure que le bruit." },
  { file: "vo_lj_prose_03.mp3", label: "ambiance_dawn", text: "L’aube lave les jarres, mais ne lave pas les doutes qui restent au bord.", direction: "[solemn] [slowly] L’aube lave les jarres… mais ne lave pas les doutes qui restent au bord." },
  { file: "vo_lj_prose_04.mp3", label: "ambiance_debate", text: "Chaque parole fait des vagues, chaque silence fait des routes vers l’ombre." },
  { file: "vo_lj_prose_05.mp3", label: "ambiance_vote", text: "Quand les voix se lèvent, le destin se noue, et le cœur choisit son couteau de lumière.", direction: "[dramatically] Quand les voix se lèvent, le destin se noue, [slowly] et le cœur choisit son couteau de lumière." },
  { file: "vo_lj_prose_06.mp3", label: "nuit_zazavavindrano", text: "L’esprit des eaux tend un fady sur le miroir, et toute force hostile y laisse un frisson noir.", direction: "[whispers] L’esprit des eaux tend un fady sur le miroir… [ominous] et toute force hostile y laisse un frisson noir." },
  { file: "vo_lj_prose_07.mp3", label: "nuit_mpamosavy", text: "Le charmeur souffle son mal sur une cible nouvelle, et son pouvoir s’éteint dans une haleine cruelle.", direction: "[whispers] Le charmeur souffle son mal sur une cible nouvelle… [ominous] et son pouvoir s’éteint dans une haleine cruelle." },
  { file: "vo_lj_prose_08.mp3", label: "nuit_mpisikidy", text: "Le devin lit les cauris dans la poussière de lune, et les signes révèlent un masque ou un mirage.", direction: "[whispers] Le devin lit les cauris dans la poussière de lune… et les signes révèlent un masque ou un mirage." },
  { file: "vo_lj_prose_09.mp3", label: "nuit_kalanoro", text: "La pisteuse suit des traces sans les nommer, et la place quittée parle plus fort que le pas premier.", direction: "[whispers] La pisteuse suit des traces sans les nommer… et la place quittée parle plus fort que le pas premier." },
  { file: "vo_lj_prose_10.mp3", label: "nuit_kinoly", text: "Le dormeur, s’il a déjà ouvert les yeux, rôde dans le noir et choisit un nom pour le hanter au miroir.", direction: "[whispers] Le dormeur, s’il a déjà ouvert les yeux, rôde dans le noir… [ominous] et choisit un nom pour le hanter au miroir." },
  { file: "vo_lj_prose_11.mp3", label: "nuit_songomby", text: "La meute s’unit sans débat, et la faim désigne une proie avant que le matin ne la surprenne.", direction: "[whispers] La meute s’unit sans débat… [ominous] et la faim désigne une proie avant que le matin ne la surprenne." },
  { file: "vo_lj_prose_12.mp3", label: "nuit_ombiasy", text: "Le gardien des serments mesure la nuit, puis décide s’il faut panser une vie ou chasser un péril.", direction: "[whispers] Le gardien des serments mesure la nuit… puis décide s’il faut panser une vie ou chasser un péril." },
  { file: "vo_lj_prose_13.mp3", label: "jour_night_0", text: "La nuit tombe sur le rano masina, douce comme un chant, dure comme un sort.", direction: "[slowly] [ominous] La nuit tombe sur le rano masina, douce comme un chant… dure comme un sort." },
  { file: "vo_lj_prose_14.mp3", label: "jour_night_1", text: "Les jarres blanches brillent, et le village retient son souffle dans l’ombre sans bruit.", direction: "[whispers] Les jarres blanches brillent, et le village retient son souffle dans l’ombre sans bruit." },
  { file: "vo_lj_prose_15.mp3", label: "jour_dawn_0", text: "À l’aube, une trace manque au bord de l’eau, et la peur s’assoit près du feu.", direction: "[solemn] [slowly] À l’aube, une trace manque au bord de l’eau… et la peur s’assoit près du feu." },
  { file: "vo_lj_prose_16.mp3", label: "jour_dawn_1", text: "Chacun regarde les reflets, car le lac garde les noms comme il garde les secrets.", direction: "[solemn] Chacun regarde les reflets, car le lac garde les noms comme il garde les secrets." },
  { file: "vo_lj_prose_17.mp3", label: "jour_debate_0", text: "Le premier débat cherche la forme du mensonge, et les voix tournent comme des pirogues sur l’onde." },
  { file: "vo_lj_prose_18.mp3", label: "jour_debate_1", text: "Puis les soupçons se resserrent, et le cœur de chacun bat contre sa propre honte." },
  { file: "vo_lj_prose_19.mp3", label: "jour_vote_0", text: "Le vote devient lourd comme une pierre mouillée, et chaque main hésite avant le geste.", direction: "[slowly] Le vote devient lourd comme une pierre mouillée… et chaque main hésite avant le geste." },
  { file: "vo_lj_prose_20.mp3", label: "jour_vote_1", text: "Quand la dernière voix tombe, le sort se ferme, et la vérité sort de l’orage.", direction: "[dramatically] Quand la dernière voix tombe, le sort se ferme, et la vérité sort de l’orage." },
  { file: "vo_lj_prose_21.mp3", label: "victoire_village", text: "Le village l’emporte quand les Songomby sont tous chassés, et l’aube boit enfin une eau sans peur ni bruit.", direction: "[solemn] Le village l’emporte quand les Songomby sont tous chassés. [warmly] [slowly] Et l’aube boit enfin une eau sans peur ni bruit." },
  { file: "vo_lj_prose_22.mp3", label: "victoire_songomby", text: "Les Songomby gagnent quand leur nombre atteint la parité des vivants du village, et la nuit ferme alors son poing sur le bruit.", direction: "[ominous] Les Songomby gagnent quand leur nombre atteint la parité des vivants du village. [slowly] [grave] Et la nuit ferme alors son poing sur le bruit." },
];

/**
 * Lines written for this pack, fired off game events.
 *
 * As in every pack: no player name is ever spoken (the legend's death lines carry
 * `{victim}`, which no recording can interpolate), and neither the Kinoly's awakening
 * nor the Ombiasy's remedy is narrated — both travel narrator-only, and this voice
 * plays out loud to the whole table in same-room mode.
 */
export const CUES: PackLine[] = [
  { file: "vo_lj_aube_personne.mp3", label: "aube_personne", text: "Toutes les jarres sont encore au bord, et pas un nom ne manque au matin. Cette nuit, le lac n'a rien pris — et personne n'ose encore le dire tout haut.", direction: "[solemn] Toutes les jarres sont encore au bord, et pas un nom ne manque au matin. [slowly] Cette nuit, le lac n'a rien pris… et personne n'ose encore le dire tout haut." },
  { file: "vo_lj_aube_une_mort.mp3", label: "aube_une_mort", text: "Une place est vide au bord de l'eau. Le lac a repris ce qu'il devait reprendre, et le village se réveille avec un nom de moins.", direction: "[solemn] [slowly] Une place est vide au bord de l'eau. Le lac a repris ce qu'il devait reprendre… et le village se réveille avec un nom de moins." },
  { file: "vo_lj_aube_plusieurs_morts.mp3", label: "aube_plusieurs_morts", text: "Plusieurs n'ont pas répondu à l'appel du matin. Le miroir s'est fendu large cette nuit, et le bord entier compte ses absents à voix basse.", direction: "[solemn] [slowly] Plusieurs n'ont pas répondu à l'appel du matin. Le miroir s'est fendu large cette nuit… et le bord entier compte ses absents à voix basse." },
  { file: "vo_lj_reveal_mponina.mp3", label: "reveal_mponina", text: "Sous le lamba, rien qu'un villageois. Pas de pouvoir, pas de secret — seulement des mains qui portaient l'eau, et une vie prise pour rien.", direction: "[solemn] Sous le lamba, rien qu'un villageois. [slowly] Pas de pouvoir, pas de secret… seulement des mains qui portaient l'eau, et une vie prise pour rien." },
  { file: "vo_lj_reveal_songomby.mp3", label: "reveal_songomby", text: "Sous le lamba, le pelage et les crocs : un Songomby est tombé. La bête ne troublera plus le miroir.", direction: "[solemn] Sous le lamba, le pelage et les crocs : un Songomby est tombé. [warmly] La bête ne troublera plus le miroir." },
  { file: "vo_lj_reveal_mpisikidy.mp3", label: "reveal_mpisikidy", text: "Les cauris se sont répandus dans l'eau peu profonde. Le Mpisikidy s'est tu, et les signes se sont tus avec lui.", direction: "[solemn] Les cauris se sont répandus dans l'eau peu profonde. [slowly] Le Mpisikidy s'est tu, et les signes se sont tus avec lui." },
  { file: "vo_lj_reveal_ombiasy.mp3", label: "reveal_ombiasy", text: "Les ody pendent sans maître. L'Ombiasy s'en est allé, et plus personne ne retiendra la main du sort.", direction: "[solemn] Les ody pendent sans maître. [slowly] L'Ombiasy s'en est allé, et plus personne ne retiendra la main du sort." },
  { file: "vo_lj_reveal_fanany.mp3", label: "reveal_fanany", text: "Un serpent a glissé hors du corps froid : c'était le Fanany. Les Razana ont vu tomber leur gardien.", direction: "[solemn] Un serpent a glissé hors du corps froid : c'était le Fanany. [grave] Les Razana ont vu tomber leur gardien." },
  { file: "vo_lj_reveal_zazavavindrano.mp3", label: "reveal_zazavavindrano", text: "L'eau a repris la sienne. La Zazavavindrano ne tendra plus de fady, et le lac, ce matin, est muet.", direction: "[solemn] L'eau a repris la sienne. [slowly] La Zazavavindrano ne tendra plus de fady, et le lac, ce matin, est muet." },
  { file: "vo_lj_reveal_kalanoro.mp3", label: "reveal_kalanoro", text: "De petits pas s'arrêtent net dans la vase. Le Kalanoro est mort, et les traces retournées ne diront plus rien.", direction: "[solemn] De petits pas s'arrêtent net dans la vase. [slowly] Le Kalanoro est mort, et les traces retournées ne diront plus rien." },
  { file: "vo_lj_reveal_kinoly.mp3", label: "reveal_kinoly", text: "La peau grise ne se relèvera pas deux fois. Le Kinoly est tombé pour de bon, et le dormeur retourne au fond.", direction: "[solemn] La peau grise ne se relèvera pas deux fois. [slowly] Le Kinoly est tombé pour de bon, et le dormeur retourne au fond." },
  { file: "vo_lj_reveal_mpamosavy.mp3", label: "reveal_mpamosavy", text: "Les cendres et les os roulent hors du lamba : c'était le Mpamosavy. Une malédiction de moins sur le lac.", direction: "[solemn] Les cendres et les os roulent hors du lamba : c'était le Mpamosavy. [warmly] Une malédiction de moins sur le lac." },
  { file: "vo_lj_vote_sentence.mp3", label: "vote_sentence", text: "Le cercle s'est refermé. Le village a tranché, et le lac gardera ce nom-là.", direction: "[dramatically] Le cercle s'est refermé. [slowly] [grave] Le village a tranché, et le lac gardera ce nom-là." },
  { file: "vo_lj_vote_personne.mp3", label: "vote_personne", text: "Le cercle s'est défait sans sentence. Personne ne tombe aujourd'hui, et la nuit reviendra plus lourde.", direction: "[solemn] Le cercle s'est défait sans sentence. [ominous] Personne ne tombe aujourd'hui, et la nuit reviendra plus lourde." },
  { file: "vo_lj_razana_vengeance.mp3", label: "razana_vengeance", text: "La Marque funeste s'est refermée. Le Fanany est tombé, et les Razana ont emporté avec lui celui qu'il avait désigné.", direction: "[dramatically] La Marque funeste s'est refermée. [grave] [slowly] Le Fanany est tombé, et les Razana ont emporté avec lui celui qu'il avait désigné." },
];

export const ALL: PackLine[] = [...PROSE, ...CUES];
