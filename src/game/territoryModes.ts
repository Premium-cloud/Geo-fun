/**
 * Modes de jeu Territoires — filtrés pack par pack (éliminer le trop évident).
 */
import {
  TERRITORY_PACKS,
  type TerritoryPack,
  type TerritoryPackId,
  type TerritoryUnit,
} from '../data/territories'
import type { AnswerMode } from '../lib/storage'
import type { Difficulty } from './difficulty'

export type TerritoryMode = 'carte' | 'code' | 'capital' | 'emblem'

export const TERRITORY_MODE_LABEL: Record<TerritoryMode, string> = {
  carte: 'Carte',
  code: 'Par code',
  capital: 'Par capital',
  emblem: 'Par blason / drapeau',
}

/** Modes jouables (pas d’abréviations / capitales triviales). */
export const TERRITORY_MODES_BY_PACK: Record<TerritoryPackId, TerritoryMode[]> = {
  ch: ['carte', 'emblem'],
  us: ['carte', 'capital', 'emblem'],
  es: ['carte', 'capital', 'emblem'],
  de: ['carte', 'capital', 'emblem'],
  jp: ['carte', 'code', 'emblem'],
  ca: ['carte', 'capital', 'emblem'],
  br: ['carte', 'capital', 'emblem'],
}

export function territoryModesFor(packId: TerritoryPackId) {
  return TERRITORY_MODES_BY_PACK[packId].map((id) => ({
    id,
    label: TERRITORY_MODE_LABEL[id],
  }))
}

export function defaultTerritoryMode(packId: TerritoryPackId): TerritoryMode {
  return TERRITORY_MODES_BY_PACK[packId][0]!
}

export function territoryEmblemUrl(packId: string, code: string): string {
  return `/mockups/emblems/${packId}/${code}.svg`
}

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

/** Nombre de distracteurs selon difficulté. */
function distractorCount(difficulty: Difficulty): number {
  if (difficulty === 'facile') return 3
  if (difficulty === 'difficile') return 3
  return 5
}

export function pickTerritoryDistractors(
  unit: TerritoryUnit,
  pack: TerritoryPack,
  difficulty: Difficulty,
): TerritoryUnit[] {
  const pool = shuffle(pack.units.filter((u) => u.code !== unit.code))
  return pool.slice(0, Math.min(distractorCount(difficulty), pool.length))
}

export type TerritoryRound = {
  prompt: string
  show: 'mapPrompt' | 'code' | 'capital' | 'territoryEmblem'
  showValue?: string
  showCode?: string
  answer: string
  choices: string[]
  choiceKind: 'text' | 'saisie' | 'map'
  answerLabel: string
  itemId: string
  mapKind?: 'territory'
  territoryPackId: TerritoryPackId
}

export function makeTerritoryRound(
  packId: TerritoryPackId,
  mode: TerritoryMode,
  difficulty: Difficulty,
  answerMode: AnswerMode,
): TerritoryRound | null {
  const pack = TERRITORY_PACKS[packId]
  const allowed = TERRITORY_MODES_BY_PACK[packId]
  if (!allowed.includes(mode)) return null
  if (pack.units.length < 4) return null

  const unit = pack.units[Math.floor(Math.random() * pack.units.length)]!
  const distractors = pickTerritoryDistractors(unit, pack, difficulty)
  const saisie = answerMode === 'saisie'
  const nameChoices = saisie
    ? []
    : sortAlpha([unit.name, ...distractors.map((d) => d.name)])

  if (mode === 'carte') {
    return {
      prompt: `Où se trouve « ${unit.name} » ?`,
      show: 'mapPrompt',
      showValue: unit.name,
      showCode: unit.code,
      answer: unit.code,
      choices: [],
      choiceKind: 'map',
      answerLabel: `${unit.code} — ${unit.name}`,
      itemId: `${packId}:${unit.code}`,
      mapKind: 'territory',
      territoryPackId: packId,
    }
  }

  if (mode === 'code') {
    return {
      prompt: `Quel ${pack.unitKind.toLowerCase()} ?`,
      show: 'code',
      showValue: unit.code,
      answer: unit.name,
      choices: nameChoices,
      choiceKind: saisie ? 'saisie' : 'text',
      answerLabel: unit.name,
      itemId: `${packId}:${unit.code}`,
      territoryPackId: packId,
    }
  }

  if (mode === 'capital') {
    return {
      prompt: `Quel ${pack.unitKind.toLowerCase()} ?`,
      show: 'capital',
      showValue: unit.capital,
      answer: unit.name,
      choices: nameChoices,
      choiceKind: saisie ? 'saisie' : 'text',
      answerLabel: unit.name,
      itemId: `${packId}:${unit.code}`,
      territoryPackId: packId,
    }
  }

  return {
    prompt: `Quel ${pack.unitKind.toLowerCase()} ?`,
    show: 'territoryEmblem',
    showCode: unit.code,
    answer: unit.name,
    choices: nameChoices,
    choiceKind: saisie ? 'saisie' : 'text',
    answerLabel: unit.name,
    itemId: `${packId}:${unit.code}`,
    territoryPackId: packId,
  }
}
