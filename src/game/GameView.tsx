import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { DEPT_CARDS } from '../cards/CartesFranceView'
import { COUNTRIES } from '../data/countries'
import {
  TERRITORY_PACK_ORDER,
  TERRITORY_PACKS,
  type TerritoryPackId,
} from '../data/territories'
import { answersMatch } from '../lib/answerMatch'
import { feedbackLine } from '../lib/feedbackCopy'
import { pickWeightedItem } from '../lib/pickWeighted'
import {
  loadProgress,
  PACK_COST,
  recordQuizFinish,
  type ProgressState,
} from '../lib/progression'
import {
  recordAnswerOutcome,
  weakCountryCodes,
  weaknessCount,
} from '../lib/weaknesses'
import {
  getModeStats,
  loadOptions,
  noteBestStreak,
  recordRun,
  statsKey,
  type AnswerMode,
  type SessionFormatId,
} from '../lib/storage'
import {
  DIFFICULTY_OPTIONS,
  LIVES_FOR,
  MAP_TIMER_SECONDS,
  TIMER_SECONDS,
  pickCountryDistractors,
  pickDeptDistractors,
  pickRegionDistractors,
  type Difficulty,
} from './difficulty'
import { FranceMapQuiz } from './FranceMapQuiz'
import { WORLD_MAP_CODES } from './mapCodes'
import { TerritoryMapQuiz } from './TerritoryMapQuiz'
import {
  defaultTerritoryMode,
  makeTerritoryRound,
  territoryEmblemUrl,
  territoryModesFor,
  type TerritoryMode,
} from './territoryModes'
import { WorldMapQuiz } from './WorldMapQuiz'
import { FilterLine } from '../ui/FilterLine'
import './GameView.css'

type Category = 'departements' | 'pays' | 'capitale' | 'territoires' | 'mixte'

type DeptMode = 'chiffre' | 'chefLieu' | 'blason' | 'region' | 'carte'
type PaysMode = 'flagToName' | 'nameToFlag' | 'capitalToName' | 'capitalToFlag' | 'carte'
type CapitaleMode = 'flagToCapital' | 'nameToCapital'
type Mode = DeptMode | PaysMode | CapitaleMode | TerritoryMode

const SESSION_LEN = 10
/** Départements FR = pack Territoires → France (plus de catégorie dédiée). */
const BASE_CATEGORIES: Category[] = ['pays', 'capitale', 'territoires']

type ChoiceKind = 'text' | 'flag' | 'saisie' | 'map'

type Round = {
  prompt: string
  show:
    | 'code'
    | 'chefLieu'
    | 'blason'
    | 'flag'
    | 'name'
    | 'capital'
    | 'deptName'
    | 'mapPrompt'
    | 'territoryEmblem'
  showValue?: string
  showCode?: string
  answer: string
  choices: string[]
  choiceKind: ChoiceKind
  answerLabel: string
  itemId: string
  mapKind?: 'france' | 'world' | 'territory'
  territoryPackId?: TerritoryPackId
}

const DEPT_MODES: { id: DeptMode; label: string }[] = [
  { id: 'chiffre', label: 'Par chiffre' },
  { id: 'chefLieu', label: 'Par chef-lieu' },
  { id: 'blason', label: 'Par blason' },
  { id: 'region', label: 'Par région' },
  { id: 'carte', label: 'Carte' },
]

const PAYS_MODES: { id: PaysMode; label: string }[] = [
  { id: 'flagToName', label: 'Par drapeau' },
  { id: 'nameToFlag', label: 'Par nom' },
  { id: 'capitalToName', label: 'Par capitale' },
  { id: 'capitalToFlag', label: 'Par capitale (drapeau)' },
  { id: 'carte', label: 'Carte' },
]

const MAP_COUNTRIES = COUNTRIES.filter((c) => WORLD_MAP_CODES.has(c.code))
const METRO_DEPTS = DEPT_CARDS.filter((d) => d.group === 'metro')

const CAPITALE_MODES: { id: CapitaleMode; label: string }[] = [
  { id: 'nameToCapital', label: 'Par nom' },
  { id: 'flagToCapital', label: 'Par drapeau' },
]

const CATEGORY_LABEL: Record<Category, string> = {
  departements: 'Départements',
  pays: 'Pays',
  capitale: 'Capitales',
  territoires: 'Territoires',
  mixte: 'MIX',
}

const FORMAT_LABEL: Record<SessionFormatId, string> = {
  libre: 'Libre',
  session10: '10 questions',
  rapidite: 'Rapidité',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function flagUrl(code: string): string {
  return `/flags/${code.toLowerCase()}.svg`
}

function blasonSrc(code: string): string {
  return `/blasons/${code}.png`
}

function modesFor(cat: Category, packId: TerritoryPackId = 'fr') {
  if (cat === 'mixte') return [] as { id: Mode; label: string }[]
  if (cat === 'departements') return DEPT_MODES
  if (cat === 'pays') return PAYS_MODES
  if (cat === 'territoires') return territoryModesFor(packId)
  return CAPITALE_MODES
}

function defaultMode(cat: Category, packId: TerritoryPackId = 'fr'): Mode {
  if (cat === 'mixte') return 'chiffre'
  if (cat === 'capitale') return 'nameToCapital'
  if (cat === 'pays') return 'flagToName'
  if (cat === 'territoires') return defaultTerritoryMode(packId)
  return modesFor(cat, packId)[0]!.id
}

function allRegions(): string[] {
  return [...new Set(DEPT_CARDS.map((d) => d.region))]
}

function sortAlpha(choices: string[]): string[] {
  return [...choices].sort((a, b) =>
    a.localeCompare(b, 'fr', { sensitivity: 'base' }),
  )
}

function beep(ok: boolean) {
  const opts = loadOptions()
  if (!opts.sound) return
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = ok ? 660 : 180
    g.gain.value = opts.volume * 0.08
    o.connect(g)
    g.connect(ctx.destination)
    o.start()
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18)
    o.stop(ctx.currentTime + 0.2)
    window.setTimeout(() => ctx.close(), 300)
  } catch {
    /* ignore */
  }
}

