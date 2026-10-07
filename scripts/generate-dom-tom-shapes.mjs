/**
 * Silhouettes DOM-TOM → public/maps/dom-tom-shapes.json
 * DOM (971–976) : france-geojson + Mercator fitExtent sur la feature.
 * TOM : silhouettes dessinées (lisibles à petite taille).
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { geoMercator, geoPath } from 'd3-geo'

const SIZE = 120
const PAD = 8
mkdirSync('public/maps', { recursive: true })

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
  // fitExtent sur la feature (pas une bbox polygon) pour un rendu à l’échelle.
  const proj = geoMercator().fitExtent(
    [
      [PAD, PAD],
      [SIZE - PAD, SIZE - PAD],
    ],
    feat,
  )
  return geoPath(proj)(feat)
}

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

// TOM : silhouettes dessinées (lisibles à ~3–4 rem).
const HANDMADE_TOM = {
  '975':
    'M28 38c8-14 22-16 34-8 8 6 10 18 4 28l-18 22c-8 8-22 6-28-4-8-12-4-26 8-38zm52 18c10-6 24-2 28 10 4 12-2 24-14 28-10 4-22-2-26-12-4-12 2-22 12-26z',
  '977':
    'M22 58c6-18 28-28 48-22 18 6 28 24 22 42-4 12-16 20-30 22-18 2-32-8-38-22-4-10-4-16-2-20z',
  '978': 'M30 40l50-8 18 28-12 36-42 8-22-24z',
  '984':
    'M24 30c8-6 18-4 22 4 4 8-2 16-10 18-8 2-16-4-16-12 0-4 2-8 4-10zm40 8c10-8 24-6 28 6 4 10-4 20-14 22-12 2-22-8-20-18 0-4 2-8 6-10zm-18 40c12-4 22 4 24 14 2 12-8 20-18 18-12-2-18-14-12-24 2-4 4-6 6-8zm38 6c8-6 18-2 20 8 2 8-4 14-12 14-8 0-14-8-12-16 0-2 2-4 4-6z',
  '986':
    'M24 36c10-8 22-6 26 4 4 10-4 20-14 22-12 2-20-8-18-18 0-4 2-6 6-8zm40-8c8-4 18 0 20 10 2 10-6 16-14 14-10-2-14-12-10-20 2-2 2-4 4-4zm8 40c12-6 24 0 26 12 2 12-8 20-18 18-12-2-18-14-14-24 2-4 4-6 6-6z',
  '987':
    'M48 28c18-10 40-4 48 16 8 18 0 40-18 50-16 10-38 6-48-12-10-16-4-36 10-46 2-2 6-6 8-8zm-22 8c6-4 12-2 14 4 2 6-2 10-8 10s-10-6-6-14z',
  '988':
    'M18 70c8-28 28-48 52-52 14-2 28 6 34 20 6 14 2 30-10 40-14 12-34 14-50 6-14-6-24-8-26-14zM92 28c6-2 12 2 12 8s-6 10-12 8-8-6-6-12c2-2 4-4 6-4zm8 22c4-2 10 0 10 6s-4 8-8 6-6-6-4-10c0-2 2-2 2-2zm4 20c4 0 8 4 6 8s-8 4-10 0 0-8 4-8z',
}

for (const [code, d] of Object.entries(HANDMADE_TOM)) {
  out[code] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d }
  console.log(code, 'handmade', d.length)
}

writeFileSync('public/maps/dom-tom-shapes.json', JSON.stringify(out))
console.log('wrote', Object.keys(out).sort().join(', '))
