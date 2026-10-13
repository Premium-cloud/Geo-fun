import { useMemo, useState } from 'react'
import {
  DUP_DISCARD_CREDIT,
  albumUnlocked,
  discardDuplicate,
  getCardCatalog,
  loadProgress,
  ownedCards,
  uniqueFoilCount,
  uniqueOwnedCount,
  type CardRegion,
  type ProgressState,
} from '../lib/progression'
import { CardThumb } from './CardThumb'
import './AlbumView.css'

type Filter = 'all' | 'foil' | CardRegion

export function AlbumView({
  onBack,
  onOpenPacks,
  onProgressChange,
}: {
  onBack: () => void
  onOpenPacks: () => void
  onProgressChange?: (p: ProgressState) => void
}) {
  const [filter, setFilter] = useState<Filter>('all')
  const [state, setState] = useState(() => loadProgress())
  const unlocked = albumUnlocked(state)
  const owned = useMemo(() => ownedCards(state), [state])
  const total = getCardCatalog().length
  const foils = uniqueFoilCount(state)

  const list = useMemo(() => {
    if (filter === 'all') return owned
    if (filter === 'foil') return owned.filter((c) => c.foil)
    return owned.filter((c) => c.region === filter)
  }, [owned, filter])

  function sync(next: ProgressState) {
    setState(next)
    onProgressChange?.(next)
  }

  function onDiscard(id: string) {
    const next = discardDuplicate(id)
    if (next) sync(next)
  }

  if (!unlocked) {
    return (
      <div className="album-view">
        <button type="button" className="prog-back" onClick={onBack}>
          ← Accueil
        </button>
        <h1>Mon album</h1>
        <div className="album-locked">
          <p className="album-locked-title">Album verrouillé</p>
          <p>Ouvre un pack pour ta première carte.</p>
          <button type="button" className="album-packs-btn" onClick={onOpenPacks}>
            Ouvrir un pack
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="album-view">
      <button type="button" className="prog-back" onClick={onBack}>
        ← Accueil
      </button>
      <h1>Mon album</h1>
      <p className="album-lead">
        {uniqueOwnedCount(state)} / {total} · {foils} foil · {state.points} crédits
      </p>
      <p className="album-hint">
        Album complet → titre + contour. Album foil complet → titre + contour stylé. Doublon → +
        {DUP_DISCARD_CREDIT} crédits.
      </p>

      <div className="album-filters" role="group" aria-label="Filtrer">
        {(
          [
            ['all', 'Tout'],
            ['foil', 'Foil'],
            ['france', 'France'],
            ['monde', 'Monde'],
            ['territoires', 'Territoires'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`album-chip ${filter === id ? 'is-active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="album-grid">
        {list.map((c) => (
          <li key={c.id} className={`album-card is-owned ${c.foil ? 'is-foil' : ''}`}>
            <CardThumb card={c} className="album-img" emptyClassName="is-empty" />
            <strong>{c.name}</strong>
            <span>{c.sub}</span>
            {c.foil ? <em className="album-foil-tag">Foil</em> : null}
            {c.count > 1 ? (
              <button
                type="button"
                className="album-discard"
                onClick={() => onDiscard(c.id)}
              >
                Défausser ×{c.count - 1} (+{DUP_DISCARD_CREDIT})
              </button>
            ) : (
              <em className="album-once">×1</em>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
