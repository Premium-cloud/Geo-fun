import { useEffect, useMemo, useState } from 'react'
import { DEPT_CARDS, type DeptCard } from '../cards/CartesFranceView'
import { COUNTRIES, type Country } from '../data/countries'
import {
  DIFFICULTY_OPTIONS,
  pickCountryDistractors,
  pickDeptDistractors,
  pickRegionDistractors,
  type Difficulty,
} from './difficulty'
import './GameView.css'

type Category = 'departements' | 'pays' | 'capitale'

type DeptMode = 'chiffre' | 'chefLieu' | 'blason' | 'region'
type PaysMode = 'flagToName' | 'nameToFlag' | 'capitalToName' | 'capitalToFlag'
type CapitaleMode = 'flagToCapital' | 'nameToCapital'
type Mode = DeptMode | PaysMode | CapitaleMode

type ChoiceKind = 'text' | 'flag'

type Round = {
  prompt: string
  show: 'code' | 'chefLieu' | 'blason' | 'flag' | 'name' | 'capital' | 'deptName'
  showValue?: string
  showCode?: string
  answer: string
  choices: string[]
  choiceKind: ChoiceKind
  answerLabel: string
}

const DEPT_MODES: { id: DeptMode; label: string }[] = [
  { id: 'chiffre', label: 'Par chiffre' },
  { id: 'chefLieu', label: 'Par chef-lieu' },
  { id: 'blason', label: 'Par blason' },
  { id: 'region', label: 'Par région' },
]

const PAYS_MODES: { id: PaysMode; label: string }[] = [
  { id: 'flagToName', label: 'Drapeau → nom' },
  { id: 'nameToFlag', label: 'Nom → drapeau' },
  { id: 'capitalToName', label: 'Capitale → pays' },
  { id: 'capitalToFlag', label: 'Capitale → drapeau' },
]

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

function pickDeptCard(): DeptCard {
  return shuffle(DEPT_CARDS)[0]!
}

function pickCountry(): Country {
  return shuffle(COUNTRIES)[0]!
}

function makeDeptRound(mode: DeptMode, difficulty: Difficulty): Round | null {
  if (DEPT_CARDS.length < 4) return null
  const card = pickDeptCard()
  const distractors = pickDeptDistractors(card, DEPT_CARDS, difficulty)

  if (mode === 'chiffre') {
    const answer = card.name
    return {
      prompt: 'Quel département ?',
      show: 'code',
      showValue: card.code,
      answer,
      choices: shuffle([answer, ...distractors.map((d) => d.name)]),
      choiceKind: 'text',
      answerLabel: answer,
    }
  }

  if (mode === 'chefLieu') {
    const answer = card.name
    return {
      prompt: 'Quel département ?',
      show: 'chefLieu',
      showValue: card.chefLieu,
      answer,
      choices: shuffle([answer, ...distractors.map((d) => d.name)]),
      choiceKind: 'text',
      answerLabel: answer,
    }
  }

  if (mode === 'blason') {
    const answer = card.name
    return {
      prompt: 'Quel département ?',
      show: 'blason',
      showCode: card.code,
      answer,
      choices: shuffle([answer, ...distractors.map((d) => d.name)]),
      choiceKind: 'text',
      answerLabel: answer,
    }
  }

  const answer = card.region
  const regionChoices = pickRegionDistractors(answer, allRegions(), difficulty)
  if (regionChoices.length < 3) return null
  return {
    prompt: 'Quelle région ?',
    show: 'deptName',
    showValue: card.name,
    showCode: card.code,
    answer,
    choices: shuffle([answer, ...regionChoices]),
    choiceKind: 'text',
    answerLabel: answer,
  }
}

