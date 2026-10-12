/**
 * Progression locale — profil, crédits, pack global → album, trophées.
 * Lexique = catalogue (tout visible, rien “possédé”).
 * Album = cartes débloquées via packs (accès si tu en as au moins une).
 * Pack = tirage sur TOUTES les cartes (pas de thème / zone).
 */

import { COUNTRIES } from '../data/countries'
import { TERRITORY_PACKS, TERRITORY_PACK_ORDER } from '../data/territories'

export type TrophyTier = 'bronze' | 'argent' | 'or'
export type DifficultyId = 'facile' | 'difficile' | 'hardcore'
export type CardRegion = 'france' | 'monde' | 'territoires'

export type CollectibleCard = {
  id: string
  name: string
  sub: string
  region: CardRegion
  image?: string
}

export type ProgressState = {
  points: number
  packsOpened: number
  /** id → nombre d’exemplaires (1 = album, >1 = doublons défaussables). */
  cardCounts: Record<string, number>
  trophies: Record<string, string>
  perfectCats: Record<DifficultyId, string[]>
  duelWins: number
  onboardingDone: boolean
  pseudo: string
  color: string
  /** Crédits de test déjà versés une fois. */
  starterCreditsGranted?: boolean
}

const KEY = 'cartes.progress.v1'
export const PACK_COST = 80
export const DUP_DISCARD_CREDIT = 5
export const POINTS_PER_CORRECT = 10
export const PERFECT_BONUS = 40
export const CARDS_PER_PACK = 3
export const STARTER_CREDITS = 400

export const PROFILE_COLORS = [
  '#c4473a',
  '#1f6f8b',
  '#2a9d8f',
  '#c47b3a',
  '#3a4f7a',
  '#3e6b4f',
  '#8c3a4b',
  '#d4a017',
] as const

export type TrophyDef = {
  id: string
  title: string
  blurb: string
  tier: TrophyTier
  stub?: boolean
}

export const TROPHIES: TrophyDef[] = [
  { id: 'facile_1', title: 'Sans-faute facile', blurb: '1 catégorie en facile', tier: 'bronze' },
  { id: 'facile_5', title: 'Explorateur facile', blurb: '5 catégories en facile', tier: 'argent' },
  { id: 'facile_all', title: 'Maître facile', blurb: 'Toutes les catégories en facile', tier: 'or' },
  { id: 'difficile_1', title: 'Sans-faute difficile', blurb: '1 catégorie en difficile', tier: 'bronze' },
  { id: 'difficile_5', title: 'Explorateur difficile', blurb: '5 catégories en difficile', tier: 'argent' },
  { id: 'difficile_all', title: 'Maître difficile', blurb: 'Toutes les catégories en difficile', tier: 'or' },
  { id: 'hardcore_1', title: 'Sans-faute hardcore', blurb: '1 catégorie en hardcore', tier: 'bronze' },
  { id: 'hardcore_5', title: 'Explorateur hardcore', blurb: '5 catégories en hardcore', tier: 'argent' },
  { id: 'hardcore_all', title: 'Maître hardcore', blurb: 'Toutes les catégories en hardcore', tier: 'or' },
  { id: 'duel_1', title: 'Première victoire', blurb: 'Battre 1 adversaire en duel', tier: 'bronze' },
  { id: 'duel_5', title: 'Challenger', blurb: 'Battre 5 adversaires', tier: 'argent' },
  { id: 'duel_10', title: 'Champion du salon', blurb: 'Battre 10 adversaires', tier: 'or' },
  { id: 'duel_ia', title: 'Dominer l’IA', blurb: 'Battre l’IA en duel — bientôt', tier: 'or', stub: true },
  { id: 'collec_start', title: 'Collectionneur', blurb: 'Ouvrir ton premier pack', tier: 'bronze' },
  { id: 'collec_mid', title: 'Album en cours', blurb: '20 cartes dans l’album', tier: 'argent' },
  { id: 'collec_all', title: 'Collection complète', blurb: 'Toutes les cartes — bientôt', tier: 'or', stub: true },
]

const QUIZ_CATS = ['pays', 'capitale', 'territoires', 'mixte'] as const

let catalogCache: CollectibleCard[] | null = null

