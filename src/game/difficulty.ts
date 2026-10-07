import type { DeptCard } from '../cards/CartesFranceView'
import type { Country } from '../data/countries'
import type { DifficultyId } from '../lib/storage'

export type Difficulty = DifficultyId

export const DIFFICULTY_OPTIONS: { id: Difficulty; label: string }[] = [
  { id: 'facile', label: 'Facile' },
  { id: 'difficile', label: 'Difficile' },
  { id: 'hardcore', label: 'Hardcore' },
]

export const TIMER_SECONDS: Record<Difficulty, number> = {
  facile: 20,
  difficile: 10,
  hardcore: 7,
}

/** Mode Carte : plus de temps pour zoomer / viser. */
export const MAP_TIMER_SECONDS: Record<Difficulty, number> = {
  facile: 35,
  difficile: 25,
  hardcore: 18,
}

export const LIVES_FOR: Record<Difficulty, number> = {
  facile: 3,
  difficile: 3,
  hardcore: 1,
}

/** Pays très reconnus : en facile = souvent éliminables ; en difficile = à éviter. */
const FAMOUS = new Set([
  'FR', 'US', 'ES', 'DE', 'IT', 'GB', 'BR', 'CN', 'JP', 'RU', 'CA', 'MX', 'AU',
  'AR', 'IN', 'PT', 'BE', 'CH', 'NL', 'SE', 'NO', 'PL', 'TR', 'GR', 'EG', 'ZA',
  'KR', 'SA',
])

/** Pays peu connus — injectés pour créer du doute. */
const OBSCURE = new Set([
  'BI', 'MK', 'BT', 'KI', 'TV', 'NR', 'PW', 'MH', 'FM', 'WS', 'TO', 'VU', 'SB',
  'KM', 'ST', 'GW', 'GQ', 'CF', 'TD', 'NE', 'MR', 'DJ', 'ER', 'SS', 'LS', 'SZ',
  'BW', 'NA', 'MW', 'ZM', 'ZW', 'MG', 'TL', 'BN', 'LA', 'KG', 'TJ', 'TM', 'UZ',
  'MN', 'KP', 'YE', 'OM', 'BH', 'QA', 'KW', 'AM', 'AZ', 'GE', 'MD', 'AL', 'ME',
  'BA', 'BY', 'PY', 'BO', 'GY', 'SR', 'BZ', 'HN', 'NI', 'SV', 'GT', 'HT', 'JM',
  'TT', 'BB', 'LC', 'VC', 'GD', 'AG', 'KN', 'DM', 'BS', 'AD', 'MC', 'SM', 'LI',
  'VA', 'MT', 'CY', 'IS', 'LU', 'RW', 'GM', 'SL', 'TG', 'BJ', 'CV', 'SC', 'MU',
])

/** Clusters de drapeaux ressemblants. */
const FLAG_CLUSTERS: string[][] = [
  ['CO', 'EC', 'VE'],
  ['TR', 'TN', 'DZ', 'MA', 'MR', 'AL'],
  ['NL', 'LU', 'RU', 'SI', 'HR', 'SK', 'RS'],
  ['FR', 'IT', 'BE', 'IE', 'RO', 'ML', 'TD'],
  ['CI', 'IE', 'IN', 'NE'],
  ['AU', 'NZ', 'FJ', 'TV'],
  ['NO', 'IS', 'DK', 'SE', 'FI'],
  ['AR', 'UY', 'HN', 'SV', 'NI'],
  ['PE', 'AT', 'LV', 'PL', 'ID', 'MC', 'SG'],
  ['CA', 'PE', 'AT'],
  ['GN', 'ML', 'CM', 'SN', 'BF', 'GH'],
  ['GA', 'CG', 'TD'],
  ['EG', 'IQ', 'SY', 'YE', 'SD'],
  ['JO', 'PS', 'KW', 'AE', 'SD'],
  ['HU', 'IT', 'BG', 'IR'],
  ['CZ', 'PH'],
  ['TH', 'CR'],
  ['US', 'LR', 'MY'],
  ['DE', 'BE', 'UG'],
  ['UA', 'SE'],
  ['RO', 'TD', 'AD', 'MD'],
  ['AM', 'LT'],
  ['BO', 'GH', 'ET'],
  ['PA', 'CR', 'CU'],
  ['GT', 'AR', 'HN'],
  ['KE', 'SS', 'MW', 'SD', 'TZ'],
  ['BI', 'MW', 'LS'],
  ['NG', 'NE'],
  ['JP', 'BD', 'PW'],
  ['KR', 'KP'],
  ['CN', 'VN'],
  ['LA', 'TH', 'KH'],
  ['PK', 'TR', 'TM'],
  ['UZ', 'TM', 'KG'],
  ['MK', 'BG', 'AL'],
  ['BA', 'HR', 'RS', 'ME'],
  ['EE', 'LT', 'LV'],
  ['CH', 'DK'],
  ['MZ', 'MW', 'ZW', 'ZM'],
  ['NA', 'BW'],
  ['DJ', 'ER', 'SO'],
  ['SN', 'ML', 'CM'],
  ['GM', 'SL', 'LR'],
]

