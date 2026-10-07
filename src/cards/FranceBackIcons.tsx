/** Pictogrammes dispersés au verso des cartes départements (style Game Icons). */

import type { ReactElement } from 'react'

type IconProps = { className?: string }

function IconCastle({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M2 22V10l3-2V4h3v2h2V4h3v2h2V4h3v4l3 2v12H2zm4-2h3v-4h2v4h2v-4h2v4h3V11.2L17 10V6h-1v2h-4V6h-1v2H7V6H6v4L4 11.2V20z"
      />
    </svg>
  )
}

function IconMountain({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M14 6l2.3 3.1L20 6l-8 12H4L10 8l2 2.7L14 6zm-1.5 5.2L10 7.5 5.8 14h8.9l-2.2-2.8z"
      />
    </svg>
  )
}

function IconWheat({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11 2c0 3-1.5 5-4 6 2.5 1 4 3 4 6v8h2V14c0-3 1.5-5 4-6-2.5-1-4-3-4-6h-2zm1 6.2C13.2 9.5 14.5 10 16 10c-1.5 0-2.8.5-4 1.8C10.8 10.5 9.5 10 8 10c1.5 0 2.8-.5 4-1.8z"
      />
    </svg>
  )
}

function IconAnchor({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2a3 3 0 0 1 1 5.83V10h3v2h-3v7.1A7 7 0 0 0 19 15h2a9 9 0 0 1-8 4.9V22h-2v-2.1A9 9 0 0 1 3 15h2a7 7 0 0 0 6 4.1V12H8v-2h3V7.83A3 3 0 0 1 12 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
      />
    </svg>
  )
}

function IconTree({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M11 22v-5H7l4-6H8l4-6 4 6h-3l4 6h-4v5h-2z"
      />
    </svg>
  )
}

function IconGrape({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2c1.5 1.5 2 3.2 2 4.5S13.1 9 12 9s-2-.8-2-2.5S10.5 3.5 12 2zm-4 7a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm8 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
      />
    </svg>
  )
}

function IconTower({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M8 2h8v3h-1v2h3v3h-2v10h2v2H6v-2h2V10H6V7h3V5H8V2zm4 5h2v3h-2V7zm0 5h2v8h-2v-8z"
      />
    </svg>
  )
}

function IconFish({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M2 12c4-5 8-6 12-6 3 0 5 1 8 3-1 2-2 3-3 3h-1c0 2-2 4-4 4s-4-2-4-4H8c-2 0-4-1-6-3zm14.5-2.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
      />
    </svg>
  )
}

/** Positions spatialisées (verso A4 / flip) — finalisées pour le duplex. */
const BACK_SCATTER: {
  Icon: (p: IconProps) => ReactElement
  top: string
  left: string
  size: string
  rotate: string
  opacity: number
}[] = [
  { Icon: IconCastle, top: '8%', left: '12%', size: '1.35rem', rotate: '-18deg', opacity: 0.16 },
  { Icon: IconMountain, top: '10%', left: '68%', size: '1.5rem', rotate: '14deg', opacity: 0.15 },
  { Icon: IconWheat, top: '28%', left: '78%', size: '1.25rem', rotate: '28deg', opacity: 0.14 },
  { Icon: IconAnchor, top: '62%', left: '72%', size: '1.3rem', rotate: '-12deg', opacity: 0.15 },
  { Icon: IconTree, top: '74%', left: '18%', size: '1.4rem', rotate: '8deg', opacity: 0.14 },
  { Icon: IconGrape, top: '48%', left: '8%', size: '1.2rem', rotate: '-22deg', opacity: 0.15 },
  { Icon: IconTower, top: '18%', left: '42%', size: '1.15rem', rotate: '6deg', opacity: 0.12 },
  { Icon: IconFish, top: '78%', left: '52%', size: '1.35rem', rotate: '16deg', opacity: 0.14 },
  { Icon: IconMountain, top: '55%', left: '38%', size: '1.1rem', rotate: '-8deg', opacity: 0.1 },
  { Icon: IconWheat, top: '38%', left: '58%', size: '1.05rem', rotate: '-30deg', opacity: 0.11 },
]

export function FranceBackPictos() {
  return (
    <span className="back-pictos" aria-hidden>
      {BACK_SCATTER.map(({ Icon, top, left, size, rotate, opacity }, i) => (
        <span
          key={i}
          className="back-picto"
          style={{
            top,
            left,
            width: size,
            height: size,
            opacity,
            transform: `rotate(${rotate})`,
          }}
        >
          <Icon />
        </span>
      ))}
    </span>
  )
}
