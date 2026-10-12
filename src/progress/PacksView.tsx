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

    timers.current.push(
      window.setTimeout(() => {
        setPhase('reveal')
        res.draws.forEach((_, i) => {
          timers.current.push(
            window.setTimeout(() => setVisibleCount(i + 1), 180 + i * 320),
          )
        })
      }, 900),
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
          Tirage sur les {total} cartes · {PACK_COST} crédits · {CARDS_PER_PACK} cartes
        </p>
      </div>

      {phase === 'idle' || phase === 'opening' ? (
        <section className="packs-stage" aria-label="Ouverture de pack">
          <button
            type="button"
            className={`packs-seal ${phase === 'opening' ? 'is-opening' : ''}`}
            disabled={!canBuy}
            onClick={buy}
            aria-label={`Ouvrir un pack pour ${PACK_COST} crédits`}
          >
            <span className="packs-seal-shine" aria-hidden />
            <span className="packs-seal-body">
              <span className="packs-seal-brand">GeoFun</span>
              <span className="packs-seal-title">Pack</span>
              <span className="packs-seal-sub">{CARDS_PER_PACK} cartes surprises</span>
            </span>
            <span className="packs-seal-cost">{PACK_COST} crédits</span>
          </button>
          <p className="packs-stage-hint">
            {phase === 'opening'
              ? 'Ouverture…'
              : canBuy
                ? 'Touche le pack pour l’ouvrir'
                : `Pas assez de crédits (besoin de ${PACK_COST})`}
          </p>
        </section>
      ) : null}

      {err ? <p className="packs-err">{err}</p> : null}

      {phase === 'reveal' && draws ? (
        <section className="packs-reveal" aria-live="polite">
          <h2>{revealDone ? 'Tu as obtenu' : 'Découverte…'}</h2>
          <ul className="packs-reveal-list">
            {draws.map((d, i) => {
              const shown = i < visibleCount
              return (
                <li
                  key={`${i}-${d.card.id}`}
                  className={[
                    shown ? 'is-shown' : 'is-hidden',
                    d.duplicate ? 'is-dup' : 'is-new',
                  ].join(' ')}
                  style={{ transitionDelay: shown ? `${i * 40}ms` : '0ms' }}
                >
                  <div className="packs-flip">
                    <CardThumb card={d.card} />
                    <div className="packs-flip-meta">
                      <strong>{d.card.name}</strong>
                      <span>{d.card.sub}</span>
                      {shown ? (
                        d.duplicate ? (
                          <em>Doublon</em>
                        ) : (
                          <em>Nouvelle !</em>
                        )
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
                Rouvrir ({PACK_COST})
              </button>
              {owned > 0 ? (
                <button type="button" className="packs-album-btn" onClick={onOpenAlbum}>
                  Voir l’album
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
          Un seul pack global — pas de thème. Doublons défaussables dans l’album (+5).
          {owned > 0 ? (
            <>
              {' '}
              <button type="button" className="packs-inline" onClick={onOpenAlbum}>
                Album ({owned})
              </button>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  )
}
