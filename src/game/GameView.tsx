import { useMemo, useState } from 'react'
import { DEPT_CARDS, type DeptCard } from '../cards/CartesFranceView'
import { COUNTRIES, type Country } from '../data/countries'
import './GameView.css'

type Scope = 'france' | 'monde' | 'mixte'
type Mode = 'emblem' | 'name' | 'capital'

type QuizItem =
  | { kind: 'france'; card: DeptCard }
  | { kind: 'monde'; card: Country }

type Round = {
  item: QuizItem
  mode: Mode
  prompt: string
  answer: string
  choices: string[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function pickN<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

function flagUrl(code: string): string {
  return `/flags/${code.toLowerCase()}.svg`
}

function blasonUrl(code: string): string {
  return `/blasons/${code}.svg`
}

function buildPool(scope: Scope): QuizItem[] {
  const fr: QuizItem[] = DEPT_CARDS.map((card) => ({ kind: 'france', card }))
  const monde: QuizItem[] = COUNTRIES.map((card) => ({ kind: 'monde', card }))
  if (scope === 'france') return fr
  if (scope === 'monde') return monde
  return [...fr, ...monde]
}

function labelOf(item: QuizItem): string {
  return item.kind === 'france' ? item.card.name : item.card.name
}

function capitalOf(item: QuizItem): string {
  return item.kind === 'france' ? item.card.chefLieu : item.card.capital
}

function makeRound(pool: QuizItem[], mode: Mode): Round | null {
  if (pool.length < 4) return null
  const [item, ...rest] = shuffle(pool)
  if (!item) return null

  if (mode === 'emblem') {
    const answer = labelOf(item)
    const distractors = pickN(rest, 3).map(labelOf)
    return {
      item,
      mode,
      prompt: item.kind === 'france' ? 'Quel département ?' : 'Quel pays ?',
      answer,
      choices: shuffle([answer, ...distractors]),
    }
  }

  if (mode === 'name') {
    const answer = capitalOf(item)
    const distractors = pickN(rest, 3).map(capitalOf)
    return {
      item,
      mode,
      prompt:
        item.kind === 'france'
          ? `Chef-lieu de ${item.card.name} ?`
          : `Capitale de ${item.card.name} ?`,
      answer,
      choices: shuffle([answer, ...distractors]),
    }
  }

  // capital → name
  const answer = labelOf(item)
  const distractors = pickN(rest, 3).map(labelOf)
  return {
    item,
    mode,
    prompt:
      item.kind === 'france'
        ? `Département dont le chef-lieu est ${item.card.chefLieu} ?`
        : `Pays dont la capitale est ${item.card.capital} ?`,
    answer,
    choices: shuffle([answer, ...distractors]),
  }
}

function Emblem({ item }: { item: QuizItem }) {
  if (item.kind === 'monde') {
    return (
      <img
        className="game-emblem-img is-flag"
        src={flagUrl(item.card.code)}
        alt=""
        decoding="async"
      />
    )
  }
  return (
    <img
      className="game-emblem-img is-blason"
      src={blasonUrl(item.card.code)}
      alt=""
      decoding="async"
      onError={(e) => {
        const el = e.currentTarget
        if (el.src.endsWith('.svg')) {
          el.src = `/blasons/${item.card.code}.png`
        }
      }}
    />
  )
}

const MODE_LABEL: Record<Mode, string> = {
  emblem: 'Blason / drapeau',
  name: 'Chef-lieu / capitale',
  capital: 'Nom',
}

const SCOPE_LABEL: Record<Scope, string> = {
  france: 'France',
  monde: 'Monde',
  mixte: 'Mixte',
}

export function GameView() {
  const [scope, setScope] = useState<Scope>('mixte')
  const [mode, setMode] = useState<Mode>('emblem')
  const [score, setScore] = useState(0)
  const [asked, setAsked] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [seed, setSeed] = useState(0)

  const pool = useMemo(() => buildPool(scope), [scope])

  const round = useMemo(() => makeRound(pool, mode), [pool, mode, seed])

  function next() {
    setPicked(null)
    setSeed((s) => s + 1)
  }

  function answer(choice: string) {
    if (!round || picked) return
    setPicked(choice)
    setAsked((n) => n + 1)
    if (choice === round.answer) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }
  }

  function resetScore() {
    setScore(0)
    setAsked(0)
    setStreak(0)
    next()
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

  return (
    <div className="game-view">
      <div className="game-toolbar">
        <div className="game-group" role="group" aria-label="Périmètre">
          {(Object.keys(SCOPE_LABEL) as Scope[]).map((s) => (
            <button
              key={s}
              type="button"
              className={`game-chip ${scope === s ? 'is-active' : ''}`}
              onClick={() => {
                setScope(s)
                resetScore()
              }}
            >
              {SCOPE_LABEL[s]}
            </button>
          ))}
        </div>
        <div className="game-group" role="group" aria-label="Mode">
          {(Object.keys(MODE_LABEL) as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              className={`game-chip ${mode === m ? 'is-active' : ''}`}
              onClick={() => {
                setMode(m)
                next()
              }}
            >
              {MODE_LABEL[m]}
            </button>
          ))}
        </div>
        <div className="game-score" aria-live="polite">
          <span>
            Score <strong>{score}</strong> / {asked}
          </span>
          <span className="game-pct">{pct} %</span>
          {streak >= 3 ? <span className="game-streak">×{streak}</span> : null}
        </div>
      </div>

      <div className="game-board">
        <p className="game-prompt">{round.prompt}</p>

        {round.mode === 'emblem' ? (
          <div className="game-emblem" data-kind={round.item.kind}>
            <Emblem item={round.item} />
          </div>
        ) : null}

        {round.mode !== 'emblem' && round.item.kind === 'monde' ? (
          <p className="game-hint">{round.item.card.continent}</p>
        ) : null}
        {round.mode !== 'emblem' && round.item.kind === 'france' ? (
          <p className="game-hint">{round.item.card.region}</p>
        ) : null}

        <div className="game-choices">
          {round.choices.map((choice) => {
            let cls = 'game-choice'
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
              >
                {choice}
              </button>
            )
          })}
        </div>

        {revealed ? (
          <div className={`game-feedback ${correct ? 'is-ok' : 'is-ko'}`}>
            <p>{correct ? 'Exact.' : `La bonne réponse : ${round.answer}`}</p>
            <button type="button" className="game-next" onClick={next}>
              Question suivante
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
