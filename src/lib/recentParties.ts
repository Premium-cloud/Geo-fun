/** Ratés des dernières parties, pour la section Apprendre → Les erreurs. */

export type MissItem = {
  itemId: string
  label: string
  category: string
  mode: string
  packId?: string
}

type Party = {
  at: number
  misses: MissItem[]
}

const KEY = 'cartes.parties.v1'
const MAX_PARTIES = 10

function read(): Party[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Party[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(parties: Party[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(parties.slice(-MAX_PARTIES)))
  } catch {
    /* quota */
  }
}

export function recordParty(misses: MissItem[]) {
  const unique: MissItem[] = []
  const seen = new Set<string>()
  for (const miss of misses) {
    if (!miss.itemId || seen.has(miss.itemId)) continue
    seen.add(miss.itemId)
    unique.push(miss)
  }
  write([...read(), { at: Date.now(), misses: unique }])
}

/** Ratés distincts, de la partie la plus récente à la plus ancienne. */
export function recentMisses(): MissItem[] {
  const out: MissItem[] = []
  const seen = new Set<string>()
  const parties = read().slice(-MAX_PARTIES)
  for (let i = parties.length - 1; i >= 0; i--) {
    for (const miss of parties[i]?.misses ?? []) {
      if (!miss?.itemId || seen.has(miss.itemId)) continue
      seen.add(miss.itemId)
      out.push(miss)
    }
  }
  return out
}
