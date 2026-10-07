/** Pictogrammes dispersés au verso des cartes départements (40 Game Icons). */

import { Picto, type PictoId } from './pictos'

type Scatter = { id: PictoId; x: number; y: number; r: number; s: number }

const BACK_SCATTER: Scatter[] = [
  { id: 'eiffel', x: 54, y: 93, r: -26, s: 10 },
  { id: 'wheat', x: 8, y: 10, r: -18, s: 11 },
  { id: 'wine', x: 89, y: 26, r: -12, s: 12 },
  { id: 'croissant', x: 6, y: 68, r: -6, s: 10 },
  { id: 'cheese', x: 87, y: 65, r: 8, s: 11 },
  { id: 'fleur', x: 8, y: 93, r: 14, s: 12 },
  { id: 'baguette', x: 51, y: 7, r: 20, s: 10 },
  { id: 'palm', x: 32, y: 27, r: 26, s: 11 },
  { id: 'lavender', x: 87, y: 91, r: -22, s: 12 },
  { id: 'lighthouse', x: 28, y: 74, r: 10, s: 10 },
  { id: 'castle', x: 90, y: 50, r: -16, s: 11 },
  { id: 'olive', x: 8, y: 33, r: 18, s: 12 },
  { id: 'fish', x: 62, y: 73, r: -8, s: 10 },
  { id: 'cathedral', x: 63, y: 28, r: 12, s: 11 },
  { id: 'beret', x: 88, y: 7, r: -24, s: 12 },
  { id: 'oyster', x: 33, y: 93, r: 6, s: 10 },
  { id: 'ship', x: 29, y: 7, r: 22, s: 11 },
  { id: 'grape', x: 10, y: 47, r: -14, s: 12 },
  { id: 'barrel', x: 70, y: 11, r: 16, s: 10 },
  { id: 'cow', x: 8, y: 75, r: -20, s: 11 },
  { id: 'coq', x: 94, y: 38, r: 4, s: 12 },
  { id: 'duck', x: 48, y: 81, r: 24, s: 10 },
  { id: 'scallop', x: 57, y: 18, r: -10, s: 11 },
  { id: 'honey', x: 76, y: 82, r: 28, s: 12 },
  { id: 'mustard', x: 20, y: 18, r: 15, s: 10 },
  { id: 'knife', x: 94, y: 58, r: -15, s: 11 },
  { id: 'apple', x: 89, y: 75, r: 9, s: 12 },
  { id: 'sea', x: 75, y: 24, r: -9, s: 10 },
  { id: 'champagne', x: 22, y: 85, r: 11, s: 11 },
  { id: 'cider', x: 67, y: 89, r: -11, s: 12 },
  { id: 'butter', x: 81, y: 68, r: -26, s: 10 },
  { id: 'ski', x: 81, y: 31, r: -18, s: 11 },
  { id: 'strawberry', x: 10, y: 24, r: -12, s: 12 },
  { id: 'chicken', x: 19, y: 36, r: -6, s: 10 },
  { id: 'forest', x: 41, y: 20, r: 8, s: 11 },
  { id: 'salt', x: 19, y: 66, r: 14, s: 12 },
  { id: 'cherry', x: 49, y: 70, r: 20, s: 10 },
  { id: 'pearl', x: 56, y: 28, r: 26, s: 11 },
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
