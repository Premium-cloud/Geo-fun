# Spec cartes — Départements de France (recto / verso)

> Fichier portable à coller dans une autre conversation IA.
> Objectif : reproduire **exactement** ce design de carte à jouer.

---

## Captures de référence (état actuel validé)

### Recto (face avant) — pictos en bas

![Recto — Hautes-Alpes 05](./spec/spec_recto_hautes_alpes.png)

Carte isolée (Ain 01) :

![Recto — Ain 01](./spec/spec_recto_carte.png)

### Verso (face arrière) — pictos derrière, sans contour

![Verso — Départements de France](./spec/spec_verso_hautes_alpes.png)

Carte isolée :

![Verso isolé](./spec/spec_verso_carte.png)

### Grille mixte (rectos + versos)

![Grille mixte](./spec/spec_grille_mixte.png)

---

## Format carte

| Propriété | Valeur |
|-----------|--------|
| Ratio | **5 / 7** (carte à jouer) |
| Écran | `148 × ~207 px`, `flex: 0 0 148px` |
| Coins | `border-radius: 9px` |
| Impression A4 duplex | `63.5 × 88.9 mm`, **9 cartes / page** (3×3) |
| Flip | rotation 3D `rotateY(180deg)` au clic |

Fichiers principaux :
- `src/cards/CartesView.tsx` — `CardFront`, `CardBack`, `BACK_SCATTER`, impression
- `src/cards/CartesView.css` — styles recto / verso / print
- `src/cards/pictos.tsx` — silhouettes SVG (Game Icons + France)
- `src/data/cartes.ts` — 108 fiches (code, chef-lieu, région, pictos)
- `public/blasons/{code}.svg|png` — emblèmes officiels

---

## RECTO — structure (haut → bas)

```
┌─────────────────────────────┐
│  BANDEAU RÉGION (couleur)   │  ← ribbon pleine largeur
├─────────────────────────────┤
│  01                         │  ← code (Fraunces, couleur région)
│  Ain                        │  ← nom département (Fraunces)
│  CHEF-LIEU Bourg-en-Bresse  │
├─────────────────────────────┤
│                             │
│        [ BLASON ]           │  ← centré entre chef-lieu et pictos
│                             │
├─────────────────────────────┤
│ [picto]  [picto]  [picto]   │  ← PICTOS EN BAS (3–4)
│ label    label    label     │     avec labels
└─────────────────────────────┘
```

### Contenu recto

1. **Ribbon région** — fond `REGION_COLOR[region]`, texte uppercase, contraste auto (clair/foncé).
2. **Identité** — code + nom + chef-lieu.
3. **Emblème** — `/blasons/{code}.svg` puis fallback `.png` (ex. Martinique = drapeau 2023).
4. **Pictos en bas** — grille 3–4 spécialités (icône + label court), séparés par une fine ligne haut.

### Style recto

- Fond crème `#f4efe6`
- Texte `#1c140c`
- Typo titres : **Fraunces** (serif)
- Ombre légère sur la carte (recto uniquement pour le relief écran)
- Blason : `max-width ~70%`, `object-fit: contain`, drop-shadow léger
- Zone emblème : `flex: 1`, centrage flex — **ne doit ni chevaucher le chef-lieu ni les pictos du bas**

### Exemple données (Ain)

```ts
{ code: "01", chefLieu: "Bourg-en-Bresse", region: "Auvergne-Rhône-Alpes",
  pictos: [
    { icon: "chicken", label: "Poulet de Bresse" },
    { icon: "cheese", label: "Comté" },
    { icon: "wine", label: "Bugey" },
  ] }
```

---

## VERSO — structure (identique pour toutes)

```
┌─────────────────────────────┐
│  ·  ·   ·     ·    ·   ·    │
│ ·    ·     ·    ·     ·   · │
│                             │
│      Départements           │  ← Fraunces, centré, SANS cadre
│        de France            │
│                             │
│ ·   ·    ·     ·   ·    ·   │
│  ·    ·    ·     ·    ·   · │
└─────────────────────────────┘
   fond BLANC · pictos NOIRS · PAS DE CONTOUR
```

### Règles verso (critiques)

| Règle | Détail |
|-------|--------|
| Fond | **Blanc pur** `#fff` |
| Pictos | **Noirs** `#000`, silhouettes France (nourriture, lieux, culture) |
| Contour | **AUCUN** cadre / box-shadow / double bordure sur `.card-back` — on découpe d’après le recto |
| Titre | « Départements » + « de France », Fraunces, **sans boîte / sans bordure** |
| Lisibilité | `text-shadow` blanc autour du titre ; **aucun picto sur / derrière / trop près du texte** |
| Densité | ~**40 pictos uniques** (pas de doublon), semi-aléatoires, rotations variées |
| Positions | `%` left/top + `translate(-50%,-50%)` + `rotate(r)` + taille `s%` |

### Positions `BACK_SCATTER` (état validé)

