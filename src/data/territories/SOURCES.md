# Sources pictos & emblèmes (territoires)

## Emblèmes (Wikimedia Commons)

| Pack | Type | Fichiers Commons | Dossier local |
|------|------|------------------|---------------|
| **CH** | Blasons | `Wappen … matt.svg` (Fahnenreglement) | `public/mockups/emblems/ch/` |
| **ES** | Drapeaux | `Flag of …` (communautés) | `…/es/` |
| **US** | Drapeaux | `Flag of {State}.svg` | `…/us/` |
| **DE** | Blasons | `Coat of arms of ….svg` (Länder) | `…/de/` |
| **JP** | Drapeaux | `Flag of {Prefecture} Prefecture.svg` | `…/jp/` |
| **CA** | Drapeaux | `Flag of {Province}.svg` | `…/ca/` |
| **BR** | Drapeaux | `Bandeira do/de ….svg` | `…/br/` |

Script : `node scripts/download-territory-emblems.mjs [pack…]`

## Pictos recto

Curation manuelle (pas d’API légale unique), croisée avec des sources stables :

| Pack | Base de référence |
|------|-------------------|
| **CH** | AOP/IGP [aop-igp.ch](https://www.aop-igp.ch), Lavaux UNESCO, identité cantonale |
| **ES** | DO/DOP/IGP (Rioja, Jerez, Manchego, Plátano de Canarias…), patrimoine |
| **US** | Symboles / productions d’État connus (state symbols, agriculture, industrie) |
| **DE** | Spécialités régionales & identité des Länder (bière, vin, industrie) |
| **JP** | Spécialités préfecturales (meibutsu) + symboles (Fuji, sakura, ports) |
| **CA** | Ressources & identité provinciale (érable, pétrole, pêches, blé) |
| **BR** | Produits / géographie des États (café, Amazone, plages, industrie) |

Labels = noms courts pour la carte.

## Verso

Pool de 40 pictos **thématiques pack** (pas par zone), positions = `BACK_SCATTER_SLOTS` (France).
