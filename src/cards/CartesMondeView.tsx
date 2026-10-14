import { useId, useMemo, useState } from 'react'
import {
  CONTINENT_COLOR,
  CONTINENT_ORDER,
  COUNTRIES,
  type Continent,
  type Country,
} from '../data/countries'
import { capitalMatchRank, matchesSearch } from '../lib/searchFold'
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

function CardFront({ card, eager = false }: { card: Country; eager?: boolean }) {
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
          loading={eager ? 'eager' : 'lazy'}
          decoding={eager ? 'sync' : 'async'}
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
    <span className="back-face back-face-monde">
      <GlobeWatermark />
      <span className="back-mark">
        Drapeaux
        <br />
        du monde
      </span>
    </span>
  )
}

export function MondePlayingCard({
  card,
  flipped,
  onFlip,
  foil = false,
  className = '',
}: {
  card: Country
  flipped: boolean
  onFlip: () => void
  foil?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      className={`card ${flipped ? 'is-flipped' : ''} ${foil ? 'is-foil' : ''} ${className}`.trim()}
      onClick={onFlip}
      aria-label={`${card.name}, ${card.capital}, ${card.continent}`}
    >
      <span className="card-inner">
        <span className="face face-front">
          {foil ? <span className="card-foil-sheen" aria-hidden /> : null}
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

  // Miroir horizontal par rangée : coincide en duplex portrait, retournement bord long.
  const backOrder = [2, 1, 0, 5, 4, 3, 8, 7, 6]

  return (
    <div className="print-deck" aria-hidden>
      {pages.map((page, pageIndex) => {
        const slots: (Country | null)[] = [...page]
        while (slots.length < 9) slots.push(null)

        return (
          <div className="print-pair" key={`sheet-${pageIndex}`}>
            <section className="print-sheet print-front">
              {slots.map((card, i) => (
                <div className="print-card" key={`f-${pageIndex}-${i}`}>
                  {card ? (
                    <div className="face face-front static">
                      <CardFront card={card} eager />
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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const cards = useMemo(() => {
    const q = query.trim()
    const list = COUNTRIES.filter((c) => {
      if (continent !== 'Tous' && c.continent !== continent) return false
      if (!q) return true
      return (
        matchesSearch(c.name, q) ||
        matchesSearch(c.shortName ?? '', q) ||
        matchesSearch(c.capital, q) ||
        matchesSearch(c.code, q) ||
        matchesSearch(c.continent, q) ||
        matchesSearch(c.language, q)
      )
    })
    if (!q) return list
    // Capitale d’abord (taper « Paris » → France en tête)
    return [...list].sort((a, b) => {
      const ra = capitalMatchRank(a.capital, q)
      const rb = capitalMatchRank(b.capital, q)
      if (ra !== rb) return ra - rb
      return a.name.localeCompare(b.name, 'fr')
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

  const filterActive = continent !== 'Tous'

  return (
    <div className="cartes-view cartes-monde">
      <div className="lexique-toolbar no-print">
        <label className="search">
          <span className="sr-only">Rechercher</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Capitale, pays, code…"
            autoComplete="off"
          />
        </label>
        <button
          type="button"
          className={`lexique-filter-btn ${filtersOpen ? 'is-open' : ''} ${filterActive ? 'is-active' : ''}`}
          aria-expanded={filtersOpen}
          onClick={() => setFiltersOpen((o) => !o)}
        >
          Filtre
          {filterActive ? <em>{continent}</em> : null}
        </button>
      </div>

      {filtersOpen ? (
        <div className="lexique-filter-panel no-print">
          <div className="lexique-filter-section">
            <p className="lexique-filter-label">Continent</p>
            <div className="chips" role="group" aria-label="Continents">
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
                  onClick={() => setContinent(c)}
                >
                  {c} <em>{counts[c]}</em>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="lexique-body no-print">
        <aside className="lexique-side" aria-label="Continents">
          <button
            type="button"
            className={`lexique-side-item is-head ${continent === 'Tous' ? 'is-active' : ''}`}
            onClick={() => setContinent('Tous')}
          >
            <span>Tous</span>
            <em>{COUNTRIES.length}</em>
          </button>
          {CONTINENT_ORDER.map((c) => (
            <button
              key={c}
              type="button"
              className={`lexique-side-item ${continent === c ? 'is-active' : ''}`}
              onClick={() => setContinent(c)}
            >
              <span>{c}</span>
              <em>{counts[c]}</em>
            </button>
          ))}
        </aside>

        <div className="lexique-main">
          <div className="lexique-main-bar">
            <p className="count">
              {cards.length} carte{cards.length > 1 ? 's' : ''}
            </p>
          </div>
          {cards.length === 0 ? (
            <p className="empty">Aucun pays ne correspond à votre recherche.</p>
          ) : (
            <div className="grid">
              {cards.map((card) => (
                <MondePlayingCard
                  key={card.code}
                  card={card}
                  flipped={!!flipped[card.code]}
                  onFlip={() =>
                    setFlipped((prev) => ({
                      ...prev,
                      [card.code]: !prev[card.code],
                    }))
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <PrintDeck cards={COUNTRIES} />
    </div>
  )
}
