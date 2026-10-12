/**
 * Génère public/maps/territoires/{pack}.json (admin-1, cadré pays).
 * Source : Natural Earth 10m admin-1 (cache /tmp/ne/admin1-10m.geojson).
 * Usage: node scripts/generate-territory-maps.mjs
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
import { geoMercator, geoPath } from 'd3-geo'
import { topology } from 'topojson-server'
import { merge as topoMerge } from 'topojson-client'

const SRC = process.env.NE_ADMIN1 || '/tmp/ne/admin1-10m.geojson'
const OUT = 'public/maps/territoires'
const SIZE = 900

/** ES : region_cod NE → codes pack. */
const ES_REGION_TO_CODE = {
  'ES.AN': 'AN',
  'ES.AR': 'AR',
  'ES.AS': 'AS',
  'ES.CB': 'CB',
  'ES.CL': 'CL',
  'ES.CM': 'CM',
  'ES.CN': 'CN',
  'ES.CT': 'CT',
  'ES.EX': 'EX',
  'ES.GA': 'GA',
  'ES.PM': 'IB',
  'ES.MU': 'MC',
  'ES.MD': 'MD',
  'ES.NA': 'NC',
  'ES.PV': 'PV',
  'ES.LO': 'RI',
  'ES.VC': 'VC',
  'ES.CE': 'CE',
}

const PACK_ISO = {
  ch: 'CH',
  us: 'US',
  es: 'ES',
  de: 'DE',
  jp: 'JP',
  ca: 'CA',
  br: 'BR',
}

async function ensureSource() {
  if (existsSync(SRC)) return
  mkdirSync('/tmp/ne', { recursive: true })
  console.log('Downloading Natural Earth 10m admin-1…')
  const r = await fetch(
    'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson',
  )
  if (!r.ok) throw new Error(`download failed ${r.status}`)
  writeFileSync(SRC, await r.text())
}

function codeFromFeature(packId, f) {
  const p = f.properties
  if (packId === 'jp') {
    const m = String(p.iso_3166_2 || '').match(/^JP-(\d+)$/i)
    return m ? m[1].padStart(2, '0') : null
  }
  if (packId === 'es') {
    if (String(p.iso_3166_2 || '').toUpperCase() === 'ES-ML') return 'ML'
    if (String(p.name || '').toLowerCase() === 'melilla') return 'ML'
    return ES_REGION_TO_CODE[String(p.region_cod || '')] ?? null
  }
  // Prefer iso_3166_2 : NE postal is wrong for CH-BL/OW and DE-BB
  const iso = String(p.iso_3166_2 || '')
  const m2 = iso.match(/^[A-Z]{2}-(.+)$/i)
  if (m2) return m2[1].toUpperCase()
  const hasc = String(p.code_hasc || '')
  const m = hasc.match(/^[A-Z]{2}\.([A-Z0-9]+)$/i)
  if (m) return m[1].toUpperCase()
  const postal = p.postal ? String(p.postal).toUpperCase() : null
  if (postal && /^[A-Z0-9]{1,3}$/.test(postal)) return postal
  return null
}

function dissolveByCode(raw, packId) {
  const groups = new Map()
  for (const f of raw) {
    const code = codeFromFeature(packId, f)
    if (!code) continue
    if (!groups.has(code)) groups.set(code, [])
    groups.get(code).push(f)
  }
  const out = []
  for (const [code, feats] of groups) {
    if (feats.length === 1) {
      out.push({
        type: 'Feature',
        properties: { code },
        geometry: feats[0].geometry,
      })
      continue
    }
    try {
      const topo = topology({
        collection: { type: 'FeatureCollection', features: feats },
      })
      const geom = topoMerge(topo, topo.objects.collection.geometries)
      out.push({ type: 'Feature', properties: { code }, geometry: geom })
    } catch (e) {
      console.warn(packId, code, 'merge fail', e.message)
      out.push({
        type: 'Feature',
        properties: { code },
        geometry: feats[0].geometry,
      })
    }
  }
  return out
}

function projectPack(features, packId) {
  let fitFeatures = features
  if (packId === 'us') {
    fitFeatures = features.filter((f) => !['AK', 'HI'].includes(f.properties.code))
  }
  if (packId === 'ca') {
    fitFeatures = features.filter((f) => !['YT', 'NT', 'NU'].includes(f.properties.code))
  }
  const fitFc = {
    type: 'FeatureCollection',
    features: fitFeatures.length ? fitFeatures : features,
  }
  const proj = geoMercator().fitSize([SIZE, SIZE], fitFc)
  const path = geoPath(proj)
  const paths = {}
  for (const f of features) {
    const d = path(f)
    if (d) paths[f.properties.code] = d
  }
  return { viewBox: `0 0 ${SIZE} ${SIZE}`, paths }
}

await ensureSource()
mkdirSync(OUT, { recursive: true })
const all = JSON.parse(readFileSync(SRC, 'utf8'))

for (const [packId, iso] of Object.entries(PACK_ISO)) {
  const raw = all.features.filter((f) => f.properties.iso_a2 === iso)
  let features
  if (packId === 'es') {
    features = dissolveByCode(raw, packId)
  } else {
    features = []
    const seen = new Set()
    for (const f of raw) {
      const code = codeFromFeature(packId, f)
      if (!code || seen.has(code)) continue
      if (packId === 'us' && code === 'DC') continue
      seen.add(code)
      features.push({
        type: 'Feature',
        properties: { code },
        geometry: f.geometry,
      })
    }
  }

  const json = projectPack(features, packId)
  writeFileSync(`${OUT}/${packId}.json`, JSON.stringify(json))
  console.log(packId, Object.keys(json.paths).length, '→', `${OUT}/${packId}.json`)
}
