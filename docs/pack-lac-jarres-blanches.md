# Pack de narration — Le Lac des Jarres Blanches

Texte du pack vocal de l'histoire `lac-jarres-blanches` (*Ankareno*), la troisième légende mise
en voix. Elle est racontée par **Grandpa Storyteller Oxley** (`0dPqNXnhg2bmxQv1WKDp`).
Une légende, un conteur — voir [`direction-sonore.md`](direction-sonore.md) pour la
table complète.

Registre : eau sacrée, jarres blanches, offrandes de miel et de sel, reflets, vase,
lune sur le lac. La légende demande elle-même « lenteur au début puis plus de tension
au fil du jour » : c'est ce qui a décidé du choix de la voix.

Les règles communes à tous les packs sont dans
[`pack-lanternes-mangrove.md`](pack-lanternes-mangrove.md) : **aucun nom de joueur**,
et **ni l'éveil du Kinoly ni le remède de l'Ombiasy** ne sont narrés.

---

## Ce qui est écrit ci-dessous

C'est la version **dirigée** — celle qui part à la synthèse. La version nue, sans
balise, est celle que le navigateur compare au texte du serveur ; `check:assets`
vérifie mot à mot que les deux disent la même chose, donc seules les balises et la
ponctuation diffèrent.

Deux règles, apprises au banc d'essai :

- **Aucune balise non-verbale.** `[sighs]` n'est pas interprété, il est *joué* — on
  entend un soupir plaqué au milieu de la phrase. `check:assets` les refuse.
- **La direction descend vers la fin.** Une victoire ouverte sur `[dramatically]` puis
  `[warmly]` relance le récit au lieu de le refermer ; elle se termine maintenant sur
  `[slowly]`, et on entend que la partie est finie.

Trois lignes n'ont **aucune** direction — les deux du débat et son ambiance. C'est
le moment où la table parle : le conteur se retire.

---

# Prose de la légende (22)

Extraite telle quelle du préréglage de core-api par script.

## Ouverture et ambiances (5)

| Clé | Texte dirigé |
|---|---|
| `intro` | [slowly] [solemn] Au bord du rano masina, les jarres blanches chantaient sous la lune au loin… [softly] Des pièces, du miel et du sel dormaient sur l’eau, promesse de paix et de peur mêlées au même cœur. [ominous] Mais quand le reflet se fend, le sort devient mordant, [dramatically] et chaque nuit réclame son tribut, lentement ou brusquement. |
| `ambiance_night` | [whispers] La lune boit dans le lac, [ominous] et le vent rend la peur plus dure que le bruit. |
| `ambiance_dawn` | [solemn] [slowly] L’aube lave les jarres… mais ne lave pas les doutes qui restent au bord. |
| `ambiance_debate` | Chaque parole fait des vagues, chaque silence fait des routes vers l’ombre. |
| `ambiance_vote` | [dramatically] Quand les voix se lèvent, le destin se noue, [slowly] et le cœur choisit son couteau de lumière. |

## Les tours de nuit (7)

| Clé | Texte dirigé |
|---|---|
| `nuit_zazavavindrano` | [whispers] L’esprit des eaux tend un fady sur le miroir… [ominous] et toute force hostile y laisse un frisson noir. |
| `nuit_mpamosavy` | [whispers] Le charmeur souffle son mal sur une cible nouvelle… [ominous] et son pouvoir s’éteint dans une haleine cruelle. |
| `nuit_mpisikidy` | [whispers] Le devin lit les cauris dans la poussière de lune… et les signes révèlent un masque ou un mirage. |
| `nuit_kalanoro` | [whispers] La pisteuse suit des traces sans les nommer… et la place quittée parle plus fort que le pas premier. |
| `nuit_kinoly` | [whispers] Le dormeur, s’il a déjà ouvert les yeux, rôde dans le noir… [ominous] et choisit un nom pour le hanter au miroir. |
| `nuit_songomby` | [whispers] La meute s’unit sans débat… [ominous] et la faim désigne une proie avant que le matin ne la surprenne. |
| `nuit_ombiasy` | [whispers] Le gardien des serments mesure la nuit… puis décide s’il faut panser une vie ou chasser un péril. |

## Progression du jour (8)

