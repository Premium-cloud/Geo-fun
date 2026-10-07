import { useEffect, useState } from 'react'
import { ZoomableMap } from './ZoomableMap'
import './MapQuiz.css'

type MapData = { viewBox: string; paths: Record<string, string> }

type Props = {
  answerCode: string
  locked: boolean
  picked: string | null
  onPick: (code: string) => void
}

/** Carte métropole uniquement (pas de DOM-TOM). */
export function FranceMapQuiz({ answerCode, locked, picked, onPick }: Props) {
  const [data, setData] = useState<MapData | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/maps/france-depts.json')
      .then((r) => r.json())
      .then((fr: MapData) => {
        if (alive) setData(fr)
      })
      .catch(() => {
        if (alive) setData(null)
      })
    return () => {
      alive = false
    }
  }, [])

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
    <div className="map-quiz is-france">
      <ZoomableMap resetKey={answerCode}>
        <div className="map-quiz-frame">
          <svg
            className="map-svg"
            viewBox={data.viewBox}
            role="img"
            aria-label="Carte des départements (métropole)"
          >
            {Object.entries(data.paths).map(([code, d]) => (
              <path
                key={code}
                d={d}
                className={regionClass(code)}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!locked) onPick(code)
                }}
              />
            ))}
          </svg>
        </div>
      </ZoomableMap>
    </div>
  )
}
