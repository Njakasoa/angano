# Angano — Direction sonore

Pendant du document `art-direction.md`, pour l'oreille. Les **prompts** sont dans
`scripts/audio-plan.ts` (source unique) ; ce document explique le *pourquoi* et fixe
les invariants.

## Le parti pris — « conte oral, matières organiques »

Le jeu est un *angano* : une histoire qu'on **raconte** à voix haute, la nuit. Tout
le son découle de ça.

- **Aucun synthétiseur.** Les sources sont physiques : bois, souffle, eau, terre,
  raffia, peau de tambour. Un bruitage électronique casserait immédiatement le cadre.
- **Sec et proche.** Peu de réverbération : on est autour du feu, pas dans une
  cathédrale. C'est ce qui rend l'écoute intime plutôt que spectaculaire.
- **Un seul foyer sonore à la fois**, comme la lumière en peinture : une nuit, c'est
  un souffle *ou* des sabots, jamais les deux au même niveau.

## Les trois bus

`src/audio/engine.ts` mélange trois bus indépendants — c'est ce qui permet à une
voix off de passer *par-dessus* l'ambiance sans la couper :

| Bus | Contenu | Comportement |
|---|---|---|
| `music` | Ambiance de phase, bouclée | Fondu enchaîné entre phases, **baissée à 25 %** sous une voix |
| `sfx` | Bruitages ponctuels | Polyphonique, se superposent librement |
| `voice` | Voix off | Exclusif — une nouvelle réplique interrompt la précédente |

Le *ducking* est le détail qui fait la différence : sans lui, la narration se noie
dans l'ambiance. Volumes et coupure sont persistés (`localStorage`), séparément par bus.

### Le son bloqué n'est pas un son coupé
Les navigateurs refusent l'audio tant que le joueur n'a pas interagi, et la page peut
être atteinte **sans aucun geste** (rejoin automatique après un rechargement).
L'ancien code avalait l'erreur et restait muet pour toujours. Le moteur distingue
maintenant les deux états et l'UI affiche un bouton pulsant 🔈 tant que le son est
retenu.

## Casting

Une seule voix porte tout le récit : c'est le fil rouge du conte. Le défaut actuel est
**Arthur Martin** (`qCDtdqQv5bdcrgWED5k8`, `language: fr`, `narrative_story`) — un choix
provisoire, retenu sur ses métadonnées, **pas à l'oreille**.

### Choisir à l'oreille

```bash
export ELEVENLABS_API_KEY=sk_...

bun scripts/audition-voice.ts list --fr              # les voix françaises du compte
bun scripts/audition-voice.ts voices id1,id2,id3     # la même réplique, chaque voix
bun scripts/audition-voice.ts models --voice id1     # la même voix, chaque modèle
bun scripts/audition-voice.ts sweep stability --voice id1
bun scripts/audition-voice.ts one --voice id1 --stability 0.35 --style 0.55 --speed 0.92
```

Tout sort dans `audition/` (gitignoré), sur de **vraies répliques du jeu** (`--sample
intro|songomby|kinoly|fanany|mort|victoire`) : juger sur un « bonjour » ne dit rien.

Une fois la voix retenue : `ELEVENLABS_VOICE_NARRATOR` dans `core-api/.env`, puis
`bun run gen:audio --voice --force` pour refaire les 11 voix off statiques.

> ⚠️ **Choisis une voix française.** Une voix entraînée en anglais lit le français avec
> un accent marqué, même sur un modèle multilingue. Et une voix peut être **désactivée
> par son propriétaire** : `Gabriel - French high quality` paraissait idéal mais renvoie
> 403 `voice_disabled`. Toujours tester avant de committer un ID.

## Modèle et réglages

Mesuré sur une réplique de narration typique :

| Modèle | Latence | Emploi |
|---|---|---|
| `eleven_v3` | 3 572 ms | le plus expressif ; trop lent pour le runtime |
| `eleven_multilingual_v2` | 1 362 ms | **défaut des deux côtés** |
| `eleven_flash_v2_5` | 544 ms | basse latence, le moins expressif |

Le warm runtime enchaîne ~10 répliques à 4 en parallèle dans un budget de 12 s :
`multilingual_v2` y tient largement tout en lisant bien mieux que `flash`.

