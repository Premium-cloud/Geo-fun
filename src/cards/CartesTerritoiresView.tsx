import { useMemo, useState } from 'react'
import {
  TERRITORY_PACK_ORDER,
  TERRITORY_PACKS,
  type TerritoryPack,
  type TerritoryPackId,
  type TerritoryUnit,
} from '../data/territoryPictos'
import { buildBackScatter } from './backScatterSlots'
import { Picto } from './pictos'
import './CartesMondeView.css'
import './CartesFranceView.css'
import './CartesTerritoiresView.css'

function inkOn(bg: string): string {
  const hex = bg.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luma > 0.62 ? '#1a1a1a' : '#ffffff'
}

function nameSizeClass(name: string): string {
  if (name.length > 22) return 'is-xl'
  if (name.length > 15) return 'is-long'
  return ''
}

function emblemCandidates(packId: string, code: string): string[] {
  const base = `/mockups/emblems/${packId}/${code}`
  return [`${base}.svg`, `${base}.png`]
}

function EmblemImg({
  packId,
  code,
  name,
  kind,
  eager = false,
}: {
  packId: string
  code: string
  name: string
  kind: 'blason' | 'flag'
  eager?: boolean
}) {
  const sources = emblemCandidates(packId, code)
  const [idx, setIdx] = useState(0)
  const src = sources[idx]

  if (!src) {
    return (
      <span className="blason-fallback" aria-hidden>
        {code}
      </span>
    )
  }

  return (
    <img
      className={kind === 'flag' ? 'territoire-flag' : 'blason'}
      src={src}
      alt={`${kind === 'flag' ? 'Drapeau' : 'Blason'} de ${name}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      onError={() => setIdx((i) => i + 1)}
    />
  )
}

function CardFront({
  pack,
  unit,
  eager = false,
}: {
  pack: TerritoryPack
  unit: TerritoryUnit
  eager?: boolean
}) {
  const ink = inkOn(pack.ribbonBg)
  const chefClass = unit.capital.length > 16 ? 'is-long' : ''

  return (
    <>
      <span className="ribbon" style={{ background: pack.ribbonBg, color: ink }}>
        {pack.country}
      </span>
      <span className="identity">
        <span className="code" style={{ color: pack.accent }}>
          {unit.code}
        </span>
        <span className={`dept ${nameSizeClass(unit.name)}`} title={unit.name}>
          {unit.name}
        </span>
        <span className={`chef ${chefClass}`}>
          <span className="chef-k">{pack.subLabel}</span> {unit.capital}
        </span>
      </span>
      <span className={`emblem has-pictos is-${pack.emblemKind}`}>
        <EmblemImg
          packId={pack.id}
          code={unit.code}
          name={unit.name}
          kind={pack.emblemKind}
          eager={eager}
        />
      </span>
      <span className="front-pictos" aria-label="Spécialités">
        {unit.pictos.map((p) => (
          <span key={`${p.icon}-${p.label}`} className="front-picto" title={p.label}>
            <Picto id={p.icon} />
            <span className="front-picto-label">{p.label}</span>
          </span>
        ))}
      </span>
    </>
  )
}

function CardBack({ pack }: { pack: TerritoryPack }) {
  const items = useMemo(() => buildBackScatter(pack.backIds), [pack.backIds])
  return (
    <span className="back-face back-face-fr">
      <span className="back-pictos" aria-hidden>
        {items.map((item) => (
          <span
            key={item.id}
            className="back-picto"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.s}%`,
              height: `${item.s}%`,
              transform: `translate(-50%, -50%) rotate(${item.r}deg)`,
            }}
          >
            <Picto id={item.id} />
          </span>
        ))}
      </span>
      <span className="back-mark">
        <span className="back-title">{pack.backTitle}</span>
        <span className="back-sub">{pack.backSub}</span>
      </span>
    </span>
  )
}

