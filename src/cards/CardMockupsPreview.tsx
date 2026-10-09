import './CardMockupsPreview.css'

type MockCard = {
  id: string
  country: string
  note: string
  ribbon: string
  ribbonBg: string
  ribbonInk?: string
  code: string
  codeColor?: string
  name: string
  subLabel: string
  subValue: string
  emblem: 'blason-fr' | 'blason-ch' | 'blason-de' | 'flag-us' | 'flag-es' | 'flag-ca' | 'flag-jp' | 'flag-br'
  foot?: { icon: string; label: string }[]
  footText?: string
  backTitle: string
  backSub: string
  backMotif: string
}

const MOCKS: MockCard[] = [
  {
    id: 'fr',
    country: 'France — Département',
    note: 'Référence actuelle : blason + pictos',
    ribbon: 'Bretagne',
    ribbonBg: '#2d6a4f',
    code: '29',
    codeColor: '#2d6a4f',
    name: 'Finistère',
    subLabel: 'Chef-lieu',
    subValue: 'Quimper',
    emblem: 'blason-fr',
    foot: [
      { icon: '⚓', label: 'Phare' },
      { icon: '🐷', label: 'Porc' },
    ],
    backTitle: 'Départements',
    backSub: 'de France',
    backMotif: 'fr',
  },
  {
    id: 'ch',
    country: 'Suisse — Canton',
    note: 'Blason central, pas de pictos',
    ribbon: 'Suisse',
    ribbonBg: '#c8102e',
    code: 'VD',
    codeColor: '#c8102e',
    name: 'Vaud',
    subLabel: 'Chef-lieu',
    subValue: 'Lausanne',
    emblem: 'blason-ch',
    backTitle: 'Cantons',
    backSub: 'de Suisse',
    backMotif: 'ch',
  },
  {
    id: 'us',
    country: 'USA — État',
    note: 'Drapeau d’État (pas blason)',
    ribbon: 'West',
    ribbonBg: '#1d3557',
    code: 'CA',
    codeColor: '#1d3557',
    name: 'California',
    subLabel: 'Capital',
    subValue: 'Sacramento',
    emblem: 'flag-us',
    footText: 'The Golden State',
    backTitle: 'States of',
    backSub: 'the USA',
    backMotif: 'us',
  },
  {
    id: 'es',
    country: 'Espagne — Communauté',
    note: 'Drapeau de communauté',
    ribbon: 'España',
    ribbonBg: '#aa151b',
    code: 'AN',
    codeColor: '#aa151b',
    name: 'Andalucía',
    subLabel: 'Capital',
    subValue: 'Sevilla',
    emblem: 'flag-es',
    footText: 'español',
    backTitle: 'Comunidades',
    backSub: 'de España',
    backMotif: 'es',
  },
  {
    id: 'de',
    country: 'Allemagne — Land',
    note: 'Blason de Land',
    ribbon: 'Deutschland',
    ribbonBg: '#1a1a1a',
    code: 'BY',
    codeColor: '#1a1a1a',
    name: 'Bayern',
    subLabel: 'Capital',
    subValue: 'München',
    emblem: 'blason-de',
    backTitle: 'Länder',
    backSub: 'Deutschlands',
    backMotif: 'de',
  },
  {
    id: 'jp',
    country: 'Japon — Préfecture',
    note: 'Symbole / drapeau préfectoral',
    ribbon: '日本',
    ribbonBg: '#bc002d',
    code: '13',
    codeColor: '#bc002d',
    name: 'Tōkyō',
    subLabel: 'Chef-lieu',
    subValue: 'Tōkyō',
    emblem: 'flag-jp',
    backTitle: '都道府県',
    backSub: 'Japan',
    backMotif: 'jp',
  },
  {
    id: 'ca',
    country: 'Canada — Province',
    note: 'Drapeau provincial',
    ribbon: 'Canada',
    ribbonBg: '#d80621',
    code: 'QC',
    codeColor: '#0d47a1',
    name: 'Québec',
    subLabel: 'Capital',
    subValue: 'Québec',
    emblem: 'flag-ca',
    backTitle: 'Provinces',
    backSub: 'of Canada',
    backMotif: 'ca',
  },
  {
    id: 'br',
    country: 'Brésil — État',
    note: 'Drapeau d’État',
    ribbon: 'Brasil',
    ribbonBg: '#009c3b',
    code: 'SP',
    codeColor: '#002776',
    name: 'São Paulo',
    subLabel: 'Capital',
    subValue: 'São Paulo',
    emblem: 'flag-br',
    backTitle: 'Estados',
    backSub: 'do Brasil',
    backMotif: 'br',
  },
]

