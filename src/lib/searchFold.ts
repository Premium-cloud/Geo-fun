/** Recherche lexique : ignore accents / casse. */
export function foldSearch(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function matchesSearch(haystack: string, needle: string): boolean {
  const q = foldSearch(needle)
  if (!q) return true
  return foldSearch(haystack).includes(q)
}

/** 0 = match exact / préfixe capital, plus bas = mieux. */
export function capitalMatchRank(capital: string, needle: string): number {
  const q = foldSearch(needle)
  if (!q) return 99
  const c = foldSearch(capital)
  if (c === q) return 0
  if (c.startsWith(q)) return 1
  if (c.includes(q)) return 2
  return 99
}