export function getCardCatalog(): CollectibleCard[] {
  if (catalogCache) return catalogCache
  const cards: CollectibleCard[] = []

  for (const u of TERRITORY_PACKS.fr.units) {
    cards.push({
      id: `fr:${u.code}`,
      name: u.name,
      sub: `${u.code} · ${u.capital}`,
      region: 'france',
      image: `/blasons/${u.code}.png`,
    })
  }

  for (const pid of TERRITORY_PACK_ORDER) {
    if (pid === 'fr') continue
    const pack = TERRITORY_PACKS[pid]
    for (const u of pack.units) {
      const base = `/mockups/emblems/${pid}/${u.code}`
      cards.push({
        id: `${pid}:${u.code}`,
        name: u.name,
        sub: `${pack.country} · ${u.code}`,
        region: 'territoires',
        // png en priorité (plus souvent présent) — le thumb fallback gère l’échec
        image: pack.emblemKind === 'flag' ? `${base}.png` : `${base}.svg`,
      })
    }
  }

  for (const c of COUNTRIES) {
    cards.push({
      id: `monde:${c.code}`,
      name: c.name,
      sub: c.capital,
      region: 'monde',
      image: `/flags/${c.code.toLowerCase()}.svg`,
    })
  }

  catalogCache = cards
  return cards
}

export function cardById(id: string): CollectibleCard | undefined {
  return getCardCatalog().find((c) => c.id === id)
}

export function uniqueOwnedCount(state: ProgressState): number {
  return Object.keys(state.cardCounts).filter((id) => (state.cardCounts[id] ?? 0) > 0).length
}

export function albumUnlocked(state: ProgressState): boolean {
  return uniqueOwnedCount(state) > 0
}

function defaultState(): ProgressState {
  return {
    points: 0,
    packsOpened: 0,
    cardCounts: {},
    trophies: {},
    perfectCats: { facile: [], difficile: [], hardcore: [] },
    duelWins: 0,
    onboardingDone: false,
    pseudo: '',
    color: PROFILE_COLORS[0],
    starterCreditsGranted: false,
  }
}

function migrateCounts(
  parsed: Partial<ProgressState> & { cardsOwned?: string[] },
): Record<string, number> {
  if (parsed.cardCounts && typeof parsed.cardCounts === 'object') {
    return { ...parsed.cardCounts }
  }
  const counts: Record<string, number> = {}
  for (const id of parsed.cardsOwned ?? []) {
    counts[id] = (counts[id] ?? 0) + 1
  }
  return counts
}

function migrateProfile(parsed: Partial<ProgressState>): {
  pseudo: string
  color: string
} {
  const base = defaultState()
  if (parsed.pseudo && parsed.pseudo.trim()) {
    const colors = PROFILE_COLORS as readonly string[]
    return {
      pseudo: parsed.pseudo.trim().slice(0, 20),
      color: parsed.color && colors.includes(parsed.color) ? parsed.color : base.color,
    }
  }
  return { pseudo: '', color: base.color }
}

function read(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<ProgressState> & { cardsOwned?: string[] }
    const base = defaultState()
    const profile = migrateProfile(parsed)
    let state: ProgressState = {
      ...base,
      ...parsed,
      ...profile,
      cardCounts: migrateCounts(parsed),
      perfectCats: {
        facile: parsed.perfectCats?.facile ?? [],
        difficile: parsed.perfectCats?.difficile ?? [],
        hardcore: parsed.perfectCats?.hardcore ?? [],
      },
      trophies: parsed.trophies ?? {},
      starterCreditsGranted: Boolean(parsed.starterCreditsGranted),
    }
    // Crédit de test une seule fois
    if (!state.starterCreditsGranted) {
      state = {
        ...state,
        points: state.points + STARTER_CREDITS,
        starterCreditsGranted: true,
      }
      write(state)
    }
    return state
  } catch {
    return defaultState()
  }
}

