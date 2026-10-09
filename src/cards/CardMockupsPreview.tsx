import { FranceCardPairPreview } from './CartesFranceView'
import './CartesMondeView.css'
import './CartesFranceView.css'
import './CardMockupsPreview.css'

type MockCard = {
  id: string
  country: string
  note: string
  ribbon: string
  ribbonBg: string
  accent: string
  code: string
  name: string
  subLabel: string
  subValue: string
  emblemSrc: string
  emblemKind: 'blason' | 'flag'
  footText?: string
  backTitle: string
  backSub: string
}

const MOCKS: MockCard[] = [
  {
    id: 'ch',
    country: 'Suisse — Canton',
    note: 'Vrai blason (Vaud) · verso motif croix',
    ribbon: 'Suisse',
    ribbonBg: '#c8102e',
    accent: '#c8102e',
    code: 'VD',
    name: 'Vaud',
    subLabel: 'Chef-lieu',
    subValue: 'Lausanne',
    emblemSrc: '/mockups/emblems/vaud.png',
    emblemKind: 'blason',
    backTitle: 'Cantons',
    backSub: 'de Suisse',
  },
  {
    id: 'us',
    country: 'USA — État',
    note: 'Vrai drapeau (California) · verso étoiles',
    ribbon: 'West',
    ribbonBg: '#1d3557',
    accent: '#1d3557',
    code: 'CA',
    name: 'California',
    subLabel: 'Capital',
    subValue: 'Sacramento',
    emblemSrc: '/mockups/emblems/california.png',
    emblemKind: 'flag',
    footText: 'The Golden State',
    backTitle: 'States of',
    backSub: 'the USA',
  },
  {
    id: 'es',
    country: 'Espagne — Communauté',
    note: 'Vrai drapeau (Andalucía)',
    ribbon: 'España',
    ribbonBg: '#aa151b',
    accent: '#aa151b',
    code: 'AN',
    name: 'Andalucía',
    subLabel: 'Capital',
    subValue: 'Sevilla',
    emblemSrc: '/mockups/emblems/andalucia.png',
    emblemKind: 'flag',
    footText: 'español',
    backTitle: 'Comunidades',
    backSub: 'de España',
  },
  {
    id: 'de',
    country: 'Allemagne — Land',
    note: 'Vrai blason (Bayern)',
    ribbon: 'Deutschland',
    ribbonBg: '#111111',
    accent: '#111111',
    code: 'BY',
    name: 'Bayern',
    subLabel: 'Capital',
    subValue: 'München',
    emblemSrc: '/mockups/emblems/bayern.png',
    emblemKind: 'blason',
    backTitle: 'Länder',
    backSub: 'Deutschlands',
  },
  {
    id: 'jp',
    country: 'Japon — Préfecture',
    note: 'Vrai drapeau (Tōkyō)',
    ribbon: '日本',
    ribbonBg: '#bc002d',
    accent: '#bc002d',
    code: '13',
    name: 'Tōkyō',
    subLabel: 'Chef-lieu',
    subValue: 'Tōkyō',
    emblemSrc: '/mockups/emblems/tokyo.png',
    emblemKind: 'flag',
    backTitle: '都道府県',
    backSub: 'Japan',
  },
  {
    id: 'ca',
    country: 'Canada — Province',
    note: 'Vrai drapeau (Québec)',
    ribbon: 'Canada',
    ribbonBg: '#0b3d91',
    accent: '#0b3d91',
    code: 'QC',
    name: 'Québec',
    subLabel: 'Capital',
    subValue: 'Québec',
    emblemSrc: '/mockups/emblems/quebec.png',
    emblemKind: 'flag',
    backTitle: 'Provinces',
    backSub: 'of Canada',
  },
  {
    id: 'br',
    country: 'Brésil — État',
    note: 'Vrai drapeau (São Paulo)',
    ribbon: 'Brasil',
    ribbonBg: '#009c3b',
    accent: '#002776',
    code: 'SP',
    name: 'São Paulo',
    subLabel: 'Capital',
    subValue: 'São Paulo',
    emblemSrc: '/mockups/emblems/saopaulo.png',
    emblemKind: 'flag',
    backTitle: 'Estados',
    backSub: 'do Brasil',
  },
]

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
          <div
            className={`mock-face mock-face-front is-${card.emblemKind}`}
            style={{ ['--mock-accent' as string]: card.accent }}
          >
            <div className="mock-corner mock-corner-tl" aria-hidden />
            <div className="mock-corner mock-corner-br" aria-hidden />
            <div className="mock-ribbon" style={{ background: card.ribbonBg }}>
              {card.ribbon}
            </div>
            <div className="mock-identity">
              <div className="mock-code" style={{ color: card.accent }}>
                {card.code}
              </div>
              <div className="mock-name">{card.name}</div>
              <div className="mock-sub">
                <span>{card.subLabel}</span> {card.subValue}
              </div>
            </div>
            <div className={`mock-emblem is-${card.emblemKind}`}>
              <img src={card.emblemSrc} alt="" />
            </div>
            {card.footText ? <div className="mock-foot-text">{card.footText}</div> : null}
          </div>
        </div>

        <div className="mock-card">
          <span className="mock-face-tag">Verso</span>
          <div
            className={`mock-face mock-face-back theme-${card.id}`}
            style={{ ['--mock-accent' as string]: card.accent }}
          >
            <div className="mock-back-wash" aria-hidden />
            <div className="mock-back-pattern" aria-hidden />
            <div className="mock-back-frame" aria-hidden />
            <div className="mock-back-title">
              <strong>{card.backTitle}</strong>
              <span>{card.backSub}</span>
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
          France = cartes actuelles (inchangées). Autres pays = vrais blasons/drapeaux + verso
          travaillé pour juger le rendu « carte à jouer ».
        </p>
      </div>

      <article className="mock-pair is-france">
        <header className="mock-pair-head">
          <h2>France — Département</h2>
          <p>Design actuel gardé (recto blason + pictos · verso pictos)</p>
        </header>
        <div className="mock-pair-cards france-real-wrap">
          <div className="mock-card">
            <span className="mock-face-tag">Recto / Verso réels</span>
            <FranceCardPairPreview code="29" />
          </div>
        </div>
      </article>

      <div className="mockups-grid">
        {MOCKS.map((card) => (
          <MockPlayingCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}
