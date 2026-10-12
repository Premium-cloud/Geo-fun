import { useEffect, useState } from 'react'
import { ZoomableMap } from './ZoomableMap'
import './MapQuiz.css'

type MapData = { viewBox: string; paths: Record<string, string> }

type Props = {
  packId: string
  answerCode: string
  locked: boolean
  picked: string | null
  onPick: (code: string) => void
  onMiss?: () => void
  label?: string
}

export function TerritoryMapQuiz({
  packId,
  answerCode,
  locked,
  picked,
  onPick,
  onMiss,
  label = 'Carte des territoires',
}: Props) {
  const [data, setData] = useState<MapData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    setData(null)
    setError(false)
    fetch(`/maps/territoires/${packId}.json`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .then((j: MapData) => {
        if (alive) setData(j)
      })
      .catch(() => {
        if (alive) setError(true)
      })
    return () => {
      alive = false
    }
  }, [packId])

  if (error) {
    return <p className="map-loading">Carte indisponible pour ce pack.</p>
  }
  if (!data) {
    return <p className="map-loading">Chargement de la carte…</p>
  }

  const revealed = picked !== null
  const [, , vbW, vbH] = data.viewBox.split(/\s+/).map(Number)

  function regionClass(code: string) {
    if (!revealed) return 'map-region is-idle'
    if (code === answerCode) return 'map-region is-reveal is-correct'
    if (code === picked) return 'map-region is-wrong'
    return 'map-region is-idle is-locked'
  }

  return (
    <div className="map-quiz is-france is-territoire">
      <ZoomableMap
        resetKey={`${packId}-${answerCode}`}
        locked={locked}
        onPickCode={onPick}
        onMiss={onMiss}
      >
        <div className="map-quiz-frame">
          <svg
            className="map-svg"
            viewBox={data.viewBox}
            role="img"
            aria-label={label}
          >
            <rect
              className="map-ocean"
              x={0}
              y={0}
              width={vbW || 900}
              height={vbH || 900}
              fill="transparent"
            />
            {Object.entries(data.paths).map(([code, d]) => (
              <g key={code}>
                <path d={d} className="map-region-hit" data-map-code={code} strokeWidth={5} />
                <path d={d} className={regionClass(code)} data-map-code={code} />
              </g>
            ))}
          </svg>
        </div>
      </ZoomableMap>
    </div>
  )
}
