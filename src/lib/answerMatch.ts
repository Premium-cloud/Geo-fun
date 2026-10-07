/** Tolérances pour le mode saisie (réponse unique). */

const ALIASES: Record<string, string[]> = {
  paris: ['paris'],
  'wallis et futuna': ['wallis futuna', 'wallisetfutuna'],
  'polynesie francaise': ['polynesie', 'tahiti'],
  'nouvelle caledonie': ['nouvellecaledonie', 'kanaky'],
  'saint pierre et miquelon': ['saint pierre miquelon', 'spm'],
  reunion: ['la reunion'],
  't a a f': ['taaf', 'terres australes', 'terres australes et antarctiques'],
  kazakhstan: ['kazakstan', 'kazahstan'],
  'cote divoire': ['cote ivoire', 'ivory coast'],
  'etats unis': ['usa', 'united states', 'us', 'etatsunis'],
  'royaume uni': ['uk', 'grande bretagne', 'angleterre'],
  'emirats arabes unis': ['eau', 'uae', 'emirats'],
  'republique tcheque': ['tchequie', 'czechia'],
  'coree du sud': ['coree sud', 'south korea'],
  'coree du nord': ['coree nord', 'north korea'],
  somme: ['some'],
  herault: ['heraut', 'herault'],
  'hautes alpes': ['haute alpes', 'hautesalpes'],
  'haute savoie': ['haute savoie', 'hautesavoie'],
  'loire atlantique': ['loire atlantique', 'loireatlantique'],
  'seine maritime': ['seine maritime'],
  'pyrenees orientales': ['pyrenees orientale', 'pyreneesorientales'],
  'bouches du rhone': ['bouche du rhone', 'bouches du rhone'],
}

export function normalizeAnswer(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’`]/g, ' ')
    .replace(/&/g, ' et ')
    // tirets / ponctuation → espaces (accepte "-" faux ou absents)
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(les?|la|l|le|du|de|des|d)\s+/i, '')
}

/** Compacte + réduit les doubles consonnes (some ≈ somme). */
export function softenSpelling(s: string): string {
  return s
    .replace(/\s+/g, '')
    .replace(/([bcdfghjklmnpqrstvwxz])\1+/g, '$1')
}

function compact(s: string): string {
  return s.replace(/\s+/g, '')
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const prev = new Array<number>(b.length + 1)
  const cur = new Array<number>(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    cur[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      cur[j] = Math.min(
        (prev[j] ?? 0) + 1,
        (cur[j - 1] ?? 0) + 1,
        (prev[j - 1] ?? 0) + cost,
      )
    }
    for (let j = 0; j <= b.length; j++) prev[j] = cur[j] ?? 0
  }
  return prev[b.length] ?? 99
}

function maxEdits(len: number, strictness: MatchStrictness): number {
  if (strictness === 'hardcore') return 0
  if (strictness === 'strict') {
    if (len <= 5) return 0
    if (len <= 10) return 1
    return 1
  }
  // loose (Facile)
  if (len <= 5) return 1
  if (len <= 10) return 2
  return 2
}

function fuzzyClose(user: string, expected: string, strictness: MatchStrictness): boolean {
  const u = softenSpelling(user)
  const e = softenSpelling(expected)
  if (!u || !e) return false
  if (u === e) return true
  const dist = levenshtein(u, e)
  const allowed = maxEdits(Math.max(u.length, e.length), strictness)
  return dist <= allowed
}

function aliasHits(norm: string, targetNorm: string): boolean {
  const key = targetNorm
  const list = ALIASES[key] ?? []
  const n = softenSpelling(norm)
  if (list.some((a) => softenSpelling(normalizeAnswer(a)) === n)) return true
  // aussi chercher si la clé alias matche après soften
  for (const [canon, alts] of Object.entries(ALIASES)) {
    if (softenSpelling(canon) === softenSpelling(targetNorm)) {
      if (alts.some((a) => softenSpelling(normalizeAnswer(a)) === n)) return true
      if (softenSpelling(canon) === n) return true
    }
  }
  return false
}

export type MatchStrictness = 'loose' | 'strict' | 'hardcore'

export function answersMatch(
  userInput: string,
  expected: string,
  strictness: MatchStrictness = 'loose',
): boolean {
  const u = normalizeAnswer(userInput)
  const e = normalizeAnswer(expected)
  if (!u || !e) return false

  // égalité exacte après normalisation (tirets/espaces déjà unifiés)
  if (u === e || compact(u) === compact(e)) return true

  // sans article côté attendu
  const e2 = e.replace(/^(les?|la|le|l|du|de|des)\s+/, '')
  if (u === e2 || compact(u) === compact(e2)) return true

  // Hardcore : pas de doubles lettres / fuzzy — accents & tirets seulement
  if (strictness === 'hardcore') {
    return aliasHits(u, e) || aliasHits(u, e2)
  }

  if (softenSpelling(u) === softenSpelling(e)) return true
  if (softenSpelling(u) === softenSpelling(e2)) return true

  if (aliasHits(u, e) || aliasHits(u, e2)) return true

  // fuzzy orthographe (some/somme, heraut/herault…)
  if (fuzzyClose(u, e, strictness) || fuzzyClose(u, e2, strictness)) return true

  return false
}
