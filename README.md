# Simulateur Crypto — S'investir

Simulateur de plus-value crypto reproduisant la logique fonctionnelle de [sinvestir.fr/simulateur-crypto-monnaie](https://sinvestir.fr/simulateur-crypto-monnaie/), habillé aux standards visuels de [simulateurs.sinvestir.fr](https://simulateurs.sinvestir.fr/).

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Build de production

```bash
npm run build
npm start
```

## Stack

- **Next.js 16** (App Router) — rendu serveur + API routes
- **TypeScript** — typage strict end-to-end
- **Tailwind CSS v4** — design system S'investir (navy `#030C24`, bleu `#0049C6`, Lexend + Plus Jakarta Sans)
- **Recharts** — graphiques Historique (LineChart) et Gains/Pertes (AreaChart)
- **CoinGecko API** (free tier) — cours historiques + recherche de cryptos

## Architecture

```
app/
  page.tsx                  — Page principale (Server Component, fetch top cryptos au build)
  api/coingecko/
    coins/route.ts          — GET /api/coingecko/coins?q=... (recherche crypto)
    simulate/route.ts       — GET /api/coingecko/simulate?... (lance la simulation)
components/
  SimulatorClient.tsx       — Composant principal (Client, état + logique UI)
  CryptoSearch.tsx          — Dropdown de sélection crypto avec recherche
  KPICard.tsx               — Carte chiffre clé (investi, capital final, performance…)
  HistoryChart.tsx          — Graphique Valeur vs Investi dans le temps
  GainsChart.tsx            — Graphique Gains / Pertes
lib/
  types.ts                  — Types partagés
  coingecko.ts              — Appels CoinGecko API (server-side)
  dca.ts                    — Logique de simulation DCA pure
```

## Partis pris techniques

**Pourquoi Next.js et non Nuxt.js ?**
Le brief indique Next.js dans leur stack. Le site `simulateurs.sinvestir.fr` utilise techniquement Nuxt.js (`/_nuxt/` dans les assets), mais Next.js était le choix demandé — et le plus naturel pour une intégration dans leur infrastructure Vercel.

**CoinGecko free tier**
La clé API n'est pas requise pour le tier gratuit (50 req/min). Pour la production, il faudrait passer sur un tier Pro ou mettre en place un cache Redis pour éviter les rate limits. Les prix historiques sont revalidés toutes les heures (`next: { revalidate: 3600 }`).

**Données historiques vs temps réel**
CoinGecko renvoie des données quotidiennes pour les plages > 90 jours. Le simulateur fonctionne sur données journalières — cohérent avec un investissement DCA réaliste.

**Embeddabilité**
Le composant `SimulatorClient` est autonome, sans état global ni dépendances lourdes. Pour l'intégrer en iframe dans `sinvestir.fr` :

```html
<iframe
  src="https://votre-deploy.vercel.app"
  width="100%"
  height="900"
  frameborder="0"
  style="border-radius: 16px"
></iframe>
```

Ou via `iframe-resizer` pour un resize automatique (déjà utilisé sur leur stack actuelle).

## Suggestions d'amélioration pour S'investir

1. **Comparateur multi-actifs** : simuler 2–3 cryptos en parallèle sur le même graphique (BTC vs ETH vs SOL).
2. **Export CSV/PDF** : télécharger les données de simulation pour les abonnés premium.
3. **Scénarios sauvegardés** : avec Supabase (déjà dans leur stack), laisser les utilisateurs connectés sauvegarder et partager leurs scénarios.
4. **Indicateur de volatilité** : afficher l'écart-type glissant en overlay sur le graphique Historique — signal pédagogique fort sur le risque crypto.
5. **Mode dark/light toggle** : le design dark est excellent ; un toggle serait un bonus pour l'intégration iframe sur des pages à fond blanc.
