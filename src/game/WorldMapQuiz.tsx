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

export function WorldMapQuiz({ answerCode, locked, picked, onPick }: Props) {
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
      <ZoomableMap maxScale={6} resetKey={answerCode}>
        <div className="map-quiz-frame">
          <svg
            className="map-svg map-svg-world"
            viewBox={data.viewBox}
            role="img"
            aria-label="Carte du monde"
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
