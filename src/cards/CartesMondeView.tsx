import { useId, useMemo, useState } from 'react'
import {
  CONTINENT_COLOR,
  CONTINENT_ORDER,
  COUNTRIES,
  type Continent,
  type Country,
} from '../data/countries'
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
  return `https://flagcdn.com/w320/${code.toLowerCase()}.png`
}

function CardFront({ card }: { card: Country }) {
  const color = CONTINENT_COLOR[card.continent]
  const ink = inkOn(color)

  return (
    <>
      <span className="ribbon" style={{ background: color, color: ink }}>
        {card.continent}
      </span>
      <span className="identity">
        <span className="code">{card.code}</span>
        <span className="dept">{card.name}</span>
        <span className="chef">
          <span className="chef-k">Capitale</span> {card.capital}
        </span>
      </span>
      <span className="emblem">
        <img
          className="flag"
          src={flagUrl(card.code)}
          alt={`Drapeau de ${card.name}`}
          loading="lazy"
          decoding="async"
        />
      </span>
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

      {/* Grille */}
      <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="100" cy="100" rx="28" ry="78" fill="none" stroke="currentColor" strokeWidth="0.85" />
      <ellipse cx="100" cy="100" rx="52" ry="78" fill="none" stroke="currentColor" strokeWidth="0.85" />
      <line x1="22" y1="100" x2="178" y2="100" stroke="currentColor" strokeWidth="0.9" />
      <path
        d="M34 66c22-5 46-7 66-7s44 2 66 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M34 134c22 5 46 7 66 7s44-2 66-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      />

      <g clipPath={`url(#${clipId})`} fill="currentColor" opacity="0.58">
        {/* Groenland */}
        <path d="M78 42c4-3 9-4 13-2 3 2 4 6 3 9-2 4-6 6-10 5-4-1-7-5-6-9v-3z" />
        {/* Amérique du Nord */}
        <path d="M48 48c5-4 12-7 19-7 6 0 11 2 14 6 3 4 3 9 1 13l-3 6c-1 3 0 6 2 8l5 4c3 2 4 6 3 10-1 4-4 7-8 8-5 1-10-1-13-5-2-3-5-4-8-3-4 1-7-1-9-5-3-5-3-12-1-18 1-4 0-8-2-11v-6z" />
        {/* Amérique centrale + Sud */}
        <path d="M70 98c3 1 5 3 5 6 0 2-1 4-3 5-1 2 0 4 1 6l6 12c3 6 4 13 2 19-2 6-7 10-12 11-5 1-10-2-12-7-2-4-1-9 1-13l5-12c2-4 2-8 0-12-1-3 0-6 2-8 2-2 5-4 5-7z" />
        {/* Europe */}
        <path d="M108 58c5-3 11-3 16 0 4 2 6 7 5 11-1 3-4 5-7 5-2 0-4 2-4 4 0 2 2 3 3 5 2 2 1 5-1 7-3 2-7 1-10-1-4-3-6-8-5-13 1-6 2-12 3-18z" />
        {/* Afrique */}
        <path d="M112 88c6-1 12 1 16 5 4 4 5 10 4 15l-1 8c-1 5 1 10 4 13 2 2 2 6 0 8-3 4-8 6-13 5-6-1-11-5-13-11-2-5-2-11 0-16 1-4 0-8-2-11-1-3 0-6 2-8 2-3 5-6 3-8z" />
        {/* Asie */}
        <path d="M128 52c8-4 18-5 27-2 8 3 14 10 16 18 2 7 0 14-4 19-3 4-7 6-11 6 1 4 0 9-3 12-3 4-8 5-12 4-3 5-2 11 1 15 2 3 2 7 0 10-3 4-8 5-12 3-5-2-8-8-7-13 1-4 3-7 6-10-5-2-9-6-11-11-2-6-1-13 3-18 4-5 9-10 7-17v-16z" />
        {/* Sous-continent / SE Asie */}
        <path d="M148 98c4 0 7 3 8 7 1 3 0 6-2 8-2 2-5 2-7 0-3-2-4-6-3-9 1-3 2-6 4-6z" />
        {/* Australie */}
        <path d="M152 128c6-2 12 0 15 5 3 4 3 10 0 14-3 4-9 6-14 5-5-1-9-5-10-10-1-5 1-10 5-13 1-1 3-1 4-1z" />
        {/* Antarctique (liseré bas) */}
        <path d="M72 168c8 4 18 6 28 6s20-2 28-6c-8 2-18 3-28 3s-20-1-28-3z" opacity="0.7" />
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
        c.capital.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q)
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
