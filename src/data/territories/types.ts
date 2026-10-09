import type { PictoId } from '../../cards/pictos'
import type { Specialty } from '../deptPictos'

export type TerritoryPackId = 'ch' | 'us' | 'es' | 'de' | 'jp' | 'ca' | 'br'

export type TerritoryUnit = {
  code: string
  name: string
  /** Chef-lieu / capital */
  capital: string
  /** 3 spécialités recto */
  pictos: Specialty[]
}

export type TerritoryPack = {
  id: TerritoryPackId
  country: string
  unitKind: string
  backTitle: string
  backSub: string
  ribbonBg: string
  accent: string
  emblemKind: 'blason' | 'flag'
  subLabel: string
  /** 40 pictos uniques verso (slots France). */
  backIds: readonly PictoId[]
  /** Toutes les zones du pack, ordre d’affichage. */
  units: readonly TerritoryUnit[]
}

export function unitByCode(
  pack: TerritoryPack,
  code: string,
): TerritoryUnit | undefined {
  return pack.units.find((u) => u.code === code)
}