```ts
const BACK_SCATTER = [
  { id: 'eiffel', x: 54, y: 93, r: -26, s: 10 },
  { id: 'wheat', x: 8, y: 10, r: -18, s: 11 },
  { id: 'wine', x: 89, y: 26, r: -12, s: 12 },
  { id: 'croissant', x: 8, y: 60, r: -6, s: 10 },
  { id: 'cheese', x: 85, y: 55, r: -15, s: 11 },
  { id: 'fleur', x: 8, y: 93, r: 14, s: 12 },
  { id: 'baguette', x: 51, y: 7, r: 20, s: 10 },
  { id: 'palm', x: 32, y: 27, r: 26, s: 11 },
  { id: 'lavender', x: 87, y: 91, r: -22, s: 12 },
  { id: 'lighthouse', x: 28, y: 74, r: 10, s: 10 },
  { id: 'castle', x: 78, y: 30, r: -16, s: 11 },
  { id: 'olive', x: 8, y: 33, r: 18, s: 12 },
  { id: 'fish', x: 62, y: 73, r: -8, s: 10 },
  { id: 'cathedral', x: 62, y: 30, r: 12, s: 11 },
  { id: 'beret', x: 88, y: 7, r: -24, s: 12 },
  { id: 'oyster', x: 33, y: 93, r: 6, s: 10 },
  { id: 'ship', x: 29, y: 7, r: 22, s: 11 },
  { id: 'grape', x: 6, y: 47, r: -14, s: 12 },
  { id: 'barrel', x: 74, y: 18, r: 16, s: 10 },
  { id: 'cow', x: 8, y: 75, r: -20, s: 11 },
  { id: 'coq', x: 95, y: 44, r: 4, s: 12 },
  { id: 'duck', x: 48, y: 81, r: 24, s: 10 },
  { id: 'scallop', x: 57, y: 18, r: -10, s: 11 },
  { id: 'honey', x: 76, y: 82, r: 28, s: 12 },
  { id: 'mustard', x: 20, y: 18, r: 15, s: 10 },
  { id: 'knife', x: 95, y: 65, r: 8, s: 11 },
  { id: 'apple', x: 95, y: 75, r: 9, s: 12 },
  { id: 'sea', x: 75, y: 2, r: -9, s: 10 },
  { id: 'champagne', x: 22, y: 85, r: 11, s: 11 },
  { id: 'cider', x: 67, y: 89, r: -11, s: 12 },
  { id: 'butter', x: 74, y: 64, r: -26, s: 10 },
  { id: 'ski', x: 50, y: 66, r: 20, s: 10 },
  { id: 'strawberry', x: 10, y: 24, r: -12, s: 12 },
  { id: 'chicken', x: 21, y: 37, r: -6, s: 10 },
  { id: 'forest', x: 41, y: 20, r: 8, s: 11 },
  { id: 'salt', x: 21, y: 65, r: 14, s: 12 },
  { id: 'cherry', x: 35, y: 66, r: 20, s: 10 },
  { id: 'pearl', x: 44, y: 34, r: 26, s: 11 },
  { id: 'volcano', x: 89, y: 16, r: -22, s: 12 },
  { id: 'beach', x: 78, y: 72, r: 10, s: 10 },
]
```

CSS verso clé :

```css
.card-back {
  background: #fff;
  color: #1c140c;
  /* PAS de border, PAS de box-shadow, PAS de cadre */
}
.back-pattern { position: absolute; inset: 6%; color: #000; }
.back-mark { background: none; border: 0; /* pas de cadre autour du titre */ }
.back-title, .back-sub {
  font-family: Fraunces, Georgia, serif;
  text-shadow: 0 0 0.35rem #fff, 0 0 0.55rem #fff, 0 0 0.8rem #fff;
}
```

---

## Impression duplex

- Bouton « Imprimer / PDF » → `window.print()`
- Chaque feuille A4 : page **rectos** (9 cartes) puis page **versos** (mêmes 9, lignes miroir pour alignement recto-verso)
- Découpe : se baser sur le **recto** (le verso n’a plus de contour)

---

## Checklist « c’est bien comme ici »

- [ ] Recto : pictos **en bas** avec labels (pas ailleurs)
- [ ] Recto : blason centré entre chef-lieu et pictos
- [ ] Verso : fond blanc, pictos noirs **en arrière-plan** (scatter)
- [ ] Verso : **sans contour** / sans cadre autour du titre
- [ ] Verso : aucun picto qui mange le texte « Départements de France »
- [ ] Ratio carte à jouer 5:7
- [ ] 108 départements + DOM/TOM, blasons officiels

---

## Prompt court à coller ailleurs

```
Reproduis un jeu de cartes départements français (ratio 5/7) :

RECTO (par département) :
- bandeau couleur région en haut
- code + nom (Fraunces) + chef-lieu
- blason officiel centré
- EN BAS : 3–4 pictogrammes spécialités + labels
- fond crème #f4efe6

VERSO (identique pour toutes) :
- fond blanc pur
- titre centré « Départements / de France » en Fraunces, SANS cadre
- ~40 pictos noirs France en scatter derrière, sans doublon
- PAS de contour / bordure sur le verso
- zone centrale dégagée autour du titre

Impression A4 duplex 9 cartes/page 63.5×88.9 mm.
Voir images docs/spec/spec_recto_carte.png et docs/spec/spec_verso_carte.png.
```
