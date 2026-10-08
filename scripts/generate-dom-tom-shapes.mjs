/**
 * Silhouettes DOM-TOM → public/maps/dom-tom-shapes.json
 *
 * DOM : france-geojson.
 * TOM : Nominatim (terre) pour SPM / St-Barth / St-Martin ;
 *        Natural Earth 10m pour TAAF / Wallis / Polynésie / Nouvelle-Calédonie.
 *
 * Important : d3-geo exige des anneaux extérieurs horaires (clockwise).
 * Les GeoJSON Nominatim/OSM sont souvent anti-horaires → on inverse.
 *
 * Usage: node scripts/generate-dom-tom-shapes.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { geoMercator, geoPath } from 'd3-geo'

const SIZE = 120
const PAD = 7
const CACHE = '/tmp/tom-sources'
mkdirSync('public/maps', { recursive: true })
mkdirSync(CACHE, { recursive: true })

function shoelace(ring) {
  let a = 0
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1]
  }
  return a
}

/** Anneau extérieur pour d3-geo (horaire). */
function toD3Outer(ring) {
  const clean = [ring[0]]
  for (let i = 1; i < ring.length; i++) {
    const a = clean[clean.length - 1]
    const b = ring[i]
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) > 1e-10) clean.push(b)
  }
  if (
    clean.length &&
    (clean[0][0] !== clean[clean.length - 1][0] ||
      clean[0][1] !== clean[clean.length - 1][1])
  ) {
    clean.push([...clean[0]])
  }
  return shoelace(clean) > 0 ? clean.reverse() : clean
}

function areaAbs(ring) {
  return Math.abs(shoelace(ring) / 2)
}

function centroid(ring) {
  let cx = 0
  let cy = 0
  for (const p of ring) {
    cx += p[0]
    cy += p[1]
  }
  const n = ring.length || 1
  return [cx / n, cy / n]
}

function simplify(ring, maxPts = 100) {
  if (ring.length <= maxPts) return ring
  const step = Math.max(1, Math.floor((ring.length - 1) / (maxPts - 1)))
  const out = []
  for (let i = 0; i < ring.length - 1; i += step) out.push(ring[i])
  out.push(ring[ring.length - 1])
  return out
}

function partsOf(geom) {
  if (!geom) return []
  const polys =
    geom.type === 'Polygon' ? [geom.coordinates] : [...geom.coordinates]
  return polys
    .filter((poly) => poly?.[0]?.length >= 4)
    .map((poly) => {
      const outer = toD3Outer(poly[0])
      const [cx, cy] = centroid(outer)
      return { poly: [outer], area: areaAbs(outer), cx, cy }
    })
    .sort((a, b) => b.area - a.area)
}

function pathNatural(parts) {
  const coords = parts.map((p) => [simplify(p.poly[0], 110)])
  const feat = {
    type: 'Feature',
    properties: {},
    geometry:
      coords.length === 1
        ? { type: 'Polygon', coordinates: coords[0] }
        : { type: 'MultiPolygon', coordinates: coords },
  }
  const proj = geoMercator().fitExtent(
    [
      [PAD, PAD],
      [SIZE - PAD, SIZE - PAD],
    ],
    feat,
  )
  return geoPath(proj)(feat)
}

function pathPacked(parts) {
  const sorted = [...parts].sort((a, b) => b.area - a.area)
  if (sorted.length === 1) return pathNatural(sorted)
  const ds = []
  if (sorted.length === 2) {
    const slots = [
      [PAD, PAD + 4, SIZE * 0.66, SIZE - PAD],
      [SIZE * 0.55, SIZE * 0.38, SIZE - PAD, SIZE - PAD],
    ]
    sorted.forEach((p, i) => {
      const feat = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [simplify(p.poly[0], 100)] },
      }
      const [x0, y0, x1, y1] = slots[i]
      ds.push(geoPath(geoMercator().fitExtent([[x0, y0], [x1, y1]], feat))(feat))
    })
  } else {
    const main = sorted[0]
    const feat0 = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [simplify(main.poly[0], 120)] },
    }
    ds.push(
      geoPath(
        geoMercator().fitExtent(
          [
            [PAD, PAD + 16],
            [SIZE * 0.82, SIZE - PAD],
          ],
          feat0,
        ),
      )(feat0),
    )
    const sats = sorted.slice(1, 4)
    const w = (SIZE - PAD * 2) / sats.length
    sats.forEach((p, i) => {
      const x0 = PAD + i * w
      const feat = {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Polygon', coordinates: [simplify(p.poly[0], 80)] },
      }
      ds.push(
        geoPath(
          geoMercator().fitExtent(
            [
              [x0, PAD],
              [x0 + w - 3, SIZE * 0.3],
            ],
            feat,
          ),
        )(feat),
      )
    })
  }
  return ds.filter(Boolean).join('')
}

