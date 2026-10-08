# Cartes — France & monde

Collection de cartes à collectionner et mode jeu :
- **France** — 108 départements / territoires (blason, chef-lieu, région, pictos de spécialité)
- **Monde** — 198 pays (drapeau, capitale, continent, population, langue)
- **Entraînement** — quiz pour apprendre (validation manuelle)
- **Jeu** — vies, timer, tirage des cartes peu vues, Facile / Difficile / Hardcore
- **Mixte** (Jeu Difficile / Hardcore) — uniquement drapeau→pays, nom→capitale, chiffre→département
- **Carte** — pointer le département ou le pays ; zoom / pinch ; timers allongés ; option DOM-TOM (silhouettes)
- **Hardcore** — pièges QCM plus collés, saisie très stricte (Entraînement et Jeu)
- **Récap** — fin de partie avec bonnes / mauvaises réponses
- **Réponse unique** — saisie libre avec tolérances (tirets, accents…)
- **Options** — mode nuit, son, suppression / import-export des données locales

## Lancer en local

```bash
npm install
npm run dev
```

L’app tourne sur [http://127.0.0.1:43125](http://127.0.0.1:43125).

## Duel

Onglet **Jeux → Duel** :

- **Même écran** : Bombe (patate chaude), Chacun son tour, Split (si largeur ≥ 720px)
- **En ligne** : salon + lien d’invitation (PeerJS), course 2 pts / 1 pt, timer → 5 s dès qu’un trouve
- Catégories : Départements (n°) · Pays (drapeau) · Capitales · Mixte — QCM ou saisie, pas de carte

## Déploiement Vercel (prod stable)

Ne pas utiliser `vercel deploy --temporary` ni les déploiements anonymes « prebuilt » : ils ne se redéploient pas correctement.

1. Créer un dépôt GitHub pour ce projet (bouton **Create repo** dans Cursor si besoin).
2. Sur [vercel.com/new](https://vercel.com/new) → **Import** ce dépôt.
3. Nom du projet : `geofun` (Framework : Vite, détecté via `vercel.json`).
4. Deploy. URL typique : `https://geofun.vercel.app` (ou `geofun-xxx` si le nom est pris).
5. Ensuite : chaque `git push` sur `main` = nouveau déploiement Production. **Redeploy** marche aussi depuis le dashboard.

## Impression recto-verso

1. Onglet **France** (blasons) ou **Monde** (drapeaux) → **Imprimer**
2. Options d’impression navigateur : **duplex**, retournement **bord long**

Chaque paire de pages = 1 feuille (9 cartes face + dos miroir).

Le recto France affiche 2–3 pictos de spécialité sous le blason ; le verso reprend le scatter Game Icons. Le verso Monde : globe. Même typo Fraunces.

## Blasons départements

Les blasons sont dans `public/blasons/`. Pour (re)télécharger depuis Wikimedia Commons :

```bash
node scripts/download-blasons.mjs
```

Le script ignore les fichiers déjà présents et gère les 429 avec backoff.

## Stack

Vite + React + TypeScript.
