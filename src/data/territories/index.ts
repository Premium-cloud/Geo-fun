import { BR_PACK } from './br'
import { CA_PACK } from './ca'
import { CH_PACK } from './ch'
import { DE_PACK } from './de'
import { ES_PACK } from './es'
import { FR_PACK } from './fr'
import { JP_PACK } from './jp'
import { US_PACK } from './us'
import type { TerritoryPack, TerritoryPackId } from './types'
import { UNIT_REGION } from './unitRegions'

export type { TerritoryPack, TerritoryPackId, TerritoryUnit } from './types'
export { unitByCode } from './types'
export { TERRITORY_REGION_COLOR } from './unitRegions'

function withRegions(pack: TerritoryPack): TerritoryPack {
  const map = UNIT_REGION[pack.id]
  if (!map) return pack
  return {
    ...pack,
    units: pack.units.map((u) => ({
      ...u,
      region: u.region ?? map[u.code],
    })),
  }
}

export const TERRITORY_PACKS: Record<TerritoryPackId, TerritoryPack> = {
  fr: FR_PACK,
  ch: CH_PACK,
  us: withRegions(US_PACK),
  es: ES_PACK,
  de: DE_PACK,
  jp: withRegions(JP_PACK),
  ca: withRegions(CA_PACK),
  br: withRegions(BR_PACK),
}

export const TERRITORY_PACK_ORDER: TerritoryPackId[] = [
  'fr',
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