const REGION_NEIGHBORS: Record<string, string[]> = {
  "Provence-Alpes-Côte d'Azur": ['Occitanie', 'Auvergne-Rhône-Alpes', 'Corse'],
  Occitanie: ["Provence-Alpes-Côte d'Azur", 'Nouvelle-Aquitaine', 'Auvergne-Rhône-Alpes'],
  'Auvergne-Rhône-Alpes': ["Provence-Alpes-Côte d'Azur", 'Bourgogne-Franche-Comté', 'Occitanie'],
  'Nouvelle-Aquitaine': ['Occitanie', 'Centre-Val de Loire', 'Pays de la Loire'],
  Bretagne: ['Normandie', 'Pays de la Loire'],
  Normandie: ['Bretagne', 'Hauts-de-France', 'Île-de-France'],
  'Hauts-de-France': ['Normandie', 'Grand Est', 'Île-de-France'],
  'Grand Est': ['Hauts-de-France', 'Bourgogne-Franche-Comté', 'Île-de-France'],
  'Bourgogne-Franche-Comté': ['Grand Est', 'Auvergne-Rhône-Alpes', 'Centre-Val de Loire'],
  'Centre-Val de Loire': ['Île-de-France', 'Nouvelle-Aquitaine', 'Pays de la Loire'],
  'Pays de la Loire': ['Bretagne', 'Centre-Val de Loire', 'Nouvelle-Aquitaine'],
  'Île-de-France': ['Centre-Val de Loire', 'Normandie', 'Hauts-de-France'],
  Corse: ["Provence-Alpes-Côte d'Azur", 'Occitanie'],
  Guadeloupe: ['Martinique', 'Saint-Martin', 'Saint-Barthélemy'],
  Martinique: ['Guadeloupe', 'Guyane', 'Saint-Martin'],
  Guyane: ['Martinique', 'Guadeloupe'],
  'La Réunion': ['Mayotte', 'Terres australes'],
  Mayotte: ['La Réunion', 'Terres australes'],
  'Saint-Pierre-et-Miquelon': ['Normandie', 'Bretagne'],
  'Saint-Barthélemy': ['Saint-Martin', 'Guadeloupe'],
  'Saint-Martin': ['Saint-Barthélemy', 'Guadeloupe'],
  'Terres australes': ['La Réunion', 'Mayotte'],
  'Wallis-et-Futuna': ['Polynésie française', 'Nouvelle-Calédonie'],
  'Polynésie française': ['Wallis-et-Futuna', 'Nouvelle-Calédonie'],
  'Nouvelle-Calédonie': ['Polynésie française', 'Wallis-et-Futuna'],
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function pickOne<T>(pool: T[], used: Set<string>, keyOf: (t: T) => string): T | null {
  for (const item of shuffle(pool)) {
    const k = keyOf(item)
    if (!used.has(k)) {
      used.add(k)
      return item
    }
  }
  return null
}

function fillFromPools<T>(
  target: T[],
  n: number,
  pools: T[][],
  used: Set<string>,
  keyOf: (t: T) => string,
): T[] {
  const out = [...target]
  for (const pool of pools) {
    while (out.length < n) {
      const item = pickOne(pool, used, keyOf)
      if (!item) break
      out.push(item)
    }
    if (out.length >= n) break
  }
  return out
}

function codeKey(code: string): number {
  if (code === '2A') return 20.1
  if (code === '2B') return 20.2
  const n = parseInt(code, 10)
  return Number.isFinite(n) ? n : 900
}

function isOverseas(d: DeptCard): boolean {
  return d.group !== 'metro'
}

function isIdfOuter(code: string): boolean {
  return ['91', '92', '93', '94', '95'].includes(code)
}

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
}

function nameToken(name: string): string {
  return stripAccents(name).replace(/^(les?|la|l'|d'|de|du|des)\s+/i, '')
}

function firstLetter(name: string): string {
  return nameToken(name).charAt(0)
}

