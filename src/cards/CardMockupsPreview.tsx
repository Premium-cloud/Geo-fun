import { buildBackScatter, type BackScatterItem } from './backScatterSlots'
import { FranceCardPairPreview } from './CartesFranceView'
import { Picto } from './pictos'
import {
  TERRITORY_PACK_ORDER,
  TERRITORY_PACKS,
  type TerritoryPack,
  type TerritoryUnit,
} from '../data/territoryPictos'
import './CartesMondeView.css'
import './CartesFranceView.css'
import './CardMockupsPreview.css'

/** Emblèmes disponibles en local (sinon fallback code). */
const EMBLEM_SRC: Partial<Record<string, string>> = {
  'ch:VD': '/mockups/emblems/vaud.png',
  'us:CA': '/mockups/emblems/california.png',
  'es:AN': '/mockups/emblems/andalucia.png',
  'de:BY': '/mockups/emblems/bayern.png',
  'jp:13': '/mockups/emblems/tokyo.png',
  'ca:QC': '/mockups/emblems/quebec.png',
  'br:SP': '/mockups/emblems/saopaulo.png',
}

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

function MockRecto({
  pack,
  unit,
}: {
  pack: TerritoryPack
  unit: TerritoryUnit
}) {
  const emblemKey = `${pack.id}:${unit.code}`
  const emblemSrc = EMBLEM_SRC[emblemKey]
  return (
    <div className="mock-card">
      <span className="mock-face-tag">{unit.code}</span>
      <div className={`mock-face mock-face-front is-${pack.emblemKind}`}>
        <div className="mock-ribbon" style={{ background: pack.ribbonBg }}>
          {pack.country}
        </div>
        <div className="mock-identity">
          <div className="mock-code" style={{ color: pack.accent }}>
            {unit.code}
          </div>
          <div className="mock-name">{unit.name}</div>
          <div className="mock-sub">
            <span>{pack.subLabel}</span> {unit.capital}
          </div>
        </div>
        <div className={`mock-emblem has-pictos is-${pack.emblemKind}`}>
          {emblemSrc ? (
            <img src={emblemSrc} alt="" />
          ) : (
            <span className="mock-emblem-fallback" aria-hidden>
              {unit.code}
            </span>
          )}
        </div>
        <span className="front-pictos" aria-label="Spécialités">
          {unit.pictos.map((f) => (
            <span key={f.label} className="front-picto" title={f.label}>
              <Picto id={f.icon} />
              <span className="front-picto-label">{f.label}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  )
}

function PackSection({ pack }: { pack: TerritoryPack }) {
  const backScatter = buildBackScatter(pack.backIds)
  return (
    <article className="mock-pair mock-pack">
      <header className="mock-pair-head">
        <h2>
          {pack.country} — {pack.unitKind}
        </h2>
        <p>
          {pack.units.length} zones · recto par unité · verso unique (40 slots France)
        </p>
      </header>

      <div className="mock-pack-verso">
        <div className="mock-card">
          <span className="mock-face-tag">Verso (pack)</span>
          <div className="mock-face mock-face-back">
            <MockBackPictos items={backScatter} />
            <div className="mock-back-title">
              <strong>{pack.backTitle}</strong>
              <span>{pack.backSub}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mock-pack-rectos">
        {pack.units.map((unit) => (
          <MockRecto key={unit.code} pack={pack} unit={unit} />
        ))}
      </div>
    </article>
  )
}

export function CardMockupsPreview() {
  const total = TERRITORY_PACK_ORDER.reduce(
    (n, id) => n + TERRITORY_PACKS[id].units.length,
    0,
  )
  return (
    <div className="mockups-page">
      <div className="mockups-banner">
        <p className="mockups-kicker">Aperçu local — pas déployé</p>
        <h1>Maquettes cartes Territoires</h1>
        <p className="mockups-lead">
          France inchangée. Autres packs : {total} cartes — pictos recto par zone, verso partagé
          (mêmes positions que la France).
        </p>
      </div>

      <article className="mock-pair is-france">
        <header className="mock-pair-head">
          <h2>France — Département</h2>
          <p>Référence (recto blason + pictos · verso pictos)</p>
        </header>
        <div className="mock-pair-cards france-real-wrap">
          <div className="mock-card">
            <span className="mock-face-tag">Recto / Verso réels</span>
            <FranceCardPairPreview code="29" />
          </div>
        </div>
      </article>

      <div className="mockups-grid">
        {TERRITORY_PACK_ORDER.map((id) => (
          <PackSection key={id} pack={TERRITORY_PACKS[id]} />
        ))}
      </div>
    </div>
  )
}