async function fetchText(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'geofun-dom-tom/2.2' } })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.text()
}

async function nominatimSearch(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=geojson&polygon_geojson=1&limit=6`
  const r = await fetch(url, { headers: { 'User-Agent': 'geofun-dom-tom/2.2' } })
  if (!r.ok) throw new Error(`nominatim ${r.status}`)
  return r.json()
}

function pickBestFeature(features, prefer) {
  let best = null
  for (const f of features || []) {
    if (!f.geometry) continue
    const parts = partsOf(f.geometry)
    if (!parts.length) continue
    if (prefer && !prefer(f, parts)) continue
    const verts = parts.reduce((n, p) => n + p.poly[0].length, 0)
    const score =
      verts +
      (f.properties?.osm_type === 'relation' ? 500 : 0) +
      (String(f.properties?.type || '').includes('administrative') ? 200 : 0)
    if (!best || score > best.score) best = { f, score, verts, parts }
  }
  return best
}

async function loadCachedFeature(cache, loader) {
  if (existsSync(cache)) return JSON.parse(readFileSync(cache, 'utf8'))
  const feat = await loader()
  if (feat) writeFileSync(cache, JSON.stringify(feat))
  return feat
}

async function loadSpm() {
  return loadCachedFeature(`${CACHE}/tom-land-975.geojson`, async () => {
    const queries = [
      ['Miquelon-Langlade', (f) => /Miquelon/i.test(f.properties?.display_name || '')],
      [
        'Saint-Pierre, Saint-Pierre-et-Miquelon',
        (f) => /Saint-Pierre-et-Miquelon/i.test(f.properties?.display_name || ''),
      ],
    ]
    const polys = []
    for (const [q, pref] of queries) {
      console.log('975 nominatim', q)
      const fc = await nominatimSearch(q)
      const hit = pickBestFeature(fc.features, (f, parts) => pref(f) && parts[0]?.area < 0.05)
      if (hit) for (const p of hit.parts) polys.push(p.poly)
      await new Promise((r) => setTimeout(r, 1100))
    }
    if (!polys.length) return null
    return {
      type: 'Feature',
      properties: { name: 'Saint-Pierre-et-Miquelon' },
      geometry: { type: 'MultiPolygon', coordinates: polys },
    }
  })
}

async function loadNominatim(code, queries, prefer) {
  return loadCachedFeature(`${CACHE}/tom-land-${code}.geojson`, async () => {
    let best = null
    for (const q of queries) {
      console.log(code, 'nominatim', q)
      const fc = await nominatimSearch(q)
      const hit = pickBestFeature(fc.features, prefer)
      if (hit && (!best || hit.score > best.score)) best = hit
      await new Promise((r) => setTimeout(r, 1100))
      if (best && best.verts > 200) break
    }
    return best?.f ?? null
  })
}

async function loadNE(name) {
  const path = `${CACHE}/${name}.geojson`
  if (!existsSync(path)) {
    writeFileSync(
      path,
      await fetchText(
        `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/${name}.geojson`,
      ),
    )
  }
  return JSON.parse(readFileSync(path, 'utf8'))
}

function findByName(fc, pred) {
  return fc.features.find((f) =>
    [f.properties.NAME, f.properties.NAME_EN, f.properties.ADMIN, f.properties.GEOUNIT]
      .filter(Boolean)
      .map(String)
      .some(pred),
  )
}

// ——— DOM ———
const frPath = '/tmp/fr-outre.geojson'
if (!existsSync(frPath)) {
  writeFileSync(
    frPath,
    await fetchText(
      'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/departements-avec-outre-mer.geojson',
    ),
  )
}
const outre = JSON.parse(readFileSync(frPath, 'utf8'))
const byCode = Object.fromEntries(
  outre.features.map((f) => [String(f.properties.code), f]),
)

const out = {}
for (const code of ['971', '972', '973', '974', '976']) {
  const f = byCode[code]
  let parts = partsOf(f.geometry)
  const main = parts[0]
  parts = parts
    .filter((p) => Math.hypot(p.cx - main.cx, p.cy - main.cy) < 2.5)
    .slice(0, 10)
  out[code] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d: pathNatural(parts) }
  console.log(code, 'dom', out[code].d.length)
}

// ——— TOM ———
const units = await loadNE('ne_10m_admin_0_map_units')

const spm = await loadSpm()
{
  const parts = partsOf(spm.geometry)
    .filter((p) => p.area < 0.05)
    .slice(0, 2)
  out['975'] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d: pathPacked(parts) }
  console.log('975 packed', parts.length, out['975'].d.length)
}

const stBarth = await loadNominatim(
  '977',
  ['Saint-Barthélemy, 97133'],
  (f) => /97133|Barthélemy/i.test(f.properties?.display_name || ''),
)
{
  const parts = partsOf(stBarth.geometry).slice(0, 1)
  out['977'] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d: pathNatural(parts) }
  console.log('977', out['977'].d.length)
}

const stMartin = await loadNominatim(
  '978',
  ['Collectivité de Saint-Martin', 'Saint-Martin, 97150'],
  (f) =>
    /Saint-Martin/i.test(f.properties?.display_name || '') &&
    !/Sint/i.test(f.properties?.display_name || ''),
)
{
  const parts = partsOf(stMartin.geometry).slice(0, 1)
  out['978'] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d: pathNatural(parts) }
  console.log('978', out['978'].d.length)
}

{
  const f = findByName(units, (n) => /Fr\. S\. Antarctic|French Southern/i.test(n))
  let parts = partsOf(f.geometry).filter(
    (p) => p.cy >= -55 && p.cy <= -45 && p.cx >= 65 && p.cx <= 75,
  )
  if (!parts.length) parts = partsOf(f.geometry).filter((p) => p.cy >= -55 && p.cy <= -35).slice(0, 1)
  out['984'] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d: pathNatural(parts.slice(0, 3)) }
  console.log('984', out['984'].d.length)
}

{
  const f = findByName(units, (n) => /Wallis/i.test(n))
  out['986'] = {
    viewBox: `0 0 ${SIZE} ${SIZE}`,
    d: pathPacked(partsOf(f.geometry).slice(0, 2)),
  }
  console.log('986', out['986'].d.length)
}

{
  const f = findByName(units, (n) => /Polynesia|Polynésie/i.test(n))
  const parts = partsOf(f.geometry)
    .filter((p) => p.cx > -151.3 && p.cx < -148.8 && p.cy > -18.2 && p.cy < -16.4)
    .slice(0, 4)
  out['987'] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d: pathPacked(parts) }
  console.log('987', out['987'].d.length)
}

{
  const f = findByName(units, (n) => /Caledonia|Calédonie/i.test(n))
  const parts = partsOf(f.geometry)
    .filter((p) => p.cx >= 163 && p.cx <= 169)
    .slice(0, 5)
  out['988'] = { viewBox: `0 0 ${SIZE} ${SIZE}`, d: pathNatural(parts) }
  console.log('988', out['988'].d.length)
}

const need = ['971', '972', '973', '974', '975', '976', '977', '978', '984', '986', '987', '988']
const missing = need.filter((c) => !out[c]?.d)
if (missing.length) {
  console.error('MISSING', missing.join(','))
  process.exit(1)
}

writeFileSync('public/maps/dom-tom-shapes.json', JSON.stringify(out))
console.log('wrote', need.join(', '))