function PlayingCard({
  pack,
  unit,
  flipped,
  onFlip,
}: {
  pack: TerritoryPack
  unit: TerritoryUnit
  flipped: boolean
  onFlip: () => void
}) {
  return (
    <button
      type="button"
      className={`card ${flipped ? 'is-flipped' : ''}`}
      onClick={onFlip}
      aria-label={`${unit.name}, ${unit.capital}, ${pack.country}`}
    >
      <span className="card-inner">
        <span className="face face-front">
          <CardFront pack={pack} unit={unit} />
        </span>
        <span className="face face-back">
          <CardBack pack={pack} />
        </span>
      </span>
    </button>
  )
}

function PrintDeck({ pack }: { pack: TerritoryPack }) {
  const units = pack.units
  const pages: TerritoryUnit[][] = []
  for (let i = 0; i < units.length; i += 9) {
    pages.push(units.slice(i, i + 9))
  }
  const backOrder = [2, 1, 0, 5, 4, 3, 8, 7, 6]

  return (
    <div className="print-deck" aria-hidden>
      {pages.map((page, pageIndex) => {
        const slots: (TerritoryUnit | null)[] = [...page]
        while (slots.length < 9) slots.push(null)

        return (
          <div className="print-pair" key={`sheet-${pack.id}-${pageIndex}`}>
            <section className="print-sheet print-front">
              {slots.map((unit, i) => (
                <div className="print-card" key={`f-${pageIndex}-${i}`}>
                  {unit ? (
                    <div className="face face-front static">
                      <CardFront pack={pack} unit={unit} eager />
                    </div>
                  ) : null}
                </div>
              ))}
            </section>
            <section className="print-sheet print-back">
              {backOrder.map((i) => {
                const unit = slots[i]
                return (
                  <div className="print-card" key={`b-${pageIndex}-${i}`}>
                    {unit ? (
                      <div className="face face-back static">
                        <CardBack pack={pack} />
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </section>
          </div>
        )
      })}
    </div>
  )
}

export function CartesTerritoiresView() {
  const [packId, setPackId] = useState<TerritoryPackId>('ch')
  const [query, setQuery] = useState('')
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const pack = TERRITORY_PACKS[packId]

  const units = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pack.units
    return pack.units.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.capital.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q),
    )
  }, [pack, query])

  return (
    <div className="cartes-view cartes-france cartes-territoires">
      <div className="lexique-toolbar no-print">
        <label className="search">
          <span className="sr-only">Rechercher</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${pack.unitKind}, capital, code…`}
            autoComplete="off"
          />
        </label>
        <div className="chips territoire-pack-chips" role="tablist" aria-label="Pays">
          {TERRITORY_PACK_ORDER.map((id) => {
            const p = TERRITORY_PACKS[id]
            return (
              <button
                key={id}
                type="button"
                role="tab"
                className={`chip ${packId === id ? 'is-active' : ''}`}
                aria-selected={packId === id}
                onClick={() => {
                  setPackId(id)
                  setQuery('')
                  setFlipped({})
                }}
              >
                {p.country}
              </button>
            )
          })}
        </div>
      </div>

      <div className="lexique-body no-print">
        <aside className="lexique-side" aria-label="Packs territoires">
          {TERRITORY_PACK_ORDER.map((id) => {
            const p = TERRITORY_PACKS[id]
            return (
              <button
                key={id}
                type="button"
                className={`lexique-side-item ${packId === id ? 'is-active' : ''}`}
                onClick={() => {
                  setPackId(id)
                  setQuery('')
                  setFlipped({})
                }}
              >
                <span>{p.country}</span>
                <em>{p.units.length}</em>
              </button>
            )
          })}
        </aside>

        <div className="lexique-main">
          <div className="lexique-main-bar">
            <p className="count">
              {pack.country} — {units.length} {pack.unitKind.toLowerCase()}
              {units.length > 1 ? 's' : ''}
            </p>
          </div>
          {units.length === 0 ? (
            <p className="empty">Aucune zone ne correspond à votre recherche.</p>
          ) : (
            <div className="grid">
              {units.map((unit) => (
                <PlayingCard
                  key={`${pack.id}-${unit.code}`}
                  pack={pack}
                  unit={unit}
                  flipped={!!flipped[unit.code]}
                  onFlip={() =>
                    setFlipped((prev) => ({
                      ...prev,
                      [unit.code]: !prev[unit.code],
                    }))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <PrintDeck pack={pack} />
    </div>
  )
}
