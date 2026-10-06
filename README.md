# Drapeaux du monde

Collection de cartes des pays du monde : drapeau, continent, capitale, population et langue. Verso unifié « DRAPEAU DU MONDE ».

## Lancer en local

```bash
npm install
npm run dev
```

L’app tourne sur [http://127.0.0.1:43125](http://127.0.0.1:43125).

## Impression recto-verso

1. Bouton **Imprimer recto-verso** (imprimante ou « Enregistrer en PDF »)
2. Ou téléchargez **PDF test** / **PDF complet**
3. Dans les options d’impression : **recto-verso / duplex**, retournement sur le **bord long**

Chaque paire de pages = 1 feuille physique :
- page impaire = faces (9 cartes)
- page paire = dos (miroir pour que ça coincide une fois retourné)

Résultat : **22 feuilles** pour 198 cartes (au lieu de 44 en simple face).

Régénérer les PDF :

```bash
npm run pdf:test
npm run pdf
```

Imprimez en **100 % / taille réelle**, pas « ajuster à la page ».

## Contenu

- 198 pays, drapeaux SVG locaux (`public/flags`)
- Continents dont Amérique du Nord / centrale / Sud
- Ratios de drapeau corrects (Suisse, Vatican, Népal…)
- Langues : principale / officielles + langues locales majeures

## Stack

Vite + React + TypeScript. Export PDF via Playwright.