function makePaysRound(mode: PaysMode, difficulty: Difficulty): Round | null {
  if (COUNTRIES.length < 4) return null
  const card = pickCountry()
  const distractors = pickCountryDistractors(card, COUNTRIES, difficulty)

  if (mode === 'flagToName') {
    const answer = card.name
    return {
      prompt: 'Quel pays ?',
      show: 'flag',
      showCode: card.code,
      answer,
      choices: shuffle([answer, ...distractors.map((d) => d.name)]),
      choiceKind: 'text',
      answerLabel: answer,
    }
  }

  if (mode === 'nameToFlag') {
    const answer = card.code
    return {
      prompt: 'Quel drapeau ?',
      show: 'name',
      showValue: card.name,
      answer,
      choices: shuffle([answer, ...distractors.map((d) => d.code)]),
      choiceKind: 'flag',
      answerLabel: card.name,
    }
  }

  if (mode === 'capitalToName') {
    const answer = card.name
    return {
      prompt: 'Quel pays ?',
      show: 'capital',
      showValue: card.capital,
      answer,
      choices: shuffle([answer, ...distractors.map((d) => d.name)]),
      choiceKind: 'text',
      answerLabel: answer,
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
  }
}

function makeCapitaleRound(mode: CapitaleMode, difficulty: Difficulty): Round | null {
  if (COUNTRIES.length < 4) return null
  const card = pickCountry()
  const distractors = pickCountryDistractors(card, COUNTRIES, difficulty)
  const answer = card.capital

  if (mode === 'flagToCapital') {
    return {
      prompt: 'Quelle capitale ?',
      show: 'flag',
      showCode: card.code,
      answer,
      choices: shuffle([answer, ...distractors.map((d) => d.capital)]),
      choiceKind: 'text',
      answerLabel: answer,
    }
  }

  return {
    prompt: 'Quelle capitale ?',
    show: 'name',
    showValue: card.name,
    answer,
    choices: shuffle([answer, ...distractors.map((d) => d.capital)]),
    choiceKind: 'text',
    answerLabel: answer,
  }
}

function makeRound(
  category: Category,
  mode: Mode,
  difficulty: Difficulty,
): Round | null {
  if (category === 'departements') return makeDeptRound(mode as DeptMode, difficulty)
  if (category === 'pays') return makePaysRound(mode as PaysMode, difficulty)
  return makeCapitaleRound(mode as CapitaleMode, difficulty)
}

function PromptVisual({ round }: { round: Round }) {
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

const MAX_LIVES = 3
const AUTO_NEXT_MS = 900

function Lives({ lives }: { lives: number }) {
  return (
    <div className="game-lives" aria-label={`${lives} vie${lives > 1 ? 's' : ''}`}>
      {Array.from({ length: MAX_LIVES }, (_, i) => (
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
  const [score, setScore] = useState(0)
  const [asked, setAsked] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [gameOver, setGameOver] = useState(false)
  const [seed, setSeed] = useState(0)

  const availableModes = modesFor(category)

  const round = useMemo(
    () => makeRound(category, mode, difficulty),
    [category, mode, difficulty, seed],
  )

  function resetRun() {
    setScore(0)
    setAsked(0)
    setStreak(0)
    setLives(MAX_LIVES)
    setGameOver(false)
    setPicked(null)
    setSeed((s) => s + 1)
  }

  function next() {
    setPicked(null)
    setSeed((s) => s + 1)
  }

  // Reset when switching Entraînement ↔ Jeu
  useEffect(() => {
    resetRun()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant])

  // Mode Jeu : enchaîne auto après un court feedback
  useEffect(() => {
    if (!isPlay || !picked || gameOver) return
    const t = window.setTimeout(() => {
      if (lives <= 0) {
        setGameOver(true)
        setPicked(null)
      } else {
        next()
      }
    }, AUTO_NEXT_MS)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, isPlay, gameOver, lives])

  function selectCategory(cat: Category) {
    setCategory(cat)
    setMode(defaultMode(cat))
    resetRun()
  }

  function selectMode(m: Mode) {
    setMode(m)
    setPicked(null)
    setSeed((s) => s + 1)
  }

  function selectDifficulty(d: Difficulty) {
    setDifficulty(d)
    resetRun()
  }

  function answer(choice: string) {
    if (!round || picked || gameOver) return
    setPicked(choice)
    setAsked((n) => n + 1)
    if (choice === round.answer) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
      if (isPlay) {
        setLives((l) => {
          const nextLives = l - 1
          return nextLives
        })
      }
    }
  }

  if (!round) {
    return (
      <div className="game-view">
        <p className="game-empty">Pas assez de cartes pour lancer une partie.</p>
      </div>
    )
  }

  const revealed = picked !== null
  const correct = picked === round.answer
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
          <button type="button" className="game-next" onClick={resetRun}>
            Rejouer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-view">
      <p className="game-session">
        {isPlay ? 'Mode Jeu · 3 vies' : 'Entraînement'}
      </p>

      <div className="game-toolbar">
        <div className="game-toolbar-primary">
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

          <div className="game-field-sep" aria-hidden />

          <div className="game-field game-field-diff">
            <span className="game-field-label">Difficulté</span>
            <div className="game-group" role="group" aria-label="Difficulté">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`game-chip game-chip-diff ${difficulty === d.id ? 'is-active' : ''} ${d.id === 'difficile' ? 'is-hard' : 'is-easy'}`}
                  onClick={() => selectDifficulty(d.id)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="game-board" key={`${variant}-${category}-${mode}-${difficulty}-${seed}`}>
        <div className="game-board-hud" aria-live="polite">
          {isPlay ? <Lives lives={lives} /> : null}
          <span className="game-score">
            Score <strong>{score}</strong>
            {!isPlay ? <> / {asked}</> : null}
          </span>
          {!isPlay ? <span className="game-pct">{pct} %</span> : null}
          {streak >= 3 ? <span className="game-streak">×{streak}</span> : null}
        </div>
        <p className="game-prompt">{round.prompt}</p>
        <PromptVisual round={round} />

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

        {revealed ? (
          <div className={`game-feedback ${correct ? 'is-ok' : 'is-ko'}`}>
            <p>{correct ? 'Exact.' : `La bonne réponse : ${round.answerLabel}`}</p>
            {!isPlay ? (
              <button type="button" className="game-next" onClick={next}>
                Question suivante
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
