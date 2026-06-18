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

### 1. Projection de tendance par régression linéaire
Ajouter une courbe de projection sur le graphique Historique, calculée côté serveur via une régression linéaire (ou polynomiale) sur les N derniers points de prix. Exposée via une API route Next.js (`/api/projection`), elle prolongerait visuellement la tendance sur 3, 6 ou 12 mois — en précisant clairement que c'est une extrapolation statistique, non une prédiction.

Stack envisagée : calcul en Python (scikit-learn) via un microservice appelé depuis Next.js, ou directement en TypeScript avec une lib légère (simple-statistics).

### 2. Prédiction de prix par réseau LSTM (Deep Learning)
Intégrer un modèle LSTM (Long Short-Term Memory) entraîné sur les séries temporelles de prix historiques pour générer une fourchette de prix probable à court terme. Le LSTM est particulièrement adapté aux séries crypto grâce à sa capacité à capturer les dépendances longues (cycles bull/bear).

Architecture proposée :
- Entraînement offline en Python (TensorFlow/Keras) sur les données Binance
- Modèle sérialisé et exposé via une API FastAPI déployée sur Vercel (Python runtime) ou un service dédié
- Affichage d'une zone de confiance (intervalle à 80%) sur le graphique, clairement labellisée "projection IA — non contractuelle"

### 3. Scoring de risque par machine learning
Calculer un score de risque dynamique pour chaque actif (volatilité, drawdown max, corrélation BTC) via un pipeline ML, et l'afficher comme indicateur visuel dans la fiche de simulation — utile pour les utilisateurs peu expérimentés.

### 4. Agent IA d'analyse de portefeuille (n8n + Claude API)
Connecter un agent IA (via n8n, déjà dans leur stack) qui, après simulation, génère automatiquement un résumé pédagogique personnalisé : "Sur cette période, votre DCA Bitcoin aurait surperformé un placement livret A de X fois, avec une volatilité Y fois supérieure." Appelé via Claude API (Sonnet), déclenché par webhook n8n après chaque simulation.

### 5. Comparateur multi-actifs + export
Simuler 2–3 cryptos en parallèle sur le même graphique, avec export CSV/PDF des résultats — fonctionnalité premium sauvegardée dans Supabase pour les utilisateurs connectés.
