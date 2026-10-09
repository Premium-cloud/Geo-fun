#!/usr/bin/env node
/**
 * Emblèmes CH (blasons) + ES (drapeaux) depuis Wikimedia Commons.
 * Sortie : public/mockups/emblems/{pack}/{code}.svg|.png
 * Usage: node scripts/download-territory-emblems.mjs
 */
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const UA = 'GeoFun-territories/1.0 (educational card mockups; contact via project)'
const ROOT = join(process.cwd(), 'public/mockups/emblems')

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchWithBackoff(url, init, retries = 6) {
  let delay = 1500
  for (let i = 0; i <= retries; i++) {
    const res = await fetch(url, init)
    if (res.status !== 429 && res.status !== 503) return res
    if (i === retries) return res
    const retryAfter = Number(res.headers.get('retry-after'))
    const wait = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : delay
    await sleep(wait)
    delay = Math.min(delay * 2, 30000)
  }
  throw new Error('unreachable')
}

async function resolveUrl(filename) {
  const api =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      titles: `File:${filename}`,
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '480',
      format: 'json',
    })
  const res = await fetchWithBackoff(api, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`API ${res.status}`)
  const data = await res.json()
  for (const page of Object.values(data.query?.pages ?? {})) {
    if (page.missing != null) return null
    const info = page.imageinfo?.[0]
    return info?.thumburl || info?.url || null
  }
  return null
}

async function download(pack, code, filenames) {
  const dir = join(ROOT, pack)
  mkdirSync(dir, { recursive: true })
  const destSvg = join(dir, `${code}.svg`)
  const destPng = join(dir, `${code}.png`)
  if (existsSync(destSvg) && statSync(destSvg).size > 200) return 'skip-svg'
  if (existsSync(destPng) && statSync(destPng).size > 200) return 'skip-png'

  for (const filename of filenames) {
    const url = await resolveUrl(filename)
    if (!url) {
      await sleep(200)
      continue
    }
    const res = await fetchWithBackoff(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
    if (!res.ok) {
      await sleep(200)
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    const head = buf.subarray(0, 200).toString('utf8').toLowerCase()
    if (head.includes('<svg') || head.includes('<?xml')) {
      writeFileSync(destSvg, buf)
      return `svg:${filename}`
    }
    writeFileSync(destPng, buf)
    return `png:${filename}`
  }
  return 'missing'
}

/** Blasons officiels CH — série « matt » (Fahnenreglement / domaine public). */
const CH = {
  AG: ['Wappen Aargau matt.svg'],
  AI: ['Wappen Appenzell Innerrhoden matt.svg'],
  AR: ['Wappen Appenzell Ausserrhoden matt.svg'],
  BE: ['Wappen Bern matt.svg'],
  BL: ['Wappen Basel-Landschaft matt.svg'],
  BS: ['Wappen Basel-Stadt matt.svg'],
  FR: ['Wappen Freiburg matt.svg', 'Wappen Fribourg matt.svg'],
  GE: ['Wappen Genf matt.svg', 'Wappen Genève matt.svg'],
  GL: ['Wappen Glarus matt.svg'],
  GR: ['Wappen Graubünden matt.svg'],
  JU: ['Wappen Jura matt.svg'],
  LU: ['Wappen Luzern matt.svg'],
  NE: ['Wappen Neuenburg matt.svg', 'Wappen Neuchâtel matt.svg'],
  NW: ['Wappen Nidwalden matt.svg'],
  OW: ['Wappen Obwalden matt.svg'],
  SG: ['Wappen St. Gallen matt.svg', 'Wappen Sankt Gallen matt.svg'],
  SH: ['Wappen Schaffhausen matt.svg'],
  SO: ['Wappen Solothurn matt.svg'],
  SZ: ['Wappen Schwyz matt.svg'],
  TG: ['Wappen Thurgau matt.svg'],
  TI: ['Wappen Tessin matt.svg', 'Wappen Ticino matt.svg'],
  UR: ['Wappen Uri matt.svg'],
  VD: ['Wappen Waadt matt.svg', 'Wappen Vaud matt.svg'],
  VS: ['Wappen Wallis matt.svg', 'Wappen Valais matt.svg'],
  ZG: ['Wappen Zug matt.svg'],
  ZH: ['Wappen Zürich matt.svg'],
}

/** Drapeaux officiels communautés autonomes ES (Commons). */
const ES = {
  AN: ['Flag of Andalucía.svg', 'Flag of Andalusia.svg', 'Flag of Andalucía (with coat of arms).svg'],
  AR: ['Flag of Aragon.svg'],
  AS: ['Flag of Asturias.svg'],
  CB: ['Flag of Cantabria.svg'],
  CL: ['Flag of Castile and León.svg'],
  CM: ['Flag of Castilla–La Mancha.svg', 'Flag of Castile-La Mancha.svg', 'Flag of Castilla-La Mancha.svg'],
  CN: ['Flag of the Canary Islands.svg', 'Flag of Canary Islands.svg'],
  CT: ['Flag of Catalonia.svg'],
  EX: ['Flag of Extremadura.svg', 'Flag of Extremadura (with coat of arms).svg'],
  GA: ['Flag of Galicia.svg'],
  IB: ['Flag of the Balearic Islands.svg'],
  MC: ['Flag of the Region of Murcia.svg', 'Flag of Murcia.svg'],
  MD: ['Flag of the Community of Madrid.svg'],
  NC: ['Flag of Navarre.svg', 'Flag of Navarra.svg'],
  PV: ['Flag of the Basque Country.svg'],
  RI: ['Flag of La Rioja (with coat of arms).svg', 'Flag of La Rioja.svg'],
  VC: ['Flag of the Land of Valencia (2-3).svg', 'Flag of Valencian Community (2-3).svg', 'Flag of the Valencian Community.svg'],
  CE: ['Flag of Ceuta.svg'],
  ML: ['Flag of Melilla.svg'],
}

async function runPack(pack, map) {
  let ok = 0
  let fail = 0
  for (const [code, files] of Object.entries(map)) {
    let status = 'fail'
    try {
      status = await download(pack, code, files)
    } catch (e) {
      status = String(e.message || e)
    }
    if (status.startsWith('skip') || status.startsWith('svg') || status.startsWith('png')) {
      ok++
      process.stdout.write('.')
    } else {
      fail++
      console.log(`\nFAIL ${pack}/${code}: ${status}`)
    }
    await sleep(400)
  }
  console.log(`\n${pack}: ok=${ok} fail=${fail} total=${Object.keys(map).length}`)
  return { ok, fail }
}

async function run() {
  const a = await runPack('ch', CH)
  const b = await runPack('es', ES)
  console.log('done', { ch: a, es: b })
  if (a.fail + b.fail > 0) process.exitCode = 1
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
