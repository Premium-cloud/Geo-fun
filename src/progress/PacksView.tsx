import { useEffect, useRef, useState } from 'react'
import {
  CARDS_PER_PACK,
  PACK_COST,
  canOpenPack,
  getCardCatalog,
  loadProgress,
  openPack,
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
  const owned = uniqueOwnedCount(state)
  const firstOpen = state.packsOpened === 0

  function clearTimers() {
    for (const id of timers.current) window.clearTimeout(id)
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  function sync(next: ProgressState) {
    setState(next)
    onProgressChange?.(next)
  }

  function showPack() {
    clearTimers()
    setDraws(null)
    setVisibleCount(0)
    setPhase('idle')
    setErr(null)
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
          ? `Pas assez de crédits (${PACK_COST}).`
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

    const tearMs = firstOpen ? 650 : 900
    const stagger = firstOpen ? 240 : 340
    timers.current.push(
      window.setTimeout(() => {
        setPhase('reveal')
        res.draws.forEach((d, i) => {
          timers.current.push(
            window.setTimeout(() => {
              setVisibleCount(i + 1)
              if (d.foil) playFoilReveal()
              else playCardReveal()
            }, 120 + i * stagger),
          )
        })
      }, tearMs),
    )
  }

  const canBuy = canOpenPack(state) && phase !== 'opening'
  const revealDone = phase === 'reveal' && visibleCount >= (draws?.length ?? 0)
  const total = getCardCatalog().length

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
          {PACK_COST} · {CARDS_PER_PACK} cartes · {owned}/{total}
        </p>
      </div>

      {phase === 'idle' || phase === 'opening' ? (
        <section className="packs-stage" aria-label="Ouverture de pack">
          <button
            type="button"
            className={`packs-booster ${phase === 'opening' ? 'is-opening' : ''}`}
            disabled={!canBuy}
            onClick={buy}
            aria-label={`Ouvrir un pack pour ${PACK_COST} crédits`}
          >
            <span className="packs-booster-edge" aria-hidden />
            <span className="packs-booster-foil" aria-hidden />
            <span className="packs-booster-grain" aria-hidden />
            <span className="packs-booster-body">
              <span className="packs-booster-brand">GeoFun</span>
              <span className="packs-booster-title">Booster</span>
              <span className="packs-booster-sub">{CARDS_PER_PACK} cartes</span>
            </span>
            <span className="packs-booster-wax" aria-hidden>
              <span>{CARDS_PER_PACK}</span>
            </span>
            <span className="packs-booster-cost">{PACK_COST} crédits</span>
          </button>
          {phase === 'opening' ? (
            <p className="packs-stage-hint">…</p>
          ) : firstOpen && canBuy ? (
            <p className="packs-stage-hint">Touche pour ouvrir</p>
          ) : !canBuy ? (
            <p className="packs-stage-hint">{PACK_COST} crédits</p>
          ) : null}
        </section>
      ) : null}

      {err ? <p className="packs-err">{err}</p> : null}

      {phase === 'reveal' && draws ? (
        <section className="packs-reveal" aria-live="polite">
          <ul className="packs-reveal-list">
            {draws.map((d, i) => {
              const shown = i < visibleCount
              return (
                <li
                  key={`${i}-${d.card.id}-${d.foil ? 'f' : 'n'}`}
                  className={[
                    'packs-draw',
                    shown ? 'is-shown' : 'is-hidden',
                    d.duplicate ? 'is-dup' : 'is-new',
                    d.foil ? 'is-foil' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {shown && d.duplicate ? (
                    <span className="packs-dup-pin">Doublon</span>
                  ) : null}
                  <div className="packs-flip">
                    <div className={`packs-art ${d.foil ? 'is-foil' : ''}`}>
                      {d.foil ? (
                        <>
                          <span className="packs-holo" aria-hidden />
                          <span className="packs-holo-glint" aria-hidden />
                        </>
                      ) : null}
                      <CardThumb card={d.card} />
                    </div>
                    <div className="packs-flip-meta">
                      <strong>{d.card.name}</strong>
                      <span>{d.card.sub}</span>
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
                onClick={showPack}
              >
                Rouvrir
              </button>
              {owned > 0 ? (
                <button type="button" className="packs-album-btn" onClick={onOpenAlbum}>
                  Album
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
