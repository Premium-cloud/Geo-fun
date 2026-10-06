#!/usr/bin/env node
/**
 * Télécharge les blasons / drapeaux des départements depuis Wikimedia Commons.
 * Usage: node scripts/download-blasons.mjs
 */
import { mkdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'

const OUT = join(process.cwd(), 'public/blasons')
mkdirSync(OUT, { recursive: true })

const UA = 'DeptCards/1.0 (educational; local wallpaper project)'

/** code -> Wikimedia filename (File:…) */
const FILES = {
  '01': 'Blason département fr Ain.svg',
  '02': 'Blason département fr Aisne.svg',
  '03': 'Blason département fr Allier.svg',
  '04': 'Blason département fr Alpes-de-Haute-Provence.svg',
  '05': 'Blason département fr Hautes-Alpes.svg',
  '06': 'Blason département fr Alpes-Maritimes.svg',
  '07': 'Blason département fr Ardèche.svg',
  '08': 'Blason département fr Ardennes.svg',
  '09': 'Blason département fr Ariège.svg',
  '10': 'Blason département fr Aube.svg',
  '11': 'Blason département fr Aude.svg',
  '12': 'Blason département fr Aveyron.svg',
  '13': 'Blason département fr Bouches-du-Rhône.svg',
  '14': 'Blason département fr Calvados.svg',
  '15': 'Blason département fr Cantal.svg',
  '16': 'Blason département fr Charente.svg',
  '17': 'Blason département fr Charente-Maritime.svg',
  '18': 'Blason département fr Cher.svg',
  '19': 'Blason département fr Corrèze.svg',
  '2A': 'Blason département fr Corse-du-Sud.svg',
  '2B': 'Blason département fr Haute-Corse.svg',
  '21': "Blason département fr Côte-d'Or.svg",
  '22': "Blason département fr Côtes-d'Armor.svg",
  '23': 'Blason département fr Creuse.svg',
  '24': 'Blason département fr Dordogne.svg',
  '25': 'Blason département fr Doubs.svg',
  '26': 'Blason département fr Drôme.svg',
  '27': 'Blason département fr Eure.svg',
  '28': 'Blason département fr Eure-et-Loir.svg',
  '29': 'Blason département fr Finistère.svg',
  '30': 'Blason département fr Gard.svg',
  '31': 'Blason département fr Haute-Garonne.svg',
  '32': 'Blason département fr Gers.svg',
  '33': 'Blason département fr Gironde.svg',
  '34': 'Blason département fr Hérault.svg',
  '35': 'Blason département fr Ille-et-Vilaine.svg',
  '36': 'Blason département fr Indre.svg',
  '37': 'Blason département fr Indre-et-Loire.svg',
  '38': 'Blason département fr Isère.svg',
  '39': 'Blason département fr Jura.svg',
  '40': 'Blason département fr Landes.svg',
  '41': 'Blason département fr Loir-et-Cher.svg',
  '42': 'Blason département fr Loire.svg',
  '43': 'Blason département fr Haute-Loire.svg',
  '44': 'Blason département fr Loire-Atlantique.svg',
  '45': 'Blason département fr Loiret.svg',
  '46': 'Blason département fr Lot.svg',
  '47': 'Blason département fr Lot-et-Garonne.svg',
  '48': 'Blason département fr Lozère.svg',
  '49': 'Blason département fr Maine-et-Loire.svg',
  '50': 'Blason département fr Manche.svg',
  '51': 'Blason département fr Marne.svg',
  '52': 'Blason département fr Haute-Marne.svg',
  '53': 'Blason département fr Mayenne.svg',
  '54': 'Blason département fr Meurthe-et-Moselle.svg',
  '55': 'Blason département fr Meuse.svg',
  '56': 'Blason département fr Morbihan.svg',
  '57': 'Blason département fr Moselle.svg',
  '58': 'Blason département fr Nièvre.svg',
  '59': 'Blason département fr Nord.svg',
  '60': 'Blason département fr Oise.svg',
  '61': 'Blason département fr Orne.svg',
  '62': 'Blason département fr Pas-de-Calais.svg',
  '63': 'Blason département fr Puy-de-Dôme.svg',
  '64': 'Blason département fr Pyrénées-Atlantiques.svg',
  '65': 'Blason département fr Hautes-Pyrénées.svg',
  '66': 'Blason département fr Pyrénées-Orientales.svg',
  '67': 'Blason département fr Bas-Rhin.svg',
  '68': 'Blason département fr Haut-Rhin.svg',
  '69': 'Blason département fr Rhône.svg',
  '70': 'Blason département fr Haute-Saône.svg',
  '71': 'Blason département fr Saône-et-Loire.svg',
  '72': 'Blason département fr Sarthe.svg',
  '73': 'Blason département fr Savoie.svg',
  '74': 'Blason département fr Haute-Savoie.svg',
  '75': 'Blason Paris.svg',
  '76': 'Blason département fr Seine-Maritime.svg',
  '77': 'Blason département fr Seine-et-Marne.svg',
  '78': 'Blason département fr Yvelines.svg',
  '79': 'Blason département fr Deux-Sèvres.svg',
  '80': 'Blason département fr Somme.svg',
  '81': 'Blason département fr Tarn.svg',
  '82': 'Blason département fr Tarn-et-Garonne.svg',
  '83': 'Blason département fr Var.svg',
  '84': 'Blason département fr Vaucluse.svg',
  '85': 'Blason département fr Vendée.svg',
  '86': 'Blason département fr Vienne.svg',
  '87': 'Blason département fr Haute-Vienne.svg',
  '88': 'Blason département fr Vosges.svg',
  '89': 'Blason département fr Yonne.svg',
  '90': 'Blason département fr Territoire de Belfort.svg',
  '91': 'Blason département fr Essonne.svg',
  '92': 'Blason département fr Hauts-de-Seine.svg',
  '93': 'Blason département fr Seine-Saint-Denis.svg',
  '94': 'Blason département fr Val-de-Marne.svg',
  '95': "Blason département fr Val-d'Oise.svg",
  // Outre-mer : drapeaux officiels
  '971': 'Flag of Guadeloupe (local).svg',
  '972': 'Flag-of-Martinique.svg',
  '973': 'Flag of French Guiana.svg',
  '974': 'Flag of Réunion (unofficial, with hammers and sickles).svg',
  '976': 'Flag of Mayotte (local).svg',
  '975': 'Flag of Saint-Pierre and Miquelon.svg',
  '977': 'Flag of Saint Barthélemy (local).svg',
  '978': 'Local flag of the Collectivity of Saint Martin.svg',
  '984': 'Flag of the French Southern and Antarctic Lands.svg',
  '986': 'Flag of Wallis and Futuna.svg',
  '987': 'Flag of French Polynesia.svg',
  '988': 'Flags of New Caledonia.svg',
}

// Fallbacks when primary filename fails
const FALLBACKS = {
  '06': 'Blason département fr Alpes-Maritimes (proposé par Robert Louis).svg',
  '2A': 'Blason département fr Corse.svg',
  '2B': 'Blason département fr Corse.svg',
  '22': "Blason 22.svg",
  '23': 'Blason Creuse.svg',
  '24': 'Blason Dordogne 1.svg',
  '47': 'Blason Lot-et-Garonne2.svg',
  '55': 'Blason Meuse.svg',
  '75': 'Grandes Armes de Paris.svg',
  '76': 'Blason76.svg',
  '90': 'Blason Belfort.svg',
  '971': 'Flag of Guadeloupe.svg',
  '974': 'Proposed flag of Réunion (VAR).svg',
  '976': 'Flag of Mayotte.svg',
}

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
  const title = `File:${filename}`
  const api =
    'https://commons.wikimedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      titles: title,
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: '480',
      format: 'json',
    })
  const res = await fetchWithBackoff(api, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`API ${res.status}`)
  const data = await res.json()
  const pages = data.query?.pages ?? {}
  for (const page of Object.values(pages)) {
    if (page.missing != null) return null
    const info = page.imageinfo?.[0]
    return info?.thumburl || info?.url || null
  }
  return null
}

