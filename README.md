# Cartes — France & monde

Collection de cartes à collectionner et mode jeu :
- **France** — 108 départements / territoires (blason, chef-lieu, région)
- **Monde** — 198 pays (drapeau, capitale, continent, population, langue)
- **Entraînement** — quiz pour apprendre (validation manuelle)
- **Jeu** — vies, timer, tirage des cartes peu vues, Facile / Difficile / Hardcore
- **Carte** — pointer le département ou le pays ; zoom / pinch ; timers allongés ; option DOM-TOM (silhouettes)
- **Réponse unique** — saisie libre avec tolérances (tirets, accents…)
- **Options** — mode nuit, son, suppression / import-export des données locales

## Lancer en local

```bash
npm install
npm run dev
```

L’app tourne sur [http://127.0.0.1:43125](http://127.0.0.1:43125).

## Impression recto-verso

1. Onglet **France** (blasons) ou **Monde** (drapeaux) → **Imprimer**
2. Options d’impression navigateur : **duplex**, retournement **bord long**

Chaque paire de pages = 1 feuille (9 cartes face + dos miroir).

Le verso France reprend les pictogrammes ; le verso Monde le globe. Même typo Fraunces sur les deux jeux.

## Blasons départements

Les blasons sont dans `public/blasons/`. Pour (re)télécharger depuis Wikimedia Commons :

```bash
node scripts/download-blasons.mjs
```

Le script ignore les fichiers déjà présents et gère les 429 avec backoff.

## Stack

Vite + React + TypeScript.
