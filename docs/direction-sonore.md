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

| Emploi | Voix | ID |
|---|---|---|
| Conteur (tout le récit) | **Arthur Martin** — `language: fr`, `narrative_story`, calme | `qCDtdqQv5bdcrgWED5k8` |

Une seule voix porte tout le récit : c'est le fil rouge du conte. Le choix est
**configurable** — `ELEVENLABS_VOICE_NARRATOR` côté core-api, et la même variable pour
`scripts/generate-audio.ts`.

> ⚠️ **Choisis une voix française.** Une voix entraînée en anglais lit le français avec
> un accent marqué, même sur un modèle multilingue. `Gabriel - French high quality`
> paraissait idéal mais a été **désactivé par son propriétaire** (403 `voice_disabled`) —
> vérifier la disponibilité avant de committer un ID.

### Prononciation du malgache
Une voix française lit « Songomby » à la française et le massacre. Deux règles
couvrent l'essentiel : le `o` malgache se dit **[u]** (→ `ou`) et le `y` final **[ɨ]**
(→ `i`). D'où `Songomby` → *sougoumbi*, `Mpisikidy` → *mpissikidi*.

La table est dans `core-api/src/games/angano/pronunciation.ts`, **dupliquée** dans
`scripts/generate-audio.ts` (les deux dépôts sont livrés séparément). *Seule la forme
prononcée change ; tout ce qui est affiché garde son orthographe réelle.* En ajoutant
un rôle, penser aux deux fichiers.

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