| Clé | Texte dirigé |
|---|---|
| `jour_night_0` | [slowly] [ominous] La nuit tombe sur le rano masina, douce comme un chant… dure comme un sort. |
| `jour_night_1` | [whispers] Les jarres blanches brillent, et le village retient son souffle dans l’ombre sans bruit. |
| `jour_dawn_0` | [solemn] [slowly] À l’aube, une trace manque au bord de l’eau… et la peur s’assoit près du feu. |
| `jour_dawn_1` | [solemn] Chacun regarde les reflets, car le lac garde les noms comme il garde les secrets. |
| `jour_debate_0` | Le premier débat cherche la forme du mensonge, et les voix tournent comme des pirogues sur l’onde. |
| `jour_debate_1` | Puis les soupçons se resserrent, et le cœur de chacun bat contre sa propre honte. |
| `jour_vote_0` | [slowly] Le vote devient lourd comme une pierre mouillée… et chaque main hésite avant le geste. |
| `jour_vote_1` | [dramatically] Quand la dernière voix tombe, le sort se ferme, et la vérité sort de l’orage. |

## Fins de partie (2)

| Clé | Texte dirigé |
|---|---|
| `victoire_village` | [solemn] Le village l’emporte quand les Songomby sont tous chassés. [warmly] [slowly] Et l’aube boit enfin une eau sans peur ni bruit. |
| `victoire_songomby` | [ominous] Les Songomby gagnent quand leur nombre atteint la parité des vivants du village. [slowly] [grave] Et la nuit ferme alors son poing sur le bruit. |

---

# Lignes écrites pour le pack (15)

## L'aube — ce que la nuit a pris (3)

| Clé | Texte dirigé |
|---|---|
| `aube_personne` | [solemn] Toutes les jarres sont encore au bord, et pas un nom ne manque au matin. [slowly] Cette nuit, le lac n'a rien pris… et personne n'ose encore le dire tout haut. |
| `aube_une_mort` | [solemn] [slowly] Une place est vide au bord de l'eau. Le lac a repris ce qu'il devait reprendre… et le village se réveille avec un nom de moins. |
| `aube_plusieurs_morts` | [solemn] [slowly] Plusieurs n'ont pas répondu à l'appel du matin. Le miroir s'est fendu large cette nuit… et le bord entier compte ses absents à voix basse. |

## Les révélations de rôle (9)

| Clé | Texte dirigé |
|---|---|
| `reveal_mponina` | [solemn] Sous le lamba, rien qu'un villageois. [slowly] Pas de pouvoir, pas de secret… seulement des mains qui portaient l'eau, et une vie prise pour rien. |
| `reveal_songomby` | [solemn] Sous le lamba, le pelage et les crocs : un Songomby est tombé. [warmly] La bête ne troublera plus le miroir. |
| `reveal_mpisikidy` | [solemn] Les cauris se sont répandus dans l'eau peu profonde. [slowly] Le Mpisikidy s'est tu, et les signes se sont tus avec lui. |
| `reveal_ombiasy` | [solemn] Les ody pendent sans maître. [slowly] L'Ombiasy s'en est allé, et plus personne ne retiendra la main du sort. |
| `reveal_fanany` | [solemn] Un serpent a glissé hors du corps froid : c'était le Fanany. [grave] Les Razana ont vu tomber leur gardien. |
| `reveal_zazavavindrano` | [solemn] L'eau a repris la sienne. [slowly] La Zazavavindrano ne tendra plus de fady, et le lac, ce matin, est muet. |
| `reveal_kalanoro` | [solemn] De petits pas s'arrêtent net dans la vase. [slowly] Le Kalanoro est mort, et les traces retournées ne diront plus rien. |
| `reveal_kinoly` | [solemn] La peau grise ne se relèvera pas deux fois. [slowly] Le Kinoly est tombé pour de bon, et le dormeur retourne au fond. |
| `reveal_mpamosavy` | [solemn] Les cendres et les os roulent hors du lamba : c'était le Mpamosavy. [warmly] Une malédiction de moins sur le lac. |

## Le verdict et la vengeance (3)

| Clé | Texte dirigé |
|---|---|
| `vote_sentence` | [dramatically] Le cercle s'est refermé. [slowly] [grave] Le village a tranché, et le lac gardera ce nom-là. |
| `vote_personne` | [solemn] Le cercle s'est défait sans sentence. [ominous] Personne ne tombe aujourd'hui, et la nuit reviendra plus lourde. |
| `razana_vengeance` | [dramatically] La Marque funeste s'est refermée. [grave] [slowly] Le Fanany est tombé, et les Razana ont emporté avec lui celui qu'il avait désigné. |
