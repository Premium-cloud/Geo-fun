# Sources pictos & emblèmes (territoires)

## Emblèmes

| Pack | Type | Source | Statut |
|------|------|--------|--------|
| **CH** | Blasons cantonaux | Wikimedia Commons, série `Wappen … matt.svg` (Fahnenreglement armée suisse / domaine public) | Téléchargés → `public/mockups/emblems/ch/` |
| **ES** | Drapeaux autonomies | Wikimedia Commons (`Flag of …`) — drapeaux officiels des communautés | Téléchargés → `public/mockups/emblems/es/` |
| Autres packs | — | Pas encore branchés | Fallback code |

Script : `scripts/download-territory-emblems.mjs`

## Pictos recto

**Pas une API officielle unique.** Curation manuelle, croisée avec :

### Suisse (CH)
- Spécialités AOP/IGP et produits emblématiques : [aop-igp.ch](https://www.aop-igp.ch), Lavaux UNESCO (VD)
- Identité cantonale classique (horlogerie GE/JU/NE, Castelli TI, Cervin VS, etc.)
- Labels = noms courts pour la carte (pas le texte légal AOP)

### Espagne (ES)
- Appellations / produits protégés et symboles régionaux (Jerez, Rioja DOCa, Manchego, Camino / coquille St-Jacques, Teide, etc.)
- Drapeaux / patrimoine (Sagrada Família CT, Alcázar AN) — choix pédagogique, pas une liste légale

### Autres packs (US, DE, JP, CA, BR)
- Toujours **indicatif** (culture / économie / paysage) — à revoir pack par pack comme CH/ES

## Verso

Pool de 40 pictos **thématiques pack** (pas par zone), positions = `BACK_SCATTER_SLOTS` (France).
