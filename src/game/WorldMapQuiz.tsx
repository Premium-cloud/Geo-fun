import { useEffect, useMemo, useState } from 'react'
import { ZoomableMap } from './ZoomableMap'
import './MapQuiz.css'

type MapData = { viewBox: string; paths: Record<string, string> }

type Props = {
  answerCode: string
  locked: boolean
  picked: string | null
  onPick: (code: string) => void
  onMiss?: () => void
}

/** Pays dont le tracé est trop petit → hit-target élargi. */
function isTinyPath(d: string): boolean {
  return d.length < 400
}

function pathCentroid(d: string): { x: number; y: number } | null {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? []
  if (nums.length < 4) return null
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
  if (!Number.isFinite(minX)) return null
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
}

export function WorldMapQuiz({
  answerCode,
  locked,
  picked,
  onPick,
  onMiss,
}: Props) {
  const [data, setData] = useState<MapData | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/maps/world-countries.json')
      .then((r) => r.json())
      .then((j: MapData) => {
        if (alive) setData(j)
      })
      .catch(() => {
        if (alive) setData(null)
      })
    return () => {
      alive = false
    }
  }, [])

  const tinyPads = useMemo(() => {
    if (!data) return [] as { code: string; x: number; y: number }[]
    const out: { code: string; x: number; y: number }[] = []
    for (const [code, d] of Object.entries(data.paths)) {
      if (!isTinyPath(d)) continue
      const c = pathCentroid(d)
      if (c) out.push({ code, ...c })
    }
    return out
  }, [data])

  if (!data) {
    return <p className="map-loading">Chargement de la carte…</p>
  }

  const revealed = picked !== null

  function regionClass(code: string) {
    if (!revealed) return 'map-region is-idle'
    if (code === answerCode) return 'map-region is-reveal is-correct'
    if (code === picked) return 'map-region is-wrong'
    return 'map-region is-idle is-locked'
  }

  return (
    <div className="map-quiz is-world">
      <ZoomableMap
        maxScale={8}
        resetKey={answerCode}
        locked={locked}
        onPickCode={onPick}
        onMiss={onMiss}
      >
        <div className="map-quiz-frame">
          <svg
            className="map-svg map-svg-world"
            viewBox={data.viewBox}
            role="img"
            aria-label="Carte du monde"
          >
            {/* Fond cliquable = miss */}
            <rect
              className="map-ocean"
              x={0}
              y={0}
              width={1000}
              height={520}
              fill="transparent"
            />
            {Object.entries(data.paths).map(([code, d]) => (
              <g key={code}>
                {/* Zone de hit élargie (stroke invisible) */}
                <path
                  d={d}
                  className="map-region-hit"
                  data-map-code={code}
                  strokeWidth={isTinyPath(d) ? 14 : 6}
                />
                <path d={d} className={regionClass(code)} data-map-code={code} />
              </g>
            ))}
            {tinyPads.map((p) => (
              <circle
                key={`pad-${p.code}`}
                className="map-region-pad"
                cx={p.x}
                cy={p.y}
                r={10}
                data-map-code={p.code}
              />
            ))}
          </svg>
        </div>
      </ZoomableMap>
    </div>
  )
}
