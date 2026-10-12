import { useMemo, useState } from 'react'
import {
  DUP_DISCARD_CREDIT,
  albumUnlocked,
  discardDuplicate,
  getCardCatalog,
  loadProgress,
  ownedCards,
  uniqueOwnedCount,
  type CardRegion,
  type ProgressState,
} from '../lib/progression'
import './AlbumView.css'

type Filter = 'all' | CardRegion

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

  const list = useMemo(() => {
    if (filter === 'all') return owned
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
          <p>
            Ouvre un pack pour obtenir ta première carte — ensuite l’album se débloque.
          </p>
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
        {uniqueOwnedCount(state)} / {total} · {state.points} crédits
      </p>
      <p className="album-hint">
        Cartes possédées. Doublon (×2+) → défausse = +{DUP_DISCARD_CREDIT} crédits. Le lexique
        reste le catalogue complet.
      </p>

      <div className="album-filters" role="group" aria-label="Filtrer">
        {(
          [
            ['all', 'Tout'],
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
          <li key={c.id} className="album-card is-owned">
            {c.image ? (
              <img src={c.image} alt="" className="album-img" />
            ) : (
              <span className="album-img is-empty" />
            )}
            <strong>{c.name}</strong>
            <span>{c.sub}</span>
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
