import { clearSeenBucket, loadSeen, markSeen } from './storage'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Tirage pondéré : favorise les ids jamais sortis (mode Jeu). */
export function pickWeightedId(
  bucket: string,
  ids: string[],
  preferUnseen: boolean,
): string {
  if (!ids.length) throw new Error('empty pool')
  if (!preferUnseen) return shuffle(ids)[0]!

  const seen = new Set(loadSeen()[bucket] ?? [])
  const unseen = ids.filter((id) => !seen.has(id))
  const pool = unseen.length ? unseen : ids
  // si tout vu : reset soft du bucket pour recommencer un cycle
  if (!unseen.length) {
    const pick = shuffle(ids)[0]!
    markSeen(bucket, pick)
    return pick
  }
  const pick = shuffle(pool)[0]!
  markSeen(bucket, pick)
  return pick
}

export function pickWeightedItem<T>(
  bucket: string,
  items: T[],
  idOf: (t: T) => string,
  preferUnseen: boolean,
): T {
  const id = pickWeightedId(
    bucket,
    items.map(idOf),
    preferUnseen,
  )
  return items.find((t) => idOf(t) === id) ?? items[0]!
}
