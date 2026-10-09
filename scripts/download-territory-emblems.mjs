#!/usr/bin/env node
/**
 * Emblèmes territoires depuis Wikimedia Commons.
 * Packs : ch, es, us, de, jp, ca, br
 * Sortie : public/mockups/emblems/{pack}/{code}.svg|.png
 * Usage: node scripts/download-territory-emblems.mjs [pack...]
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

const ES = {
  AN: ['Flag of Andalucía.svg', 'Flag of Andalusia.svg'],
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

const US = {
  AL: ['Flag of Alabama.svg'],
  AK: ['Flag of Alaska.svg'],
  AZ: ['Flag of Arizona.svg'],
  AR: ['Flag of Arkansas.svg'],
  CA: ['Flag of California.svg'],
  CO: ['Flag of Colorado.svg'],
  CT: ['Flag of Connecticut.svg'],
  DE: ['Flag of Delaware.svg'],
  FL: ['Flag of Florida.svg'],
  GA: ['Flag of Georgia (U.S. state).svg', 'Flag of Georgia.svg'],
  HI: ['Flag of Hawaii.svg'],
  ID: ['Flag of Idaho.svg'],
  IL: ['Flag of Illinois.svg'],
  IN: ['Flag of Indiana.svg'],
  IA: ['Flag of Iowa.svg'],
  KS: ['Flag of Kansas.svg'],
  KY: ['Flag of Kentucky.svg'],
  LA: ['Flag of Louisiana.svg'],
  ME: ['Flag of Maine.svg'],
  MD: ['Flag of Maryland.svg'],
  MA: ['Flag of Massachusetts.svg'],
  MI: ['Flag of Michigan.svg'],
  MN: ['Flag of Minnesota.svg'],
  MS: ['Flag of Mississippi.svg'],
  MO: ['Flag of Missouri.svg'],
  MT: ['Flag of Montana.svg'],
  NE: ['Flag of Nebraska.svg'],
  NV: ['Flag of Nevada.svg'],
  NH: ['Flag of New Hampshire.svg'],
  NJ: ['Flag of New Jersey.svg'],
  NM: ['Flag of New Mexico.svg'],
  NY: ['Flag of New York.svg'],
  NC: ['Flag of North Carolina.svg'],
  ND: ['Flag of North Dakota.svg'],
  OH: ['Flag of Ohio.svg'],
  OK: ['Flag of Oklahoma.svg'],
  OR: ['Flag of Oregon.svg'],
  PA: ['Flag of Pennsylvania.svg'],
  RI: ['Flag of Rhode Island.svg'],
  SC: ['Flag of South Carolina.svg'],
  SD: ['Flag of South Dakota.svg'],
  TN: ['Flag of Tennessee.svg'],
  TX: ['Flag of Texas.svg'],
  UT: ['Flag of Utah.svg'],
  VT: ['Flag of Vermont.svg'],
  VA: ['Flag of Virginia.svg'],
  WA: ['Flag of Washington.svg'],
  WV: ['Flag of West Virginia.svg'],
  WI: ['Flag of Wisconsin.svg'],
  WY: ['Flag of Wyoming.svg'],
}

/** Allemagne — blasons des Länder. */
const DE = {
  BW: ['Coat of arms of Baden-Württemberg.svg', 'Coat of arms of Baden-Württemberg (lesser).svg'],
  BY: ['Coat of arms of Bavaria.svg', 'Bayern Wappen.svg'],
  BE: ['Coat of arms of Berlin.svg'],
  BB: ['DEU Brandenburg COA.svg', 'CoA Brandenburg, Germany.svg', 'Coat of Arms of Brandenburg.svg'],
  HB: ['Coat of arms of Bremen.svg', 'Bremen Wappen.svg'],
  HH: ['Coat of arms of Hamburg.svg', 'DEU Hamburg COA.svg'],
  HE: ['Coat of arms of Hesse.svg'],
  MV: [
    'Coat of arms of Mecklenburg-Western Pomerania (great).svg',
    'Coat of arms of Mecklenburg-Western Pomerania (small).svg',
  ],
  NI: ['Coat of arms of Lower Saxony.svg'],
  NW: ['Coat of arms of North Rhine-Westphalia.svg'],
  RP: ['Coat of arms of Rhineland-Palatinate.svg'],
  SL: ['Wappen des Saarlands.svg', 'Coa de-saarland.svg'],
  SN: ['Coat of arms of Saxony.svg'],
  ST: ['Wappen Sachsen-Anhalt.svg'],
  SH: ['Coat of arms of Schleswig-Holstein.svg'],
  TH: ['Coat of arms of Thuringia.svg'],
}