function makeDeptRound(
  mode: DeptMode,
  difficulty: Difficulty,
  preferUnseen: boolean,
  answerMode: AnswerMode,
  includeDomTom: boolean,
): Round | null {
  if (mode === 'carte') {
    const pool = includeDomTom ? DEPT_CARDS : METRO_DEPTS
    if (pool.length < 4) return null
    const card = pickWeightedItem(
      includeDomTom ? `dept:carte:dom` : `dept:carte`,
      pool,
      (d) => d.code,
      preferUnseen,
    )
    return {
      prompt: 'Où se trouve ce département ?',
      show: 'mapPrompt',
      showValue: card.name,
      showCode: card.code,
      answer: card.code,
      choices: [],
      choiceKind: 'map',
      answerLabel: `${card.code} — ${card.name}`,
      itemId: card.code,
      mapKind: 'france',
    }
  }

  if (DEPT_CARDS.length < 4) return null
  const card = pickWeightedItem(
    `dept:${mode}`,
    DEPT_CARDS,
    (d) => d.code,
    preferUnseen,
  )

  const distractors = pickDeptDistractors(card, DEPT_CARDS, difficulty)
  const saisie = answerMode === 'saisie'

  if (mode === 'chiffre') {
    const answer = card.name
    return {
      prompt: 'Quel département ?',
      show: 'code',
      showValue: card.code,
      answer,
      choices: saisie ? [] : sortAlpha([answer, ...distractors.map((d) => d.name)]),
      choiceKind: saisie ? 'saisie' : 'text',
      answerLabel: answer,
      itemId: card.code,
    }
  }

  if (mode === 'chefLieu') {
    const answer = card.name
    return {
      prompt: 'Quel département ?',
      show: 'chefLieu',
      showValue: card.chefLieu,
      answer,
      choices: saisie ? [] : sortAlpha([answer, ...distractors.map((d) => d.name)]),
      choiceKind: saisie ? 'saisie' : 'text',
      answerLabel: answer,
      itemId: card.code,
    }
  }

  if (mode === 'blason') {
    const answer = card.name
    return {
      prompt: 'Quel département ?',
      show: 'blason',
      showCode: card.code,
      answer,
      choices: saisie ? [] : sortAlpha([answer, ...distractors.map((d) => d.name)]),
      choiceKind: saisie ? 'saisie' : 'text',
      answerLabel: answer,
      itemId: card.code,
    }
  }

  const answer = card.region
  if (saisie) {
    return {
      prompt: 'Quelle région ?',
      show: 'deptName',
      showValue: card.name,
      showCode: card.code,
      answer,
      choices: [],
      choiceKind: 'saisie',
      answerLabel: answer,
      itemId: card.code,
    }
  }
  const regionChoices = pickRegionDistractors(answer, allRegions(), difficulty)
  if (regionChoices.length < 3) return null
  return {
    prompt: 'Quelle région ?',
    show: 'deptName',
    showValue: card.name,
    showCode: card.code,
    answer,
    choices: sortAlpha([answer, ...regionChoices]),
    choiceKind: 'text',
    answerLabel: answer,
    itemId: card.code,
  }
}

function makePaysRound(
  mode: PaysMode,
  difficulty: Difficulty,
  preferUnseen: boolean,
  answerMode: AnswerMode,
  preferCodes: string[] = [],
): Round | null {
  if (mode === 'carte') {
    if (MAP_COUNTRIES.length < 4) return null
    const preferMap = preferCodes.length
      ? MAP_COUNTRIES.filter((c) => preferCodes.includes(c.code))
      : []
    const mapPool = preferMap.length >= 4 ? preferMap : MAP_COUNTRIES
    const card = pickWeightedItem(
      preferMap.length >= 4 ? `pays:carte:weak` : `pays:carte`,
      mapPool,
      (c) => c.code,
      preferUnseen,
    )
    return {
      prompt: 'Où se trouve ce pays ?',
      show: 'mapPrompt',
      showValue: card.name,
      showCode: card.code,
      answer: card.code,
      choices: [],
      choiceKind: 'map',
      answerLabel: card.name,
      itemId: card.code,
      mapKind: 'world',
    }
  }

  if (COUNTRIES.length < 4) return null
  const preferPool = preferCodes.length
    ? COUNTRIES.filter((c) => preferCodes.includes(c.code))
    : []
  const pool = preferPool.length >= 4 ? preferPool : COUNTRIES
  const card = pickWeightedItem(
    preferPool.length >= 4 ? `pays:${mode}:weak` : `pays:${mode}`,
    pool,
    (c) => c.code,
    preferUnseen,
  )
  const distractors = pickCountryDistractors(card, COUNTRIES, difficulty)
  const saisie = answerMode === 'saisie'

  if (mode === 'flagToName') {
    const answer = card.name
    return {
      prompt: 'Quel pays ?',
      show: 'flag',
      showCode: card.code,
      answer,
      choices: saisie ? [] : sortAlpha([answer, ...distractors.map((d) => d.name)]),
      choiceKind: saisie ? 'saisie' : 'text',
      answerLabel: answer,
      itemId: card.code,
    }
  }

  if (mode === 'nameToFlag') {
    if (saisie) {
      // saisie du nom de pays à partir du drapeau plutôt que l’inverse
      return {
        prompt: 'Quel pays ?',
        show: 'flag',
        showCode: card.code,
        answer: card.name,
        choices: [],
        choiceKind: 'saisie',
        answerLabel: card.name,
        itemId: card.code,
      }
    }
    const answer = card.code
    return {
      prompt: 'Quel drapeau ?',
      show: 'name',
      showValue: card.name,
      answer,
      choices: shuffle([answer, ...distractors.map((d) => d.code)]),
      choiceKind: 'flag',
      answerLabel: card.name,
      itemId: card.code,
    }
  }

  if (mode === 'capitalToName') {
    const answer = card.name
    return {
      prompt: 'Quel pays ?',
      show: 'capital',
      showValue: card.capital,
      answer,
      choices: saisie ? [] : sortAlpha([answer, ...distractors.map((d) => d.name)]),
      choiceKind: saisie ? 'saisie' : 'text',
      answerLabel: answer,
      itemId: card.code,
    }
  }

  if (saisie) {
    return {
      prompt: 'Quelle capitale ?',
      show: 'name',
      showValue: card.name,
      answer: card.capital,
      choices: [],
      choiceKind: 'saisie',
      answerLabel: card.capital,
      itemId: card.code,
    }
  }

  const answer = card.code
  return {
    prompt: 'Quel drapeau ?',
    show: 'capital',
    showValue: card.capital,
    answer,
    choices: shuffle([answer, ...distractors.map((d) => d.code)]),
    choiceKind: 'flag',
    answerLabel: card.name,
    itemId: card.code,
  }
}

