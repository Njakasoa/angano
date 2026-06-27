# Angano — tests E2E

Tests de bout en bout, gardés hors du build de l'app (leur propre `package.json`).

## Deux niveaux

| Fichier | Niveau | Lanceur | Besoin |
|---|---|---|---|
| `smoke.ts` | Protocole (WebSocket) — partie complète + secret des rôles | `bun` | core-api `:3000` |
| `reconnect.ts` | Protocole — déconnexion / reconnexion / anti-rejoin | `bun` | core-api `:3000` |
| `scenarios.mjs` | Navigateur (Playwright) — chaque issue jouée jusqu'à la fin | `node` | core-api `:3000` **+** front `:5173` |

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
node scenarios.mjs    # 7 scénarios navigateur jusqu'à la fin

# ou tout :
npm test
```

URLs surchargeables : `ANGANO_API` (défaut `http://localhost:3000`), `ANGANO_URL` (défaut `http://localhost:5173`).

## Scénarios navigateur couverts (`scenarios.mjs`)
Victoire **Village**, victoire **Songomby** (parité), **chaîne du Chasseur**, **soin** de l'Ombiasy,
**reconnexion** (rechargement de page → retour en partie), **rematch** (2 parties), **morts annoncées par le narrateur**.
Chaque scénario pilote plusieurs onglets (1 narrateur + N joueurs) via la god-view et joue jusqu'à l'écran de fin.
