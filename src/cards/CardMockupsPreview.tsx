import { buildBackScatter, type BackScatterItem } from './backScatterSlots'
import { FranceCardPairPreview } from './CartesFranceView'
import { Picto, type PictoId } from './pictos'
import {
  getUnitPictos,
  TERRITORY_PACKS,
  type TerritoryPackId,
} from '../data/territoryPictos'
import './CartesMondeView.css'
import './CartesFranceView.css'
import './CardMockupsPreview.css'

type MockCard = {
  id: TerritoryPackId
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
  foot: { id: PictoId; label: string }[]
  backTitle: string
  backSub: string
  backScatter: BackScatterItem[]
}

type MockMeta = {
  id: TerritoryPackId
  ribbon: string
  ribbonBg: string
  accent: string
  code: string
  name: string
  subLabel: string
  subValue: string
  emblemSrc: string
  emblemKind: 'blason' | 'flag'
}

/** Unités d’exemple — méta carte ; pictos = TERRITORY_PACKS. */
const MOCK_META: MockMeta[] = [
  {
    id: 'ch',
    ribbon: 'Suisse',
    ribbonBg: '#c8102e',
    accent: '#c8102e',
    code: 'VD',
    name: 'Vaud',
    subLabel: 'Chef-lieu',
    subValue: 'Lausanne',
    emblemSrc: '/mockups/emblems/vaud.png',
    emblemKind: 'blason',
  },
  {
    id: 'us',
    ribbon: 'West',
    ribbonBg: '#1d3557',
    accent: '#1d3557',
    code: 'CA',
    name: 'California',
    subLabel: 'Capital',
    subValue: 'Sacramento',
    emblemSrc: '/mockups/emblems/california.png',
    emblemKind: 'flag',
  },
  {
    id: 'es',
    ribbon: 'España',
    ribbonBg: '#aa151b',
    accent: '#aa151b',
    code: 'AN',
    name: 'Andalucía',
    subLabel: 'Capital',
    subValue: 'Sevilla',
    emblemSrc: '/mockups/emblems/andalucia.png',
    emblemKind: 'flag',
  },
  {
    id: 'de',
    ribbon: 'Deutschland',
    ribbonBg: '#111111',
    accent: '#111111',
    code: 'BY',
    name: 'Bayern',
    subLabel: 'Capital',
    subValue: 'München',
    emblemSrc: '/mockups/emblems/bayern.png',
    emblemKind: 'blason',
  },
  {
    id: 'jp',
    ribbon: '日本',
    ribbonBg: '#bc002d',
    accent: '#bc002d',
    code: '13',
    name: 'Tōkyō',
    subLabel: 'Chef-lieu',
    subValue: 'Tōkyō',
    emblemSrc: '/mockups/emblems/tokyo.png',
    emblemKind: 'flag',
  },
  {
    id: 'ca',
    ribbon: 'Canada',
    ribbonBg: '#0b3d91',
    accent: '#0b3d91',
    code: 'QC',
    name: 'Québec',
    subLabel: 'Capital',
    subValue: 'Québec',
    emblemSrc: '/mockups/emblems/quebec.png',
    emblemKind: 'flag',
  },
  {
    id: 'br',
    ribbon: 'Brasil',
    ribbonBg: '#009c3b',
    accent: '#002776',
    code: 'SP',
    name: 'São Paulo',
    subLabel: 'Capital',
    subValue: 'São Paulo',
    emblemSrc: '/mockups/emblems/saopaulo.png',
    emblemKind: 'flag',
  },
]

function buildMock(meta: MockMeta): MockCard {
  const pack = TERRITORY_PACKS[meta.id]
  const specialties = getUnitPictos(meta.id, meta.code)
  return {
    ...meta,
    country: `${pack.country} — ${pack.unitKind}`,
    note: 'Même positions verso que la France · pictos curés (territoryPictos)',
    foot: specialties.map((s) => ({ id: s.icon, label: s.label })),
    backTitle: pack.backTitle,
    backSub: pack.backSub,
    backScatter: buildBackScatter(pack.backIds),
  }
}

const MOCKS: MockCard[] = MOCK_META.map(buildMock)

function MockBackPictos({ items }: { items: BackScatterItem[] }) {
  return (
    <span className="back-pictos mock-back-pictos" aria-hidden>
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
          <div className={`mock-face mock-face-front is-${card.emblemKind}`}>
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
            <div className={`mock-emblem has-pictos is-${card.emblemKind}`}>
              <img src={card.emblemSrc} alt="" />
            </div>
            <span className="front-pictos" aria-label="Spécialités">
              {card.foot.map((f) => (
                <span key={f.label} className="front-picto" title={f.label}>
                  <Picto id={f.id} />
                  <span className="front-picto-label">{f.label}</span>
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="mock-card">
          <span className="mock-face-tag">Verso</span>
          <div className="mock-face mock-face-back">
            <MockBackPictos items={card.backScatter} />
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
          France inchangée. Autres pays : mêmes positions verso (40 slots), pictos curés par pack
          dans <code>territoryPictos</code>.
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
