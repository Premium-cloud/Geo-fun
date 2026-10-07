import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { DEPT_CARDS } from '../cards/CartesFranceView'
import { COUNTRIES } from '../data/countries'
import { answersMatch } from '../lib/answerMatch'
import { pickWeightedItem } from '../lib/pickWeighted'
import {
  getModeStats,
  loadOptions,
  recordRun,
  saveOptions,
  statsKey,
  type AnswerMode,
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
import { HistoryPanel } from './HistoryPanel'
import { WORLD_MAP_CODES } from './mapCodes'
import { WorldMapQuiz } from './WorldMapQuiz'
import './GameView.css'

type Category = 'departements' | 'pays' | 'capitale'

type DeptMode = 'chiffre' | 'chefLieu' | 'blason' | 'region' | 'carte'
type PaysMode = 'flagToName' | 'nameToFlag' | 'capitalToName' | 'capitalToFlag' | 'carte'
type CapitaleMode = 'flagToCapital' | 'nameToCapital'
type Mode = DeptMode | PaysMode | CapitaleMode

type ChoiceKind = 'text' | 'flag' | 'saisie' | 'map'

type Round = {
  prompt: string
  show: 'code' | 'chefLieu' | 'blason' | 'flag' | 'name' | 'capital' | 'deptName' | 'mapPrompt'
  showValue?: string
  showCode?: string
  answer: string
  choices: string[]
  choiceKind: ChoiceKind
  answerLabel: string
  itemId: string
  mapKind?: 'france' | 'world'
}

const DEPT_MODES: { id: DeptMode; label: string }[] = [
  { id: 'chiffre', label: 'Par chiffre' },
  { id: 'chefLieu', label: 'Par chef-lieu' },
  { id: 'blason', label: 'Par blason' },
  { id: 'region', label: 'Par région' },
  { id: 'carte', label: 'Carte' },
]

const PAYS_MODES: { id: PaysMode; label: string }[] = [
  { id: 'flagToName', label: 'Drapeau → nom' },
  { id: 'nameToFlag', label: 'Nom → drapeau' },
  { id: 'capitalToName', label: 'Capitale → pays' },
  { id: 'capitalToFlag', label: 'Capitale → drapeau' },
  { id: 'carte', label: 'Carte' },
]

const MAP_COUNTRIES = COUNTRIES.filter((c) => WORLD_MAP_CODES.has(c.code))
const METRO_DEPTS = DEPT_CARDS.filter((d) => d.group === 'metro')

const CAPITALE_MODES: { id: CapitaleMode; label: string }[] = [
  { id: 'flagToCapital', label: 'Drapeau → capitale' },
  { id: 'nameToCapital', label: 'Nom → capitale' },
]

const CATEGORY_LABEL: Record<Category, string> = {
  departements: 'Départements',
  pays: 'Pays',
  capitale: 'Capitales',
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

function modesFor(cat: Category) {
  if (cat === 'departements') return DEPT_MODES
  if (cat === 'pays') return PAYS_MODES
  return CAPITALE_MODES
}

function defaultMode(cat: Category): Mode {
  return modesFor(cat)[0]!.id
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
): Round | null {
  if (mode === 'carte') {
    if (MAP_COUNTRIES.length < 4) return null
    const card = pickWeightedItem(
      `pays:carte`,
      MAP_COUNTRIES,
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
  const card = pickWeightedItem(
    `pays:${mode}`,
    COUNTRIES,
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
): Round | null {
  if (COUNTRIES.length < 4) return null
  const card = pickWeightedItem(
    `capitale:${mode}`,
    COUNTRIES,
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
): Round | null {
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
    return makePaysRound(mode as PaysMode, difficulty, preferUnseen, answerMode)
  }
  return makeCapitaleRound(mode as CapitaleMode, difficulty, preferUnseen, answerMode)
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

function FlagChoice({ code }: { code: string }) {
  return (
    <img className="game-choice-flag" src={flagUrl(code)} alt="" decoding="async" />
  )
}

export type PlayVariant = 'entrainement' | 'jeu'

const AUTO_NEXT_MS = 900
const AUTO_NEXT_WRONG_HARDCORE_MS = 2400

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

export function GameView({ variant }: { variant: PlayVariant }) {
  const isPlay = variant === 'jeu'
  const [category, setCategory] = useState<Category>('departements')
  const [mode, setMode] = useState<Mode>('chiffre')
  const [difficulty, setDifficulty] = useState<Difficulty>('facile')
  const [answerMode, setAnswerMode] = useState<AnswerMode>('qcm')
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
  const [statsTick, setStatsTick] = useState(0)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [mapDomTom, setMapDomTom] = useState(() => loadOptions().mapDomTom)
  const timedOut = useRef(false)
  const endAfterFeedback = useRef(false)
  const runSnapshot = useRef({ score: 0, asked: 0, peak: 0 })

  const availableModes = modesFor(category)
  const isMapMode = mode === 'carte'
  const effectiveAnswerMode: AnswerMode = isMapMode ? 'map' : answerMode === 'map' ? 'qcm' : answerMode
  const maxLives = LIVES_FOR[difficulty]
  const timerMax = isMapMode ? MAP_TIMER_SECONDS[difficulty] : TIMER_SECONDS[difficulty]
  const key = statsKey(category, mode, difficulty, effectiveAnswerMode)
  const best = useMemo(() => getModeStats(key), [key, statsTick])

  const round = useMemo(
    () =>
      makeRound(category, mode, difficulty, isPlay, effectiveAnswerMode, mapDomTom),
    [category, mode, difficulty, seed, isPlay, effectiveAnswerMode, mapDomTom],
  )

  function toggleMapDomTom() {
    const next = !mapDomTom
    setMapDomTom(next)
    const opts = loadOptions()
    saveOptions({ ...opts, mapDomTom: next })
    setPicked(null)
    setTyped('')
    timedOut.current = false
    setSecondsLeft(timerMax)
    setSeed((s) => s + 1)
  }

  function resetRun() {
    setScore(0)
    setAsked(0)
    setStreak(0)
    setStreakPeak(0)
    setLives(LIVES_FOR[difficulty])
    setGameOver(false)
    setPicked(null)
    setTyped('')
    timedOut.current = false
    setSecondsLeft(
      (mode === 'carte' ? MAP_TIMER_SECONDS : TIMER_SECONDS)[difficulty],
    )
    setSeed((s) => s + 1)
  }

  function next() {
    setPicked(null)
    setTyped('')
    timedOut.current = false
    setSecondsLeft(timerMax)
    setSeed((s) => s + 1)
  }

  function finishRun(finalScore: number, finalAsked: number, peak: number) {
    recordRun({ key, score: finalScore, asked: finalAsked, streakPeak: peak })
    setStatsTick((t) => t + 1)
  }

  useEffect(() => {
    resetRun()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  useEffect(() => {
    if (!isPlay || !picked || gameOver) return
    const wrong =
      picked === '__timeout__' ||
      !(picked === round?.answer || answersMatch(picked, round?.answer ?? '', 'loose'))
    const delay =
      difficulty === 'hardcore' && wrong ? AUTO_NEXT_WRONG_HARDCORE_MS : AUTO_NEXT_MS
    const t = window.setTimeout(() => {
      if (endAfterFeedback.current) {
        setGameOver(true)
        setPicked(null)
        const snap = runSnapshot.current
        finishRun(snap.score, snap.asked, snap.peak)
      } else {
        next()
      }
    }, delay)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, isPlay, gameOver, difficulty])

  // Timer countdown (Jeu only)
  useEffect(() => {
    if (!isPlay || gameOver || picked || !round) return
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
  }, [seed, isPlay, gameOver, timerMax, picked])

  function selectCategory(cat: Category) {
    setCategory(cat)
    const nextMode = defaultMode(cat)
    setMode(nextMode)
    if (nextMode === 'carte') setAnswerMode('map')
    else if (answerMode === 'map') setAnswerMode('qcm')
    resetRun()
  }

  function selectMode(m: Mode) {
    setMode(m)
    if (m === 'carte') setAnswerMode('map')
    else if (answerMode === 'map') setAnswerMode('qcm')
    setPicked(null)
    setTyped('')
    setSeed((s) => s + 1)
    setSecondsLeft((m === 'carte' ? MAP_TIMER_SECONDS : TIMER_SECONDS)[difficulty])
  }

  function selectDifficulty(d: Difficulty) {
    setDifficulty(d)
    setLives(LIVES_FOR[d])
    setScore(0)
    setAsked(0)
    setStreak(0)
    setStreakPeak(0)
    setGameOver(false)
    setPicked(null)
    setTyped('')
    setSecondsLeft((isMapMode ? MAP_TIMER_SECONDS : TIMER_SECONDS)[d])
    setSeed((s) => s + 1)
  }

  function selectAnswerMode(am: AnswerMode) {
    setAnswerMode(am)
    resetRun()
  }

  function resolveAnswer(choice: string, isCorrect: boolean) {
    if (!round || picked || gameOver) return
    setPicked(choice)
    const nextAsked = asked + 1
    setAsked(nextAsked)
    beep(isCorrect)
    if (isCorrect) {
      const nextScore = score + 1
      setScore(nextScore)
      const nextStreak = streak + 1
      setStreak(nextStreak)
      const peak = Math.max(streakPeak, nextStreak)
      setStreakPeak(peak)
      endAfterFeedback.current = false
      runSnapshot.current = { score: nextScore, asked: nextAsked, peak }
    } else {
      setStreak(0)
      runSnapshot.current = { score, asked: nextAsked, peak: streakPeak }
      if (isPlay) {
        const nextLives = Math.max(0, lives - 1)
        setLives(nextLives)
        endAfterFeedback.current = nextLives <= 0
      } else {
        endAfterFeedback.current = false
      }
    }
  }

  function answer(choice: string) {
    if (!round) return
    resolveAnswer(choice, choice === round.answer)
  }

  function submitTyped(e: FormEvent) {
    e.preventDefault()
    if (!round || picked) return
    const strict = difficulty === 'facile' ? 'loose' : 'strict'
    const ok = answersMatch(typed, round.answer, strict)
    resolveAnswer(typed || '—', ok)
  }

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
    return (
      <div className="game-view">
        <div className="game-board game-over">
          <p className="game-prompt">Partie terminée</p>
          <p className="game-over-score">
            Score <strong>{score}</strong> / {asked}
            <span className="game-pct"> · {pct} %</span>
          </p>
          <p className="game-over-streak">
            Meilleure série cette partie : <strong>×{streakPeak}</strong>
            {best.bestStreak > 0 ? (
              <> · Record <strong>×{best.bestStreak}</strong></>
            ) : null}
          </p>
          <button type="button" className="game-next" onClick={resetRun}>
            Rejouer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`game-view ${isMapMode ? 'is-map-mode' : ''}`}>
      <div className={`game-toolbar ${isMapMode ? 'is-compact' : ''}`}>
        <div className="game-toolbar-primary">
          <div className="game-field">
            <span className="game-field-label">Catégorie</span>
            <div className="game-group game-categories" role="group" aria-label="Catégorie">
              {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`game-chip game-chip-cat ${category === c ? 'is-active' : ''}`}
                  onClick={() => selectCategory(c)}
                >
                  {CATEGORY_LABEL[c]}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="game-chip game-hist-btn"
            onClick={() => setHistoryOpen(true)}
          >
            Historique
          </button>
        </div>

        <div className="game-toolbar-secondary">
          <div className="game-field">
            <span className="game-field-label">Sous-mode</span>
            <div className="game-group" role="group" aria-label="Sous-mode">
              {availableModes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`game-chip ${mode === m.id ? 'is-active' : ''}`}
                  onClick={() => selectMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {!isMapMode ? (
            <>
              <div className="game-field-sep" aria-hidden />
              <div className="game-field">
                <span className="game-field-label">Réponse</span>
                <div className="game-group" role="group" aria-label="Type de réponse">
                  <button
                    type="button"
                    className={`game-chip ${effectiveAnswerMode === 'qcm' ? 'is-active' : ''}`}
                    onClick={() => selectAnswerMode('qcm')}
                  >
                    QCM
                  </button>
                  <button
                    type="button"
                    className={`game-chip ${effectiveAnswerMode === 'saisie' ? 'is-active' : ''}`}
                    onClick={() => selectAnswerMode('saisie')}
                  >
                    Réponse unique
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {isMapMode && category === 'departements' ? (
            <>
              <div className="game-field-sep" aria-hidden />
              <div className="game-field">
                <span className="game-field-label">Territoires</span>
                <div className="game-group" role="group" aria-label="DOM-TOM">
                  <button
                    type="button"
                    className={`game-chip game-chip-dom ${mapDomTom ? 'is-on' : 'is-off'}`}
                    onClick={toggleMapDomTom}
                    aria-pressed={mapDomTom}
                  >
                    DOM-TOM
                    <span className="game-pastille" aria-hidden>
                      {mapDomTom ? 'actif' : 'inactif'}
                    </span>
                  </button>
                </div>
              </div>
            </>
          ) : null}

          <div className="game-field-sep" aria-hidden />

          <div className="game-field game-field-diff">
            <span className="game-field-label">Difficulté</span>
            <div className="game-group" role="group" aria-label="Difficulté">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`game-chip game-chip-diff ${difficulty === d.id ? 'is-active' : ''} is-${d.id}`}
                  onClick={() => selectDifficulty(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {best.bestStreak > 0 ? (
              <p className="game-record">Record ×{best.bestStreak}</p>
            ) : (
              <p className="game-record is-empty">Pas encore de record</p>
            )}
          </div>
        </div>
      </div>

      <div
        className={`game-board ${isMapMode ? 'is-map-board' : ''}`}
        key={`${variant}-${category}-${mode}-${difficulty}-${answerMode}-${seed}`}
      >
        <div className="game-board-hud" aria-live="polite">
          {isPlay ? (
            <>
              <Lives lives={lives} max={maxLives} />
              <span
                className={`game-timer ${secondsLeft <= 5 ? 'is-urgent' : ''}`}
                aria-label={`${secondsLeft} secondes`}
              >
                {secondsLeft}s
              </span>
            </>
          ) : null}
          <span className="game-score">
            Score <strong>{score}</strong>
            {!isPlay ? <> / {asked}</> : null}
          </span>
          {!isPlay ? <span className="game-pct">{pct} %</span> : null}
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
          />
        ) : null}

        {round.choiceKind === 'map' && round.mapKind === 'world' ? (
          <WorldMapQuiz
            answerCode={round.answer}
            locked={revealed}
            picked={picked}
            onPick={answer}
          />
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
            {round.choices.map((choice) => {
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
                    round.choiceKind === 'flag'
                      ? (COUNTRIES.find((c) => c.code === choice)?.name ?? choice)
                      : choice
                  }
                >
                  {round.choiceKind === 'flag' ? <FlagChoice code={choice} /> : choice}
                </button>
              )
            })}
          </div>
        ) : null}

        {revealed ? (
          <div className={`game-feedback ${correct ? 'is-ok' : 'is-ko'}`}>
            <p>
              {picked === '__timeout__'
                ? `Temps écoulé. Réponse : ${round.answerLabel}`
                : correct
                  ? 'Exact.'
                  : `La bonne réponse : ${round.answerLabel}`}
            </p>
            {!isPlay ? (
              <button type="button" className="game-next" onClick={next}>
                Question suivante
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {historyOpen ? <HistoryPanel onClose={() => setHistoryOpen(false)} /> : null}
    </div>
  )
}
