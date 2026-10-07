/**
 * Génère src/cards/pictos.tsx (Game Icons CC BY 3.0 + pictos FR custom).
 * Usage: node scripts/generate-pictos.mjs
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const gameIcons = (
  await import('@iconify-json/game-icons/icons.json', {
    with: { type: 'json' },
  })
).default
const { icons } = gameIcons

function gi(name) {
  const icon = icons[name]
  if (!icon?.body) throw new Error(`Missing game-icons: ${name}`)
  return icon.body
}

/** IDs verso (40) + spécialités recto + repli flower. */
const GI_MAP = {
  wheat: 'wheat',
  wine: 'wine-glass',
  cheese: 'cheese-wedge',
  croissant: 'croissant',
  fleur: 'fleur-de-lys',
  baguette: 'bread',
  palm: 'palm-tree',
  lavender: 'flowers',
  lighthouse: 'lighthouse',
  castle: 'castle',
  olive: 'olive',
  fish: 'fish-cooked',
  cathedral: 'church',
  oyster: 'oyster',
  ship: 'caravel',
  grape: 'grapes',
  barrel: 'barrel',
  cow: 'cow',
  coq: 'rooster',
  duck: 'duck',
  scallop: 'scallop',
  honey: 'honeycomb',
  mustard: 'cool-spices',
  knife: 'bowie-knife',
  apple: 'shiny-apple',
  sea: 'at-sea',
  champagne: 'champagne-cork',
  cider: 'beer-bottle',
  butter: 'butter',
  ski: 'skis',
  strawberry: 'strawberry',
  chicken: 'chicken',
  forest: 'forest',
  salt: 'salt-shaker',
  cherry: 'cherry',
  pearl: 'pearl-necklace',
  volcano: 'volcano',
  beach: 'beach-ball',
  flower: 'flowers',
  // Spécialités recto
  sheep: 'sheep',
  goat: 'goat',
  soap: 'soap',
  oak: 'oak-leaf',
  watch: 'pocket-watch',
  airplane: 'airplane',
  ribbon: 'ribbon',
  coal: 'coal-pile',
  cookie: 'cookie',
  crystal: 'crystal-growth',
  fries: 'french-fries',
  beer: 'beer-stein',
  horse: 'horse-head',
  pepper: 'chili-pepper',
  pig: 'pig',
  pretzel: 'pretzel',
  stork: 'stork-delivery',
  race: 'race-car',
  garlic: 'garlic',
  lion: 'lion',
  atom: 'atom',
  briefcase: 'briefcase',
  film: 'film-projector',
  rose: 'rose',
  gold: 'gold-bar',
  penguin: 'penguin',
  metal: 'metal-bar',
  factory: 'factory',
  vanilla: 'vanilla-flower',
  sword: 'broadsword',
  walnut: 'acorn',
  mushroom: 'mushroom',
  plum: 'plum',
  pottery: 'amphora',
  silk: 'rolled-cloth',
  // Blasons historiques (DEPT_PICTOS)
  beet: 'beet',
  spa: 'hot-surface',
  mountain: 'mountains',
  chestnut: 'chestnut-leaf',
  river: 'river',
  textile: 'rolled-cloth',
  calisson: 'wrapped-sweet',
  truffle: 'mushroom',
  clock: 'pocket-watch',
  nougat: 'cookie',
  plane: 'airplane',
  lentil: 'peas',
  lace: 'sewing-needle',
  prune: 'plum',
  ceramic: 'porcelain-vase',
  melon: 'watermelon',
  banana: 'banana',
  sugar: 'sugar-cane',
  rum: 'drink-me',
  rocket: 'rocket',
}

const CUSTOM = {
  eiffel: `<path fill="currentColor" d="M256 32l-28 168h56zm-72 168l-36 88h24l8-48h128l8 48h24l-36-88zm36 88l-12 72h24l-6-36zm48 0l-6 36h24l-12-72zM220 200h72l36 216h-24l-8-48H216l-8 48h-24z"/>`,
  beret: `<path fill="currentColor" d="M128 280c0-88 64-136 128-136s128 48 128 136c0 24-8 44-24 56l16 48H136l16-48c-16-12-24-32-24-56zm128-96c-52 0-92 36-100 88h200c-8-52-48-88-100-88z"/>`,
  crepe: `<path fill="currentColor" d="M256 80c-88 0-160 40-160 96v32c0 24 24 48 64 64l16 96h160l16-96c40-16 64-40 64-64v-32c0-56-72-96-160-96zm0 32c64 0 112 24 112 48s-48 48-112 48-112-24-112-48 48-48 112-48z"/>`,
}

const pictoIds = [...new Set([...Object.keys(GI_MAP), ...Object.keys(CUSTOM)])]

const entries = pictoIds.map((id) => {
  const body = CUSTOM[id] ?? gi(GI_MAP[id])
  const escaped = body.replace(/\\/g, '\\\\').replace(/`/g, '\\`')
  return `  ${id}: \`${escaped}\`,`
})

const out = `/** Pictogrammes Game Icons (CC BY 3.0) — généré par scripts/generate-pictos.mjs */

export type PictoId =
${pictoIds.map((id) => `  | '${id}'`).join('\n')}

export const ICONS: Record<PictoId, string> = {
${entries.join('\n')}
}

export function Picto({ id }: { id: PictoId }) {
  const body = ICONS[id] ?? ICONS.flower
  return (
    <svg
      viewBox="0 0 512 512"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  )
}
`

writeFileSync(join(root, 'src/cards/pictos.tsx'), out)
console.log('Wrote src/cards/pictos.tsx with', pictoIds.length, 'icons')
