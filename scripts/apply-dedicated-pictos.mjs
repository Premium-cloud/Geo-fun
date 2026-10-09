/**
 * Remplace les approximations (oak≈érable, factory/coal≈pétrole, cow≈encierro,
 * forest≈café/cerfs) par les pictos dédiés, et refond les backIds (40) par pack.
 * Usage: node scripts/apply-dedicated-pictos.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dir = join(root, 'src/data/territories')

const BACK = {
  es: [
    'olive', 'grape', 'wine', 'castle', 'cathedral', 'beach', 'fish', 'sea',
    'pepper', 'garlic', 'horse', 'rose', 'pottery', 'palm', 'melon', 'spa',
    'sheep', 'goat', 'honey', 'wheat', 'pig', 'cheese', 'barrel', 'ship',
    'flower', 'scallop', 'cherry', 'apple', 'river', 'mountain', 'ski', 'gold',
    'bull', 'sword', 'lion', 'banana', 'volcano', 'briefcase', 'factory', 'coal',
  ],
  ca: [
    'maple', 'oil', 'bear', 'deer', 'forest', 'ski', 'fish', 'mountain',
    'river', 'cow', 'wheat', 'ship', 'crystal', 'duck', 'honey', 'apple',
    'cheese', 'butter', 'horse', 'gold', 'metal', 'lighthouse', 'briefcase', 'sea',
    'beach', 'salt', 'coal', 'factory', 'pig', 'chicken', 'flower', 'rose',
    'mushroom', 'sheep', 'goat', 'airplane', 'barrel', 'wine', 'grape', 'beer',
  ],
  us: [
    'gold', 'film', 'palm', 'beach', 'airplane', 'rocket', 'horse', 'cow',
    'wheat', 'maple', 'sea', 'ship', 'factory', 'briefcase', 'atom', 'race',
    'mountain', 'ski', 'fish', 'apple', 'grape', 'wine', 'cheese', 'honey',
    'forest', 'river', 'crystal', 'oil', 'pepper', 'pig', 'chicken', 'duck',
    'flower', 'rose', 'melon', 'bear', 'deer', 'metal', 'coal', 'volcano',
  ],
  br: [
    'palm', 'beach', 'banana', 'rum', 'sugar', 'fish', 'sea', 'coffee',
    'pepper', 'flower', 'ship', 'gold', 'melon', 'airplane', 'river', 'race',
    'cow', 'horse', 'wheat', 'pig', 'chicken', 'duck', 'goat', 'sheep',
    'honey', 'forest', 'oil', 'grape', 'wine', 'barrel', 'castle', 'cathedral',
    'pottery', 'crystal', 'metal', 'coal', 'film', 'rocket', 'spa', 'cheese',
  ],
  de: [
    'pretzel', 'beer', 'castle', 'oak', 'mountain', 'ski', 'forest', 'factory',
    'clock', 'horse', 'wheat', 'bear', 'metal', 'mushroom', 'river', 'cow',
    'pig', 'cheese', 'apple', 'cherry', 'honey', 'wine', 'grape', 'barrel',
    'cathedral', 'duck', 'fish', 'sheep', 'goat', 'flower', 'rose', 'spa',
    'knife', 'butter', 'salt', 'coal', 'gold', 'briefcase', 'race', 'ship',
  ],
  ch: [
    'cheese', 'cow', 'ski', 'mountain', 'watch', 'clock', 'grape', 'wine',
    'honey', 'forest', 'oak', 'sheep', 'goat', 'river', 'crystal', 'castle',
    'apple', 'cherry', 'wheat', 'butter', 'mushroom', 'duck', 'fish', 'ship',
    'factory', 'metal', 'gold', 'ribbon', 'flower', 'rose', 'spa', 'cathedral',
    'pottery', 'silk', 'horse', 'beer', 'barrel', 'knife', 'salt', 'bear',
  ],
  jp: [
    'flower', 'fleur', 'fish', 'volcano', 'mountain', 'sea', 'ship', 'castle',
    'silk', 'crystal', 'airplane', 'pearl', 'plum', 'ribbon', 'rose', 'spa',
    'pottery', 'ceramic', 'cherry', 'apple', 'honey', 'forest', 'river', 'deer',
    'duck', 'sword', 'gold', 'metal', 'factory', 'clock', 'watch', 'beach',
    'palm', 'grape', 'wine', 'mushroom', 'wheat', 'cow', 'ski', 'horse',
  ],
}

function setBackIds(src, ids) {
  const arr = ids.map((id) => `'${id}'`).join(', ')
  if (!/backIds:\s*\[[\s\S]*?\],\n\s*units:/.test(src)) {
    throw new Error('backIds not found')
  }
  return src.replace(
    /backIds:\s*\[[\s\S]*?\],\n\s*units:/,
    `backIds: [${arr}],\n  units:`,
  )
}

function swap(src, from, to) {
  if (!src.includes(from)) throw new Error(`not found: ${from.slice(0, 80)}`)
  return src.replace(from, to)
}

// --- ES ---
{
  let src = readFileSync(join(dir, 'es.ts'), 'utf8')
  src = setBackIds(src, BACK.es)
  if (src.includes(`{ icon: 'cow', label: 'Encierro' }`)) {
    src = src.replace(
      `{ icon: 'cow', label: 'Encierro' }`,
      `{ icon: 'bull', label: 'Encierro' }`,
    )
  } else if (!src.includes(`{ icon: 'bull', label: 'Encierro' }`)) {
    throw new Error('Navarra Encierro picto not found')
  }
  writeFileSync(join(dir, 'es.ts'), src)
  console.log('es OK')
}

// --- CA ---
{
  let src = readFileSync(join(dir, 'ca.ts'), 'utf8')
  src = setBackIds(src, BACK.ca)
  const swaps = [
    [
      `{ icon: 'coal', label: 'Pétrole' }, { icon: 'cow', label: 'Ranch' }, { icon: 'mountain', label: 'Rocheuses' }`,
      `{ icon: 'oil', label: 'Pétrole' }, { icon: 'cow', label: 'Ranch' }, { icon: 'mountain', label: 'Rocheuses' }`,
    ],
    [
      `{ icon: 'briefcase', label: 'Finance' }, { icon: 'sea', label: 'Grands Lacs' }, { icon: 'oak', label: 'Érable' }`,
      `{ icon: 'briefcase', label: 'Finance' }, { icon: 'sea', label: 'Grands Lacs' }, { icon: 'maple', label: 'Érable' }`,
    ],
    [
      `{ icon: 'oak', label: 'Érable' }, { icon: 'ski', label: 'Hiver' }, { icon: 'river', label: 'Fleuve' }`,
      `{ icon: 'maple', label: 'Érable' }, { icon: 'ski', label: 'Hiver' }, { icon: 'river', label: 'Fleuve' }`,
    ],
    [
      `{ icon: 'gold', label: 'Mine' }, { icon: 'crystal', label: 'Aurores' }, { icon: 'forest', label: 'Taïga' }`,
      `{ icon: 'gold', label: 'Mine' }, { icon: 'bear', label: 'Ours' }, { icon: 'forest', label: 'Taïga' }`,
    ],
    [
      `{ icon: 'crystal', label: 'Arctique' }, { icon: 'fish', label: 'Pêche' }, { icon: 'mountain', label: 'Toundra' }`,
      `{ icon: 'bear', label: 'Ours' }, { icon: 'fish', label: 'Pêche' }, { icon: 'crystal', label: 'Arctique' }`,
    ],
  ]
  for (const [a, b] of swaps) src = swap(src, a, b)
  writeFileSync(join(dir, 'ca.ts'), src)
  console.log('ca OK')
}

// --- US ---
{
  let src = readFileSync(join(dir, 'us.ts'), 'utf8')
  src = setBackIds(src, BACK.us)
  const swaps = [
    [
      `{ icon: 'fish', label: 'Pêche' }, { icon: 'mountain', label: 'Denali' }, { icon: 'gold', label: 'Or' }`,
      `{ icon: 'fish', label: 'Pêche' }, { icon: 'bear', label: 'Ours' }, { icon: 'gold', label: 'Or' }`,
    ],
    [
      `{ icon: 'gold', label: 'Or' }, { icon: 'film', label: 'Cinéma' }, { icon: 'palm', label: 'Côte' }`,
      `{ icon: 'gold', label: 'Or' }, { icon: 'film', label: 'Cinéma' }, { icon: 'bear', label: 'Ours' }`,
    ],
    [
      `{ icon: 'mountain', label: 'White Mts' }, { icon: 'forest', label: 'Forêt' }, { icon: 'oak', label: 'Érable' }`,
      `{ icon: 'mountain', label: 'White Mts' }, { icon: 'forest', label: 'Forêt' }, { icon: 'maple', label: 'Érable' }`,
    ],
    [
      `{ icon: 'wheat', label: 'Blé' }, { icon: 'coal', label: 'Énergie' }, { icon: 'cow', label: 'Élevage' }`,
      `{ icon: 'wheat', label: 'Blé' }, { icon: 'oil', label: 'Pétrole' }, { icon: 'cow', label: 'Élevage' }`,
    ],
    [
      `{ icon: 'cow', label: 'Ranch' }, { icon: 'coal', label: 'Pétrole' }, { icon: 'wheat', label: 'Blé' }`,
      `{ icon: 'cow', label: 'Ranch' }, { icon: 'oil', label: 'Pétrole' }, { icon: 'wheat', label: 'Blé' }`,
    ],
    [
      `{ icon: 'cow', label: 'Ranch' }, { icon: 'factory', label: 'Pétrole' }, { icon: 'gold', label: 'Lone Star' }`,
      `{ icon: 'cow', label: 'Ranch' }, { icon: 'oil', label: 'Pétrole' }, { icon: 'gold', label: 'Lone Star' }`,
    ],
    [
      `{ icon: 'oak', label: 'Érable' }, { icon: 'cheese', label: 'Fromage' }, { icon: 'ski', label: 'Ski' }`,
      `{ icon: 'maple', label: 'Érable' }, { icon: 'cheese', label: 'Fromage' }, { icon: 'ski', label: 'Ski' }`,
    ],
    [
      `{ icon: 'cow', label: 'Ranch' }, { icon: 'mountain', label: 'Yellowstone' }, { icon: 'coal', label: 'Énergie' }`,
      `{ icon: 'cow', label: 'Ranch' }, { icon: 'mountain', label: 'Yellowstone' }, { icon: 'oil', label: 'Énergie' }`,
    ],
  ]
  for (const [a, b] of swaps) src = swap(src, a, b)
  writeFileSync(join(dir, 'us.ts'), src)
  console.log('us OK')
}

// --- BR ---
{
  let src = readFileSync(join(dir, 'br.ts'), 'utf8')
  src = setBackIds(src, BACK.br)
  const swaps = [
    [
      `{ icon: 'forest', label: 'Café' }, { icon: 'beach', label: 'Côte' }, { icon: 'metal', label: 'Fer' }`,
      `{ icon: 'coffee', label: 'Café' }, { icon: 'beach', label: 'Côte' }, { icon: 'metal', label: 'Fer' }`,
    ],
    [
      `{ icon: 'cheese', label: 'Fromage' }, { icon: 'gold', label: 'Mine' }, { icon: 'forest', label: 'Café' }`,
      `{ icon: 'cheese', label: 'Fromage' }, { icon: 'gold', label: 'Mine' }, { icon: 'coffee', label: 'Café' }`,
    ],
    [
      `{ icon: 'beach', label: 'Plages' }, { icon: 'coal', label: 'Pétrole' }, { icon: 'sugar', label: 'Sucre' }`,
      `{ icon: 'beach', label: 'Plages' }, { icon: 'oil', label: 'Pétrole' }, { icon: 'sugar', label: 'Sucre' }`,
    ],
    [
      `{ icon: 'factory', label: 'Industrie' }, { icon: 'race', label: 'Interlagos' }, { icon: 'briefcase', label: 'Finance' }`,
      `{ icon: 'coffee', label: 'Café' }, { icon: 'race', label: 'Interlagos' }, { icon: 'briefcase', label: 'Finance' }`,
    ],
  ]
  for (const [a, b] of swaps) src = swap(src, a, b)
  writeFileSync(join(dir, 'br.ts'), src)
  console.log('br OK')
}

// --- DE ---
{
  let src = readFileSync(join(dir, 'de.ts'), 'utf8')
  src = setBackIds(src, BACK.de)
  src = swap(
    src,
    `{ icon: 'briefcase', label: 'Capitale' }, { icon: 'film', label: 'Culture' }, { icon: 'castle', label: 'Porte' }`,
    `{ icon: 'bear', label: 'Ours' }, { icon: 'briefcase', label: 'Capitale' }, { icon: 'film', label: 'Culture' }`,
  )
  writeFileSync(join(dir, 'de.ts'), src)
  console.log('de OK')
}

// --- CH ---
{
  let src = readFileSync(join(dir, 'ch.ts'), 'utf8')
  src = setBackIds(src, BACK.ch)
  src = swap(
    src,
    `{ icon: 'cheese', label: 'Emmental' }, { icon: 'ski', label: 'Oberland' }, { icon: 'mountain', label: 'Alpes' }`,
    `{ icon: 'cheese', label: 'Emmental' }, { icon: 'bear', label: 'Ours' }, { icon: 'ski', label: 'Oberland' }`,
  )
  writeFileSync(join(dir, 'ch.ts'), src)
  console.log('ch OK')
}

// --- JP ---
{
  let src = readFileSync(join(dir, 'jp.ts'), 'utf8')
  src = setBackIds(src, BACK.jp)
  src = swap(
    src,
    `{ icon: 'forest', label: 'Cerfs' }, { icon: 'cathedral', label: 'Temples' }, { icon: 'castle', label: 'Histoire' }`,
    `{ icon: 'deer', label: 'Cerfs' }, { icon: 'cathedral', label: 'Temples' }, { icon: 'castle', label: 'Histoire' }`,
  )
  writeFileSync(join(dir, 'jp.ts'), src)
  console.log('jp OK')
}

for (const [id, ids] of Object.entries(BACK)) {
  if (ids.length !== 40) throw new Error(`${id}: ${ids.length} ≠ 40`)
  if (new Set(ids).size !== 40) throw new Error(`${id}: duplicates`)
}
console.log('All packs: 40 unique backIds OK')
