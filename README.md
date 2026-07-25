# angano

**Angano** — un jeu de déduction sociale multijoueur en ligne (façon loup‑garou /
mafia, mécaniques génériques), pour **angano.njakasoa.xyz**. La nuit, des monstres
cachés frappent ; le jour, le village débat et vote. Un **narrateur** dédié orchestre
la partie. Thème inspiré du folklore malgache (rôles aux noms malagasy).

> Le nom et les rôles sont en malagasy ; les visuels/audio actuels sont des
> **placeholders recyclés** — de vrais assets « monstres du folklore malgache »
> viendront plus tard.

## Rôles (MVP — identité « fady / traces / esprits », voir `docs/roles-folklore-finalise-v2.md`)

**Village**
- **Mponina** — villageois sans pouvoir.
- **Mpisikidy** — sonde le rôle d'un joueur chaque nuit (le sikidy peut être brouillé).
- **Ombiasy** — 1 remède (sauver) + 1 rituel d'exil (tuer), une fois chacun.
- **Fanany** — marque un joueur ; si le Fanany meurt avant le prochain jour, la marque le venge.
- **Zazavavindrano** — pose un fady d'eau sur un joueur ; si une force hostile le trouble, elle laisse une trace.
- **Kalanoro** — lit les pas d'un joueur : sait s'il a quitté sa place cette nuit.

**Songomby (maléfiques)**
- **Songomby** — le monstre : dévore une victime chaque nuit, en meute.
- **Mpamosavy** — maudit un joueur chaque nuit : son pouvoir nocturne échoue.

**Neutre**
- **Kinoly** — dormant au départ ; la première mort nocturne l'éveille, puis il hante ses cibles. Le vote le tue normalement.

> La nuit est **collectée puis résolue** dans un ordre fixe (marques → blocages →
> infos → morts → sauvetages → traces), côté serveur. La mécanique « amoureux »
> (Cupidon) a été retirée. Rôles à venir : Tromba, Kokolampo, Trimobe, Lalomena.

Le **narrateur** est un siège à part (ne joue pas) : il voit tout, lance l'ambiance
et rythme les phases — mais c'est le **serveur** qui résout toute la logique
(rôles secrets, morts, votes, victoire). Anti‑triche par construction : la
réponse/le rôle n'est jamais envoyé à un client qui n'y a pas droit.

## Stack

Vite + TypeScript, UI DOM/CSS + ambiance audio. Multijoueur **server‑authoritatif**
sur **core‑api** (`/angano/rt`). Aucun rôle/secret ne transite vers les mauvais clients.

## Son

Trois bus indépendants (`src/audio/engine.ts`) : ambiance bouclée, bruitages
ponctuels, et voix off qui **baisse l'ambiance** sous elle. Volumes et coupure
persistés ; quand le navigateur retient l'audio faute de geste utilisateur, l'UI le
signale au lieu de rester muette en silence.

La **voix off** se scinde en deux : les répliques à texte fixe (révélations de rôle,
victoires) sont livrées en fichiers, tandis que la légende écrite par l'IA est
synthétisée au runtime par core-api. Voir `docs/direction-sonore.md`.

Les clés d'ambiance viennent du **serveur** ; `src/audio/manifest.ts` les résout en
fichiers via une chaîne de repli, si bien qu'une piste non encore produite retombe
sur un placeholder au lieu de rendre la phase muette.

## Développer

```bash
bun install
bun run dev    # http://localhost:5173
bun run build  # check assets + type-check + bundle → dist/

bun run check:assets   # aucun visuel/son référencé ne manque (lancé par le build)
bun run opt:images     # ré-encode les PNG en WebP
ELEVENLABS_API_KEY=sk_... bun run gen:audio   # bruitages + voix off statique
```

Pointer vers un core‑api local : `VITE_API_BASE=http://localhost:3000 bun run dev`.
Tester à plusieurs : ouvrir un onglet par joueur (+ un pour le narrateur).

## Déploiement (Cloudflare Pages)

Connecter le repo (preset **Vite**, build `dist`), domaine `angano.njakasoa.xyz`.
`public/_headers` autorise `https://api.njakasoa.xyz` + `wss://api.njakasoa.xyz`.

> Backend : gateway dans **core‑api** (`src/games/angano/`). Ajouter
> `https://angano.njakasoa.xyz` à `CORS_ORIGINS` du `.env` du VPS (le fetch
> `/v1/auth/guest` est cross‑origin).

## Assets

`public/assets/images/*.webp` — illustrations originales (masters PNG générés depuis
`docs/illustrations-prompts.csv`, ré-encodés en WebP pour la livraison : 19 Mo → 1,5 Mo).
`brand_icon` / `brand_og` restent en PNG pour les favicons et les robots sociaux.

`public/assets/audio/` — bruitages (`sfx_*`) et voix off (`vo_*`) produits via
ElevenLabs depuis `scripts/audio-plan.ts`. Les **ambiances de phase** sont encore les
pistes recyclées du repo Flutter `loupgarou` ; la chaîne de repli du manifeste permet
de les remplacer fichier par fichier, sans toucher au code.
