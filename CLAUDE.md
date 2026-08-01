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

Quatre mécanismes protègent contre ça, à respecter :

1. **`src/audio/manifest.ts`** — chaînes de repli (`nuit_songomby` → `nuit_songomby.mp3`,
   sinon `loupgarou.mp3`) et alias hérités (`cupidon` → `nuit_zazavavindrano`). C'est ce
   qui permet aux deux dépôts de se déployer dans n'importe quel ordre.
2. **`LEGACY_IMAGE_ALIAS`** — même principe pour l'art renommé.
3. **`bun run check:assets`** — échoue si une chaîne ne résout rien, si un visuel
   manque (rôle, **pouvoir**, scène, marque) ou si un lit foley manque. **Lancé par
   `bun run build`** : ne pas le contourner.
4. **`bun run check:live`** — la même liste, mais sondée **sur le site déployé**, plus
   le commit en ligne lu dans `/version.json` (émis par le build, voir `vite.config.ts`).

La liste des fichiers attendus vit dans `scripts/asset-inventory.ts`, importée par les
deux vérificateurs : une clé ajoutée d'un côté est vérifiée des deux.

> Pourquoi le quatrième : `check:assets` prouve que le fichier est dans le dépôt, ce qui
> est une autre question que « est-il en ligne ». La prod a servi pendant des semaines un
> codex avec cinq vignettes noires — build vert, console vide, aucun 404 (l'hôte répond
> `200 text/html`). Une illustration de pouvoir manquante n'était qu'un *avertissement* ;
> c'est une erreur maintenant, et l'écart entre le dépôt et le déploiement se lit en une
> commande.

### Le piège du cache : un asset manquant se grave pour un an

`public/_headers` marque `/assets/*` en `immutable, max-age=31536000`, et cette règle
porte sur le **chemin**, pas sur le fichier. Tant que l'hôte répondait à un chemin
inconnu par l'`index.html` de l'app, la première visite d'un asset non encore déployé
mettait cette page HTML en cache **sur son URL, pour un an** — chez ce visiteur et sur
son nœud de bord. Déployer le fichier ensuite n'y changeait rien : du point de vue du
CDN, l'URL était correcte et fraîche.

C'est arrivé à 72 fichiers d'un coup. Deux garde-fous depuis :

- **`public/404.html`** — sa seule raison d'être est de faire répondre un vrai 404 aux
  chemins inconnus. Ne pas le supprimer : le jeu n'a aucune route côté client, rien
  d'autre ne dépendait de ce repli.
- **`check:live` sonde deux fois**, une fois normalement et une fois derrière le cache,
  et distingue « jamais déployé » de « déployé, mais le CDN sert l'ancienne réponse ».
  Le second ne se règle que par une purge Cloudflare — jamais par un redéploiement.

## Déploiement

Les deux dépôts se déploient **automatiquement au push sur `main`** : le front sur
Cloudflare Pages, core-api par son timer de mise à jour (`deploy/update-core-api.sh`).
Vérifier après coup avec `bun run check:live`, qui lit le commit réellement en ligne.

Côté core-api, l'environnement du conteneur est une **liste explicite** dans
`deploy/docker-compose.prod.yml` : une variable posée dans le `.env` de prod sans être
listée là n'atteint jamais l'API. C'est pour ça que `ELEVENLABS_*` ne fait rien en
production aujourd'hui.

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

Un **pack enregistré** (`src/audio/packs/`) est une troisième voie, et elle appartient à
une légende précise : le navigateur le choisit sur le `storyId` que le serveur envoie, et
une histoire écrite par l'IA n'en a pas. Conséquence à garder en tête — un pack ne joue
**que** si core-api sert le preset correspondant, c'est-à-dire si `ANGANO_STORY_PRESET`
le nomme (côté serveur, cela impose la légende et évite l'appel IA).

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

bun run check:live               # ce que la prod sert vraiment, et depuis quel commit
cd e2e && npm run test:live      # la même suite, pointée sur le site déployé
```

`e2e/` a son propre `package.json`, hors du build de l'app. Les tests protocole
exigent core-api sur `:3000` ; `scenarios.mjs` exige en plus le front sur `:5173`.
`voice.ts` s'ignore proprement si la TTS est désactivée côté serveur.

Après toute modification touchant les assets ou l'audio, faire tourner
`node scenarios.mjs` : le scénario `assets` joue une partie complète et vérifie
qu'aucun visuel ne part en 404.

Pointée sur le live, la suite est la même — seuls les délais changent (×4 hors
localhost, plus un budget dédié à la légende, écrite par une vraie IA en ~30 s). Ne pas
« corriger » un échec de latence en accusant le jeu : vérifier d'abord `check:live`.