function makeCapitaleRound(
  mode: CapitaleMode,
  difficulty: Difficulty,
  preferUnseen: boolean,
  answerMode: AnswerMode,
  preferCodes: string[] = [],
): Round | null {
  if (COUNTRIES.length < 4) return null
  const preferPool = preferCodes.length
    ? COUNTRIES.filter((c) => preferCodes.includes(c.code))
    : []
  const pool = preferPool.length >= 4 ? preferPool : COUNTRIES
  const card = pickWeightedItem(
    preferPool.length >= 4 ? `capitale:${mode}:weak` : `capitale:${mode}`,
    pool,
    (c) => c.code,
    preferUnseen,
  )
  const distractors = pickCountryDistractors(card, COUNTRIES, difficulty)
  const saisie = answerMode === 'saisie'
  const answer = card.capital

  if (mode === 'flagToCapital') {
    return {
      prompt: 'Quelle capitale ?',
      show: 'flag',
      showCode: card.code,
      answer,
      choices: saisie
        ? []
        : sortAlpha([answer, ...distractors.map((d) => d.capital)]),
      choiceKind: saisie ? 'saisie' : 'text',
      answerLabel: answer,
      itemId: card.code,
    }
  }

  return {
    prompt: 'Quelle capitale ?',
    show: 'name',
    showValue: card.name,
    answer,
    choices: saisie
      ? []
      : sortAlpha([answer, ...distractors.map((d) => d.capital)]),
    choiceKind: saisie ? 'saisie' : 'text',
    answerLabel: answer,
    itemId: card.code,
  }
}

function makeRound(
  category: Category,
  mode: Mode,
  difficulty: Difficulty,
  preferUnseen: boolean,
  answerMode: AnswerMode,
  includeDomTom: boolean,
  territoryPackId: TerritoryPackId = 'fr',
  preferCodes: string[] = [],
): Round | null {
  if (category === 'mixte') {
    return makeMixedRound(
      difficulty,
      preferUnseen,
      answerMode,
      includeDomTom,
      preferCodes,
    )
  }
  if (category === 'departements') {
    return makeDeptRound(
      mode as DeptMode,
      difficulty,
      preferUnseen,
      answerMode,
      includeDomTom,
    )
  }
  if (category === 'pays') {
    return makePaysRound(
      mode as PaysMode,
      difficulty,
      preferUnseen,
      answerMode,
      preferCodes,
    )
  }
  if (category === 'territoires') {
    return makeTerritoryRound(
      territoryPackId,
      mode as TerritoryMode,
      difficulty,
      answerMode,
      preferUnseen,
    )
  }
  return makeCapitaleRound(
    mode as CapitaleMode,
    difficulty,
    preferUnseen,
    answerMode,
    preferCodes,
  )
}

/** MIX = uniquement drapeau→pays, nom→capitale, chiffre→département. */
const MIXTE_POOL: {
  cat: Exclude<Category, 'mixte' | 'territoires'>
  mode: Mode
}[] = [
  { cat: 'pays', mode: 'flagToName' },
  { cat: 'capitale', mode: 'nameToCapital' },
  { cat: 'departements', mode: 'chiffre' },
]

function makeMixedRound(
  difficulty: Difficulty,
  preferUnseen: boolean,
  answerMode: AnswerMode,
  includeDomTom: boolean,
  preferCodes: string[] = [],
): Round | null {
  for (let i = 0; i < 10; i++) {
    const pick = MIXTE_POOL[Math.floor(Math.random() * MIXTE_POOL.length)]!
    const am: AnswerMode = answerMode === 'map' ? 'qcm' : answerMode
    const round = makeRound(
      pick.cat,
      pick.mode,
      difficulty,
      preferUnseen,
      am,
      includeDomTom,
      'fr',
      preferCodes,
    )
    if (round) return round
  }
  return null
}

function PromptVisual({ round }: { round: Round }) {
  if (round.show === 'mapPrompt') {
    return (
      <div className="game-dept-prompt game-map-prompt">
        {round.showCode ? <span className="game-dept-code">{round.showCode}</span> : null}
        <p className="game-big-text">{round.showValue}</p>
      </div>
    )
  }
  if (round.show === 'code') {
    return <p className="game-big-code">{round.showValue}</p>
  }
  if (round.show === 'chefLieu' || round.show === 'capital' || round.show === 'name') {
    return <p className="game-big-text">{round.showValue}</p>
  }
  if (round.show === 'deptName') {
    return (
      <div className="game-dept-prompt">
        {round.showCode ? <span className="game-dept-code">{round.showCode}</span> : null}
        <p className="game-big-text">{round.showValue}</p>
      </div>
    )
  }
  if (round.show === 'blason' && round.showCode) {
    return (
      <div className="game-emblem">
        <img
          className="game-emblem-img is-blason"
          src={blasonSrc(round.showCode)}
          alt=""
          decoding="async"
        />
      </div>
    )
  }
  if (round.show === 'territoryEmblem' && round.showCode && round.territoryPackId) {
    const packId = round.territoryPackId
    const code = round.showCode
    return (
      <div className="game-emblem">
        <img
          className="game-emblem-img is-blason"
          src={territoryEmblemUrl(packId, code)}
          alt=""
          decoding="async"
          onError={(e) => {
            const img = e.currentTarget
            if (img.src.endsWith('.svg')) {
              img.src = territoryEmblemUrl(packId, code).replace('.svg', '.png')
            }
          }}
        />
      </div>
    )
  }
  if (round.show === 'flag' && round.showCode) {
    return (
      <div className="game-emblem">
        <img
          className="game-emblem-img is-flag"
          src={flagUrl(round.showCode)}
          alt=""
          decoding="async"
        />
      </div>
    )
  }
  return null
}

function flagChoiceLabel(code: string): string {
  const c = COUNTRIES.find((x) => x.code === code)
  return c?.shortName ?? c?.name ?? code
}

function FlagChoice({
  code,
  showName,
}: {
  code: string
  showName?: boolean
}) {
  const name = flagChoiceLabel(code)
  return (
    <span className="game-flag-choice-inner">
      <img className="game-choice-flag" src={flagUrl(code)} alt="" decoding="async" />
      {showName ? <span className="game-choice-flag-name">{name}</span> : null}
    </span>
  )
}

export type PlayVariant = 'entrainement' | 'jeu'
/** Lancement depuis l’accueil (rejeu faiblesses). */
export type GameLaunch = 'weaknesses' | null

