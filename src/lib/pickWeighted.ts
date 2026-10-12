import { loadSeen, saveSeen } from './storage'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Combien d’items récemment tirés à tenir éloignés du début du prochain cycle. */
export function cooldownSize(poolSize: number): number {
  if (poolSize <= 4) return 1
  if (poolSize <= 12) return Math.max(2, Math.floor(poolSize / 3))
  if (poolSize <= 30) return Math.max(4, Math.floor(poolSize / 4))
  return Math.min(16, Math.floor(poolSize / 5))
}

/**
 * Sac sans remise :
 * — `cartes.seen` stocke l’ordre de tirage du cycle en cours (déjà sortis)
 * — `cartes.bag` stocke la file restante (tête = prochain)
 * — au recyclage, les derniers tirés partent en queue
 */
const BAG_KEY = 'cartes.bag.v1'

type BagStore = Record<string, string[]>

function loadBags(): BagStore {
  try {
    const raw = localStorage.getItem(BAG_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as BagStore
  } catch {
    return {}
  }
}

function saveBags(bags: BagStore) {
  try {
    localStorage.setItem(BAG_KEY, JSON.stringify(bags))
  } catch {
    /* quota / private mode */
  }
}

function buildBag(ids: string[], recent: string[], exclude: Set<string>): string[] {
  const recentSet = new Set(recent)
  const head = shuffle(ids.filter((id) => !recentSet.has(id) && !exclude.has(id)))
  const tail = shuffle(ids.filter((id) => recentSet.has(id) && !exclude.has(id)))
  const bag = [...head, ...tail]
  if (bag.length) return bag
  const fallback = shuffle(ids.filter((id) => !exclude.has(id)))
  return fallback.length ? fallback : shuffle(ids)
}

/**
 * Tirage sans remise (sac).
 * `preferUnseen` false = soft (évite seulement les récents), true = cycle complet.
 */
export function pickWeightedId(
  bucket: string,
  ids: string[],
  preferUnseen: boolean,
  excludeIds: readonly string[] = [],
): string {
  if (!ids.length) throw new Error('empty pool')

  const idSet = new Set(ids)
  const exclude = new Set(excludeIds.filter((id) => idSet.has(id)))
  const k = cooldownSize(ids.length)
  const seenAll = loadSeen()
  const drawn = (seenAll[bucket] ?? []).filter((id) => idSet.has(id))

  if (!preferUnseen) {
    const recent = new Set(drawn.slice(-k))
    const softPool = ids.filter((id) => !exclude.has(id) && !recent.has(id))
    const pool = softPool.length ? softPool : ids.filter((id) => !exclude.has(id))
    const pick = shuffle(pool.length ? pool : ids)[0]!
    seenAll[bucket] = [...drawn.filter((id) => id !== pick), pick].slice(-Math.max(k * 2, 8))
    saveSeen(seenAll)
    return pick
  }

  const bags = loadBags()
  let bag = (bags[bucket] ?? []).filter((id) => idSet.has(id) && !exclude.has(id))

  // Reconstruire si sac vide ou désynchronisé (nouveaux ids / pool réduit)
  if (!bag.length) {
    const recent = drawn.slice(-k)
    bag = buildBag(ids, recent, exclude)
    seenAll[bucket] = []
    saveSeen(seenAll)
  }

  const pick = bag[0]!
  bag = bag.slice(1)
  bags[bucket] = bag
  saveBags(bags)

  const nextDrawn = [...(loadSeen()[bucket] ?? []).filter((id) => idSet.has(id) && id !== pick), pick]
  const seenNext = loadSeen()
  seenNext[bucket] = nextDrawn
  saveSeen(seenNext)

  return pick
}

export function pickWeightedItem<T>(
  bucket: string,
  items: T[],
  idOf: (t: T) => string,
  preferUnseen: boolean,
  excludeIds: readonly string[] = [],
): T {
  const id = pickWeightedId(
    bucket,
    items.map(idOf),
    preferUnseen,
    excludeIds,
  )
  return items.find((t) => idOf(t) === id) ?? items[0]!
}
