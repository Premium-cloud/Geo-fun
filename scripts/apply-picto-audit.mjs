/**
 * Corrections audit culturel / historique des pictos territoires.
 * Usage: node scripts/apply-picto-audit.mjs
 */
import { readFileSync, writeFileSync } from 'fs'

const VALID = new Set(
  `wheat,wine,cheese,croissant,fleur,baguette,palm,lavender,lighthouse,castle,olive,fish,cathedral,oyster,ship,grape,barrel,cow,coq,duck,scallop,honey,mustard,knife,apple,sea,champagne,cider,butter,ski,strawberry,chicken,forest,salt,cherry,pearl,volcano,beach,flower,sheep,goat,soap,oak,watch,airplane,ribbon,coal,cookie,crystal,fries,beer,horse,pepper,pig,pretzel,stork,race,garlic,lion,atom,briefcase,film,rose,gold,penguin,metal,factory,vanilla,sword,walnut,mushroom,plum,pottery,silk,beet,spa,mountain,chestnut,river,textile,calisson,truffle,clock,nougat,plane,lentil,lace,prune,ceramic,melon,banana,sugar,rum,rocket,eiffel,beret,crepe`.split(','),
)

function fixFile(path, replacements) {
  let src = readFileSync(path, 'utf8')
  for (const [from, to] of replacements) {
    if (!src.includes(from)) {
      console.warn('MISS', path, from.slice(0, 80))
      continue
    }
    src = src.replace(from, to)
    // validate icons in to
    for (const m of to.matchAll(/icon: '([a-z]+)'/g)) {
      if (!VALID.has(m[1])) throw new Error(`invalid ${m[1]} in ${path}`)
    }
  }
  writeFileSync(path, src)
  console.log('ok', path)
}

fixFile('src/data/territories/ch.ts', [
  [
    `{ code: 'BE', name: 'Bern', capital: 'Bern', pictos: [
      { icon: 'cheese', label: 'Emmental' }, { icon: 'cow', label: 'Tête Moine' }, { icon: 'mountain', label: 'Oberland' },
    ]}`,
    `{ code: 'BE', name: 'Bern', capital: 'Bern', pictos: [
      { icon: 'cheese', label: 'Emmental' }, { icon: 'ski', label: 'Oberland' }, { icon: 'mountain', label: 'Alpes' },
    ]}`,
  ],
  [
    `{ code: 'FR', name: 'Fribourg', capital: 'Fribourg', pictos: [
      { icon: 'cheese', label: 'Gruyère' }, { icon: 'cheese', label: 'Vacherin' }, { icon: 'cow', label: 'Pré-alpes' },
    ]}`,
    `{ code: 'FR', name: 'Fribourg', capital: 'Fribourg', pictos: [
      { icon: 'cheese', label: 'Gruyère' }, { icon: 'butter', label: 'Vacherin' }, { icon: 'cow', label: 'Pré-alpes' },
    ]}`,
  ],
  [
    `{ code: 'GE', name: 'Genève', capital: 'Genève', pictos: [
      { icon: 'watch', label: 'Horlogerie' }, { icon: 'briefcase', label: 'ONU' }, { icon: 'spa', label: 'Jet d’eau' },
    ]}`,
    `{ code: 'GE', name: 'Genève', capital: 'Genève', pictos: [
      { icon: 'watch', label: 'Horlogerie' }, { icon: 'briefcase', label: 'ONU' }, { icon: 'sea', label: 'Léman' },
    ]}`,
  ],
  [
    `{ code: 'GL', name: 'Glarus', capital: 'Glarus', pictos: [
      { icon: 'mountain', label: 'Alpes' }, { icon: 'textile', label: 'Textile' }, { icon: 'cheese', label: 'Glarner' },
    ]}`,
    `{ code: 'GL', name: 'Glarus', capital: 'Glarus', pictos: [
      { icon: 'mountain', label: 'Alpes' }, { icon: 'textile', label: 'Textile' }, { icon: 'cheese', label: 'Schabziger' },
    ]}`,
  ],
  [
    `{ code: 'SZ', name: 'Schwyz', capital: 'Schwyz', pictos: [
      { icon: 'mountain', label: 'Mythen' }, { icon: 'cheese', label: 'Fromage' }, { icon: 'sword', label: 'Schwyz' },
    ]}`,
    `{ code: 'SZ', name: 'Schwyz', capital: 'Schwyz', pictos: [
      { icon: 'mountain', label: 'Mythen' }, { icon: 'cheese', label: 'Fromage' }, { icon: 'forest', label: 'Waldstätten' },
    ]}`,
  ],
])