> ⚠️ **Garde le même modèle des deux côtés** (`ELEVENLABS_MODEL` dans core-api et pour
> `gen:audio`). Une même voix ne rend pas pareil d'un modèle à l'autre : le conteur
> changerait imperceptiblement de caractère entre une révélation de rôle (fichier
> statique) et le récit (synthèse runtime).

Réglages, tous optionnels — omis, la voix garde ses propres défauts :

| Variable | Effet |
|---|---|
| `ELEVENLABS_STABILITY` | bas = expressif et varié · haut = plat et constant |
| `ELEVENLABS_STYLE` | exagération du jeu d'acteur ; instable au-delà de ~0.6 |
| `ELEVENLABS_SPEED` | < 1 = plus lent et plus grave (0.7–1.2) |
| `ELEVENLABS_SIMILARITY` | fidélité au timbre d'origine |

Ils entrent dans la **clé de cache** côté serveur : re-régler la stabilité ne resert
pas l'ancien rendu. Sur `eleven_v3`, `stability` n'accepte que 3 paliers (0, 0.5, 1).

### Prononciation du malgache
Une voix française lit « Songomby » à la française et le massacre. Deux règles
couvrent l'essentiel : le `o` malgache se dit **[u]** (→ `ou`) et le `y` final **[ɨ]**
(→ `i`). D'où `Songomby` → *sougoumbi*, `Mpisikidy` → *mpissikidi*.

Ajoute `j` → **dz** pour les toponymes : `Ambohijanaka` → *ambouidzanaka*.

C'est un **dictionnaire de prononciation hébergé chez ElevenLabs**, référencé par
`ELEVENLABS_DICT_ID` / `_VERSION` dans les deux dépôts. Le texte part **tel qu'il est
écrit** ; la correction se fait en aval. Les règles sont versionnées ici, dans
`scripts/pronunciation-rules.ts`, et publiées par :

```bash
bun run dico:sync                 # crée un dictionnaire
bun run dico:sync --id <id>       # remplace les règles d'un existant
```

Ce fichier est la source de vérité, pas le dictionnaire : une fois téléversé il est
opaque — l'endpoint de téléchargement d'ElevenLabs répond `500` — donc une règle qui
n'existerait que là-bas serait une règle que personne ne peut relire.

> **Avant**, la table vivait en trois exemplaires : `core-api/pronunciation.ts`,
> `generate-audio.ts` et `audition-voice.ts`. Elles avaient divergé — seule celle du
> banc d'essai connaissait `Ambohitra`, et **aucune ne couvrait un nom de village**,
> si bien que chaque légende s'ouvrait sur un toponyme lu à la française. Les trois
> sont supprimées. `voice.test.ts` échoue si un respelling revient dans le code.

Deux limites à connaître. Les règles sont de type **alias** (une orthographe en
remplace une autre), pas **phoneme** : les règles phonétiques ne sont pas supportées
par tous les modèles, les alias oui. Et un dictionnaire absent n'est pas une panne —
les noms sont simplement lus à la française ; core-api et le générateur le signalent
au démarrage, parce que rien en aval ne le ferait.

## La nuit s'écoute

Autour d'une table, tout le monde ferme les yeux. L'écran nomme pourtant chaque étape
(`Nuit 2 — Ombiasy`) et personne ne le lit : c'est au son de porter la nuit.

**Deux bruitages par tour.** `wake_<rôle>` à l'ouverture — qui s'éveille — et
`act_<rôle>` à l'instant où l'acteur a choisi, sur le message `acted` du serveur. Le
second est le plus important : il dit que c'est fini, sans que personne rouvre les
yeux. Chaque rôle a sa matière propre (l'eau, les braises, les graines, la vase, la
pierre, les roseaux, les amulettes) pour être reconnaissable seul, pas comme la
variation d'un même froissement.

**Un lit foley par tour**, choisi au salon via l'option *🌙 Nuit sonore*, active par
défaut. Le lit musical composé reste disponible en décochant. Les deux cohabitent
dans la chaîne de repli : `musicCandidates` place `nuit_songomby_foley.mp3` devant
`nuit_songomby.mp3`, donc **un lit foley non produit retombe sur sa musique** — c'est
ce qui a permis de livrer l'option avant l'audio.

