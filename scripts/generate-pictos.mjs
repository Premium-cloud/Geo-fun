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

/** IDs utilisés au verso (40) + repli flower. */
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
}

const CUSTOM = {
  eiffel: `<path fill="currentColor" d="M256 32l-28 168h56zm-72 168l-36 88h24l8-48h128l8 48h24l-36-88zm36 88l-12 72h24l-6-36zm48 0l-6 36h24l-12-72zM220 200h72l36 216h-24l-8-48H216l-8 48h-24z"/>`,
  beret: `<path fill="currentColor" d="M128 280c0-88 64-136 128-136s128 48 128 136c0 24-8 44-24 56l16 48H136l16-48c-16-12-24-32-24-56zm128-96c-52 0-92 36-100 88h200c-8-52-48-88-100-88z"/>`,
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