fixFile('src/data/territories/es.ts', [
  [
    `{ code: 'AN', name: 'Andalucía', capital: 'Sevilla', pictos: [
      { icon: 'olive', label: 'Huile' }, { icon: 'grape', label: 'Jerez' }, { icon: 'cathedral', label: 'Alcázar' },
    ]}`,
    `{ code: 'AN', name: 'Andalucía', capital: 'Sevilla', pictos: [
      { icon: 'olive', label: 'Huile' }, { icon: 'grape', label: 'Jerez' }, { icon: 'castle', label: 'Alcázar' },
    ]}`,
  ],
  [
    `{ code: 'CB', name: 'Cantabria', capital: 'Santander', pictos: [
      { icon: 'sea', label: 'Côte' }, { icon: 'cow', label: 'Élevage' }, { icon: 'crystal', label: 'Altamira' },
    ]}`,
    `{ code: 'CB', name: 'Cantabria', capital: 'Santander', pictos: [
      { icon: 'sea', label: 'Côte' }, { icon: 'cow', label: 'Élevage' }, { icon: 'pottery', label: 'Altamira' },
    ]}`,
  ],
  [
    `{ code: 'MD', name: 'Madrid', capital: 'Madrid', pictos: [
      { icon: 'briefcase', label: 'Capitale' }, { icon: 'castle', label: 'Royal' }, { icon: 'film', label: 'Culture' },
    ]}`,
    `{ code: 'MD', name: 'Madrid', capital: 'Madrid', pictos: [
      { icon: 'briefcase', label: 'Capitale' }, { icon: 'castle', label: 'Royal' }, { icon: 'rose', label: 'Prado' },
    ]}`,
  ],
  [
    `{ code: 'NC', name: 'Navarra', capital: 'Pamplona', pictos: [
      { icon: 'wine', label: 'Navarra' }, { icon: 'horse', label: 'Sanfermines' }, { icon: 'forest', label: 'Pyrénées' },
    ]}`,
    `{ code: 'NC', name: 'Navarra', capital: 'Pamplona', pictos: [
      { icon: 'wine', label: 'Navarra' }, { icon: 'cow', label: 'Encierro' }, { icon: 'forest', label: 'Pyrénées' },
    ]}`,
  ],
])

fixFile('src/data/territories/de.ts', [
  [
    `{ code: 'BE', name: 'Berlin', capital: 'Berlin', pictos: [{ icon: 'briefcase', label: 'Capitale' }, { icon: 'film', label: 'Culture' }, { icon: 'lion', label: 'Ours' }] }`,
    `{ code: 'BE', name: 'Berlin', capital: 'Berlin', pictos: [{ icon: 'briefcase', label: 'Capitale' }, { icon: 'film', label: 'Culture' }, { icon: 'castle', label: 'Porte' }] }`,
  ],
  [
    `{ code: 'NI', name: 'Niedersachsen', capital: 'Hannover', pictos: [{ icon: 'horse', label: 'Saxe' }, { icon: 'wheat', label: 'Cultures' }, { icon: 'sea', label: 'Mer du N.' }] }`,
    `{ code: 'NI', name: 'Niedersachsen', capital: 'Hannover', pictos: [{ icon: 'horse', label: 'Sachsenross' }, { icon: 'wheat', label: 'Cultures' }, { icon: 'sea', label: 'Mer du N.' }] }`,
  ],
])

