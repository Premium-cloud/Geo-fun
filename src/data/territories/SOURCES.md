# Sources pictos & emblèmes (territoires)

## Emblèmes (Wikimedia Commons) — vérifiés

| Pack | Type | Source Commons | Local | Audit |
|------|------|----------------|-------|-------|
| **CH** | Blasons | `Wappen … matt.svg` (Fahnenreglement) | `emblems/ch/` | 26/26 OK |
| **ES** | Drapeaux | `Flag of …` | `emblems/es/` | 19/19 OK (Andalousie avec armes, Catalogne senyera, Ikurriña…) |
| **US** | Drapeaux | `Flag of {State}.svg` | `emblems/us/` | 50/50 OK (Mississippi = Magnolia 2021, Georgia = U.S. state) |
| **DE** | Blasons | `Coat of arms of …` / `DEU … COA` | `emblems/de/` | 16/16 OK (Berlin ours, Brandebourg aigle rouge) |
| **JP** | Drapeaux | `Flag of {Pref} Prefecture.svg` | `emblems/jp/` | 47/47 OK |
| **CA** | Drapeaux | `Flag of …` | `emblems/ca/` | 13/13 OK |
| **BR** | Drapeaux | `Bandeira do/de …` | `emblems/br/` | 27/27 OK |

Script : `node scripts/download-territory-emblems.mjs [pack…]`

## Pictos recto — base & audit

Curation manuelle croisée (pas d’API légale unique) :

| Pack | Références | Corrections audit |
|------|------------|-------------------|
| **CH** | AOP/IGP [aop-igp.ch](https://www.aop-igp.ch), UNESCO Lavaux | Schabziger (GL), Vacherin≠2×cheese, Genève Léman, Bern Emmental/Oberland |
| **ES** | DO/DOP (Rioja, Jerez, Manchego…) | Alcázar=`castle`, Encierro≠cheval, Altamira=`pottery`, Prado |
| **US** | State symbols / économie | Alaska≠pingouin, AZ Grand Canyon, PA Amish=`horse`, TX pétrole≠charbon icône |
| **DE** | Spécialités Länder | Berlin≠lion (ours→Porte), Sachsenross |
| **JP** | Meibutsu / symboles | Tokyo≠Fuji (géo.), Akita≠mouton, Nara cerfs≠chèvre |
| **CA** | Ressources provinciales | Nunavut/Manitoba≠pingouin, QC érable |
| **BR** | Géographie / produits | SP finance≠tropiques, Ceará éolien, DF Niemeyer |

Script de corrections : `scripts/apply-picto-audit.mjs`

## Limites honnêtes

- Pas de pictogramme « ours / taureau / érable / café / pétrole » dédié → approximations iconographiques (`oak`≈érable, `factory`≈pétrole, `cow`≈encierro).
- Labels courts pour la carte (pas le texte légal AOP/DO complet).
- Verso = pool thématique pack (40 slots France), pas une liste officielle.

## Verso

Pool de 40 pictos **thématiques pack**, positions = `BACK_SCATTER_SLOTS` (France).
