import { DEPT_CARDS } from '../cards/CartesFranceView'
import { COUNTRIES } from '../data/countries'
import { pickCountryDistractors, pickDeptDistractors } from '../game/difficulty'
import type { DuelAnswerMode, DuelCategory, DuelKind, DuelRound } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function sortAlpha(arr: string[]): string[] {
  return [...arr].sort((a, b) => a.localeCompare(b, 'fr'))
}

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function pickKind(category: DuelCategory): DuelKind {
  if (category === 'departements') return 'chiffre'
  if (category === 'pays') return 'flagToName'
  if (category === 'capitale') return 'nameToCapital'
  const pool: DuelKind[] = ['chiffre', 'flagToName', 'nameToCapital']
  return pool[Math.floor(Math.random() * pool.length)]!
}

export function makeDuelRound(
  category: DuelCategory,
  answerMode: DuelAnswerMode,
): DuelRound {
  const kind = pickKind(category)
  const saisie = answerMode === 'saisie'

  if (kind === 'chiffre') {
    const card = DEPT_CARDS[Math.floor(Math.random() * DEPT_CARDS.length)]!
    const distractors = pickDeptDistractors(card, DEPT_CARDS, 'difficile')
    return {
      id: uid(),
      kind,
      prompt: 'Quel département ?',
      show: 'code',
      showValue: card.code,
      answer: card.name,
      choices: saisie
        ? []
        : sortAlpha([card.name, ...distractors.map((d) => d.name)]),
      answerLabel: card.name,
    }
  }

  if (kind === 'flagToName') {
    const card = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]!
    const distractors = pickCountryDistractors(card, COUNTRIES, 'difficile')
    return {
      id: uid(),
      kind,
      prompt: 'Quel pays ?',
      show: 'flag',
      showCode: card.code,
      answer: card.name,
      choices: saisie
        ? []
        : sortAlpha([card.name, ...distractors.map((d) => d.name)]),
      answerLabel: card.name,
    }
  }

  const card = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]!
  const distractors = pickCountryDistractors(card, COUNTRIES, 'difficile')
  return {
    id: uid(),
    kind: 'nameToCapital',
    prompt: 'Quelle capitale ?',
    show: 'name',
    showValue: card.name,
    answer: card.capital,
    choices: saisie
      ? []
      : sortAlpha([card.capital, ...distractors.map((d) => d.capital)]),
    answerLabel: card.capital,
  }
}

export function makeDuelDeck(
  category: DuelCategory,
  answerMode: DuelAnswerMode,
  n: number,
): DuelRound[] {
  const out: DuelRound[] = []
  const seen = new Set<string>()
  let guard = 0
  while (out.length < n && guard < n * 20) {
    guard++
    const r = makeDuelRound(category, answerMode)
    const key = `${r.kind}:${r.answer}:${r.showValue ?? r.showCode ?? ''}`
    if (seen.has(key)) continue
    seen.add(key)
    // Mélanger l’ordre QCM pour chaque copie indépendante
    out.push({
      ...r,
      choices: r.choices.length ? shuffle(r.choices) : [],
    })
  }
  return out
}
