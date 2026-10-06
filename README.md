# Drapeaux du monde

Jeu de cartes des pays du monde : drapeau, continent, capitale, population et langue. Verso unifié « DRAPEAU DU MONDE ».

## Lancer en local

```bash
npm install
npm run dev
```

L’app tourne sur [http://127.0.0.1:43125](http://127.0.0.1:43125).

## Utilisation

- Cliquez une carte pour la retourner
- Filtrez par continent ou recherchez un pays / une capitale
- `Ctrl/Cmd + P` pour imprimer (recto puis verso miroir, 9 cartes / feuille A4, fond perdu 3 mm + traits de coupe)

## Contenu

- 198 pays, drapeaux SVG locaux (`public/flags`)
- Continents dont Amérique du Nord / centrale / Sud
- Ratios de drapeau corrects (Suisse, Vatican, Népal…)
- Langues : principale / officielles, avec langues d’origine quand c’est pertinent

## Stack

Vite + React + TypeScript.
