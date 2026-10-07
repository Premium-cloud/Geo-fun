/**
 * Génère public/maps/*.json + src/game/mapCodes.ts
 * Prérequis : fichiers /tmp/fr-depts.geojson et /tmp/world-110m.json
 * (ou téléchargés ici).
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'

async function ensureSources() {
  if (!existsSync('/tmp/fr-depts.geojson')) {
    const r = await fetch(
      'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-version-simplifiee.geojson',
    )
    writeFileSync('/tmp/fr-depts.geojson', await r.text())
  }
  if (!existsSync('/tmp/world-110m.json')) {
    const r = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
    writeFileSync('/tmp/world-110m.json', await r.text())
  }
}

await ensureSources()
mkdirSync('public/maps', { recursive: true })

const fr = JSON.parse(readFileSync('/tmp/fr-depts.geojson', 'utf8'))
const frProj = geoMercator().fitSize([900, 900], fr)
const frPath = geoPath(frProj)
const frPaths = {}
for (const f of fr.features) {
  const code = String(f.properties.code)
  const d = frPath(f)
  if (d) frPaths[code] = d
}
writeFileSync(
  'public/maps/france-depts.json',
  JSON.stringify({ viewBox: '0 0 900 900', paths: frPaths }),
)

const topo = JSON.parse(readFileSync('/tmp/world-110m.json', 'utf8'))
const countries = feature(topo, topo.objects.countries)
const slim = await (
  await fetch(
    'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-2/slim-2.json',
  )
).json()
const numToA2 = {}
for (const row of slim) {
  numToA2[String(Number(row['country-code']))] = row['alpha-2']
}
const worldProj = geoMercator().fitSize([1000, 520], countries)
const worldPath = geoPath(worldProj)
const worldPaths = {}
for (const f of countries.features) {
  const a2 = numToA2[String(f.id)]
  if (!a2) continue
  const d = worldPath(f)
  if (d) worldPaths[a2] = d
}
writeFileSync(
  'public/maps/world-countries.json',
  JSON.stringify({ viewBox: '0 0 1000 520', paths: worldPaths }),
)

writeFileSync(
  'src/game/mapCodes.ts',
  `/** Codes présents sur les cartes SVG (généré). */\nexport const WORLD_MAP_CODES = new Set(${JSON.stringify(Object.keys(worldPaths))})\nexport const FRANCE_MAP_CODES = new Set(${JSON.stringify(Object.keys(frPaths))})\n`,
)

console.log('france', Object.keys(frPaths).length, 'world', Object.keys(worldPaths).length)