async function download(code, filename) {
  const destSvg = join(OUT, `${code}.svg`)
  const destPng = join(OUT, `${code}.png`)
  if (existsSync(destSvg) && statSync(destSvg).size > 400) return 'skip-svg'
  if (existsSync(destPng) && statSync(destPng).size > 400) return 'skip-png'

  const url = await resolveUrl(filename)
  if (!url) return 'missing'

  const res = await fetchWithBackoff(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
  if (!res.ok) return `http-${res.status}`
  const buf = Buffer.from(await res.arrayBuffer())
  const head = buf.subarray(0, 200).toString('utf8').toLowerCase()
  if (head.includes('<svg') || head.includes('<?xml')) {
    writeFileSync(destSvg, buf)
    return 'svg'
  }
  // PNG / other raster
  writeFileSync(destPng, buf)
  return 'png'
}

async function run() {
  const codes = Object.keys(FILES)
  let ok = 0
  let fail = 0
  for (const code of codes) {
    const names = [FILES[code], FALLBACKS[code]].filter(Boolean)
    let status = 'fail'
    for (const name of names) {
      try {
        status = await download(code, name)
        if (status.startsWith('skip') || status === 'svg' || status === 'png') break
      } catch (e) {
        status = String(e.message || e)
      }
      await sleep(400)
    }
    if (status.startsWith('skip') || status === 'svg' || status === 'png') {
      ok++
      process.stdout.write('.')
    } else {
      fail++
      console.log(`\nFAIL ${code}: ${status}`)
    }
    await sleep(350)
  }
  console.log(`\nok=${ok} fail=${fail} total=${codes.length}`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