function write(state: ProgressState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

export function loadProgress(): ProgressState {
  return read()
}

export function saveProgress(state: ProgressState) {
  write(state)
}

export function clearProgress() {
  localStorage.removeItem(KEY)
}

/** Force un crédit (dev / test). */
export function grantCredits(amount: number): ProgressState {
  const state = { ...read(), points: read().points + amount }
  write(state)
  return state
}

export function profileInitial(pseudo: string): string {
  const t = pseudo.trim()
  if (!t) return '?'
  return t[0]!.toUpperCase()
}

export function profileLabel(state: ProgressState): string {
  const t = state.pseudo.trim()
  return t || 'Ton profil'
}

export function setProfile(input: { pseudo: string; color: string }): ProgressState {
  const colors = PROFILE_COLORS as readonly string[]
  const color = colors.includes(input.color) ? input.color : PROFILE_COLORS[0]
  const state: ProgressState = {
    ...read(),
    pseudo: input.pseudo.trim().slice(0, 20),
    color,
  }
  write(state)
  return state
}

function unlock(state: ProgressState, id: string): ProgressState {
  if (state.trophies[id]) return state
  return {
    ...state,
    trophies: { ...state.trophies, [id]: new Date().toISOString() },
  }
}

function evalPerfectTrophies(state: ProgressState, diff: DifficultyId): ProgressState {
  const n = new Set(state.perfectCats[diff]).size
  let next = state
  if (n >= 1) next = unlock(next, `${diff}_1`)
  if (n >= 5) next = unlock(next, `${diff}_5`)
  if (n >= QUIZ_CATS.length) next = unlock(next, `${diff}_all`)
  return next
}

function evalDuelTrophies(state: ProgressState): ProgressState {
  let next = state
  if (state.duelWins >= 1) next = unlock(next, 'duel_1')
  if (state.duelWins >= 5) next = unlock(next, 'duel_5')
  if (state.duelWins >= 10) next = unlock(next, 'duel_10')
  return next
}

function evalCollectionTrophies(state: ProgressState): ProgressState {
  let next = state
  if (state.packsOpened >= 1) next = unlock(next, 'collec_start')
  if (uniqueOwnedCount(state) >= 20) next = unlock(next, 'collec_mid')
  return next
}

export function recordQuizFinish(input: {
  category: string
  difficulty: DifficultyId
  score: number
  asked: number
  countPerfect: boolean
}): { state: ProgressState; gained: number; newTrophies: string[] } {
  const before = read()
  const gained =
    input.score * POINTS_PER_CORRECT +
    (input.countPerfect && input.asked > 0 && input.score === input.asked
      ? PERFECT_BONUS
      : 0)
  let state: ProgressState = { ...before, points: before.points + gained }
  const prevKeys = new Set(Object.keys(before.trophies))

  if (
    input.countPerfect &&
    input.asked >= 5 &&
    input.score === input.asked &&
    (QUIZ_CATS as readonly string[]).includes(input.category)
  ) {
    const list = new Set(state.perfectCats[input.difficulty])
    list.add(input.category)
    state = {
      ...state,
      perfectCats: {
        ...state.perfectCats,
        [input.difficulty]: [...list],
      },
    }
    state = evalPerfectTrophies(state, input.difficulty)
  }

  write(state)
  const newTrophies = Object.keys(state.trophies).filter((id) => !prevKeys.has(id))
  return { state, gained, newTrophies }
}

export function recordDuelWin(): ProgressState {
  let state = read()
  state = { ...state, duelWins: state.duelWins + 1 }
  state = evalDuelTrophies(state)
  write(state)
  return state
}

export function setOnboardingDone(): ProgressState {
  const state = { ...read(), onboardingDone: true }
  write(state)
  return state
}

export type PackDraw = {
  card: CollectibleCard
  duplicate: boolean
}

export type PackResult =
  | { ok: true; draws: PackDraw[]; state: ProgressState }
  | { ok: false; reason: 'points' | 'empty' }

/** Pack global : 3 tirages au hasard sur tout le catalogue. */
export function openPack(): PackResult {
  const before = read()
  if (before.points < PACK_COST) return { ok: false, reason: 'points' }
  const pool = getCardCatalog()
  if (pool.length < 1) return { ok: false, reason: 'empty' }

  const draws: PackDraw[] = []
  const counts = { ...before.cardCounts }

  for (let i = 0; i < CARDS_PER_PACK; i++) {
    const pick = pool[Math.floor(Math.random() * pool.length)]!
    const prev = counts[pick.id] ?? 0
    const duplicate = prev > 0
    counts[pick.id] = prev + 1
    draws.push({ card: pick, duplicate })
  }

  let state: ProgressState = {
    ...before,
    points: before.points - PACK_COST,
    packsOpened: before.packsOpened + 1,
    cardCounts: counts,
  }
  state = evalCollectionTrophies(state)
  write(state)
  return { ok: true, draws, state }
}

/** Défausse 1 doublon (count > 1) → +DUP_DISCARD_CREDIT. */
export function discardDuplicate(cardId: string): ProgressState | null {
  const before = read()
  const n = before.cardCounts[cardId] ?? 0
  if (n < 2) return null
  const counts = { ...before.cardCounts, [cardId]: n - 1 }
  const state: ProgressState = {
    ...before,
    cardCounts: counts,
    points: before.points + DUP_DISCARD_CREDIT,
  }
  write(state)
  return state
}

export function trophyLevel(state: ProgressState): number {
  return Object.keys(state.trophies).length
}

export function canOpenPack(state: ProgressState = read()): boolean {
  return state.points >= PACK_COST
}

export type OwnedEntry = CollectibleCard & { count: number }

export function ownedCards(state: ProgressState = read()): OwnedEntry[] {
  const map = new Map(getCardCatalog().map((c) => [c.id, c]))
  const list: OwnedEntry[] = []
  for (const [id, count] of Object.entries(state.cardCounts)) {
    if (count < 1) continue
    const card = map.get(id)
    if (card) list.push({ ...card, count })
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
}
