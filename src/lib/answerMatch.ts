/** Tolérances pour le mode saisie (réponse unique). */

const ALIASES: Record<string, string[]> = {
  paris: ['paris'],
  'wallis-et-futuna': ['wallis et futuna', 'wallis futuna'],
  'polynesie francaise': ['polynesie', 'tahiti'],
  'nouvelle-caledonie': ['nouvelle caledonie', 'kanaky'],
  'saint-pierre-et-miquelon': ['saint pierre et miquelon', 'spm'],
  'la reunion': ['reunion'],
  mayotte: ['mayotte'],
  guadeloupe: ['guadeloupe'],
  martinique: ['martinique'],
  guyane: ['guyane francaise', 'guyane'],
  't.a.a.f.': ['taaf', 't a a f', 'terres australes', 'terres australes et antarctiques'],
  kazakhstan: ['kazakstan', 'kazahstan', 'kazakhstan'],
  'cote divoire': ["cote d'ivoire", 'cote ivoire', 'ivory coast'],
  'etats-unis': ['usa', 'etats unis', 'united states', 'us'],
  'royaume-uni': ['uk', 'grande bretagne', 'angleterre'],
  'emirats arabes unis': ['eau', 'uae', 'emirats'],
  'republique tcheque': ['tchequie', 'czechia'],
  'coree du sud': ['coree sud', 'south korea'],
  'coree du nord': ['coree nord', 'north korea'],
}

export function normalizeAnswer(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/['’`]/g, ' ')
    .replace(/&/g, ' et ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(les?|la|l|le|du|de|des|d)\s+/i, '')
}

function compact(s: string): string {
  return s.replace(/\s+/g, '')
}

function aliasHits(norm: string, targetNorm: string): boolean {
  const key = targetNorm
  const list = ALIASES[key] ?? []
  const n = compact(norm)
  if (list.some((a) => compact(normalizeAnswer(a)) === n)) return true
  // fuzzy: allow missing/extra single letter for long names (Kazakhstan, etc.)
  const t = compact(targetNorm)
  if (t.length >= 8 && n.length >= 7) {
    if (Math.abs(t.length - n.length) <= 1) {
      let miss = 0
      let i = 0
      let j = 0
      while (i < t.length && j < n.length) {
        if (t[i] === n[j]) {
          i++
          j++
        } else {
          miss++
          if (miss > 1) return false
          if (t.length > n.length) i++
          else if (n.length > t.length) j++
          else {
            i++
            j++
          }
        }
      }
      miss += t.length - i + (n.length - j)
      return miss <= 1
    }
  }
  return false
}

export type MatchStrictness = 'loose' | 'strict'

export function answersMatch(
  userInput: string,
  expected: string,
  strictness: MatchStrictness = 'loose',
): boolean {
  const u = normalizeAnswer(userInput)
  const e = normalizeAnswer(expected)
  if (!u || !e) return false
  if (u === e || compact(u) === compact(e)) return true
  if (strictness === 'loose' && aliasHits(u, e)) return true
  if (strictness === 'loose') {
    // tirets / espaces déjà normalisés ; accepter sans article côté attendu
    const e2 = e.replace(/^(les?|la|le|l|du|de|des)\s+/, '')
    if (u === e2 || compact(u) === compact(e2)) return true
  }
  return false
}
