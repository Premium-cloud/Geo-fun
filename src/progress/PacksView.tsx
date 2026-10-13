import { useEffect, useRef, useState } from 'react'
import {
  CARDS_PER_PACK,
  DUP_DISCARD_CREDIT,
  FOIL_CHANCE,
  PACK_COST,
  canOpenPack,
  getCardCatalog,
  loadProgress,
  openPack,
  uniqueFoilCount,
  uniqueOwnedCount,
  type PackDraw,
  type ProgressState,
} from '../lib/progression'
import { playCardReveal, playFoilReveal, playPackTear } from '../lib/packSfx'
import { CardThumb } from './CardThumb'
import './PacksView.css'

type Phase = 'idle' | 'opening' | 'reveal'

export function PacksView({
  onBack,
  onOpenAlbum,
  onProgressChange,
}: {
  onBack: () => void
  onOpenAlbum: () => void
  onProgressChange?: (p: ProgressState) => void
}) {
  const [state, setState] = useState(() => loadProgress())
  const [draws, setDraws] = useState<PackDraw[] | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [visibleCount, setVisibleCount] = useState(0)
  const [err, setErr] = useState<string | null>(null)
  const timers = useRef<number[]>([])
  const total = getCardCatalog().length
  const owned = uniqueOwnedCount(state)
  const foils = uniqueFoilCount(state)

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id)
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  function sync(next: ProgressState) {
    setState(next)
    onProgressChange?.(next)
  }

  function buy() {
    if (phase === 'opening') return
    setErr(null)
    const res = openPack()
    if (!res.ok) {
      setDraws(null)
      setPhase('idle')
      setErr(
        res.reason === 'points'
          ? `Il te faut ${PACK_COST} crédits (tu en as ${state.points}).`
          : 'Pack indisponible.',
      )
      return
    }
    clearTimers()
    setDraws(res.draws)
    setVisibleCount(0)
    setPhase('opening')
    sync(res.state)
    playPackTear()

    timers.current.push(
      window.setTimeout(() => {
        setPhase('reveal')
        res.draws.forEach((d, i) => {
          timers.current.push(
            window.setTimeout(() => {
              setVisibleCount(i + 1)
              if (d.foil) playFoilReveal()
              else playCardReveal()
            }, 220 + i * 380),
          )
        })
      }, 1000),
    )
  }

  function resetToIdle() {
    clearTimers()
    setDraws(null)
    setVisibleCount(0)
    setPhase('idle')
    setErr(null)
  }

  const canBuy = canOpenPack(state) && phase !== 'opening'
  const revealDone = phase === 'reveal' && visibleCount >= (draws?.length ?? 0)
  const foilPct = Math.round(FOIL_CHANCE * 100)

  return (
    <div className={`packs-view is-${phase}`}>
      <header className="packs-top">
        <button type="button" className="prog-back" onClick={onBack}>
          ← Accueil
        </button>
        <div className="packs-wallet" aria-live="polite">
          <strong>{state.points}</strong>
          <span>crédits</span>
        </div>
      </header>

      <div className="packs-intro">
        <h1>Packs</h1>
        <p>
          {PACK_COST} crédits · {CARDS_PER_PACK} cartes · foil ~{foilPct}% · album {owned}/
          {total}
          {foils > 0 ? ` · ${foils} foil` : ''}
        </p>
      </div>

      {phase === 'idle' || phase === 'opening' ? (
        <section className="packs-stage" aria-label="Ouverture de pack">
          <div className={`packs-stage-ring ${phase === 'opening' ? 'is-opening' : ''}`}>
            <button
              type="button"
              className={`packs-seal ${phase === 'opening' ? 'is-opening' : ''}`}
              disabled={!canBuy}
              onClick={buy}
              aria-label={`Ouvrir un pack pour ${PACK_COST} crédits`}
            >
              <span className="packs-seal-band" aria-hidden />
              <span className="packs-seal-body">
                <span className="packs-seal-brand">GeoFun</span>
                <span className="packs-seal-title">Pack</span>
                <span className="packs-seal-sub">{CARDS_PER_PACK} cartes</span>
              </span>
              <span className="packs-seal-cost">{PACK_COST}</span>
            </button>
          </div>
          <p className="packs-stage-hint">
            {phase === 'opening'
              ? 'Ouverture…'
              : canBuy
                ? 'Ouvre le pack'
                : `${PACK_COST} crédits nécessaires`}
          </p>
        </section>
      ) : null}

      {err ? <p className="packs-err">{err}</p> : null}

      {phase === 'reveal' && draws ? (
        <section className="packs-reveal" aria-live="polite">
          <h2>{revealDone ? 'Résultat' : '…'}</h2>
          <ul className="packs-reveal-list">
            {draws.map((d, i) => {
              const shown = i < visibleCount
              return (
                <li
                  key={`${i}-${d.card.id}-${d.foil ? 'f' : 'n'}`}
                  className={[
                    shown ? 'is-shown' : 'is-hidden',
                    d.duplicate ? 'is-dup' : 'is-new',
                    d.foil ? 'is-foil' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="packs-flip">
                    {d.foil ? <span className="packs-foil-sheen" aria-hidden /> : null}
                    <CardThumb card={d.card} />
                    <div className="packs-flip-meta">
                      <strong>{d.card.name}</strong>
                      <span>{d.card.sub}</span>
                      {shown ? (
                        <em className={d.foil ? 'is-foil-tag' : undefined}>
                          {d.foil
                            ? d.newFoil
                              ? 'Foil !'
                              : 'Foil (doublon)'
                            : d.duplicate
                              ? 'Doublon'
                              : 'Nouvelle'}
                        </em>
                      ) : null}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {revealDone ? (
            <div className="packs-reveal-actions">
              <button
                type="button"
                className="packs-again"
                disabled={!canOpenPack(state)}
                onClick={buy}
              >
                Rouvrir · {PACK_COST}
              </button>
              {owned > 0 ? (
                <button type="button" className="packs-album-btn" onClick={onOpenAlbum}>
                  Album
                </button>
              ) : null}
              <button type="button" className="packs-done" onClick={resetToIdle}>
                Fermer
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

      {phase === 'idle' ? (
        <p className="packs-footnote">
          Hasard sur {total} cartes. Foil = variante dorée. Doublons → album (+
          {DUP_DISCARD_CREDIT} crédits).
          {owned > 0 ? (
            <>
              {' '}
              <button type="button" className="packs-inline" onClick={onOpenAlbum}>
                Album
              </button>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  )
}
