/** Pictogrammes dispersés au verso des cartes départements (40 Game Icons). */

import { buildBackScatter } from './backScatterSlots'
import { Picto, type PictoId } from './pictos'

/** Pool verso France — 40 uniques, alignés sur BACK_SCATTER_SLOTS. */
export const FRANCE_BACK_IDS: readonly PictoId[] = [
  'eiffel',
  'wheat',
  'wine',
  'croissant',
  'cheese',
  'fleur',
  'baguette',
  'palm',
  'lavender',
  'lighthouse',
  'castle',
  'olive',
  'fish',
  'cathedral',
  'beret',
  'oyster',
  'ship',
  'grape',
  'barrel',
  'cow',
  'coq',
  'duck',
  'scallop',
  'honey',
  'mustard',
  'knife',
  'apple',
  'sea',
  'champagne',
  'cider',
  'butter',
  'ski',
  'strawberry',
  'chicken',
  'forest',
  'salt',
  'cherry',
  'pearl',
  'volcano',
  'beach',
]

export function FranceBackPictos() {
  const items = buildBackScatter(FRANCE_BACK_IDS)
  return (
    <span className="back-pictos" aria-hidden>
      {items.map((item) => (
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
