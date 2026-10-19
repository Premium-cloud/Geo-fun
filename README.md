# Cartes — France & monde

Collection de cartes à collectionner et mode jeu :
- **France** — 108 départements / territoires (blason, chef-lieu, région, pictos de spécialité)
- **Territoires** — départements FR, cantons CH, communautés ES, États US, Länder DE, préfectures JP, provinces CA, États BR (lexique + quiz)
- **Monde** — 198 pays (drapeau, capitale, continent, population, langue)
- **Mes erreurs** — rejeu des pays ratés
- **Entraînement** — quiz sans chrono
- **Jeu** — vies, timer, tirage des cartes peu vues, Facile / Difficile / Hardcore
- **MIX** — uniquement drapeau→pays, nom→capitale, chiffre→département
- **Carte** — pointer le pays ou une subdivision (Territoires) ; zoom / pinch ; timers allongés
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

## App téléphone (PWA) & hors ligne

GeoFun est une **PWA** : installable comme une app, sans App Store.

1. Ouvre la **prod HTTPS** (Vercel) sur le téléphone — pas `localhost`.
2. **iPhone (Safari)** : Partager → **Sur l’écran d’accueil** (un bandeau sur l’accueil le rappelle).
3. **Android (Chrome)** : menu → **Installer l’application**, ou le bouton **Installer** du bandeau.
4. Laisse l’app se charger **une fois en ligne** (le service worker met ~drapeaux, blasons, maps en cache).
5. Vérif hors-ligne : mode avion → rouvre depuis l’icône → Accueil / Jouer / Lexique doivent répondre.

### Si tu coupes le réseau / Vercel demain ?

| Situation | Ça marche ? |
|-----------|-------------|
| App **installée** + déjà ouverte 1× en ligne, puis **mode avion** | Oui — quiz, lexique, packs, album, duel **même écran** |
| Profil / crédits / collection | Oui — tout est en `localStorage` sur l’appareil |
| Duel **en ligne** (PeerJS) | Non — il faut le réseau |
| Jamais installée / cache vidé / nouvel iPhone | Non — il faut recharger la prod HTTPS une fois |

En résumé : ce n’est **pas** un binaire App Store autonome, mais une app **hors ligne après installation**. Si tu supprimes le site Vercel, les téléphones qui ont déjà le cache continuent ; les nouveaux ne pourront plus l’installer.

Pour une vraie fiche Play Store / App Store (indépendante de Vercel) : wrapper type **Capacitor** (autre étape).

## Duel

Onglet **Jeux → Duel** :

- **Même écran** : Battle royale (premier faux = perdu), Chacun son tour (question différente par joueur), Split (même question — téléphone miroir moitié/moitié ; PC : J1 = 1–2–3–4, J2 = A–Z–E–R)
- **En ligne** : salon PeerJS + sync hôte
- Catégories : Départements (n°) · Pays (drapeau) · Capitales · MIX — QCM ou saisie, pas de carte

## Déploiement Vercel (prod stable)

Ne pas utiliser `vercel deploy --temporary` ni les déploiements anonymes « prebuilt » : ils ne se redéploient pas correctement.

1. Créer un dépôt GitHub pour ce projet (bouton **Create repo** dans Cursor si besoin).
2. Sur [vercel.com/new](https://vercel.com/new) → **Import** ce dépôt.
3. Nom du projet : `geofun` (Framework : Vite, détecté via `vercel.json`).
4. Deploy. URL typique : `https://geofun.vercel.app` (ou `geofun-xxx` si le nom est pris).
5. Ensuite : chaque `git push` sur `main` = nouveau déploiement Production. **Redeploy** marche aussi depuis le dashboard.

## Impression recto-verso

1. Onglet **France** (blasons) ou **Monde** (drapeaux) → **Imprimer**
2. Options d’impression navigateur : **recto-verso**, retournement sur le **bord long**
   (pas bord court — sinon le dos ne tombe pas en face du recto).

Chaque paire de pages = 1 feuille (9 cartes face + dos en miroir horizontal).

Le recto France affiche 2–3 pictos de spécialité sous le blason ; le verso reprend le scatter Game Icons. Le verso Monde : globe. Même typo Fraunces.

## Blasons départements

Les blasons sont dans `public/blasons/`. Pour (re)télécharger depuis Wikimedia Commons :

```bash
node scripts/download-blasons.mjs
```

Le script ignore les fichiers déjà présents et gère les 429 avec backoff.

## Stack

Vite + React + TypeScript.
