# Pack de narration — Les Lanternes de Mangrove

Texte du pack vocal de l'histoire `lanternes-mangrove` (*Ankivy des Eaux Grises*).
**À valider avant génération audio.** Une fois approuvé, ces lignes deviennent
`scripts/story-packs/lanternes-mangrove.ts` puis des `.mp3` livrés avec le front.

Registre : mangrove, pirogues, lanternes, racines, vase, eau grise, sel, marée.
Rimes ou assonances nettes, phrasé oral, grave.

---

## Règle qui gouverne tout le pack : aucun nom de joueur

Les lignes de mort de l'histoire contiennent `{victim}` — le nom du joueur, substitué
au runtime. **Impossible à pré-enregistrer.** Le narrateur ne prononce donc jamais de
nom : il dit *ce qui s'est passé*, l'écran dit *à qui*.

## Deux lignes que j'ai refusé d'écrire

En mode salon, la voix sort du téléphone du narrateur **devant toute la table**. Deux
événements que tu avais listés comme « temps forts » ne peuvent pas être narrés :

| Événement | Pourquoi c'est interdit |
|---|---|
| **Éveil du Kinoly** | Il ne part que dans le `pushLog`, **privé au narrateur**. Publiquement il ne se manifeste que par une nuit sans mort. L'annoncer révélerait qu'un Kinoly est en jeu **et** qu'il vient de survivre. |
| **Remède de l'Ombiasy** | Privé lui aussi. L'annoncer révélerait qu'un Ombiasy est vivant et vient de brûler son unique remède. |

Les deux se racontent déjà, correctement, par la ligne « personne n'est mort » : le
village sait qu'il ne s'est rien passé, sans savoir pourquoi. C'est exactement le
brouillard qu'il faut.

**Seule la vengeance des Razana reste narrable** : elle est déjà publique (le rôle du
Fanany est révélé par sa propre mort, et le serveur envoie l'art `power_fanany_vengeance`
avec le message de morts).

---

## 1. L'aube — ce que la nuit a pris (3)

| Clé | Texte |
|---|---|
| `aube_personne` | Toutes les pirogues sont rentrées. Cette nuit, la mangrove n'a rien pris — et personne n'ose encore dire merci. |
| `aube_une_mort` | Une place est vide sur la rive. L'eau grise ne rend jamais ce qu'elle prend, et la brume s'est refermée sur un nom de moins. |
| `aube_plusieurs_morts` | Plusieurs lanternes se sont éteintes avant le jour. La mangrove a bu large, et le village compte ses absents à voix basse. |

## 2. Ce qu'on découvre sous le lamba (9)

Ces lignes servent **aussi bien à l'aube qu'après un vote** : la révélation est le même
fait, seule l'annonce qui la précède change.

| Clé | Texte |
|---|---|
| `reveal_mponina` | Sous le lamba, rien qu'un villageois. Pas de pouvoir, pas de secret — juste une vie que la nuit a prise sans raison. |
| `reveal_songomby` | Sous le lamba, le pelage et les crocs : un Songomby est tombé. La bête ne fendra plus les racines. |
| `reveal_mpisikidy` | Les cauris se sont répandus dans la vase. Le Mpisikidy s'est tu, et les signes avec lui. |
| `reveal_ombiasy` | Les ody pendent sans maître. L'Ombiasy s'en est allé, et plus personne ne retiendra la main du sort. |
| `reveal_fanany` | Un serpent a glissé hors du corps froid : c'était le Fanany. Les Razana ont vu tomber leur gardien. |
| `reveal_zazavavindrano` | L'eau a repris la sienne. La Zazavavindrano ne nouera plus de fady, et la rivière, ce matin, est muette. |
| `reveal_kalanoro` | De petits pas s'arrêtent net dans la vase. Le Kalanoro est mort, et les traces inversées ne diront plus rien. |
| `reveal_kinoly` | La peau grise ne se relèvera pas deux fois. Le Kinoly est tombé pour de bon, et le revenant retourne à sa tombe. |
| `reveal_mpamosavy` | Les cendres et les os roulent hors du lamba : c'était le Mpamosavy. Une malédiction de moins sur la mangrove. |

## 3. Le vote (2)

| Clé | Texte |
|---|---|
| `vote_sentence` | Le cercle s'est refermé. Le village a tranché, et la mangrove va garder ce nom-là. |
| `vote_personne` | Le cercle s'est défait sans sentence. Personne ne tombe aujourd'hui, et la nuit reviendra plus lourde. |

## 4. Le temps fort narrable (1)

| Clé | Texte |
|---|---|
| `razana_vengeance` | La Marque funeste s'est refermée. Le Fanany est tombé, et les Razana ont emporté avec lui celui qu'il avait désigné. |

---

## Déjà écrit, enregistrable tel quel (26)

Rien à rédiger — ces lignes viennent du preset et n'ont aucun placeholder.

- **intro** (1) — la légende
- **ambiance** (4) — nuit, aube, débat, vote
- **nightSteps** (7) — un appel par rôle
- **dayProgression** (12) — 3 variantes × nuit / aube / débat / vote, choisies selon le jour
- **victoires** (2) — village, Songomby

## Total

**41 lignes** pour le pack complet : 15 à écrire (ci-dessus), 26 déjà écrites.

C'est moins que les ~56 que j'avais estimées : j'ai fusionné les révélations de rôle
entre « mort la nuit » et « éliminé au vote » — c'est le même fait, écrire deux
variantes n'aurait produit que du quasi-doublon — et retiré les deux lignes qui
fuitaient de l'information.