fixFile('src/data/territories/us.ts', [
  [
    `{ code: 'AK', name: 'Alaska', capital: 'Juneau', pictos: [{ icon: 'fish', label: 'Pêche' }, { icon: 'penguin', label: 'Froid' }, { icon: 'gold', label: 'Or' }] }`,
    `{ code: 'AK', name: 'Alaska', capital: 'Juneau', pictos: [{ icon: 'fish', label: 'Pêche' }, { icon: 'mountain', label: 'Denali' }, { icon: 'gold', label: 'Or' }] }`,
  ],
  [
    `{ code: 'AZ', name: 'Arizona', capital: 'Phoenix', pictos: [{ icon: 'palm', label: 'Désert' }, { icon: 'mountain', label: 'Canyon' }, { icon: 'crystal', label: 'Cuivre' }] }`,
    `{ code: 'AZ', name: 'Arizona', capital: 'Phoenix', pictos: [{ icon: 'mountain', label: 'Grand Canyon' }, { icon: 'crystal', label: 'Cuivre' }, { icon: 'gold', label: 'Mine' }] }`,
  ],
  [
    `{ code: 'LA', name: 'Louisiana', capital: 'Baton Rouge', pictos: [{ icon: 'pepper', label: 'Épices' }, { icon: 'film', label: 'Jazz' }, { icon: 'river', label: 'Mississippi' }] }`,
    `{ code: 'LA', name: 'Louisiana', capital: 'Baton Rouge', pictos: [{ icon: 'pepper', label: 'Cajun' }, { icon: 'ship', label: 'Port' }, { icon: 'river', label: 'Mississippi' }] }`,
  ],
  [
    `{ code: 'NV', name: 'Nevada', capital: 'Carson City', pictos: [{ icon: 'gold', label: 'Casino' }, { icon: 'mountain', label: 'Désert' }, { icon: 'atom', label: 'Essais' }] }`,
    `{ code: 'NV', name: 'Nevada', capital: 'Carson City', pictos: [{ icon: 'gold', label: 'Vegas' }, { icon: 'mountain', label: 'Sierra' }, { icon: 'atom', label: 'Essais' }] }`,
  ],
  [
    `{ code: 'PA', name: 'Pennsylvania', capital: 'Harrisburg', pictos: [{ icon: 'metal', label: 'Acier' }, { icon: 'coal', label: 'Charbon' }, { icon: 'cheese', label: 'Amish' }] }`,
    `{ code: 'PA', name: 'Pennsylvania', capital: 'Harrisburg', pictos: [{ icon: 'metal', label: 'Acier' }, { icon: 'coal', label: 'Charbon' }, { icon: 'horse', label: 'Amish' }] }`,
  ],
  [
    `{ code: 'TX', name: 'Texas', capital: 'Austin', pictos: [{ icon: 'cow', label: 'Ranch' }, { icon: 'coal', label: 'Pétrole' }, { icon: 'gold', label: 'Lone Star' }] }`,
    `{ code: 'TX', name: 'Texas', capital: 'Austin', pictos: [{ icon: 'cow', label: 'Ranch' }, { icon: 'factory', label: 'Pétrole' }, { icon: 'gold', label: 'Lone Star' }] }`,
  ],
])

fixFile('src/data/territories/jp.ts', [
  [
    `{ code: '05', name: 'Akita', capital: 'Akita', pictos: [{ icon: 'wheat', label: 'Riz' }, { icon: 'sheep', label: 'Akita' }, { icon: 'spa', label: 'Onsen' }] }`,
    `{ code: '05', name: 'Akita', capital: 'Akita', pictos: [{ icon: 'wheat', label: 'Riz' }, { icon: 'spa', label: 'Onsen' }, { icon: 'mountain', label: 'Monts' }] }`,
  ],
  [
    `{ code: '13', name: 'Tōkyō', capital: 'Tōkyō', pictos: [{ icon: 'flower', label: 'Sakura' }, { icon: 'fish', label: 'Sushi' }, { icon: 'volcano', label: 'Fuji' }] }`,
    `{ code: '13', name: 'Tōkyō', capital: 'Tōkyō', pictos: [{ icon: 'flower', label: 'Sakura' }, { icon: 'fish', label: 'Sushi' }, { icon: 'briefcase', label: 'Capitale' }] }`,
  ],
  [
    `{ code: '29', name: 'Nara', capital: 'Nara', pictos: [{ icon: 'goat', label: 'Cerfs' }, { icon: 'cathedral', label: 'Temples' }, { icon: 'castle', label: 'Histoire' }] }`,
    `{ code: '29', name: 'Nara', capital: 'Nara', pictos: [{ icon: 'forest', label: 'Cerfs' }, { icon: 'cathedral', label: 'Temples' }, { icon: 'castle', label: 'Histoire' }] }`,
  ],
])

