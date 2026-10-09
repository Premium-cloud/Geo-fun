import { FranceCardPairPreview } from './CartesFranceView'
import { Picto, type PictoId } from './pictos'
import './CartesMondeView.css'
import './CartesFranceView.css'
import './CardMockupsPreview.css'

type Scatter = { id: PictoId; x: number; y: number; r: number; s: number }
type Foot = { id: PictoId; label: string }

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
  foot: Foot[]
  backTitle: string
  backSub: string
  backScatter: Scatter[]
}

/** Densité proche du verso France (~36), centre dégagé pour le titre. */
function scatterRing(ids: PictoId[]): Scatter[] {
  const slots: Omit<Scatter, 'id'>[] = [
    { x: 8, y: 9, r: -18, s: 9 },
    { x: 28, y: 7, r: 14, s: 8 },
    { x: 50, y: 6, r: -8, s: 9 },
    { x: 72, y: 8, r: 20, s: 8 },
    { x: 91, y: 11, r: -14, s: 9 },
    { x: 7, y: 26, r: 10, s: 9 },
    { x: 22, y: 22, r: -22, s: 8 },
    { x: 78, y: 20, r: 12, s: 9 },
    { x: 93, y: 28, r: -10, s: 8 },
    { x: 6, y: 44, r: 16, s: 9 },
    { x: 18, y: 40, r: -6, s: 8 },
    { x: 84, y: 38, r: 18, s: 9 },
    { x: 94, y: 46, r: -16, s: 8 },
    { x: 5, y: 60, r: 8, s: 9 },
    { x: 16, y: 58, r: -20, s: 8 },
    { x: 86, y: 56, r: 14, s: 9 },
    { x: 95, y: 64, r: -12, s: 8 },
    { x: 7, y: 76, r: 22, s: 9 },
    { x: 20, y: 74, r: -14, s: 8 },
    { x: 80, y: 72, r: 10, s: 9 },
    { x: 93, y: 78, r: -18, s: 8 },
    { x: 12, y: 90, r: 6, s: 9 },
    { x: 30, y: 93, r: -10, s: 8 },
    { x: 50, y: 94, r: 16, s: 9 },
    { x: 70, y: 92, r: -8, s: 8 },
    { x: 88, y: 90, r: 12, s: 9 },
    { x: 34, y: 18, r: -24, s: 8 },
    { x: 66, y: 16, r: 8, s: 8 },
    { x: 32, y: 82, r: 14, s: 8 },
    { x: 68, y: 80, r: -16, s: 8 },
    { x: 10, y: 52, r: 4, s: 8 },
    { x: 90, y: 52, r: -4, s: 8 },
    { x: 40, y: 10, r: 26, s: 8 },
    { x: 60, y: 12, r: -12, s: 8 },
    { x: 38, y: 88, r: -6, s: 8 },
    { x: 62, y: 86, r: 20, s: 8 },
  ]
  return slots.map((slot, i) => ({
    id: ids[i % ids.length]!,
    ...slot,
  }))
}

