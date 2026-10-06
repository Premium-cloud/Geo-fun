# Drapeaux du monde

Collection de cartes des pays du monde : drapeau, continent, capitale, population et langue. Verso unifié « DRAPEAU DU MONDE ».

## Lancer en local

```bash
npm install
npm run dev
```

L’app tourne sur [http://127.0.0.1:43125](http://127.0.0.1:43125).

## Impression

- Boutons **Feuille test** (1 recto + 1 verso) et **PDF complet** dans l’app
- Ou régénérer les PDF :

```bash
npm run pdf:test   # feuille-test.pdf (pour valider bleed / découpe)
npm run pdf        # drapeaux-du-monde.pdf (deck entier)
```

Les PDF sont dans `public/` (A4). **9 cartes par feuille**, chacune dans un cadre noir = ligne de découpe. Coupez le long du cadre. Imprimez en « 100 % » / taille réelle.

## Contenu

- 198 pays, drapeaux SVG locaux (`public/flags`)
- Continents dont Amérique du Nord / centrale / Sud
- Ratios de drapeau corrects (Suisse, Vatican, Népal…)
- Langues : principale / officielles + langues locales majeures

## Stack

Vite + React + TypeScript. Export PDF via Playwright.