fixFile('src/data/territories/ca.ts', [
  [
    `{ code: 'MB', name: 'Manitoba', capital: 'Winnipeg', pictos: [{ icon: 'wheat', label: 'Blé' }, { icon: 'penguin', label: 'Nord' }, { icon: 'river', label: 'Rouge' }] }`,
    `{ code: 'MB', name: 'Manitoba', capital: 'Winnipeg', pictos: [{ icon: 'wheat', label: 'Blé' }, { icon: 'duck', label: 'Lacs' }, { icon: 'river', label: 'Rouge' }] }`,
  ],
  [
    `{ code: 'NU', name: 'Nunavut', capital: 'Iqaluit', pictos: [{ icon: 'penguin', label: 'Arctique' }, { icon: 'fish', label: 'Pêche' }, { icon: 'crystal', label: 'Glace' }] }`,
    `{ code: 'NU', name: 'Nunavut', capital: 'Iqaluit', pictos: [{ icon: 'crystal', label: 'Arctique' }, { icon: 'fish', label: 'Pêche' }, { icon: 'mountain', label: 'Toundra' }] }`,
  ],
  [
    `{ code: 'QC', name: 'Québec', capital: 'Québec', pictos: [{ icon: 'forest', label: 'Forêt' }, { icon: 'ski', label: 'Hiver' }, { icon: 'river', label: 'Fleuve' }] }`,
    `{ code: 'QC', name: 'Québec', capital: 'Québec', pictos: [{ icon: 'oak', label: 'Érable' }, { icon: 'ski', label: 'Hiver' }, { icon: 'river', label: 'Fleuve' }] }`,
  ],
])

fixFile('src/data/territories/br.ts', [
  [
    `{ code: 'CE', name: 'Ceará', capital: 'Fortaleza', pictos: [{ icon: 'beach', label: 'Plages' }, { icon: 'airplane', label: 'Vent' }, { icon: 'cow', label: 'Élevage' }] }`,
    `{ code: 'CE', name: 'Ceará', capital: 'Fortaleza', pictos: [{ icon: 'beach', label: 'Plages' }, { icon: 'factory', label: 'Éolien' }, { icon: 'cow', label: 'Élevage' }] }`,
  ],
  [
    `{ code: 'SP', name: 'São Paulo', capital: 'São Paulo', pictos: [{ icon: 'factory', label: 'Industrie' }, { icon: 'race', label: 'Interlagos' }, { icon: 'palm', label: 'Tropiques' }] }`,
    `{ code: 'SP', name: 'São Paulo', capital: 'São Paulo', pictos: [{ icon: 'factory', label: 'Industrie' }, { icon: 'race', label: 'Interlagos' }, { icon: 'briefcase', label: 'Finance' }] }`,
  ],
  [
    `{ code: 'DF', name: 'Distrito Federal', capital: 'Brasília', pictos: [{ icon: 'briefcase', label: 'Capitale' }, { icon: 'plane', label: 'Architecture' }, { icon: 'film', label: 'Culture' }] }`,
    `{ code: 'DF', name: 'Distrito Federal', capital: 'Brasília', pictos: [{ icon: 'briefcase', label: 'Capitale' }, { icon: 'plane', label: 'Niemeyer' }, { icon: 'castle', label: 'Planalto' }] }`,
  ],
])

console.log('audit pictos applied')