const MOCKS: MockCard[] = [
  {
    id: 'ch',
    country: 'Suisse — Canton',
    note: 'Esprit France : pictos sous blason · verso blanc + scatter',
    ribbon: 'Suisse',
    ribbonBg: '#c8102e',
    accent: '#c8102e',
    code: 'VD',
    name: 'Vaud',
    subLabel: 'Chef-lieu',
    subValue: 'Lausanne',
    emblemSrc: '/mockups/emblems/vaud.png',
    emblemKind: 'blason',
    foot: [
      { id: 'mountain', label: 'Alpes' },
      { id: 'grape', label: 'Vigne' },
      { id: 'cheese', label: 'Fromage' },
    ],
    backTitle: 'Cantons',
    backSub: 'de Suisse',
    backScatter: scatterRing([
      'mountain',
      'cheese',
      'watch',
      'cow',
      'ski',
      'clock',
      'forest',
      'grape',
      'river',
      'crystal',
      'oak',
      'sheep',
      'honey',
      'castle',
      'wine',
      'goat',
    ]),
  },
  {
    id: 'us',
    country: 'USA — État',
    note: 'Pictos sous drapeau · verso blanc + scatter',
    ribbon: 'West',
    ribbonBg: '#1d3557',
    accent: '#1d3557',
    code: 'CA',
    name: 'California',
    subLabel: 'Capital',
    subValue: 'Sacramento',
    emblemSrc: '/mockups/emblems/california.png',
    emblemKind: 'flag',
    foot: [
      { id: 'gold', label: 'Or' },
      { id: 'film', label: 'Cinéma' },
      { id: 'palm', label: 'Palmier' },
    ],
    backTitle: 'States of',
    backSub: 'the USA',
    backScatter: scatterRing([
      'gold',
      'film',
      'airplane',
      'beach',
      'horse',
      'rocket',
      'oak',
      'sea',
      'factory',
      'briefcase',
      'atom',
      'race',
      'mountain',
      'palm',
      'ship',
      'crystal',
    ]),
  },
  {
    id: 'es',
    country: 'Espagne — Communauté',
    note: 'Pictos sous drapeau · verso blanc + scatter',
    ribbon: 'España',
    ribbonBg: '#aa151b',
    accent: '#aa151b',
    code: 'AN',
    name: 'Andalucía',
    subLabel: 'Capital',
    subValue: 'Sevilla',
    emblemSrc: '/mockups/emblems/andalucia.png',
    emblemKind: 'flag',
    foot: [
      { id: 'olive', label: 'Olive' },
      { id: 'grape', label: 'Vigne' },
      { id: 'castle', label: 'Alcázar' },
    ],
    backTitle: 'Comunidades',
    backSub: 'de España',
    backScatter: scatterRing([
      'olive',
      'grape',
      'castle',
      'beach',
      'fish',
      'pepper',
      'horse',
      'rose',
      'pottery',
      'cathedral',
      'sea',
      'garlic',
      'palm',
      'melon',
      'wine',
      'spa',
    ]),
  },
  {
    id: 'de',
    country: 'Allemagne — Land',
    note: 'Pictos sous blason · verso blanc + scatter',
    ribbon: 'Deutschland',
    ribbonBg: '#111111',
    accent: '#111111',
    code: 'BY',
    name: 'Bayern',
    subLabel: 'Capital',
    subValue: 'München',
    emblemSrc: '/mockups/emblems/bayern.png',
    emblemKind: 'blason',
    foot: [
      { id: 'pretzel', label: 'Brezel' },
      { id: 'beer', label: 'Bier' },
      { id: 'mountain', label: 'Alpen' },
    ],
    backTitle: 'Länder',
    backSub: 'Deutschlands',
    backScatter: scatterRing([
      'pretzel',
      'beer',
      'castle',
      'oak',
      'mountain',
      'forest',
      'factory',
      'clock',
      'horse',
      'wheat',
      'lion',
      'metal',
      'mushroom',
      'river',
      'ski',
      'cow',
    ]),
  },
  {
    id: 'jp',
    country: 'Japon — Préfecture',
    note: 'Pictos sous drapeau · verso blanc + scatter',
    ribbon: '日本',
    ribbonBg: '#bc002d',
    accent: '#bc002d',
    code: '13',
    name: 'Tōkyō',
    subLabel: 'Chef-lieu',
    subValue: 'Tōkyō',
    emblemSrc: '/mockups/emblems/tokyo.png',
    emblemKind: 'flag',
    foot: [
      { id: 'flower', label: 'Sakura' },
      { id: 'fish', label: 'Sushi' },
      { id: 'mountain', label: 'Fuji' },
    ],
    backTitle: '都道府県',
    backSub: 'Japan',
    backScatter: scatterRing([
      'flower',
      'fleur',
      'fish',
      'mountain',
      'sea',
      'ship',
      'castle',
      'silk',
      'crystal',
      'airplane',
      'pearl',
      'plum',
      'ribbon',
      'rose',
      'spa',
      'pottery',
    ]),
  },
  {
    id: 'ca',
    country: 'Canada — Province',
    note: 'Pictos sous drapeau · verso blanc + scatter',
    ribbon: 'Canada',
    ribbonBg: '#0b3d91',
    accent: '#0b3d91',
    code: 'QC',
    name: 'Québec',
    subLabel: 'Capital',
    subValue: 'Québec',
    emblemSrc: '/mockups/emblems/quebec.png',
    emblemKind: 'flag',
    foot: [
      { id: 'forest', label: 'Forêt' },
      { id: 'ski', label: 'Hiver' },
      { id: 'river', label: 'Fleuve' },
    ],
    backTitle: 'Provinces',
    backSub: 'of Canada',
    backScatter: scatterRing([
      'forest',
      'ski',
      'oak',
      'fish',
      'mountain',
      'river',
      'cow',
      'wheat',
      'ship',
      'crystal',
      'duck',
      'honey',
      'apple',
      'castle',
      'sheep',
      'goat',
    ]),
  },
  {
    id: 'br',
    country: 'Brésil — État',
    note: 'Pictos sous drapeau · verso blanc + scatter',
    ribbon: 'Brasil',
    ribbonBg: '#009c3b',
    accent: '#002776',
    code: 'SP',
    name: 'São Paulo',
    subLabel: 'Capital',
    subValue: 'São Paulo',
    emblemSrc: '/mockups/emblems/saopaulo.png',
    emblemKind: 'flag',
    foot: [
      { id: 'palm', label: 'Palm' },
      { id: 'factory', label: 'Industrie' },
      { id: 'race', label: 'Sport' },
    ],
    backTitle: 'Estados',
    backSub: 'do Brasil',
    backScatter: scatterRing([
      'palm',
      'beach',
      'banana',
      'rum',
      'sugar',
      'fish',
      'sea',
      'factory',
      'pepper',
      'flower',
      'ship',
      'gold',
      'melon',
      'airplane',
      'river',
      'race',
    ]),
  },
]

function MockBackPictos({ items }: { items: Scatter[] }) {
  return (
    <span className="back-pictos mock-back-pictos" aria-hidden>
      {items.map((item, i) => (
        <span
          key={`${item.id}-${i}`}
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
            <div className={`mock-emblem is-${card.emblemKind}`}>
              <img src={card.emblemSrc} alt="" />
            </div>
            <div className="mock-foot-pictos">
              {card.foot.map((f) => (
                <span key={f.label} title={f.label}>
                  <span className="mock-foot-ico">
                    <Picto id={f.id} />
                  </span>
                  {f.label}
                </span>
              ))}
            </div>
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
          France inchangée. Autres pays : même esprit — pictos sous l’emblème, verso blanc avec
          pictos dispersés (pas de cadre).
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
