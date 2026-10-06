import { useMemo, useState } from 'react'
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
  return (
    <svg
      className="back-globe"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="100" cy="100" rx="30" ry="78" fill="none" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="100" cy="100" rx="55" ry="78" fill="none" stroke="currentColor" strokeWidth="1" />
      <line x1="22" y1="100" x2="178" y2="100" stroke="currentColor" strokeWidth="1" />
      <path d="M36 64c20-4 44-6 64-6s44 2 64 6" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <path d="M36 136c20 4 44 6 64 6s44-2 64-6" fill="none" stroke="currentColor" strokeWidth="0.9" />
      {/* Amériques */}
      <path
        d="M68 58c6-4 12-3 16 1 3 4 2 10-1 14-2 3-1 7 2 9 4 3 5 8 3 12-3 5-8 8-13 7-6-1-10-6-11-12-1-5 1-10 4-14 1-4 0-8 0-17z
           M72 118c5-1 9 2 11 7 2 5 1 11-2 15-4 5-9 7-13 5-4-2-6-8-5-13 1-5 4-10 9-14z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Eurasie + Afrique */}
      <path
        d="M108 52c10-3 22-2 30 4 7 5 10 13 9 21-2 6-7 10-13 11 2 5 1 11-2 15-4 5-10 7-15 5 1 7 4 13 9 18 4 4 5 10 2 15-4 6-12 8-18 5-7-3-11-11-10-19 1-6 4-11 8-15-6-2-11-7-13-13-2-7 0-15 5-20 6-6 12-12 18-27z"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Océanie */}
      <path
        d="M148 128c4-1 8 1 10 5 2 3 1 7-1 9-3 3-7 3-10 1-3-2-4-6-3-9 1-3 2-5 4-6z"
        fill="currentColor"
        opacity="0.45"
      />
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