function sharesNameFamily(a: string, b: string): boolean {
  const ta = nameToken(a)
  const tb = nameToken(b)
  if (ta.slice(0, 4) === tb.slice(0, 4) && ta.length >= 4) return true
  const partsA = ta.split(/[\s-]+/).filter((p) => p.length >= 4)
  const partsB = new Set(tb.split(/[\s-]+/).filter((p) => p.length >= 4))
  return partsA.some((p) => partsB.has(p))
}

function letterDistance(a: string, b: string): number {
  return Math.abs(firstLetter(a).charCodeAt(0) - firstLetter(b).charCodeAt(0))
}

function isFamous(c: Country): boolean {
  return FAMOUS.has(c.code)
}

function isObscure(c: Country): boolean {
  if (FAMOUS.has(c.code)) return false
  if (OBSCURE.has(c.code)) return true
  return /k$/i.test(c.population.trim())
}

function clusterMates(code: string): Set<string> {
  const mates = new Set<string>()
  for (const cluster of FLAG_CLUSTERS) {
    if (cluster.includes(code)) {
      for (const c of cluster) if (c !== code) mates.add(c)
    }
  }
  return mates
}

function metroOnly(answer: DeptCard, d: DeptCard): boolean {
  if (d.code === answer.code) return false
  if (!isOverseas(answer) && isOverseas(d)) return false
  return true
}

/** Pièges durs : même famille de nom, même lettre, codes voisins. */
function deptHardPool(answer: DeptCard, all: DeptCard[]): DeptCard[] {
  const ak = codeKey(answer.code)
  const tight = answer.region === 'Île-de-France' || isIdfOuter(answer.code) ? 2 : 3
  return all.filter((d) => {
    if (!metroOnly(answer, d) && !(isOverseas(answer) && isOverseas(d))) return false
    if (isOverseas(answer) && isOverseas(d)) return true
    // Évite Paris comme piège par défaut pour les 91–95
    if (isIdfOuter(answer.code) && d.code === '75') return false
    if (sharesNameFamily(answer.name, d.name)) return true
    if (firstLetter(answer.name) === firstLetter(d.name)) return true
    if (Math.abs(codeKey(d.code) - ak) <= tight) return true
    return false
  })
}

/** En Difficile/Hardcore : encore plus collé (codes ±1–2 + même région hors Paris pour 9x). */
function deptHarderPool(answer: DeptCard, all: DeptCard[]): DeptCard[] {
  const ak = codeKey(answer.code)
  return all.filter((d) => {
    if (d.code === answer.code) return false
    if (!metroOnly(answer, d) && !(isOverseas(answer) && isOverseas(d))) return false
    if (isIdfOuter(answer.code) && d.code === '75') return false
    if (isOverseas(answer) && isOverseas(d)) return true
    if (Math.abs(codeKey(d.code) - ak) <= 2) return true
    if (sharesNameFamily(answer.name, d.name)) return true
    if (d.region === answer.region && firstLetter(answer.name) === firstLetter(d.name)) return true
    if (d.region === answer.region && Math.abs(codeKey(d.code) - ak) <= 5) return true
    return false
  })
}

function deptSameLetterSoft(answer: DeptCard, all: DeptCard[]): DeptCard[] {
  return all.filter((d) => {
    if (!metroOnly(answer, d)) return false
    if (sharesNameFamily(answer.name, d.name)) return false
    return firstLetter(answer.name) === firstLetter(d.name)
  })
}

function deptSameRegionSoft(answer: DeptCard, all: DeptCard[]): DeptCard[] {
  return all.filter((d) => {
    if (!metroOnly(answer, d)) return false
    if (sharesNameFamily(answer.name, d.name)) return false
    if (Math.abs(codeKey(d.code) - codeKey(answer.code)) <= 2) return false
    // 91–95 : préférer d’autres couronnes, pas Paris
    if (isIdfOuter(answer.code) && d.code === '75') return false
    return d.region === answer.region
  })
}

function deptFarPool(answer: DeptCard, all: DeptCard[]): DeptCard[] {
  const ak = codeKey(answer.code)
  return all.filter((d) => {
    if (d.code === answer.code) return false
    if (!isOverseas(answer) && isOverseas(d)) return false
    if (isOverseas(answer) && !isOverseas(d)) return true
    if (sharesNameFamily(answer.name, d.name)) return false
    if (firstLetter(answer.name) === firstLetter(d.name)) return false
    if (d.region === answer.region) return false
    if (Math.abs(codeKey(d.code) - ak) <= 12) return false
    return letterDistance(answer.name, d.name) >= 3
  })
}