Rien de tout ça ne trahit quoi que ce soit. core-api construit la nuit à partir des
rôles **vivants** : un Ombiasy mort n'a tout simplement plus de tour, et l'étape du
Kinoly n'apparaît qu'une fois qu'il s'est éveillé. L'existence d'un tour est donc
déjà publique, dans `phase`, avant qu'aucun son ne joue. Une seule exception tenue
côté serveur : la Marque du Fanany passe par le même gestionnaire d'action mais en
plein jour, et reste muette — son secret est toute la mécanique.

### Comparer plusieurs prises

Aucun endpoint ElevenLabs ne renvoie plusieurs résultats par requête — ni
`/v1/sound-generation` (pas de `n`, pas de `seed`), ni `/v1/music`, ni la synthèse
vocale. Quatre variantes = quatre requêtes, facturées quatre fois.

C'est le bon compromis pour du sound design, où le prompt est une hypothèse et la
deuxième prise est souvent la bonne — mais pas quelque chose à faire en silence.
D'où `--variants=<n>` : les prises vont dans `audition/variantes/` (gitignoré),
`public/` n'est jamais touché, et le script imprime le `cp` qui garde la bonne.

Les lits foley sont générés avec `loop: true` : `eleven_text_to_sound_v2` referme la
boucle lui-même. Les lits **musicaux** passent toujours par le crossfade ffmpeg — le
compositeur n'a pas cette option — et y perdent trois secondes de matière à chaque
fois.

## Packs de narration enregistrés

L'expérience par défaut : une légende fixe, entièrement pré-enregistrée. Les données
sont dans `src/audio/packs/`, le texte approuvé dans `docs/pack-*.md`.

**Une légende, un conteur.** Le pack porte sa propre voix, déclarée à côté de ses
lignes dans `scripts/audio-plan.ts` — pas dans l'environnement : régénérer d'un bloc
ne peut donc pas réenregistrer une légende avec la voix de l'autre.

| Légende | Conteur | État | Texte |
|---|---|---|---|
| `lac-jarres-blanches` — *Ankareno* | Grandpa Oxley (`0dPqNXnh…`) | **la seule montée** | [`pack-lac-jarres-blanches.md`](pack-lac-jarres-blanches.md) |
| `lanternes-mangrove` — *Ankivy des Eaux Grises* | voix clonée (`LOF1yccp…`) | enregistrée puis **rejetée à l'écoute** | [`pack-lanternes-mangrove.md`](pack-lanternes-mangrove.md) |
| `barriere-rompue` — *Ambohijanaka des Enclos* | Grandma Clo (`EMuO6fFL…`) | enregistrée puis **rejetée à l'écoute** | [`pack-barriere-rompue.md`](pack-barriere-rompue.md) |
| `pierres-laterite` — *Antsahon'ny Vato* | — | jamais écrite | — |

Les deux packs rejetés ne sont plus câblés : leurs modules sont sortis du registre, et
une légende sans pack n'est **pas** un état cassé — le navigateur retombe sur la voix
runtime, ou sur le texte. Leur texte approuvé reste dans les `docs/pack-*.md` et dans
git, et la prose se régénère depuis le préréglage de core-api par script : les
réenregistrer coûte une commande, pas une réécriture.

`pierres-laterite` demande une diction sèche et tranchante — c'est une quatrième voix
à trouver, pas une de celles-ci.

Un pack se compose de deux familles, parce qu'on les retrouve de deux façons :

- **PROSE** — le texte de la légende, extrait du preset. Le serveur envoie déjà ces
  chaînes dans `phase.text` : le navigateur **apparie sur le texte lui-même**, donc
  aucune clé ne peut diverger de ce qui est réellement dit.
- **CUES** — écrites pour le pack ; le serveur ne les envoie jamais, elles se
  branchent sur des événements (aube sans mort, rôle révélé, sentence).

Deux règles absolues :

1. **Le narrateur ne prononce jamais de nom de joueur.** Les lignes de mort du preset
   portent `{victim}`, qu'aucun enregistrement ne peut interpoler. La voix dit *ce
   qui s'est passé*, l'écran dit *à qui*. `check:assets` refuse le build si un
   placeholder apparaît dans un pack.
