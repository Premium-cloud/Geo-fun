import { useState } from 'react'
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
import './PacksView.css'

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
  const [err, setErr] = useState<string | null>(null)
  const total = getCardCatalog().length

  function sync(next: ProgressState) {
    setState(next)
    onProgressChange?.(next)
  }

  function buy() {
    setErr(null)
    const res = openPack()
    if (!res.ok) {
      setDraws(null)
      setErr(
        res.reason === 'points'
          ? `Il te faut ${PACK_COST} crédits (tu en as ${state.points}).`
          : 'Pack indisponible.',
      )
      return
    }
    setDraws(res.draws)
    sync(res.state)
  }

  return (
    <div className="packs-view">
      <button type="button" className="prog-back" onClick={onBack}>
        ← Accueil
      </button>
      <h1>Packs</h1>
      <p className="packs-lead">
        {state.points} crédits · pack = {PACK_COST} · {CARDS_PER_PACK} cartes au hasard
      </p>
      <p className="packs-hint">
        Un seul type de pack : tirage sur les <strong>{total}</strong> cartes du jeu. Pas de
        thème — c’est la chance. Les doublons se défaussent dans l’album (+5 crédits).
      </p>

      <button
        type="button"
        className="packs-card is-global"
        disabled={!canOpenPack(state)}
        onClick={buy}
      >
        <strong>Ouvrir un pack</strong>
        <span>3 cartes parmi tout le catalogue</span>
        <em>{PACK_COST} crédits</em>
      </button>

      {err ? <p className="packs-err">{err}</p> : null}

      {draws ? (
        <section className="packs-reveal" aria-live="polite">
          <h2>Tu as obtenu</h2>
          <ul className="packs-reveal-list">
            {draws.map((d, i) => (
              <li key={`${i}-${d.card.id}`} className={d.duplicate ? 'is-dup' : ''}>
                {d.card.image ? (
                  <img src={d.card.image} alt="" className="packs-thumb" />
                ) : (
                  <span className="packs-thumb is-empty" />
                )}
                <div>
                  <strong>{d.card.name}</strong>
                  <span>{d.card.sub}</span>
                  {d.duplicate ? <em>Doublon</em> : <em>Nouvelle !</em>}
                </div>
              </li>
            ))}
          </ul>
          {uniqueOwnedCount(state) > 0 ? (
            <button type="button" className="packs-album-btn" onClick={onOpenAlbum}>
              Voir l’album
            </button>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
