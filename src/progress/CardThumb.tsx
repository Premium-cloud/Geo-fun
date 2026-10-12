import { useState } from 'react'
import { cardImageCandidates, type CollectibleCard } from '../lib/progression'

/** Miniature avec fallback png ↔ svg (évite les icônes cassées au reveal). */
export function CardThumb({
  card,
  className = 'packs-thumb',
  emptyClassName = 'is-empty',
}: {
  card: CollectibleCard
  className?: string
  emptyClassName?: string
}) {
  const sources = cardImageCandidates(card)
  const [idx, setIdx] = useState(0)
  const src = sources[idx]

  if (!src) {
    return <span className={`${className} ${emptyClassName}`} aria-hidden />
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      loading="eager"
      decoding="async"
      onError={() => setIdx((i) => i + 1)}
    />
  )
}
