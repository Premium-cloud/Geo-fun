/**
 * Silhouettes DOM-TOM fidèles → public/maps/dom-tom-shapes.json
 * Sources : france-geojson (971–976) + Nominatim (TOM).
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { geoMercator, geoPath } from 'd3-geo'

const SIZE = 120
const PAD = 8
const CACHE = '/tmp/dom-tom-geo-cache'
mkdirSync(CACHE, { recursive: true })
mkdirSync('public/maps', { recursive: true })

const NOMINATIM = {
  '975': 'Saint-Pierre-et-Miquelon, France',
  '977': 'Saint-Barthélemy, France',
  '978': 'Collectivité de Saint-Martin, France',
  '984': 'Terres australes et antarctiques françaises',
  '986': 'Wallis-et-Futuna, France',
  '987': 'Polynésie française',
  '988': 'Nouvelle-Calédonie, France',
}

function ringArea(ring) {
  let a = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]
  }
  return a / 2
}

function walkCoords(geom, out = []) {
  if (!geom) return out
  if (geom.type === 'Polygon') {
    for (const ring of geom.coordinates) for (const p of ring) out.push(p)
  } else if (geom.type === 'MultiPolygon') {
    for (const poly of geom.coordinates)
      for (const ring of poly) for (const p of ring) out.push(p)
  }
  return out
}

function manualBounds(feature) {
  const pts = walkCoords(feature.geometry)
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const [x, y] of pts) {
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }
  return [
    [minX, minY],
    [maxX, maxY],
  ]
}

function focusLargest(feature, maxParts, clusterDeg = 10) {
  const g = feature.geometry
  if (!g || g.type === 'Polygon') return feature
  if (g.type !== 'MultiPolygon') return feature
  const scored = g.coordinates
    .map((poly) => {
      const area = Math.abs(ringArea(poly[0]))
      let cx = 0
      let cy = 0
      const ring = poly[0]
      for (const p of ring) {
        cx += p[0]
        cy += p[1]
      }
      const n = ring.length || 1
      return { poly, area, cx: cx / n, cy: cy / n }
    })
    .sort((a, b) => b.area - a.area)
  const main = scored[0]
  const near = scored
    .filter((s) => Math.hypot(s.cx - main.cx, s.cy - main.cy) < clusterDeg)
    .slice(0, maxParts)
  return {
    type: 'Feature',
    properties: feature.properties ?? {},
    geometry: { type: 'MultiPolygon', coordinates: near.map((s) => s.poly) },
  }
}

function thinRing(ring, stride) {
  if (ring.length <= 48) return ring
  const out = []
  for (let i = 0; i < ring.length - 1; i += stride) out.push(ring[i])
  out.push(ring[ring.length - 1])
  return out
}

function simplify(geom, stride) {
  if (geom.type === 'Polygon') {
    return { type: 'Polygon', coordinates: geom.coordinates.map((r) => thinRing(r, stride)) }
  }
  if (geom.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: geom.coordinates.map((poly) => poly.map((r) => thinRing(r, stride))),
    }
  }
  return geom
}

function toPath(feature) {
  let feat = focusLargest(feature, 14, 12)
  const pts = walkCoords(feat.geometry)
  const stride = pts.length > 8000 ? 4 : pts.length > 2500 ? 3 : 2
  feat = { ...feat, geometry: simplify(feat.geometry, stride) }
  // fitExtent sur la feature elle-même (pas une bbox polygon) —
  // sinon Mercator sous-échelle les DOM france-geojson (~0.2×0.2 dans 120).
  const proj = geoMercator().fitExtent(
    [
      [PAD, PAD],
      [SIZE - PAD, SIZE - PAD],
    ],
    feat,
  )
  const d = geoPath(proj)(feat)
  return d
}

async function fetchNominatim(code, q) {
  const cache = `${CACHE}/${code}.geojson`
  if (existsSync(cache)) return JSON.parse(readFileSync(cache, 'utf8'))
  console.log('fetch', code, q)
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=geojson&polygon_geojson=1&limit=1`
  const r = await fetch(url, {
    headers: { 'User-Agent': 'cartes-lexique/1.0 (DOM-TOM silhouettes)' },
  })
  if (!r.ok) throw new Error(`HTTP ${r.status} ${code}`)
  const j = await r.json()
  writeFileSync(cache, JSON.stringify(j))
  await new Promise((res) => setTimeout(res, 1100))
  return j
}

// france-geojson outre-mer
if (!existsSync('/tmp/fr-outre.geojson')) {
  const r = await fetch(
    'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-avec-outre-mer.geojson',
  )
  writeFileSync('/tmp/fr-outre.geojson', await r.text())
}
const outre = JSON.parse(readFileSync('/tmp/fr-outre.geojson', 'utf8'))
const byCode = Object.fromEntries(
  outre.features.map((f) => [String(f.properties.code), f]),
)

const out = {}
for (const code of ['971', '972', '973', '974', '976']) {
  const f = byCode[code]
  if (!f) {
    console.warn('missing france-geojson', code)
    continue
  }
  const d = toPath(f)
  if (d) {
    out[code] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d }
    console.log(code, 'ok', d.length)
  }
}

for (const [code, q] of Object.entries(NOMINATIM)) {
  const fc = await fetchNominatim(code, q)
  const f = fc.features?.[0]
  if (!f) {
    console.warn('missing nominatim', code)
    continue
  }
  // Polynésie / TAAF : cluster autour des plus grandes îles
  const cluster = code === '987' ? 8 : code === '984' ? 15 : 12
  const focused = focusLargest(f, code === '987' ? 16 : 10, cluster)
  const d = toPath(focused)
  if (d) {
    out[code] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d }
    console.log(code, 'ok', d.length)
  }
}

writeFileSync('public/maps/dom-tom-shapes.json', JSON.stringify(out))
console.log('wrote', Object.keys(out).sort().join(', '))
