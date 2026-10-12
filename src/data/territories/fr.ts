import { FRANCE_BACK_IDS } from '../../cards/FranceBackIcons'
import { FICHES } from '../cartes'
import { DEPARTEMENTS } from '../departements'
import { DEPT_PICTOS } from '../deptPictos'
import type { TerritoryPack, TerritoryUnit } from './types'

/**
 * France — départements métropolitains (96).
 * Emblèmes : public/blasons/{code}.png — mêmes pictos que le lexique France.
 */

const FICHE_BY_CODE = Object.fromEntries(FICHES.map((f) => [f.code, f]))

const units: TerritoryUnit[] = DEPARTEMENTS.filter((d) => d.group === 'metro').map(
  (d) => {
    const fiche = FICHE_BY_CODE[d.code]
    return {
      code: d.code,
      name: d.name,
      capital: fiche?.chefLieu ?? '—',
      region: fiche?.region,
      pictos: DEPT_PICTOS[d.code] ?? [],
    }
  },
)

export const FR_PACK: TerritoryPack = {
  id: 'fr',
  country: 'France',
  unitKind: 'Département',
  backTitle: 'Départements',
  backSub: 'de France',
  ribbonBg: '#002395',
  accent: '#ed2939',
  emblemKind: 'blason',
  subLabel: 'Chef-lieu',
  backIds: FRANCE_BACK_IDS,
  units,
}
