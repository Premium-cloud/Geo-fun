# Cartes — France & monde

Collection de cartes à collectionner et mode jeu :
- **France** — 108 départements / territoires (blason, chef-lieu, région)
- **Monde** — 198 pays (drapeau, capitale, continent, population, langue)
- **Entraînement** — quiz pour apprendre (validation manuelle)
- **Jeu** — 3 vies, enchaînement auto, difficulté Facile / Difficile

## Lancer en local

```bash
npm install
npm run dev
```

L’app tourne sur [http://127.0.0.1:43125](http://127.0.0.1:43125).

## Impression recto-verso

1. Onglet **France** (blasons) ou **Monde** (drapeaux) → **Imprimer**
2. (Monde) PDF test / PDF complet disponibles en complément
3. Options d’impression navigateur : **duplex**, retournement **bord long**

Chaque paire de pages = 1 feuille (9 cartes face + dos miroir).

Le verso France reprend les pictogrammes ; le verso Monde le globe. Même typo Fraunces sur les deux jeux.

Régénérer les PDF monde :

```bash
npm run pdf:test
npm run pdf
```

## Blasons départements

Les blasons sont dans `public/blasons/`. Pour (re)télécharger depuis Wikimedia Commons :

```bash
node scripts/download-blasons.mjs
```

Le script ignore les fichiers déjà présents et gère les 429 avec backoff.

## Stack

Vite + React + TypeScript.
