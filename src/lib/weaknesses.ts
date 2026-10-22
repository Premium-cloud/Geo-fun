/** Scores locaux, question par question. L’écran Apprendre lit les parties, pas ce score. */

export type WeakEntry = {
  id: string
  label: string
  /** pays | capitale | territoires | departements | mixte */
  bucket: string
  wrong: number
  right: number
  updatedAt: number
}

const KEY = 'cartes.weak.v1'

type Store = Record<string, WeakEntry>

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Store
  } catch {
    return {}
  }
}

function write(store: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch {
    /* quota */
  }
}

/** Score de « faiblesse » : erreurs récentes pèsent plus. */
function weaknessScore(e: WeakEntry): number {
  const net = e.wrong - e.right * 0.6
  const ageDays = (Date.now() - e.updatedAt) / (1000 * 60 * 60 * 24)
  const freshness = Math.max(0.35, 1.2 - ageDays * 0.08)
  return Math.max(0, net) * freshness
}

export function recordAnswerOutcome(input: {
  id: string
  label: string
  bucket: string
  ok: boolean
}) {
  if (!input.id || input.id.startsWith('__')) return
  const store = read()
  const cur = store[input.id] ?? {
    id: input.id,
    label: input.label,
    bucket: input.bucket,
    wrong: 0,
    right: 0,
    updatedAt: Date.now(),
  }
  if (input.ok) cur.right += 1
  else cur.wrong += 1
  cur.label = input.label
  cur.bucket = input.bucket
  cur.updatedAt = Date.now()
  // Oublie si bien maîtrisé
  if (cur.right >= cur.wrong + 3 && cur.wrong <= 1) {
    delete store[input.id]
  } else {
    store[input.id] = cur
  }
  write(store)
}

export function topWeaknesses(limit = 12): WeakEntry[] {
  return Object.values(read())
    .filter((e) => e.wrong > 0 && weaknessScore(e) > 0.2)
    .sort((a, b) => weaknessScore(b) - weaknessScore(a))
    .slice(0, limit)
}

export function weaknessCount(): number {
  return topWeaknesses(50).length
}

/** Codes pays (2 lettres) parmi les faiblesses. */
export function weakCountryCodes(limit = 16): string[] {
  return topWeaknesses(40)
    .map((e) => e.id)
    .filter((id) => /^[A-Z]{2}$/i.test(id))
    .map((id) => id.toUpperCase())
    .slice(0, limit)
}
