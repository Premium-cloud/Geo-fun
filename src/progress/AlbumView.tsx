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
import { AlbumCollectibleCard } from './AlbumCollectibleCard'
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
  const [flipped, setFlipped] = useState<Record<string, boolean>>({})
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
        {uniqueOwnedCount(state)} / {total}
        {foils > 0 ? ` · ${foils} foil` : ''} · {state.points} crédits
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
            onClick={() => {
              setFilter(id)
              setFlipped({})
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="album-empty">Rien dans ce filtre.</p>
      ) : (
        <ul className="album-deck">
          {list.map((c) => (
            <li key={c.id} className={`album-slot ${c.foil ? 'is-foil' : ''}`}>
              <AlbumCollectibleCard
                id={c.id}
                foil={c.foil}
                flipped={!!flipped[c.id]}
                onFlip={() =>
                  setFlipped((prev) => ({ ...prev, [c.id]: !prev[c.id] }))
                }
              />
              <div className="album-slot-meta">
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
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
