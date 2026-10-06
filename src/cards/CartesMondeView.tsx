import { useId, useMemo, useState } from 'react'
import {
  CONTINENT_COLOR,
  CONTINENT_ORDER,
  COUNTRIES,
  type Continent,
  type Country,
} from '../data/countries'
import { GLOBE_LAND_PATH } from './globeLandPath'
import './CartesMondeView.css'

function inkOn(bg: string): string {
  const hex = bg.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luma > 0.62 ? '#1a1a1a' : '#ffffff'
}

function flagUrl(code: string): string {
  return `/flags/${code.toLowerCase()}.svg`
}

function nameSizeClass(name: string): string {
  if (name.length > 22) return 'is-xl'
  if (name.length > 15) return 'is-long'
  return ''
}

function CardFront({ card }: { card: Country }) {
  const color = CONTINENT_COLOR[card.continent]
  const ink = inkOn(color)
  const ratio = card.flagRatio ?? '3 / 2'
  const label = card.shortName ?? card.name
  const chefClass = card.capital.length > 16 ? 'is-long' : ''
  const showMeta = !card.population.includes('—') && card.language.length > 0

  return (
    <>
      <span className="ribbon" style={{ background: color, color: ink }}>
        {card.continent}
      </span>
      <span className="identity">
        <span className="code">{card.code}</span>
        <span className={`dept ${nameSizeClass(label)}`} title={card.name}>
          {label}
        </span>
        <span className={`chef ${chefClass}`}>
          <span className="chef-k">Capitale</span> {card.capital}
        </span>
      </span>
      <span className="emblem">
        <img
          className="flag"
          style={{ aspectRatio: ratio }}
          src={flagUrl(card.code)}
          alt={`Drapeau de ${card.name}`}
          loading="lazy"
          decoding="async"
        />
      </span>
      {showMeta ? (
        <span className="meta" title={`${card.population} · ${card.language}`}>
          <span>{card.population}</span>
          <span className="meta-sep">·</span>
          <span className="meta-lang">{card.language}</span>
        </span>
      ) : null}
    </>
  )
}

function GlobeWatermark() {
  const clipId = useId().replace(/:/g, '')

  return (
    <svg
      className="back-globe"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="78" />
        </clipPath>
      </defs>

      <g className="globe-grid" fill="none" stroke="currentColor">
        <circle cx="100" cy="100" r="78" strokeWidth="1.15" />
        <ellipse cx="100" cy="100" rx="28" ry="78" strokeWidth="0.4" />
        <ellipse cx="100" cy="100" rx="52" ry="78" strokeWidth="0.4" />
        <line x1="22" y1="100" x2="178" y2="100" strokeWidth="0.4" />
        <path d="M34 66c22-5 46-7 66-7s44 2 66 7" strokeWidth="0.35" />
        <path d="M34 134c22 5 46 7 66 7s44-2 66-7" strokeWidth="0.35" />
      </g>

      <g
        className="globe-land"
        clipPath={`url(#${clipId})`}
        fill="currentColor"
        fillRule="evenodd"
      >
        <path d={GLOBE_LAND_PATH} />
      </g>
    </svg>
  )
}

function CardBack() {
  return (
    <span className="back-face">
      <GlobeWatermark />
      <span className="back-title">
        DRAPEAU
        <br />
        DU MONDE
      </span>
    </span>
  )
}

function PlayingCard({
  card,
  flipped,
  onFlip,
}: {
  card: Country
  flipped: boolean
  onFlip: () => void
}) {
  return (
    <button
      type="button"
      className={`card ${flipped ? 'is-flipped' : ''}`}
      onClick={onFlip}
      aria-label={`${card.name}, ${card.capital}, ${card.continent}`}
    >
      <span className="card-inner">
        <span className="face face-front">
          <CardFront card={card} />
        </span>
        <span className="face face-back">
          <CardBack />
        </span>
      </span>
    </button>
  )
}

function PrintDeck({ cards }: { cards: Country[] }) {
  const pages: Country[][] = []
  for (let i = 0; i < cards.length; i += 9) {
    pages.push(cards.slice(i, i + 9))
  }

  return (
    <div className="print-deck" aria-hidden>
      {pages.map((page, pageIndex) => {
        const slots: (Country | null)[] = [...page]
        while (slots.length < 9) slots.push(null)
        const backOrder = [2, 1, 0, 5, 4, 3, 8, 7, 6]

        return (
          <div key={`sheet-${pageIndex}`}>
            <section className="print-sheet print-front">
              {slots.map((card, i) => (
                <div className="print-card" key={`f-${pageIndex}-${i}`}>
                  {card ? (
                    <div className="face face-front static">
                      <CardFront card={card} />
                    </div>
                  ) : null}
                </div>
              ))}
            </section>
            <section className="print-sheet print-back">
              {backOrder.map((i) => {
                const card = slots[i]
                return (
                  <div className="print-card" key={`b-${pageIndex}-${i}`}>
                    {card ? (
                      <div className="face face-back static">
                        <CardBack />
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

export function CartesMondeView() {
  const [query, setQuery] = useState('')
  const [continent, setContinent] = useState<Continent | 'Tous'>('Tous')
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const cards = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COUNTRIES.filter((c) => {
      if (continent !== 'Tous' && c.continent !== continent) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        (c.shortName?.toLowerCase().includes(q) ?? false) ||
        c.capital.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q) ||
        c.language.toLowerCase().includes(q)
      )
    })
  }, [query, continent])

  const counts = useMemo(() => {
    const map = Object.fromEntries(CONTINENT_ORDER.map((c) => [c, 0])) as Record<
      Continent,
      number
    >
    for (const c of COUNTRIES) map[c.continent] += 1
    return map
  }, [])

  return (
    <div className="cartes-view">
      <div className="toolbar no-print">
        <label className="search">
          <span className="sr-only">Rechercher</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pays, capitale, code…"
            autoComplete="off"
          />
        </label>
        <div className="chips" role="tablist" aria-label="Continents">
          <button
            type="button"
            className={`chip ${continent === 'Tous' ? 'is-active' : ''}`}
            onClick={() => setContinent('Tous')}
          >
            Tous <em>{COUNTRIES.length}</em>
          </button>
          {CONTINENT_ORDER.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${continent === c ? 'is-active' : ''}`}
              style={
                continent === c
                  ? { background: CONTINENT_COLOR[c], color: inkOn(CONTINENT_COLOR[c]) }
                  : undefined
              }
              onClick={() => setContinent(c)}
            >
              {c} <em>{counts[c]}</em>
            </button>
          ))}
        </div>
        <p className="count">
          {cards.length} carte{cards.length > 1 ? 's' : ''}
        </p>
      </div>

      {cards.length === 0 ? (
        <p className="empty no-print">Aucun pays ne correspond à votre recherche.</p>
      ) : (
        <div className="grid no-print">
          {cards.map((card) => (
            <PlayingCard
              key={card.code}
              card={card}
              flipped={!!flipped[card.code]}
              onFlip={() =>
                setFlipped((prev) => ({ ...prev, [card.code]: !prev[card.code] }))
              }
            />
          ))}
        </div>
      )}

      <PrintDeck cards={COUNTRIES} />
    </div>
  )
}
