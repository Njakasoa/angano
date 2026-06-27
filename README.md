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
- **Ombiasy** — 1 remède (sauver) + 1 poison (tuer), une fois chacun.
- **Mpihaza** — en mourant, emporte un joueur.
- **Zazavavindrano** — pose un fady d'eau sur un joueur ; si une force hostile le trouble, elle laisse une trace.
- **Kalanoro** — lit les pas d'un joueur : sait s'il a quitté sa place cette nuit.

**Songomby (maléfiques)**
- **Songomby** — le monstre : dévore une victime chaque nuit, en meute.
- **Kinoly** — chasse avec les Songomby, mais paraît innocent à la divination.
- **Mpamosavy** — maudit un joueur chaque nuit : son pouvoir nocturne échoue.

> La nuit est **collectée puis résolue** dans un ordre fixe (marques → blocages →
> infos → morts → sauvetages → traces), côté serveur. La mécanique « amoureux »
> (Cupidon) a été retirée. Rôles à venir : Tromba, Kokolampo, Fanany, Trimobe, Lalomena.

Le **narrateur** est un siège à part (ne joue pas) : il voit tout, lance l'ambiance
et rythme les phases — mais c'est le **serveur** qui résout toute la logique
(rôles secrets, morts, votes, victoire). Anti‑triche par construction : la
réponse/le rôle n'est jamais envoyé à un client qui n'y a pas droit.

## Stack

Vite + TypeScript, UI DOM/CSS + ambiance audio. Multijoueur **server‑authoritatif**
sur **core‑api** (`/angano/rt`). Aucun rôle/secret ne transite vers les mauvais clients.

## Développer

```bash
bun install
bun run dev    # http://localhost:5173
bun run build  # type-check + bundle → dist/
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

`public/assets/images/*.png` (art de phase, redimensionné) et
`public/assets/audio/*.mp3` (ambiance par phase) sont recyclés depuis le repo
Flutter `loupgarou` comme placeholders — à remplacer par des créations originales.
