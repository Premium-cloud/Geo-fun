import { COUNTRIES } from '../data/countries'
import {
  TERRITORY_PACKS,
  type TerritoryPackId,
} from '../data/territories'
import { MondePlayingCard } from '../cards/CartesMondeView'
import { TerritoryPlayingCard } from '../cards/CartesTerritoiresView'
import '../cards/CartesMondeView.css'
import '../cards/CartesFranceView.css'
import '../cards/CartesTerritoiresView.css'

export function parseCollectibleId(
  id: string,
):
  | { kind: 'monde'; code: string }
  | { kind: 'territory'; packId: TerritoryPackId; code: string }
  | null {
  const sep = id.indexOf(':')
  if (sep < 0) return null
  const head = id.slice(0, sep)
  const code = id.slice(sep + 1)
  if (!head || !code) return null
  if (head === 'monde') return { kind: 'monde', code }
  if (head in TERRITORY_PACKS) {
    return { kind: 'territory', packId: head as TerritoryPackId, code }
  }
  return null
}

/** Même carte que le lexique (recto / verso), pour l’album. */
export function AlbumCollectibleCard({
  id,
  foil,
  flipped,
  onFlip,
}: {
  id: string
  foil?: boolean
  flipped: boolean
  onFlip: () => void
}) {
  const parsed = parseCollectibleId(id)
  if (!parsed) return null

  if (parsed.kind === 'monde') {
    const card = COUNTRIES.find((c) => c.code === parsed.code)
    if (!card) return null
    return (
      <MondePlayingCard
        card={card}
        flipped={flipped}
        onFlip={onFlip}
        foil={foil}
      />
    )
  }

  const pack = TERRITORY_PACKS[parsed.packId]
  const unit = pack.units.find((u) => u.code === parsed.code)
  if (!unit) return null
  return (
    <TerritoryPlayingCard
      pack={pack}
      unit={unit}
      flipped={flipped}
      onFlip={onFlip}
      foil={foil}
    />
  )
}
