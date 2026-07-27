# CLAUDE.md — angano

Front d'un jeu de déduction sociale (folklore malgache). Vite + TypeScript, UI en
DOM/CSS pur, **aucun framework**. Voir `README.md` pour le jeu lui-même.

## L'invariant central : ce dépôt ne contient aucune logique de jeu

Tout est résolu par **core-api** (`src/games/angano/`, dépôt séparé), via WebSocket
`/angano/rt`. Rôles, morts, votes, victoire : le serveur décide, le client affiche.
`src/core/protocol.ts` est un **miroir manuel** du protocole backend — le modifier
sans mettre à jour l'autre dépôt casse silencieusement.

En ajoutant un champ au protocole : le rendre **optionnel**. Les deux dépôts se
déploient séparément, dans un ordre non garanti.

## Les assets sont adressés par des clés venues du serveur

C'est la source de bugs la plus vicieuse du projet. `PHASE_ASSET` (dans core-api)
décide quel `.mp3` et quel `.webp` le navigateur charge. Rien dans le bundle ne
mentionne ces fichiers, donc :

- un `background-image` en 404 **ne produit aucune erreur** — juste une bannière vide ;
- une piste absente ne produit **aucune erreur** — juste du silence.

Trois mécanismes protègent contre ça, à respecter :

1. **`src/audio/manifest.ts`** — chaînes de repli (`nuit_songomby` → `nuit_songomby.mp3`,
   sinon `loupgarou.mp3`) et alias hérités (`cupidon` → `nuit_zazavavindrano`). C'est ce
   qui permet aux deux dépôts de se déployer dans n'importe quel ordre.
2. **`LEGACY_IMAGE_ALIAS`** — même principe pour l'art renommé.
3. **`bun run check:assets`** — échoue si une chaîne ne résout rien. **Lancé par
   `bun run build`** : ne pas le contourner.

## Son

`src/audio/engine.ts` — trois bus (`music` bouclé, `sfx` polyphonique, `voice`
exclusif qui baisse la musique à 25 %). Détails et casting : `docs/direction-sonore.md`.

Deux pièges déjà corrigés, à ne pas réintroduire :
- **Ne jamais avaler l'erreur d'autoplay.** Les navigateurs refusent le son sans
  geste utilisateur, et le rejoin automatique après rechargement n'en a aucun. Le
  moteur distingue « coupé » de « bloqué » et l'UI le signale.
- **Ne jamais supposer qu'un fichier existe.** Les clés se résolvent par sondage, et
  le résultat (y compris « aucun ») est mis en cache.

La voix off se scinde en deux : texte fixe → fichier livré (`scripts/generate-audio.ts`) ;
légende écrite par l'IA → synthétisée au runtime par core-api. Ne pas mélanger.

Les noms malgaches sont corrigés par un **dictionnaire de prononciation ElevenLabs**
(`o` → `ou`, `y` final → `i`, `j` → `dz`), appliqué en amont : le texte part tel qu'il
est écrit. Les règles vivent dans `scripts/pronunciation-rules.ts` et se publient par
`bun run dico:sync`, qui imprime l'`ELEVENLABS_DICT_ID` / `_VERSION` à reporter dans
les deux `.env`. En ajoutant un rôle **ou un nom de lieu**, éditer ce fichier et
resynchroniser.

> Cette table a longtemps existé en **trois copies** — et elles avaient divergé : une
> seule connaissait `Ambohitra`, aucune ne couvrait le moindre nom de village. Ne pas
> réintroduire de respelling dans le code : `voice.test.ts` échoue si le texte est
> réécrit avant l'envoi.

## Images

Livrées en **WebP** (`bun run opt:images`). Les masters PNG restent dans l'historique
git. `brand_icon` / `brand_og` restent en PNG (favicons, robots sociaux).

## Tests

```bash
bun run build                    # check:assets + tsc + vite
cd e2e && npm test               # protocole (bun) + navigateur (Playwright)
```

`e2e/` a son propre `package.json`, hors du build de l'app. Les tests protocole
exigent core-api sur `:3000` ; `scenarios.mjs` exige en plus le front sur `:5173`.
`voice.ts` s'ignore proprement si la TTS est désactivée côté serveur.

Après toute modification touchant les assets ou l'audio, faire tourner
`node scenarios.mjs` : le scénario `assets` joue une partie complète et vérifie
qu'aucun visuel ne part en 404.