const AUTO_NEXT_MS = 900
const AUTO_NEXT_FLAG_MS = 1800
const AUTO_NEXT_WRONG_HARDCORE_MS = 2400

type RunEntry = {
  prompt: string
  question: string
  given: string
  expected: string
  ok: boolean
}

type RecapFilter = 'all' | 'ok' | 'ko'

function Lives({ lives, max }: { lives: number; max: number }) {
  return (
    <div className="game-lives" aria-label={`${lives} vie${lives > 1 ? 's' : ''}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`game-life ${i < lives ? 'is-on' : 'is-off'}`}
          aria-hidden
        />
      ))}
    </div>
  )
}

function labelForChoice(choice: string, round: Round): string {
  if (choice === '__timeout__') return 'Temps écoulé'
  if (choice === '__miss__') return 'À côté'
  if (round.mapKind === 'world' || round.choiceKind === 'flag') {
    return COUNTRIES.find((c) => c.code === choice)?.name ?? choice
  }
  if (round.mapKind === 'france') {
    const d = DEPT_CARDS.find((x) => x.code === choice)
    return d ? `${d.code} — ${d.name}` : choice
  }
  return choice
}

function questionLabel(round: Round): string {
  if (round.show === 'mapPrompt') {
    return [round.showCode, round.showValue].filter(Boolean).join(' ')
  }
  if (round.show === 'deptName') {
    return [round.showCode, round.showValue].filter(Boolean).join(' ')
  }
  if (round.showValue) return round.showValue
  if (round.showCode) {
    if (round.show === 'flag') {
      return COUNTRIES.find((c) => c.code === round.showCode)?.name ?? round.showCode
    }
    if (round.show === 'blason') {
      const d = DEPT_CARDS.find((x) => x.code === round.showCode)
      return d ? `${d.code} ${d.name}` : round.showCode
    }
    return round.showCode
  }
  return round.prompt
}

function formatDuration(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return m > 0 ? `${m} min ${s.toString().padStart(2, '0')} s` : `${s} s`
}

export function GameView({
  variant,
  mapDomTom,
  onOpenHistory,
  onProgressChange,
  launch = null,
  lobbyBump = 0,
  onOpenPacks,
}: {
  variant: PlayVariant
  mapDomTom: boolean
  onOpenHistory?: () => void
  onProgressChange?: (p: ProgressState) => void
  launch?: GameLaunch
  /** Incrémenté quand on reclique Jouer dans la topbar. */
  lobbyBump?: number
  onOpenPacks?: () => void
}) {
  const isPlay = variant === 'jeu'
  const [category, setCategory] = useState<Category>('pays')
  const [mode, setMode] = useState<Mode>('flagToName')
  const [territoryPackId, setTerritoryPackId] = useState<TerritoryPackId>('fr')
  const [difficulty, setDifficulty] = useState<Difficulty>('facile')
  const [answerMode, setAnswerMode] = useState<AnswerMode>('qcm')
  const [sessionFormat, setSessionFormat] = useState<SessionFormatId>('libre')
  /**
   * Jeu : true = écran « Commencer ». Une fois lancé, reste false
   * jusqu’à fin de partie / retour lobby (onglet Jouer).
   */
  const [lobby, setLobby] = useState(false)
  /** La partie démarre tout de suite. Le lobby ne s’ouvre plus devant Jouer. */
  const [runActive, setRunActive] = useState(true)
  const [score, setScore] = useState(0)
  const [asked, setAsked] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [streakPeak, setStreakPeak] = useState(0)
  const [lives, setLives] = useState(LIVES_FOR.facile)
  const [gameOver, setGameOver] = useState(false)
  const [seed, setSeed] = useState(0)
  const [typed, setTyped] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS.facile)
  const [elapsedSec, setElapsedSec] = useState(0)
  const [statsTick, setStatsTick] = useState(0)
  const [runLog, setRunLog] = useState<RunEntry[]>([])
  const [recapFilter, setRecapFilter] = useState<RecapFilter>('all')
  const [missHint, setMissHint] = useState(false)
  const [openFilter, setOpenFilter] = useState<string | null>(null)
  const [preferCodes, setPreferCodes] = useState<string[]>([])
  const [weaknessFocus, setWeaknessFocus] = useState(false)
  const [lastGained, setLastGained] = useState(0)
  const [creditsNow, setCreditsNow] = useState(() => loadProgress().points)
  const timedOut = useRef(false)
  const endAfterFeedback = useRef(false)
  const runSnapshot = useRef({ score: 0, asked: 0, peak: 0, timeMs: 0 })
  const mapDomTomPrev = useRef(mapDomTom)
  const missTimer = useRef(0)
  const sessionStartRef = useRef<number | null>(null)

  const setupReady = true
  const isMixte = category === 'mixte'
  const isTerritoires = category === 'territoires'
  const isRapidite = sessionFormat === 'rapidite'
  const isBounded = sessionFormat === 'session10' || sessionFormat === 'rapidite'
  const availableModes = isMixte ? [] : modesFor(category, territoryPackId)
  const isMapMode = Boolean(!isMixte && mode === 'carte')
  const effectiveAnswerMode: AnswerMode = isMapMode
    ? 'map'
    : answerMode === 'map'
      ? 'qcm'
      : answerMode
  const maxLives = LIVES_FOR[difficulty]
  const timerMax = isMapMode ? MAP_TIMER_SECONDS[difficulty] : TIMER_SECONDS[difficulty]
  const usePerQuestionTimer = isPlay && !isRapidite
  const statsMode = isMixte
    ? 'mixte'
    : isTerritoires
      ? `${territoryPackId}:${mode}`
      : mode
  const key = statsKey(
    isMixte ? 'mixte' : category,
    statsMode,
    difficulty,
    effectiveAnswerMode,
    sessionFormat,
  )
  const best = useMemo(() => getModeStats(key), [key, statsTick])
  const difficultyOptions = isMixte
    ? DIFFICULTY_OPTIONS.filter((d) => d.id !== 'facile')
    : DIFFICULTY_OPTIONS
  const formatOptions: SessionFormatId[] = isPlay
    ? ['libre', 'session10', 'rapidite']
    : ['libre', 'session10']
  const categoryOptions: Category[] = isPlay
    ? [...BASE_CATEGORIES, 'mixte']
    : BASE_CATEGORIES

  const round = useMemo(
    () =>
      category
        ? makeRound(
            category,
            mode,
            difficulty,
            // Entraînement + Jeu : sac sans remise (évite les doublons trop tôt)
            true,
            effectiveAnswerMode,
            mapDomTom,
            territoryPackId,
            preferCodes,
          )
        : null,
    [
      category,
      mode,
      difficulty,
      seed,
      effectiveAnswerMode,
      mapDomTom,
      territoryPackId,
      preferCodes,
    ],
  )

  const roundIsMap = round?.choiceKind === 'map'

  // Options ↔ chip Carte : même réglage, relance la question si ça change
  useEffect(() => {
    if (mapDomTomPrev.current === mapDomTom) return
    mapDomTomPrev.current = mapDomTom
    setPicked(null)
    setTyped('')
    timedOut.current = false
    setSecondsLeft(timerMax)
    setSeed((s) => s + 1)
  }, [mapDomTom, timerMax])

  function awardProgress(finalScore: number, finalAsked: number) {
    const { state, gained } = recordQuizFinish({
      category: isMixte ? 'mixte' : category,
      difficulty,
      score: finalScore,
      asked: finalAsked,
      countPerfect: isBounded || finalAsked >= 5,
    })
    setLastGained(gained)
    setCreditsNow(state.points)
    onProgressChange?.(state)
  }

  function flushTrainingSession() {
    if (isPlay || asked <= 0) return
    recordRun({ key, score, asked, streakPeak })
    awardProgress(score, asked)
    setStatsTick((t) => t + 1)
  }

  function resetRun(opts?: { start?: boolean; difficulty?: Difficulty }) {
    const d = opts?.difficulty ?? difficulty
    flushTrainingSession()
    setScore(0)
    setAsked(0)
    setStreak(0)
    setStreakPeak(0)
    setLives(LIVES_FOR[d])
    setGameOver(false)
    setPicked(null)
    setTyped('')
    setRunLog([])
    setRecapFilter('all')
    setMissHint(false)
    setElapsedSec(0)
    timedOut.current = false
    endAfterFeedback.current = false
    runSnapshot.current = { score: 0, asked: 0, peak: 0, timeMs: 0 }
    setSecondsLeft(
      (mode === 'carte' ? MAP_TIMER_SECONDS : TIMER_SECONDS)[d],
    )
    const start = isPlay ? Boolean(opts?.start) : true
    setRunActive(start)
    if (start) {
      setLobby(false)
    }
    sessionStartRef.current = start ? Date.now() : null
    setSeed((s) => s + 1)
  }

  /** Changement de filtre : en cours → relance ; lobby / fin → reste à Commencer. */
  function resetAfterConfig() {
    if (!isPlay) {
      resetRun({ start: true })
      return
    }
    if (lobby || gameOver || !runActive) {
      setLobby(true)
      resetRun({ start: false })
    } else {
      resetRun({ start: true })
    }
  }

  function next() {
    if (isBounded && asked >= SESSION_LEN) {
      const snap = runSnapshot.current
      const timeMs =
        sessionStartRef.current != null ? Date.now() - sessionStartRef.current : 0
      finishRun(snap.score, snap.asked, snap.peak, timeMs)
      setRunActive(false)
      setGameOver(true)
      setPicked(null)
      return
    }
    setPicked(null)
    setTyped('')
    timedOut.current = false
    setSecondsLeft(timerMax)
    setSeed((s) => s + 1)
  }

  function finishRun(
    finalScore: number,
    finalAsked: number,
    peak: number,
    timeMs?: number,
  ) {
    recordRun({
      key,
      score: finalScore,
      asked: finalAsked,
      streakPeak: peak,
      timeMs: isRapidite ? timeMs : undefined,
    })
    awardProgress(finalScore, finalAsked)
    setStatsTick((t) => t + 1)
  }

  useEffect(() => {
    if (variant === 'entrainement' && sessionFormat === 'rapidite') {
      setSessionFormat('libre')
    }
    // Nouveau mode → repart sur Pays / défauts (sauf launch home)
    if (!launch) {
      setCategory('pays')
      setMode('flagToName')
      setPreferCodes([])
      setWeaknessFocus(false)
      setLobby(false)
      resetRun({ start: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  // Recliquer Jouer (topbar) :
  // - fin de partie / lobby → lance (comme Rejouer)
  // - partie en cours → retour config (pas de relance auto)
  useEffect(() => {
    if (!lobbyBump || variant !== 'jeu') return
    if (gameOver || !runActive) {
      setWeaknessFocus(false)
      resetRun({ start: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lobbyBump])

  // Accueil → Mes erreurs
  useEffect(() => {
    if (launch !== 'weaknesses' || variant !== 'jeu') return
    let cancelled = false
    const nextDiff: Difficulty = 'facile'
    const codes = weakCountryCodes(16)
    setCategory('pays')
    setMode('flagToName')
    setSessionFormat('session10')
    setDifficulty(nextDiff)
    setAnswerMode('qcm')
    setPreferCodes(codes)
    setWeaknessFocus(true)
    setLastGained(0)
    setLobby(false)
    const t = window.setTimeout(() => {
      if (!cancelled) resetRun({ start: true, difficulty: nextDiff })
    }, 0)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launch, variant])

  // Auto-suite : Jeu toujours ; Entraînement seulement à la fin d’une session 10Q
  useEffect(() => {
    if (!picked || gameOver) return
    const sessionDone = isBounded && asked >= SESSION_LEN
    if (!isPlay && !sessionDone) return

    const wrong =
      picked === '__timeout__' ||
      !(picked === round?.answer || answersMatch(picked, round?.answer ?? '', 'loose'))
    const flagReveal = round?.choiceKind === 'flag'
    const delay =
      difficulty === 'hardcore' && wrong
        ? AUTO_NEXT_WRONG_HARDCORE_MS
        : flagReveal
          ? AUTO_NEXT_FLAG_MS
          : AUTO_NEXT_MS
    const t = window.setTimeout(() => {
      if (endAfterFeedback.current || sessionDone) {
        const snap = runSnapshot.current
        const timeMs =
          sessionStartRef.current != null ? Date.now() - sessionStartRef.current : 0
        finishRun(snap.score, snap.asked, snap.peak, timeMs)
        setRunActive(false)
        setGameOver(true)
        setPicked(null)
      } else {
        next()
      }
    }, delay)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, isPlay, gameOver, difficulty, asked, isBounded])

  // Timer countdown par question (Jeu libre / 10Q, pas Rapidité) — seulement après Lancer
  useEffect(() => {
    if (!setupReady || !runActive || !usePerQuestionTimer || gameOver || picked || !round) return
    setSecondsLeft(timerMax)
    timedOut.current = false
    const started = Date.now()
    const id = window.setInterval(() => {
      const left = Math.max(0, timerMax - Math.floor((Date.now() - started) / 1000))
      setSecondsLeft(left)
      if (left <= 0 && !timedOut.current) {
        timedOut.current = true
        resolveAnswer('__timeout__', false)
      }
    }, 200)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, usePerQuestionTimer, gameOver, timerMax, picked, runActive, setupReady])

  // Chrono session Rapidité — seulement après Lancer
  useEffect(() => {
    if (!setupReady || !runActive || !isRapidite || gameOver) return
    if (sessionStartRef.current == null) sessionStartRef.current = Date.now()
    const id = window.setInterval(() => {
      const start = sessionStartRef.current ?? Date.now()
      setElapsedSec(Math.floor((Date.now() - start) / 1000))
    }, 200)
    return () => window.clearInterval(id)
  }, [isRapidite, gameOver, seed, runActive, setupReady])

  // Raccourcis clavier (PC)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (gameOver) {
        if (e.key === 'Enter') {
          e.preventDefault()
          resetRun({ start: true })
        }
        return
      }
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (isPlay && !runActive) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          resetRun({ start: true })
        }
        return
      }

      if (revealedRef()) {
        if (!isPlay && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          next()
        }
        return
      }

      if (round?.choiceKind === 'text' || round?.choiceKind === 'flag') {
        const n = Number(e.key)
        if (n >= 1 && n <= 4 && round.choices[n - 1]) {
          e.preventDefault()
          answer(round.choices[n - 1]!)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, round, picked, isPlay, asked, runActive])

  function revealedRef() {
    return picked !== null
  }

  function selectCategory(cat: Category) {
    setCategory(cat)
    if (cat === 'mixte') {
      if (difficulty === 'facile') setDifficulty('difficile')
      setMode('chiffre')
      if (answerMode === 'map') setAnswerMode('qcm')
    } else {
      const nextMode = defaultMode(cat, territoryPackId)
      setMode(nextMode)
      if (nextMode === 'carte') setAnswerMode('map')
      else if (answerMode === 'map') setAnswerMode('qcm')
    }
    resetAfterConfig()
  }

  function selectTerritoryPack(packId: TerritoryPackId) {
    setTerritoryPackId(packId)
    const nextMode = defaultTerritoryMode(packId)
    setMode(nextMode)
    if (nextMode === 'carte') setAnswerMode('map')
    else if (answerMode === 'map') setAnswerMode('qcm')
    resetAfterConfig()
  }

  function selectMode(m: Mode) {
    setMode(m)
    if (m === 'carte') setAnswerMode('map')
    else if (answerMode === 'map') setAnswerMode('qcm')
    resetAfterConfig()
  }

  function selectDifficulty(d: Difficulty) {
    if (isMixte && d === 'facile') return
    setDifficulty(d)
    resetAfterConfig()
  }

  function selectAnswerMode(am: AnswerMode) {
    setAnswerMode(am)
    resetAfterConfig()
  }

  function selectFormat(f: SessionFormatId) {
    setSessionFormat(f)
    resetAfterConfig()
  }

  function resolveAnswer(choice: string, isCorrect: boolean) {
    if (!round || picked || gameOver || (isPlay && !runActive)) return
    setMissHint(false)
    setPicked(choice)
    const nextAsked = asked + 1
    setAsked(nextAsked)
    beep(isCorrect)
    recordAnswerOutcome({
      id: round.itemId,
      label: round.answerLabel,
      bucket: isMixte ? 'mixte' : category,
      ok: isCorrect,
    })
    setRunLog((prev) => [
      ...prev,
      {
        prompt: round.prompt,
        question: questionLabel(round),
        given: labelForChoice(choice, round),
        expected: round.answerLabel,
        ok: isCorrect,
      },
    ])
    const timeMs =
      sessionStartRef.current != null ? Date.now() - sessionStartRef.current : 0
    if (isCorrect) {
      const nextScore = score + 1
      setScore(nextScore)
      const nextStreak = streak + 1
      setStreak(nextStreak)
      const peak = Math.max(streakPeak, nextStreak)
      setStreakPeak(peak)
      noteBestStreak(key, peak)
      setStatsTick((t) => t + 1)
      endAfterFeedback.current = false
      runSnapshot.current = { score: nextScore, asked: nextAsked, peak, timeMs }
    } else {
      setStreak(0)
      runSnapshot.current = { score, asked: nextAsked, peak: streakPeak, timeMs }
      if (isPlay && !isRapidite && sessionFormat === 'libre') {
        const nextLives = Math.max(0, lives - 1)
        setLives(nextLives)
        endAfterFeedback.current = nextLives <= 0
      } else {
        // session10 / rapidité : on va jusqu’au bout (pas de game over sur vies)
        endAfterFeedback.current = false
      }
    }
    if (isBounded && nextAsked >= SESSION_LEN) {
      endAfterFeedback.current = true
    }
  }

  function answer(choice: string) {
    if (!round) return
    resolveAnswer(choice, choice === round.answer)
  }

  function onMapMiss() {
    if (picked || gameOver) return
    setMissHint(true)
    window.clearTimeout(missTimer.current)
    missTimer.current = window.setTimeout(() => setMissHint(false), 1200)
  }

  function submitTyped(e: FormEvent) {
    e.preventDefault()
    if (!round || picked) return
    const strict =
      difficulty === 'facile' ? 'loose' : difficulty === 'hardcore' ? 'hardcore' : 'strict'
    const ok = answersMatch(typed, round.answer, strict)
    resolveAnswer(typed || '—', ok)
  }

  const showLobbyCta = isPlay && !runActive && !gameOver

  function toggleFilter(id: string) {
    setOpenFilter((current) => (current === id ? null : id))
  }

  const filters = (
    <div className="game-filters is-affiche">
      <FilterLine
        value={category}
        options={categoryOptions.map((id) => ({ id, label: CATEGORY_LABEL[id] }))}
        open={openFilter === 'cat'}
        onOpen={() => toggleFilter('cat')}
        onPick={(id) => {
          selectCategory(id)
          setOpenFilter('cat')
        }}
      />
      {!isMixte ? (
        <FilterLine
          value={mode}
          options={availableModes.map((item) => ({ id: item.id, label: item.label }))}
          open={openFilter === 'mode'}
          onOpen={() => toggleFilter('mode')}
          onPick={(id) => {
            selectMode(id)
            setOpenFilter('mode')
          }}
        />
      ) : null}
      {isTerritoires ? (
        <FilterLine
          value={territoryPackId}
          options={TERRITORY_PACK_ORDER.map((id) => ({ id, label: TERRITORY_PACKS[id].country }))}
          open={openFilter === 'pack'}
          onOpen={() => toggleFilter('pack')}
          onPick={(id) => {
            selectTerritoryPack(id)
            setOpenFilter('pack')
          }}
        />
      ) : null}
      <FilterLine
        value={difficulty}
        options={difficultyOptions.map((item) => ({ id: item.id, label: item.label }))}
        open={openFilter === 'level'}
        onOpen={() => toggleFilter('level')}
        onPick={(id) => {
          selectDifficulty(id)
          setOpenFilter('level')
        }}
      />
      <FilterLine
        value={sessionFormat}
        options={formatOptions.map((id) => ({ id, label: FORMAT_LABEL[id] }))}
        open={openFilter === 'format'}
        onOpen={() => toggleFilter('format')}
        onPick={(id) => {
          selectFormat(id)
          setOpenFilter('format')
        }}
      />
      {!isMapMode ? (
        <FilterLine
          value={effectiveAnswerMode === 'saisie' ? 'saisie' : 'qcm'}
          options={[
            { id: 'qcm' as const, label: 'QCM' },
            { id: 'saisie' as const, label: 'Écrite' },
          ]}
          open={openFilter === 'answer'}
          onOpen={() => toggleFilter('answer')}
          onPick={(id) => {
            selectAnswerMode(id)
            setOpenFilter('answer')
          }}
        />
      ) : null}
    </div>
  )

  if (!round) {
    return (
      <div className="game-view">
        <p className="game-empty">Pas assez de cartes pour lancer une partie.</p>
      </div>
    )
  }

  const revealed = picked !== null
  const correct =
    revealed &&
    picked !== '__timeout__' &&
    (picked === round.answer || answersMatch(picked, round.answer, 'loose'))
  const pct = asked > 0 ? Math.round((score / asked) * 100) : 0

  if (gameOver) {
    const okCount = runLog.filter((e) => e.ok).length
    const koCount = runLog.length - okCount
    const filtered =
      recapFilter === 'all'
        ? runLog
        : runLog.filter((e) => (recapFilter === 'ok' ? e.ok : !e.ok))
    const timeMs = runSnapshot.current.timeMs || elapsedSec * 1000
    const timeLabel = formatDuration(Math.round(timeMs / 1000))
    const packReady = creditsNow >= PACK_COST
    const weakLeft = weaknessCount()
    const showWeakCta =
      isPlay && !weaknessFocus && (koCount >= 1 || weakLeft >= 3)
    const weakPriority = koCount >= 2 || weakLeft >= 3
    const startWeakSession = () => {
      const codes = weakCountryCodes(16)
      setCategory('pays')
      setMode('flagToName')
      setSessionFormat('session10')
      setPreferCodes(codes.length ? codes : preferCodes)
      setWeaknessFocus(true)
      setLastGained(0)
      window.setTimeout(() => resetRun({ start: true }), 0)
    }
    return (
      <div className="game-view is-affiche">
        <div className="game-board game-over">
          <p className="game-prompt">Partie terminée</p>
          <p className="game-over-format">
            {weaknessFocus ? 'Mes erreurs' : FORMAT_LABEL[sessionFormat]}
          </p>
          <p className="game-over-score">
            Score <strong>{score}</strong> / {asked}
            <span className="game-pct"> · {pct} %</span>
          </p>
          {lastGained > 0 ? (
            <p className="game-over-credits">
              +{lastGained} cr. · {creditsNow}
            </p>
          ) : null}
          {isRapidite ? (
            <p className="game-over-time">
              Temps <strong>{timeLabel}</strong>
              {best.bestTimeMs != null ? (
                <> · Record {formatDuration(Math.round(best.bestTimeMs / 1000))}</>
              ) : null}
            </p>
          ) : null}
          <p className="game-over-recap-sum">
            <span className="is-ok">{okCount} bonnes</span>
            {' · '}
            <span className="is-ko">{koCount} mauvaises</span>
          </p>
          <p className="game-over-streak">
            Meilleure série : <strong>×{streakPeak}</strong>
            {best.bestStreak > 0 ? (
              <> · Record <strong>×{best.bestStreak}</strong></>
            ) : null}
          </p>

          {showWeakCta ? (
            <div className={`game-weak-banner ${weakPriority ? 'is-priority' : ''}`}>
              <p className="game-weak-banner-title">
                {weakLeft > 0
                  ? `${Math.min(weakLeft, 12)} pays à revoir`
                  : `${koCount} erreur${koCount > 1 ? 's' : ''} à rejouer`}
              </p>
              <p className="game-weak-banner-hint">
                Session ciblée · {SESSION_LEN} questions · drapeaux
              </p>
              <button
                type="button"
                className="game-next"
                onClick={startWeakSession}
              >
                Mes erreurs
                {weakLeft > 0 ? ` (${Math.min(weakLeft, 12)})` : ''}
              </button>
            </div>
          ) : null}

          <div className="game-recap-filters" role="group" aria-label="Filtrer le récap">
            {(
              [
                ['all', 'Toutes'],
                ['ok', '✓'],
                ['ko', '✗'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`game-chip ${recapFilter === id ? 'is-active' : ''}`}
                onClick={() => setRecapFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <ul className="game-recap-list">
            {filtered.map((e, i) => (
              <li key={`${i}-${e.question}`} className={e.ok ? 'is-ok' : 'is-ko'}>
                <strong>
                  {e.ok ? '✓' : '✗'} {e.question}
                </strong>
                <span>
                  {e.ok ? e.expected : `${e.given} → ${e.expected}`}
                </span>
              </li>
            ))}
          </ul>

          <div className="game-over-actions">
            <button
              type="button"
              className={`game-next ${weakPriority ? 'game-next-quiet' : ''}`}
              onClick={() => resetRun({ start: true })}
            >
              {isBounded ? `Rejouer (${SESSION_LEN} Q)` : 'Rejouer'}
            </button>
            {packReady && onOpenPacks ? (
              <button
                type="button"
                className="game-next game-next-quiet"
                onClick={() => onOpenPacks()}
              >
                Ouvrir un pack
              </button>
            ) : null}
            <button
              type="button"
              className="game-next game-next-quiet"
              onClick={() => onOpenHistory?.()}
            >
              Voir l’historique
            </button>
          </div>
        </div>
        {filters}
      </div>
    )
  }

  return (
    <div className={`game-view is-affiche ${roundIsMap ? 'is-map-mode' : ''}`}>
      <div
        className={`game-board ${roundIsMap ? 'is-map-board' : ''} ${showLobbyCta ? 'is-idle' : ''}`}
        key={`${variant}-${category}-${mode}-${difficulty}-${answerMode}-${sessionFormat}-${seed}-${runActive ? 'on' : 'off'}`}
      >
        {showLobbyCta ? (
          <div className="game-idle">
            <p className="game-idle-title">
              {CATEGORY_LABEL[category]}
              {!isMixte ? ` · ${availableModes.find((m) => m.id === mode)?.label ?? ''}` : ''}
            </p>
            <p className="game-idle-hint">
              {FORMAT_LABEL[sessionFormat]}
              {' · '}
              {difficultyOptions.find((d) => d.id === difficulty)?.label ?? difficulty}
            </p>
            <button
              type="button"
              className="game-next game-lancer"
              onClick={() => resetRun({ start: true })}
            >
              Jouer
            </button>
          </div>
        ) : (
          <>
        <div className="game-board-hud" aria-live="polite">
          {isBounded ? (
            <span className="game-progress" aria-label={`Question ${Math.min(asked + 1, SESSION_LEN)} sur ${SESSION_LEN}`}>
              {Math.min(asked + (revealed ? 0 : 1), SESSION_LEN)}/{SESSION_LEN}
            </span>
          ) : null}
          {usePerQuestionTimer ? (
            <>
              {sessionFormat === 'libre' ? (
                <Lives lives={lives} max={maxLives} />
              ) : null}
              <span
                className={`game-timer ${secondsLeft <= 5 ? 'is-urgent' : ''}`}
                aria-label={`${secondsLeft} secondes`}
              >
                {secondsLeft}s
              </span>
            </>
          ) : null}
          {isRapidite ? (
            <span className="game-timer" aria-label={`Temps écoulé ${elapsedSec} secondes`}>
              {formatDuration(elapsedSec)}
            </span>
          ) : null}
          <span className="game-score">
            Score <strong>{score}</strong>
            {isBounded ? <> / {SESSION_LEN}</> : !isPlay ? <> / {asked}</> : null}
          </span>
          {!isPlay && !isBounded ? <span className="game-pct">{pct} %</span> : null}
          {streak >= 3 ? <span className="game-streak">×{streak}</span> : null}
        </div>
        <p className="game-prompt">{round.prompt}</p>
        <PromptVisual round={round} />

        {round.choiceKind === 'map' && round.mapKind === 'france' ? (
          <FranceMapQuiz
            answerCode={round.answer}
            locked={revealed}
            picked={picked}
            showDomTom={mapDomTom}
            onPick={answer}
            onMiss={onMapMiss}
          />
        ) : null}

        {round.choiceKind === 'map' && round.mapKind === 'world' ? (
          <WorldMapQuiz
            answerCode={round.answer}
            locked={revealed}
            picked={picked}
            onPick={answer}
            onMiss={onMapMiss}
          />
        ) : null}

        {round.choiceKind === 'map' &&
        round.mapKind === 'territory' &&
        round.territoryPackId ? (
          <TerritoryMapQuiz
            packId={round.territoryPackId}
            answerCode={round.answer}
            locked={revealed}
            picked={picked}
            onPick={answer}
            onMiss={onMapMiss}
            label={`Carte ${TERRITORY_PACKS[round.territoryPackId].country}`}
          />
        ) : null}

        {missHint && !revealed ? (
          <p className="game-miss-hint" role="status">
            À côté — vise une zone sur la carte
          </p>
        ) : null}

        {round.choiceKind === 'saisie' ? (
          <form className="game-saisie" onSubmit={submitTyped}>
            <input
              className="game-saisie-input"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Ta réponse…"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={revealed}
              autoFocus
            />
            <button type="submit" className="game-next" disabled={revealed || !typed.trim()}>
              Valider
            </button>
          </form>
        ) : null}

        {round.choiceKind === 'text' || round.choiceKind === 'flag' ? (
          <div className={`game-choices ${round.choiceKind === 'flag' ? 'is-flags' : ''}`}>
            {round.choices.map((choice, idx) => {
              let cls = 'game-choice'
              if (round.choiceKind === 'flag') cls += ' is-flag-choice'
              if (revealed) {
                if (choice === round.answer) cls += ' is-correct'
                else if (choice === picked) cls += ' is-wrong'
              }
              return (
                <button
                  key={choice}
                  type="button"
                  className={cls}
                  disabled={revealed}
                  onClick={() => answer(choice)}
                  aria-label={
                    round.choiceKind === 'flag' ? flagChoiceLabel(choice) : choice
                  }
                >
                  <span className="game-choice-key" aria-hidden>
                    {idx + 1}
                  </span>
                  {round.choiceKind === 'flag' ? (
                    <FlagChoice code={choice} showName={revealed} />
                  ) : (
                    choice
                  )}
                </button>
              )
            })}
          </div>
        ) : null}

        {revealed ? (
          (() => {
            const line = feedbackLine({
              ok: correct,
              answerLabel: round.answerLabel,
              picked: picked ?? '',
              givenLabel: labelForChoice(picked ?? '', round),
            })
            return (
              <div
                className={`game-feedback is-${line.kind === 'ok' ? 'ok' : 'ko'} is-${line.kind}`}
              >
                <p>
                  {line.kind === 'ok' ? (
                    <span className="game-feedback-answer">{line.text}</span>
                  ) : (
                    line.text
                  )}
                </p>
                {!isPlay ? (
                  <button type="button" className="game-next" onClick={next}>
                    Question suivante
                  </button>
                ) : null}
              </div>
            )
          })()
        ) : null}

        {!isPlay && asked > 0 ? (
          <div className="game-train-end">
            <button
              type="button"
              className="game-next game-next-quiet"
              onClick={() => {
                finishRun(score, asked, streakPeak)
                setGameOver(true)
              }}
            >
              Voir le récap
            </button>
          </div>
        ) : null}
          </>
        )}
      </div>
      {filters}
    </div>
  )
}
