# angano

**Angano** — un jeu de déduction sociale multijoueur en ligne (façon loup‑garou /
mafia, mécaniques génériques), pour **angano.njakasoa.xyz**. La nuit, des monstres
cachés frappent ; le jour, le village débat et vote. Un **narrateur** dédié orchestre
la partie. Thème inspiré du folklore malgache (rôles aux noms malagasy).

> Le nom et les rôles sont en malagasy ; les visuels/audio actuels sont des
> **placeholders recyclés** — de vrais assets « monstres du folklore malgache »
> viendront plus tard.

## Rôles (MVP)

- **Mponina** — villageois sans pouvoir.
- **Songomby** — le monstre : dévore une victime chaque nuit, en meute.
- **Mpisikidy** — sonde le rôle d'un joueur chaque nuit.
- **Ombiasy** — 1 remède (sauver) + 1 poison (tuer).
- **Cupidon** — lie deux amoureux la 1re nuit.
- **Mpihaza** — en mourant, emporte un joueur.

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