2. **Un pack n'est joué que sur son `storyId`.** Une légende écrite par l'IA n'en a
   pas et n'obtient donc aucun pack : lire de la prose enregistrée par-dessus une
   autre histoire serait pire que de ne rien lire.

La direction de jeu est appliquée **à la génération**, jamais écrite dans `text` : une
balise dans le texte apparié rendrait la ligne muette, et `check:assets` la refuse.

Deux niveaux. Par défaut, une balise unique déduite du rôle de la ligne
(`[whispers]` la nuit, `[solemn]` à l'aube, `[dramatically]` au vote) — suffisant pour
une phrase, trop grossier pour une légende qui doit chuchoter, basculer, puis se poser.
Une ligne peut donc porter sa propre `direction` : la même phrase, balisée finement,
utilisée pour la seule synthèse. `check:assets` compare les deux **mot à mot** — seules
les balises et la ponctuation peuvent différer.

Deux règles, apprises au banc d'essai et tenues par le build :

- **Aucune balise non-verbale.** `[sighs]`, `[laughs]` ne sont pas interprétés, ils sont
  *joués* : on entend un soupir plaqué au milieu de la phrase.
- **La direction descend vers la fin d'une partie.** Une victoire ouverte sur
  `[dramatically]` relance le récit ; terminée sur `[slowly]`, elle le referme.

## Voix off : statique vs dynamique

C'est la scission structurante de tout le système.

**Statique** — texte fixe (révélations de rôle, victoires). Généré une fois, livré en
fichier. Zéro latence, zéro coût par partie. → `scripts/generate-audio.ts`.

**Dynamique** — en mode « ✨ Histoire IA », la légende est écrite par le LLM à chaque
partie : impossible à pré-enregistrer. Synthétisée au runtime par core-api pendant
l'écran de préparation, puis servie par `GET /v1/tts/:hash`. Le jeu ne bloque
**jamais** dessus : une réplique sans clip s'affiche simplement en texte.

## Production

```bash
# bruitages + voix off statique (par défaut) — n'écrase pas l'existant
ELEVENLABS_API_KEY=sk_... bun run gen:audio

# une seule catégorie / tout régénérer
ELEVENLABS_API_KEY=sk_... bun scripts/generate-audio.ts --voice --force

# une seule légende — `--force` sur `--pack` seul réenregistrerait tous les packs
ELEVENLABS_API_KEY=sk_... bun scripts/generate-audio.ts --pack=lac-jarres-blanches

# quatre prises de chaque son, dans audition/variantes/ — public/ n'est pas touché
ELEVENLABS_API_KEY=sk_... bun scripts/generate-audio.ts --foley --variants=4

# vérifier qu'aucun asset référencé ne manque (lancé aussi par `bun run build`)
bun run check:assets
```

### État

`bun run doc:audio` régénère l'inventaire complet dans
[`audio-a-generer.md`](audio-a-generer.md) : chaque fichier attendu, sa taille, sa
durée, et la commande exacte qui le refait. C'est la table à consulter après une
séance d'écoute.

- ⚠️ **8 bruitages sur 14** — 6 rejetés à l'écoute, à refaire
- ⚠️ **0 voix off statique sur 11** — toutes rejetées, à refaire
- ✅ **13 ambiances de phase** composées, refermées en boucle par ffmpeg
- ⚠️ **1 pack sur 4 légendes** — le Lac, 26 lignes gardées sur 37
- ⏳ **14 bruitages de tour de nuit** (`--sfx`) et **7 lits foley** (`--foley`) —
  écrits, jamais générés. Le jeu tourne sans : les tours sont muets et la nuit joue
  ses lits musicaux.

Une clé d'ambiance sans fichier retombe sur un placeholder via la chaîne de repli de
`src/audio/manifest.ts` — déposer `nuit_songomby.mp3` suffit à le remplacer, sans
toucher au code.

## Garde-fous
- Un bruitage ne doit **jamais** couvrir une réplique : c'est le rôle du ducking, pas
  du mixage à la main.
- Les clés d'ambiance sont décidées par le **serveur** (`PHASE_ASSET`) : renommer un
  fichier sans mettre à jour le manifeste rend une phase muette. `check:assets`
  échoue dans ce cas — il tourne au build.
- Pas de fichier > ~150 Ko pour un bruitage : ils sont préchargés en bloc.
