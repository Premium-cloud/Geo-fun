import type { PictoId } from './pictos'

/** Slot verso (positions validées France — spec CARTE_RECTO_VERSO). */
export type BackScatterSlot = { x: number; y: number; r: number; s: number }

export type BackScatterItem = BackScatterSlot & { id: PictoId }

/**
 * 40 positions partagées — mêmes que le verso France.
 * Les pays ne changent que les `PictoId`, pas la géométrie.
 */
export const BACK_SCATTER_SLOTS: readonly BackScatterSlot[] = [
  { x: 54, y: 93, r: -26, s: 10 },
  { x: 8, y: 10, r: -18, s: 11 },
  { x: 89, y: 26, r: -12, s: 12 },
  { x: 8, y: 60, r: -6, s: 10 },
  { x: 85, y: 55, r: -15, s: 11 },
  { x: 8, y: 93, r: 14, s: 12 },
  { x: 51, y: 7, r: 20, s: 10 },
  { x: 32, y: 27, r: 26, s: 11 },
  { x: 87, y: 91, r: -22, s: 12 },
  { x: 28, y: 74, r: 10, s: 10 },
  { x: 78, y: 30, r: -16, s: 11 },
  { x: 8, y: 33, r: 18, s: 12 },
  { x: 62, y: 73, r: -8, s: 10 },
  { x: 62, y: 30, r: 12, s: 11 },
  { x: 88, y: 7, r: -24, s: 12 },
  { x: 33, y: 93, r: 6, s: 10 },
  { x: 29, y: 7, r: 22, s: 11 },
  { x: 6, y: 47, r: -14, s: 12 },
  { x: 74, y: 18, r: 16, s: 10 },
  { x: 8, y: 75, r: -20, s: 11 },
  { x: 95, y: 44, r: 4, s: 12 },
  { x: 48, y: 81, r: 24, s: 10 },
  { x: 57, y: 18, r: -10, s: 11 },
  { x: 76, y: 82, r: 28, s: 12 },
  { x: 20, y: 18, r: 15, s: 10 },
  { x: 95, y: 65, r: 8, s: 11 },
  { x: 95, y: 75, r: 9, s: 12 },
  { x: 75, y: 2, r: -9, s: 10 },
  { x: 22, y: 85, r: 11, s: 11 },
  { x: 67, y: 89, r: -11, s: 12 },
  { x: 74, y: 64, r: -26, s: 10 },
  { x: 50, y: 66, r: 20, s: 10 },
  { x: 10, y: 24, r: -12, s: 12 },
  { x: 21, y: 37, r: -6, s: 10 },
  { x: 41, y: 20, r: 8, s: 11 },
  { x: 21, y: 65, r: 14, s: 12 },
  { x: 35, y: 66, r: 20, s: 10 },
  { x: 44, y: 34, r: 26, s: 11 },
  { x: 89, y: 16, r: -22, s: 12 },
  { x: 78, y: 72, r: 10, s: 10 },
] as const

/** Associe 40 pictos uniques aux slots France (cycle si liste plus courte). */
export function buildBackScatter(ids: readonly PictoId[]): BackScatterItem[] {
  if (ids.length === 0) return []
  return BACK_SCATTER_SLOTS.map((slot, i) => ({
    ...slot,
    id: ids[i % ids.length]!,
  }))
}
