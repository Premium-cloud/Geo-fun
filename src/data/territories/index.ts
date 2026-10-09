import { BR_PACK } from './br'
import { CA_PACK } from './ca'
import { CH_PACK } from './ch'
import { DE_PACK } from './de'
import { ES_PACK } from './es'
import { JP_PACK } from './jp'
import { US_PACK } from './us'
import type { TerritoryPack, TerritoryPackId } from './types'

export type { TerritoryPack, TerritoryPackId, TerritoryUnit } from './types'
export { unitByCode } from './types'

export const TERRITORY_PACKS: Record<TerritoryPackId, TerritoryPack> = {
  ch: CH_PACK,
  us: US_PACK,
  es: ES_PACK,
  de: DE_PACK,
  jp: JP_PACK,
  ca: CA_PACK,
  br: BR_PACK,
}

export const TERRITORY_PACK_ORDER: TerritoryPackId[] = [
  'ch',
  'us',
  'es',
  'de',
  'jp',
  'ca',
  'br',
]

export function getUnitPictos(packId: TerritoryPackId, code: string) {
  const unit = TERRITORY_PACKS[packId].units.find((u) => u.code === code)
  return unit?.pictos ?? []
}