/** Japon — drapeaux / symboles de préfecture. */
const JP = {
  '01': ['Flag of Hokkaido Prefecture.svg', 'Flag of Hokkaidō Prefecture.svg'],
  '02': ['Flag of Aomori Prefecture.svg'],
  '03': ['Flag of Iwate Prefecture.svg'],
  '04': ['Flag of Miyagi Prefecture.svg'],
  '05': ['Flag of Akita Prefecture.svg'],
  '06': ['Flag of Yamagata Prefecture.svg'],
  '07': ['Flag of Fukushima Prefecture.svg'],
  '08': ['Flag of Ibaraki Prefecture.svg'],
  '09': ['Flag of Tochigi Prefecture.svg'],
  '10': ['Flag of Gunma Prefecture.svg'],
  '11': ['Flag of Saitama Prefecture.svg'],
  '12': ['Flag of Chiba Prefecture.svg'],
  '13': ['Flag of Tokyo Metropolis.svg', 'Flag of Tōkyō Metropolis.svg'],
  '14': ['Flag of Kanagawa Prefecture.svg'],
  '15': ['Flag of Niigata Prefecture.svg'],
  '16': ['Flag of Toyama Prefecture.svg'],
  '17': ['Flag of Ishikawa Prefecture.svg'],
  '18': ['Flag of Fukui Prefecture.svg'],
  '19': ['Flag of Yamanashi Prefecture.svg'],
  '20': ['Flag of Nagano Prefecture.svg'],
  '21': ['Flag of Gifu Prefecture.svg'],
  '22': ['Flag of Shizuoka Prefecture.svg'],
  '23': ['Flag of Aichi Prefecture.svg'],
  '24': ['Flag of Mie Prefecture.svg'],
  '25': ['Flag of Shiga Prefecture.svg'],
  '26': ['Flag of Kyoto Prefecture.svg', 'Flag of Kyōto Prefecture.svg'],
  '27': ['Flag of Osaka Prefecture.svg', 'Flag of Ōsaka Prefecture.svg'],
  '28': ['Flag of Hyogo Prefecture.svg', 'Flag of Hyōgo Prefecture.svg'],
  '29': ['Flag of Nara Prefecture.svg'],
  '30': ['Flag of Wakayama Prefecture.svg'],
  '31': ['Flag of Tottori Prefecture.svg'],
  '32': ['Flag of Shimane Prefecture.svg'],
  '33': ['Flag of Okayama Prefecture.svg'],
  '34': ['Flag of Hiroshima Prefecture.svg'],
  '35': ['Flag of Yamaguchi Prefecture.svg'],
  '36': ['Flag of Tokushima Prefecture.svg'],
  '37': ['Flag of Kagawa Prefecture.svg'],
  '38': ['Flag of Ehime Prefecture.svg'],
  '39': ['Flag of Kochi Prefecture.svg', 'Flag of Kōchi Prefecture.svg'],
  '40': ['Flag of Fukuoka Prefecture.svg'],
  '41': ['Flag of Saga Prefecture.svg'],
  '42': ['Flag of Nagasaki Prefecture.svg'],
  '43': ['Flag of Kumamoto Prefecture.svg'],
  '44': ['Flag of Oita Prefecture.svg', 'Flag of Ōita Prefecture.svg'],
  '45': ['Flag of Miyazaki Prefecture.svg'],
  '46': ['Flag of Kagoshima Prefecture.svg'],
  '47': ['Flag of Okinawa Prefecture.svg'],
}

