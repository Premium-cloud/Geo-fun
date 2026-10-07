/** Persistance locale (stats + options). Pas de compte. */

export type DifficultyId = 'facile' | 'difficile' | 'hardcore'
export type AnswerMode = 'qcm' | 'saisie' | 'map'

export type StatsKey = string

export type ModeStats = {
  bestStreak: number
  bestScore: number
  plays: number
  correct: number
  asked: number
  /** Meilleur temps (ms) pour une session Rapidité réussie au bestScore. */
  bestTimeMs?: number
}

export type OptionsState = {
  sound: boolean
  volume: number
  night: boolean
  /** Mode Carte France : inclure les DOM-TOM (silhouettes, sans spoil). */
  mapDomTom: boolean
}

export type SaveBlob = {
  version: 1
  options: OptionsState
  stats: Record<StatsKey, ModeStats>
  seen: Record<string, string[]>
  exportedAt: string
}

const OPTIONS_KEY = 'cartes.options.v1'
const STATS_KEY = 'cartes.stats.v1'
const SEEN_KEY = 'cartes.seen.v1'

export const DEFAULT_OPTIONS: OptionsState = {
  sound: true,
  volume: 0.55,
  night: false,
  mapDomTom: false,
}

function emptyStats(): ModeStats {
  return { bestStreak: 0, bestScore: 0, plays: 0, correct: 0, asked: 0 }
}

export type SessionFormatId = 'libre' | 'session10' | 'rapidite'

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode */
  }
}

export function loadOptions(): OptionsState {
  const o = readJson<Partial<OptionsState>>(OPTIONS_KEY, {})
  return {
    sound: o.sound ?? DEFAULT_OPTIONS.sound,
    volume: typeof o.volume === 'number' ? Math.min(1, Math.max(0, o.volume)) : DEFAULT_OPTIONS.volume,
    night: o.night ?? DEFAULT_OPTIONS.night,
    mapDomTom: o.mapDomTom ?? DEFAULT_OPTIONS.mapDomTom,
  }
}

export function saveOptions(options: OptionsState) {
  writeJson(OPTIONS_KEY, options)
}

export function loadStats(): Record<StatsKey, ModeStats> {
  return readJson(STATS_KEY, {})
}

export function saveStats(stats: Record<StatsKey, ModeStats>) {
  writeJson(STATS_KEY, stats)
}

export function statsKey(
  category: string,
  mode: string,
  difficulty: DifficultyId,
  answerMode: AnswerMode,
  format: SessionFormatId = 'libre',
): StatsKey {
  if (format === 'libre') return `${category}|${mode}|${difficulty}|${answerMode}`
  return `${category}|${mode}|${difficulty}|${answerMode}|${format}`
}

export function getModeStats(key: StatsKey): ModeStats {
  return loadStats()[key] ?? emptyStats()
}

export function recordRun(input: {
  key: StatsKey
  score: number
  asked: number
  streakPeak: number
  timeMs?: number
}) {
  const all = loadStats()
  const cur = all[input.key] ?? emptyStats()
  const nextScore = Math.max(cur.bestScore, input.score)
  let bestTimeMs = cur.bestTimeMs
  if (input.timeMs != null && input.timeMs > 0) {
    if (input.score > cur.bestScore) bestTimeMs = input.timeMs
    else if (input.score === nextScore) {
      bestTimeMs =
        bestTimeMs == null ? input.timeMs : Math.min(bestTimeMs, input.timeMs)
    }
  }
  all[input.key] = {
    bestStreak: Math.max(cur.bestStreak, input.streakPeak),
    bestScore: nextScore,
    plays: cur.plays + 1,
    correct: cur.correct + input.score,
    asked: cur.asked + input.asked,
    bestTimeMs,
  }
  saveStats(all)
  return all[input.key]!
}

/** Met à jour le record de série sans compter une partie (Entraînement). */
export function noteBestStreak(key: StatsKey, streakPeak: number) {
  if (streakPeak <= 0) return
  const all = loadStats()
  const cur = all[key] ?? emptyStats()
  if (streakPeak <= cur.bestStreak) return
  all[key] = { ...cur, bestStreak: streakPeak }
  saveStats(all)
}

export function loadSeen(): Record<string, string[]> {
  return readJson(SEEN_KEY, {})
}

export function markSeen(bucket: string, id: string) {
  const all = loadSeen()
  const list = new Set(all[bucket] ?? [])
  list.add(id)
  all[bucket] = [...list]
  saveSeen(all)
}

export function saveSeen(seen: Record<string, string[]>) {
  writeJson(SEEN_KEY, seen)
}

export function clearSeenBucket(bucket: string) {
  const all = loadSeen()
  delete all[bucket]
  saveSeen(all)
}

export function exportSave(): string {
  const blob: SaveBlob = {
    version: 1,
    options: loadOptions(),
    stats: loadStats(),
    seen: loadSeen(),
    exportedAt: new Date().toISOString(),
  }
  return JSON.stringify(blob, null, 2)
}

export function importSave(raw: string): { ok: true } | { ok: false; error: string } {
  try {
    const data = JSON.parse(raw) as SaveBlob
    if (!data || data.version !== 1) return { ok: false, error: 'Fichier non reconnu.' }
    if (data.options) saveOptions({ ...DEFAULT_OPTIONS, ...data.options })
    if (data.stats && typeof data.stats === 'object') saveStats(data.stats)
    if (data.seen && typeof data.seen === 'object') saveSeen(data.seen)
    return { ok: true }
  } catch {
    return { ok: false, error: 'JSON invalide.' }
  }
}

export function clearAllData() {
  localStorage.removeItem(OPTIONS_KEY)
  localStorage.removeItem(STATS_KEY)
  localStorage.removeItem(SEEN_KEY)
}

export function applyNightClass(night: boolean) {
  document.documentElement.classList.toggle('is-night', night)
  document.documentElement.style.colorScheme = night ? 'dark' : 'light'
}