/**
 * Facile : 1 même lettre soft + 1 même région soft + 1 loin
 * Difficile : 3 pièges durs (codes proches / famille)
 * Hardcore : pool encore plus collé (harder)
 */
export function pickDeptDistractors(
  answer: DeptCard,
  all: DeptCard[],
  difficulty: Difficulty,
): DeptCard[] {
  const hard = deptHardPool(answer, all)
  const harder = deptHarderPool(answer, all)
  const softLetter = deptSameLetterSoft(answer, all)
  const softRegion = deptSameRegionSoft(answer, all)
  const far = deptFarPool(answer, all)
  const others = all.filter((d) => d.code !== answer.code && metroOnly(answer, d))
  const used = new Set<string>([answer.code])
  const picked: DeptCard[] = []

  if (difficulty === 'facile') {
    const a = pickOne(softLetter.length ? softLetter : hard, used, (d) => d.code)
    if (a) picked.push(a)
    const b = pickOne(softRegion.length ? softRegion : far, used, (d) => d.code)
    if (b) picked.push(b)
    const c = pickOne(far.length ? far : others, used, (d) => d.code)
    if (c) picked.push(c)
    return fillFromPools(
      picked,
      3,
      [far, softRegion, softLetter, others],
      used,
      (d) => d.code,
    )
  }

  if (isOverseas(answer)) {
    const overseas = all.filter((d) => d.code !== answer.code && isOverseas(d))
    return fillFromPools(
      [],
      3,
      [overseas, harder, hard, others],
      used,
      (d) => d.code,
    )
  }

  if (difficulty === 'hardcore') {
    return fillFromPools([], 3, [harder, hard, softLetter, others], used, (d) => d.code)
  }

  // difficile : priorise harder puis hard
  return fillFromPools([], 3, [harder, hard, softLetter, others], used, (d) => d.code)
}

export function pickRegionDistractors(
  answerRegion: string,
  allRegions: string[],
  difficulty: Difficulty,
): string[] {
  const others = allRegions.filter((r) => r !== answerRegion)
  const neighbors = (REGION_NEIGHBORS[answerRegion] ?? []).filter((r) =>
    others.includes(r),
  )
  const far = others.filter((r) => !neighbors.includes(r))
  const used = new Set<string>([answerRegion])
  const picked: string[] = []

  if (difficulty === 'facile') {
    const a = pickOne(neighbors.length ? neighbors : others, used, (r) => r)
    if (a) picked.push(a)
    return fillFromPools(picked, 3, [far, neighbors, others], used, (r) => r)
  }
  return fillFromPools([], 3, [neighbors, far, others], used, (r) => r)
}

function countryClusterPool(answer: Country, all: Country[]): Country[] {
  const mates = clusterMates(answer.code)
  return all.filter((c) => c.code !== answer.code && mates.has(c.code))
}

function countryContinentPool(answer: Country, all: Country[]): Country[] {
  return all.filter(
    (c) =>
      c.code !== answer.code &&
      c.continent === answer.continent &&
      !isFamous(c),
  )
}

export function pickCountryDistractors(
  answer: Country,
  all: Country[],
  difficulty: Difficulty,
): Country[] {
  const cluster = countryClusterPool(answer, all)
  const continent = countryContinentPool(answer, all)
  const famous = all.filter((c) => c.code !== answer.code && isFamous(c))
  const obscure = all.filter((c) => c.code !== answer.code && isObscure(c))
  const others = all.filter((c) => c.code !== answer.code)
  const nonFamous = others.filter((c) => !isFamous(c))
  const used = new Set<string>([answer.code])
  const picked: Country[] = []

  if (difficulty === 'facile') {
    const f1 = pickOne(famous, used, (c) => c.code)
    if (f1) picked.push(f1)
    const f2 = pickOne(famous, used, (c) => c.code)
    if (f2) picked.push(f2)
    const o = pickOne(obscure, used, (c) => c.code)
    if (o) picked.push(o)
    return fillFromPools(
      picked,
      3,
      [obscure, continent, others],
      used,
      (c) => c.code,
    )
  }

  // Difficile / Hardcore : zéro cadeau célèbre
  const c1 = pickOne(cluster.length ? cluster : continent, used, (c) => c.code)
  if (c1) picked.push(c1)
  const c2 = pickOne(cluster.length ? cluster : continent, used, (c) => c.code)
  if (c2) picked.push(c2)
  const o = pickOne(obscure.length ? obscure : nonFamous, used, (c) => c.code)
  if (o) picked.push(o)
  return fillFromPools(
    picked,
    3,
    [cluster, continent, nonFamous, obscure, others],
    used,
    (c) => c.code,
  )
}