const CA = {
  AB: ['Flag of Alberta.svg'],
  BC: ['Flag of British Columbia.svg'],
  MB: ['Flag of Manitoba.svg'],
  NB: ['Flag of New Brunswick.svg'],
  NL: ['Flag of Newfoundland and Labrador.svg'],
  NS: ['Flag of Nova Scotia.svg'],
  NT: ['Flag of the Northwest Territories.svg', 'Flag of Northwest Territories.svg'],
  NU: ['Flag of Nunavut.svg'],
  ON: ['Flag of Ontario.svg'],
  PE: ['Flag of Prince Edward Island.svg'],
  QC: ['Flag of Quebec.svg', 'Flag of Québec.svg'],
  SK: ['Flag of Saskatchewan.svg'],
  YT: ['Flag of Yukon.svg'],
}

const BR = {
  AC: ['Bandeira do Acre.svg', 'Flag of Acre.svg'],
  AL: ['Bandeira de Alagoas.svg', 'Flag of Alagoas.svg'],
  AP: ['Bandeira do Amapá.svg', 'Flag of Amapá.svg'],
  AM: ['Bandeira do Amazonas.svg', 'Flag of Amazonas.svg'],
  BA: ['Bandeira da Bahia.svg', 'Flag of Bahia.svg'],
  CE: ['Bandeira do Ceará.svg', 'Flag of Ceará.svg'],
  DF: ['Bandeira do Distrito Federal (Brasil).svg', 'Flag of Distrito Federal (Brazil).svg'],
  ES: ['Bandeira do Espírito Santo.svg', 'Flag of Espírito Santo.svg'],
  GO: ['Bandeira de Goiás.svg', 'Flag of Goiás.svg'],
  MA: ['Bandeira do Maranhão.svg', 'Flag of Maranhão.svg'],
  MT: ['Bandeira de Mato Grosso.svg', 'Flag of Mato Grosso.svg'],
  MS: ['Bandeira de Mato Grosso do Sul.svg', 'Flag of Mato Grosso do Sul.svg'],
  MG: ['Bandeira de Minas Gerais.svg', 'Flag of Minas Gerais.svg'],
  PA: ['Bandeira do Pará.svg', 'Flag of Pará.svg'],
  PB: ['Bandeira da Paraíba.svg', 'Flag of Paraíba.svg'],
  PR: ['Bandeira do Paraná.svg', 'Flag of Paraná.svg'],
  PE: ['Bandeira de Pernambuco.svg', 'Flag of Pernambuco.svg'],
  PI: ['Bandeira do Piauí.svg', 'Flag of Piauí.svg'],
  RJ: ['Bandeira do Rio de Janeiro.svg', 'Flag of Rio de Janeiro.svg'],
  RN: ['Bandeira do Rio Grande do Norte.svg', 'Flag of Rio Grande do Norte.svg'],
  RS: ['Bandeira do Rio Grande do Sul.svg', 'Flag of Rio Grande do Sul.svg'],
  RO: ['Bandeira de Rondônia.svg', 'Flag of Rondônia.svg'],
  RR: ['Bandeira de Roraima.svg', 'Flag of Roraima.svg'],
  SC: ['Bandeira de Santa Catarina.svg', 'Flag of Santa Catarina.svg'],
  SP: ['Bandeira do estado de São Paulo.svg', 'Bandeira de São Paulo.svg', 'Flag of São Paulo.svg'],
  SE: ['Bandeira de Sergipe.svg', 'Flag of Sergipe.svg'],
  TO: ['Bandeira do Tocantins.svg', 'Flag of Tocantins.svg'],
}

const ALL = { ch: CH, es: ES, us: US, de: DE, jp: JP, ca: CA, br: BR }

async function runPack(pack, map) {
  let ok = 0
  let fail = 0
  const fails = []
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
      fails.push(`${code}:${status}`)
      process.stdout.write('x')
    }
    await sleep(350)
  }
  console.log(`\n${pack}: ok=${ok} fail=${fail} total=${Object.keys(map).length}`)
  if (fails.length) console.log('  FAIL', fails.join(', '))
  return { ok, fail }
}

async function run() {
  const want = process.argv.slice(2)
  const packs = want.length ? want : ['us', 'de', 'jp', 'ca', 'br']
  const summary = {}
  for (const id of packs) {
    if (!ALL[id]) {
      console.error('unknown pack', id)
      continue
    }
    console.log(`\n=== ${id} ===`)
    summary[id] = await runPack(id, ALL[id])
  }
  console.log('done', summary)
  const fails = Object.values(summary).reduce((n, s) => n + s.fail, 0)
  if (fails > 0) process.exitCode = 1
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