function Emblem({ kind }: { kind: MockCard['emblem'] }) {
  if (kind === 'blason-fr') {
    return (
      <img className="mock-blason" src="/blasons/29.png" alt="Blason Finistère" />
    )
  }
  if (kind === 'blason-ch') {
    return (
      <svg className="mock-blason-svg" viewBox="0 0 80 100" aria-hidden>
        <path
          d="M40 4c14 8 28 10 32 12v36c0 22-14 36-32 44C22 88 8 74 8 52V16c4-2 18-4 32-12z"
          fill="#e8e4d8"
          stroke="#2a2a2a"
          strokeWidth="2"
        />
        <rect x="22" y="28" width="36" height="36" rx="2" fill="#c8102e" />
        <rect x="36" y="34" width="8" height="24" fill="#fff" />
        <rect x="28" y="42" width="24" height="8" fill="#fff" />
      </svg>
    )
  }
  if (kind === 'blason-de') {
    return (
      <svg className="mock-blason-svg" viewBox="0 0 80 100" aria-hidden>
        <path
          d="M40 4c14 8 28 10 32 12v36c0 22-14 36-32 44C22 88 8 74 8 52V16c4-2 18-4 32-12z"
          fill="#f4e8c8"
          stroke="#2a2a2a"
          strokeWidth="2"
        />
        <path d="M24 58c6-18 12-28 16-34 4 6 10 16 16 34H24z" fill="#1a1a1a" />
        <circle cx="40" cy="40" r="7" fill="#d4a017" />
      </svg>
    )
  }
  if (kind === 'flag-us') {
    return (
      <div className="mock-flag mock-flag-us" aria-hidden>
        <div className="mock-flag-us-canton" />
        <div className="mock-flag-us-stripes" />
        <span className="mock-flag-bear">🐻</span>
      </div>
    )
  }
  if (kind === 'flag-es') {
    return (
      <div className="mock-flag mock-flag-es" aria-hidden>
        <span />
        <span />
        <span />
      </div>
    )
  }
  if (kind === 'flag-ca') {
    return (
      <div className="mock-flag mock-flag-ca" aria-hidden>
        <span />
        <span className="mock-flag-ca-mid">✦</span>
        <span />
      </div>
    )
  }
  if (kind === 'flag-jp') {
    return (
      <div className="mock-flag mock-flag-jp" aria-hidden>
        <i />
      </div>
    )
  }
  return (
    <div className="mock-flag mock-flag-br" aria-hidden>
      <i />
    </div>
  )
}

function MockPlayingCard({ card }: { card: MockCard }) {
  return (
    <article className="mock-pair">
      <header className="mock-pair-head">
        <h2>{card.country}</h2>
        <p>{card.note}</p>
      </header>
      <div className="mock-pair-cards">
        <div className="mock-card">
          <span className="mock-face-tag">Recto</span>
          <div className="mock-face mock-face-front">
            <div
              className="mock-ribbon"
              style={{ background: card.ribbonBg, color: card.ribbonInk ?? '#fff' }}
            >
              {card.ribbon}
            </div>
            <div className="mock-identity">
              <div className="mock-code" style={{ color: card.codeColor }}>
                {card.code}
              </div>
              <div className="mock-name">{card.name}</div>
              <div className="mock-sub">
                <span>{card.subLabel}</span> {card.subValue}
              </div>
            </div>
            <div className="mock-emblem">
              <Emblem kind={card.emblem} />
            </div>
            {card.foot ? (
              <div className="mock-foot-pictos">
                {card.foot.map((f) => (
                  <span key={f.label}>
                    <i>{f.icon}</i>
                    {f.label}
                  </span>
                ))}
              </div>
            ) : null}
            {card.footText ? <div className="mock-foot-text">{card.footText}</div> : null}
          </div>
        </div>

        <div className="mock-card">
          <span className="mock-face-tag">Verso</span>
          <div className={`mock-face mock-face-back is-${card.backMotif}`}>
            <div className="mock-back-motif" aria-hidden />
            <div className="mock-back-title">
              {card.backTitle}
              <br />
              {card.backSub}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export function CardMockupsPreview() {
  return (
    <div className="mockups-page">
      <div className="mockups-banner">
        <p className="mockups-kicker">Aperçu local — pas déployé</p>
        <h1>Maquettes cartes Territoires</h1>
        <p className="mockups-lead">
          Exemples recto / verso par pays. Les emblèmes CH/DE/US… sont des placeholders pour juger
          la composition (pas les assets finaux).
        </p>
      </div>
      <div className="mockups-grid">
        {MOCKS.map((card) => (
          <MockPlayingCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
