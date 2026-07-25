# Angano — tests E2E

Tests de bout en bout, gardés hors du build de l'app (leur propre `package.json`).

## Deux niveaux

| Fichier | Niveau | Lanceur | Besoin |
|---|---|---|---|
| `smoke.ts` | Protocole (WebSocket) — partie complète + secret des rôles | `bun` | core-api `:3000` |
| `reconnect.ts` | Protocole — déconnexion / reconnexion / anti-rejoin | `bun` | core-api `:3000` |
| `story.ts` | Protocole — narrateur obligatoire + histoire IA + fiches missions | `bun` | core-api `:3000` |
| `voice.ts` | Protocole — voix off : synthèse, service du clip, cache, 404 | `bun` | core-api `:3000` + `ELEVENLABS_*` |
| `scenarios.mjs` | Navigateur (Playwright) — chaque issue jouée jusqu'à la fin | `node` | core-api `:3000` **+** front `:5173` |

`voice.ts` **s'ignore** (exit 0) si la voix off est désactivée côté serveur : le
mode texte seul est une configuration valide, pas une panne.

Le smoke protocole est rapide (~30 s) ; les scénarios navigateur sont plus longs (~3 min, vrai Chromium).

## Pré-requis

```bash
# 1. core-api (gateway temps réel)
cd ../../core-api && bun src/index.ts        # → http://localhost:3000

# 2. front Angano (pour scenarios.mjs uniquement)
cd ../ && VITE_API_BASE=http://localhost:3000 bun run dev   # → http://localhost:5173

# 3. dépendances de test (Playwright + Chromium)
cd e2e && npm install && npx playwright install chromium
```

## Lancer

```bash
cd e2e
bun smoke.ts          # secret des rôles + partie complète (village gagne)
bun reconnect.ts      # déconnexion/reconnexion + anti-rejoin
bun story.ts          # narrateur obligatoire + histoire IA + fiches missions
bun voice.ts          # voix off de bout en bout (ignoré si TTS désactivé)
node scenarios.mjs    # 9 scénarios navigateur jusqu'à la fin

# ou tout :
npm test
```

URLs surchargeables : `ANGANO_API` (défaut `http://localhost:3000`), `ANGANO_URL` (défaut `http://localhost:5173`).

## Scénarios navigateur couverts (`scenarios.mjs`)
Victoire **Village**, victoire **Songomby** (parité), **Marque funeste du Fanany**, **soin** de l'Ombiasy,
**demande de validation de mission**, **reconnexion** (rechargement de page → retour en partie),
**rematch** (2 parties), **morts annoncées par le narrateur**, **mode salon** (rythme narrateur + retour arrière + un seul haut-parleur, avec son contrôle à distance), **pack de narration** (`ANGANO_STORY_PRESET=lanternes-mangrove` requis), et **assets** (galerie des pouvoirs du
codex + aucune image en 404 sur une partie complète — l'art est adressé par une clé venue du serveur,
donc une clé morte ne se voit qu'à l'écran, jamais dans la console).
Chaque scénario pilote plusieurs onglets (1 narrateur + N joueurs) via la god-view et joue jusqu'à l'écran de fin.
