/** Pictogrammes dispersés au verso des cartes départements (40 Game Icons). */

import { Picto, type PictoId } from './pictos'

type Scatter = { id: PictoId; x: number; y: number; r: number; s: number }

/** Positions validées (spec recto/verso) — zone centrale dégagée. */
const BACK_SCATTER: Scatter[] = [
  { id: 'eiffel', x: 54, y: 93, r: -26, s: 10 },
  { id: 'wheat', x: 8, y: 10, r: -18, s: 11 },
  { id: 'wine', x: 89, y: 26, r: -12, s: 12 },
  { id: 'croissant', x: 8, y: 60, r: -6, s: 10 },
  { id: 'cheese', x: 85, y: 55, r: -15, s: 11 },
  { id: 'fleur', x: 8, y: 93, r: 14, s: 12 },
  { id: 'baguette', x: 51, y: 7, r: 20, s: 10 },
  { id: 'palm', x: 32, y: 27, r: 26, s: 11 },
  { id: 'lavender', x: 87, y: 91, r: -22, s: 12 },
  { id: 'lighthouse', x: 28, y: 74, r: 10, s: 10 },
  { id: 'castle', x: 78, y: 30, r: -16, s: 11 },
  { id: 'olive', x: 8, y: 33, r: 18, s: 12 },
  { id: 'fish', x: 62, y: 73, r: -8, s: 10 },
  { id: 'cathedral', x: 62, y: 30, r: 12, s: 11 },
  { id: 'beret', x: 88, y: 7, r: -24, s: 12 },
  { id: 'oyster', x: 33, y: 93, r: 6, s: 10 },
  { id: 'ship', x: 29, y: 7, r: 22, s: 11 },
  { id: 'grape', x: 6, y: 47, r: -14, s: 12 },
  { id: 'barrel', x: 74, y: 18, r: 16, s: 10 },
  { id: 'cow', x: 8, y: 75, r: -20, s: 11 },
  { id: 'coq', x: 95, y: 44, r: 4, s: 12 },
  { id: 'duck', x: 48, y: 81, r: 24, s: 10 },
  { id: 'scallop', x: 57, y: 18, r: -10, s: 11 },
  { id: 'honey', x: 76, y: 82, r: 28, s: 12 },
  { id: 'mustard', x: 20, y: 18, r: 15, s: 10 },
  { id: 'knife', x: 95, y: 65, r: 8, s: 11 },
  { id: 'apple', x: 95, y: 75, r: 9, s: 12 },
  { id: 'sea', x: 75, y: 2, r: -9, s: 10 },
  { id: 'champagne', x: 22, y: 85, r: 11, s: 11 },
  { id: 'cider', x: 67, y: 89, r: -11, s: 12 },
  { id: 'butter', x: 74, y: 64, r: -26, s: 10 },
  { id: 'ski', x: 50, y: 66, r: 20, s: 10 },
  { id: 'strawberry', x: 10, y: 24, r: -12, s: 12 },
  { id: 'chicken', x: 21, y: 37, r: -6, s: 10 },
  { id: 'forest', x: 41, y: 20, r: 8, s: 11 },
  { id: 'salt', x: 21, y: 65, r: 14, s: 12 },
  { id: 'cherry', x: 35, y: 66, r: 20, s: 10 },
  { id: 'pearl', x: 44, y: 34, r: 26, s: 11 },
  { id: 'volcano', x: 89, y: 16, r: -22, s: 12 },
  { id: 'beach', x: 78, y: 72, r: 10, s: 10 },
]

export function FranceBackPictos() {
  return (
    <span className="back-pictos" aria-hidden>
      {BACK_SCATTER.map((item) => (
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
