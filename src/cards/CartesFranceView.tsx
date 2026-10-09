import { useMemo, useState } from 'react'
import {
  FICHES,
  REGION_COLOR,
  REGION_ORDER,
  type Fiche,
} from '../data/cartes'
import { DEPARTEMENTS } from '../data/departements'
import { DEPT_PICTOS } from '../data/deptPictos'
import { FranceBackPictos } from './FranceBackIcons'
import { Picto } from './pictos'
import './CartesMondeView.css'
import './CartesFranceView.css'

export type DeptCard = {
  code: string
  name: string
  chefLieu: string
  region: string
  group: 'metro' | 'dom' | 'tom'
}

const FICHE_BY_CODE = Object.fromEntries(FICHES.map((f) => [f.code, f])) as Record<
  string,
  Fiche
>

export const DEPT_CARDS: DeptCard[] = DEPARTEMENTS.map((d) => {
  const fiche = FICHE_BY_CODE[d.code]
  return {
    code: d.code,
    name: d.name,
    chefLieu: fiche?.chefLieu ?? '—',
    region: fiche?.region ?? '—',
    group: d.group,
  }
})

function inkOn(bg: string): string {
  const hex = bg.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luma > 0.62 ? '#1a1a1a' : '#ffffff'
}

function blasonCandidates(code: string): string[] {
  return [`/blasons/${code}.svg`, `/blasons/${code}.png`]
}

function nameSizeClass(name: string): string {
  if (name.length > 22) return 'is-xl'
  if (name.length > 15) return 'is-long'
  return ''
}

function BlasonImg({
  code,
  name,
  eager = false,
}: {
  code: string
  name: string
  eager?: boolean
}) {
  const [idx, setIdx] = useState(0)
  const sources = blasonCandidates(code)
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
      className="blason"
      src={src}
      alt={`Blason de ${name}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      onError={() => setIdx((i) => i + 1)}
    />
  )
}

function CardFront({ card, eager = false }: { card: DeptCard; eager?: boolean }) {
  const color = REGION_COLOR[card.region] ?? '#1f6f8b'
  const ink = inkOn(color)
  const chefClass = card.chefLieu.length > 16 ? 'is-long' : ''
  const pictos = DEPT_PICTOS[card.code] ?? []

  return (
    <>
      <span className="ribbon" style={{ background: color, color: ink }}>
        {card.region}
      </span>
      <span className="identity">
        <span className="code" style={{ color }}>
          {card.code}
        </span>
        <span className={`dept ${nameSizeClass(card.name)}`} title={card.name}>
          {card.name}
        </span>
        <span className={`chef ${chefClass}`}>
          <span className="chef-k">Chef-lieu</span> {card.chefLieu}
        </span>
      </span>
      <span className="emblem has-pictos">
        <BlasonImg code={card.code} name={card.name} eager={eager} />
      </span>
      {pictos.length > 0 ? (
        <span className="front-pictos" aria-label="Spécialités">
          {pictos.map((p) => (
            <span key={p.icon} className="front-picto" title={p.label}>
              <Picto id={p.icon} />
              <span className="front-picto-label">{p.label}</span>
            </span>
          ))}
        </span>
      ) : null}
    </>
  )
}

function CardBack() {
  return (
    <span className="back-face back-face-fr">
      <FranceBackPictos />
      <span className="back-mark">
        <span className="back-title">Départements</span>
        <span className="back-sub">de France</span>
      </span>
    </span>
  )
}

function PlayingCard({
  card,
  flipped,
  onFlip,
}: {
  card: DeptCard
  flipped: boolean
  onFlip: () => void
}) {
  return (
    <button
      type="button"
      className={`card ${flipped ? 'is-flipped' : ''}`}
      onClick={onFlip}
      aria-label={`${card.name}, ${card.chefLieu}, ${card.region}`}
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

/** Aperçu recto + verso séparés (maquettes) — design FR inchangé. */
export function FranceCardPairPreview({ code = '29' }: { code?: string }) {
  const card = DEPT_CARDS.find((c) => c.code === code) ?? DEPT_CARDS[0]!
  return (
    <div className="cartes-france france-pair-preview">
      <div className="card france-pair-static" aria-hidden>
        <span className="face face-front static">
          <CardFront card={card} />
        </span>
      </div>
      <div className="card france-pair-static" aria-hidden>
        <span className="face face-back static">
          <CardBack />
        </span>
      </div>
    </div>
  )
}

function PrintDeck({ cards }: { cards: DeptCard[] }) {
  const pages: DeptCard[][] = []
  for (let i = 0; i < cards.length; i += 9) {
    pages.push(cards.slice(i, i + 9))
  }

  const backOrder = [2, 1, 0, 5, 4, 3, 8, 7, 6]

  return (
    <div className="print-deck" aria-hidden>
      {pages.map((page, pageIndex) => {
        const slots: (DeptCard | null)[] = [...page]
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

const GROUP_LABEL: Record<DeptCard['group'] | 'Tous', string> = {
  Tous: 'Tous',
  metro: 'Métropole',
  dom: 'DOM',
  tom: 'TOM',
}

export function CartesFranceView() {
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<string>('Tous')
  const [group, setGroup] = useState<DeptCard['group'] | 'Tous'>('Tous')
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})

  const cards = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DEPT_CARDS.filter((c) => {
      if (region !== 'Tous' && c.region !== region) return false
      if (group !== 'Tous' && c.group !== group) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.chefLieu.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q)
      )
    })
  }, [query, region, group])

  const regionCounts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of REGION_ORDER) map[r] = 0
    for (const c of DEPT_CARDS) map[c.region] = (map[c.region] ?? 0) + 1
    return map
  }, [])

  return (
    <div className="cartes-view cartes-france">
      <div className="lexique-toolbar no-print">
        <label className="search">
          <span className="sr-only">Rechercher</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Département, chef-lieu, code…"
            autoComplete="off"
          />
        </label>
        <div className="chips" role="tablist" aria-label="Groupes">
          {(['Tous', 'metro', 'dom', 'tom'] as const).map((g) => (
            <button
              key={g}
              type="button"
              className={`chip ${group === g ? 'is-active' : ''}`}
              onClick={() => setGroup(g)}
            >
              {GROUP_LABEL[g]}
            </button>
          ))}
        </div>
      </div>

      <div className="lexique-body no-print">
        <aside className="lexique-side" aria-label="Régions">
          <button
            type="button"
            className={`lexique-side-item is-head ${region === 'Tous' ? 'is-active' : ''}`}
            onClick={() => setRegion('Tous')}
          >
            <span>Toutes</span>
            <em>{DEPT_CARDS.length}</em>
          </button>
          {REGION_ORDER.filter((r) => (regionCounts[r] ?? 0) > 0).map((r) => (
            <button
              key={r}
              type="button"
              className={`lexique-side-item ${region === r ? 'is-active' : ''}`}
              onClick={() => setRegion(r)}
            >
              <span>{r}</span>
              <em>{regionCounts[r]}</em>
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
            <p className="empty">Aucun département ne correspond à votre recherche.</p>
          ) : (
            <div className="grid">
              {cards.map((card) => (
                <PlayingCard
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

      <PrintDeck cards={DEPT_CARDS} />
    </div>
  )
}
