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

La table est dans `core-api/src/games/angano/pronunciation.ts`, **dupliquée** dans
`scripts/generate-audio.ts` (les deux dépôts sont livrés séparément). *Seule la forme
prononcée change ; tout ce qui est affiché garde son orthographe réelle.* En ajoutant
un rôle, penser aux deux fichiers.

## Packs de narration enregistrés

L'expérience par défaut : une légende fixe, entièrement pré-enregistrée. Voir
`docs/pack-lanternes-mangrove.md` pour le texte approuvé et
`src/audio/packs/` pour les données.

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

La direction de jeu (`[solemn]`, `[whispers]`, `[dramatically]`) est appliquée **à la
génération** selon le rôle de la ligne, pas écrite dans le texte : le libellé approuvé
reste exactement celui qui a été relu, et rediriger tout le pack est une seule
modification au lieu de 41.

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

# vérifier qu'aucun asset référencé ne manque (lancé aussi par `bun run build`)
bun run check:assets
```

### État
- ✅ **14 bruitages** générés (`sfx_*.mp3`)
- ✅ **11 voix off** statiques générées (`vo_*.mp3`)
- ⏳ **13 ambiances de phase** — *non générées*. Disponibles via `--ambiance`, mais
  l'API plafonne à 22 s et les boucles ne raccordent pas proprement ; les ambiances
  recyclées actuelles sonnent probablement mieux. **À écouter avant de committer.**

En attendant, chaque clé d'ambiance retombe sur un placeholder via la chaîne de repli
de `src/audio/manifest.ts` — déposer `nuit_songomby.mp3` suffit à le remplacer, sans
toucher au code.

## Garde-fous
- Un bruitage ne doit **jamais** couvrir une réplique : c'est le rôle du ducking, pas
  du mixage à la main.
- Les clés d'ambiance sont décidées par le **serveur** (`PHASE_ASSET`) : renommer un
  fichier sans mettre à jour le manifeste rend une phase muette. `check:assets`
  échoue dans ce cas — il tourne au build.
- Pas de fichier > ~150 Ko pour un bruitage : ils sont préchargés en bloc.
