import { useState } from 'react'
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

function emblemCandidates(packId: string, code: string): string[] {
  const base = `/mockups/emblems/${packId}/${code}`
  return [`${base}.svg`, `${base}.png`]
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

function MockEmblem({
  packId,
  code,
  kind,
}: {
  packId: string
  code: string
  kind: 'blason' | 'flag'
}) {
  const sources = emblemCandidates(packId, code)
  const [idx, setIdx] = useState(0)
  const src = sources[idx]
  if (!src) {
    return (
      <span className="mock-emblem-fallback" aria-hidden>
        {code}
      </span>
    )
  }
  return (
    <img
      src={src}
      alt=""
      className={kind === 'flag' ? 'is-flag-img' : undefined}
      onError={() => setIdx((i) => i + 1)}
    />
  )
}

function MockRecto({
  pack,
  unit,
}: {
  pack: TerritoryPack
  unit: TerritoryUnit
}) {
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
          <MockEmblem packId={pack.id} code={unit.code} kind={pack.emblemKind} />
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
          France inchangée. {total} zones — emblèmes Wikimedia + pictos documentés par pack (voir{' '}
          <code>territories/SOURCES.md</code>).
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
