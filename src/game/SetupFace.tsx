import { useEffect, useState } from 'react'
import { TERRITORY_PACKS, type TerritoryPackId } from '../data/territories'

type MapData = { viewBox: string; paths: Record<string, string> }

const SAMPLE_CODE: Record<TerritoryPackId, string> = {
  fr: '69',
  ch: 'GE',
  us: 'NY',
  es: 'MD',
  de: 'BY',
  jp: '13',
  ca: 'ON',
  br: 'RJ',
}

let worldPromise: Promise<MapData> | null = null
const packPromises = new Map<string, Promise<MapData>>()

function loadWorld() {
  worldPromise ??= fetch('/maps/world-countries.json').then((r) => r.json())
  return worldPromise
}

function loadPack(packId: string) {
  let pending = packPromises.get(packId)
  if (!pending) {
    pending = fetch(`/maps/territoires/${packId}.json`).then((r) => r.json())
    packPromises.set(packId, pending)
  }
  return pending
}

function pathBounds(d: string) {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i]!
    const y = nums[i + 1]!
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }
  const padX = (maxX - minX) * 0.08
  const padY = (maxY - minY) * 0.08
  return {
    minX: minX - padX,
    minY: minY - padY,
    width: maxX - minX + padX * 2,
    height: maxY - minY + padY * 2,
  }
}

function sampleUnit(packId: TerritoryPackId) {
  const pack = TERRITORY_PACKS[packId]
  const code = SAMPLE_CODE[packId]
  return pack.units.find((unit) => unit.code === code) ?? pack.units[0]
}

function wordClass(text: string) {
  if (text.length > 8) return 'game-setup-word is-long'
  if (text.length > 5) return 'game-setup-word is-mid'
  return 'game-setup-word'
}

function emblemSrc(packId: TerritoryPackId, code: string) {
  if (packId === 'fr') return `/blasons/${code}.png`
  return `/mockups/emblems/${packId}/${code}.png`
}

export function SetupFace({
  category,
  mode,
  packId,
}: {
  category: string
  mode: string
  packId: TerritoryPackId
}) {
  const [world, setWorld] = useState<MapData | null>(null)
  const [packMap, setPackMap] = useState<MapData | null>(null)

  const wantsItaly = category === 'pays' && mode === 'carte'
  const wantsPack = category === 'territoires' && mode === 'carte'

  useEffect(() => {
    if (!wantsItaly) return
    let alive = true
    loadWorld().then((data) => {
      if (alive) setWorld(data)
    })
    return () => {
      alive = false
    }
  }, [wantsItaly])

  useEffect(() => {
    if (!wantsPack) return
    let alive = true
    setPackMap(null)
    loadPack(packId).then((data) => {
      if (alive) setPackMap(data)
    })
    return () => {
      alive = false
    }
  }, [wantsPack, packId])

  if (category === 'mixte') {
    return (
      <div className="game-setup-mix">
        <img className="game-setup-flag" src="/flags/it.svg" alt="Drapeau de l’Italie" />
        <p className={wordClass('Italie')}>Italie</p>
        <p className={wordClass('69')}>69</p>
      </div>
    )
  }

  if (category === 'capitale') {
    if (mode === 'flagToCapital') {
      return <img className="game-setup-flag" src="/flags/it.svg" alt="Drapeau de l’Italie" />
    }
    return <p className={wordClass('Italie')}>Italie</p>
  }

  if (category === 'pays') {
    if (mode === 'flagToName') {
      return <img className="game-setup-flag" src="/flags/it.svg" alt="Drapeau de l’Italie" />
    }
    if (mode === 'nameToFlag') return <p className={wordClass('Italie')}>Italie</p>
    if (mode === 'carte') {
      const d = world?.paths.IT
      if (!d) return <p className={wordClass('Italie')}>Italie</p>
      const box = pathBounds(d)
      return (
        <svg
          className="game-setup-map"
          viewBox={`${box.minX} ${box.minY} ${box.width} ${box.height}`}
          role="img"
          aria-label="Carte de l’Italie"
        >
          <path d={d} className="is-country" />
        </svg>
      )
    }
    return <p className={wordClass('Rome')}>Rome</p>
  }

  if (category === 'territoires') {
    const unit = sampleUnit(packId)
    if (!unit) return null
    if (mode === 'code') return <p className={wordClass(unit.code)}>{unit.code}</p>
    if (mode === 'capital') return <p className={wordClass(unit.capital)}>{unit.capital}</p>
    if (mode === 'emblem') {
      const pack = TERRITORY_PACKS[packId]
      const src = emblemSrc(packId, unit.code)
      if (pack.emblemKind === 'flag') {
        return <img className="game-setup-flag" src={src} alt="" />
      }
      return <img className="game-setup-blason" src={src} alt="" />
    }
    if (!packMap) return <p className={wordClass(unit.code)}>{unit.code}</p>
    return (
      <svg className="game-setup-map is-regions" viewBox={packMap.viewBox} role="img" aria-label="Carte">
        {Object.entries(packMap.paths).map(([code, d]) => (
          <path key={code} d={d} className={code === unit.code ? 'is-hot' : 'is-region'} />
        ))}
      </svg>
    )
  }

  return <p className={wordClass('Italie')}>Italie</p>
}
