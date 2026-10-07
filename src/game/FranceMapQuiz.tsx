import { useEffect, useState } from 'react'
import { DEPT_CARDS } from '../cards/CartesFranceView'
import { ZoomableMap } from './ZoomableMap'
import './MapQuiz.css'

type MapData = { viewBox: string; paths: Record<string, string> }
type DomShape = { viewBox: string; d: string }

const OVERSEAS = DEPT_CARDS.filter((d) => d.group !== 'metro')

type Props = {
  answerCode: string
  locked: boolean
  picked: string | null
  showDomTom: boolean
  onPick: (code: string) => void
}

export function FranceMapQuiz({
  answerCode,
  locked,
  picked,
  showDomTom,
  onPick,
}: Props) {
  const [data, setData] = useState<MapData | null>(null)
  const [domShapes, setDomShapes] = useState<Record<string, DomShape>>({})

  useEffect(() => {
    let alive = true
    const loads: Promise<unknown>[] = [
      fetch('/maps/france-depts.json').then((r) => r.json()),
    ]
    if (showDomTom) {
      loads.push(fetch('/maps/dom-tom-shapes.json').then((r) => r.json()))
    }
    Promise.all(loads)
      .then(([fr, dom]) => {
        if (!alive) return
        setData(fr as MapData)
        if (dom) setDomShapes(dom as Record<string, DomShape>)
      })
      .catch(() => {
        if (alive) setData(null)
      })
    return () => {
      alive = false
    }
  }, [showDomTom])

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

  function chipClass(code: string) {
    let cls = 'dom-shape'
    if (!revealed) return cls
    if (code === answerCode) cls += ' is-reveal is-correct'
    else if (code === picked) cls += ' is-wrong'
    return cls
  }

  return (
    <div className={`map-quiz is-france ${showDomTom ? 'has-dom' : ''}`}>
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

      {showDomTom ? (
        <div className="dom-strip" role="group" aria-label="DOM-TOM (silhouettes)">
          {OVERSEAS.map((d) => {
            const shape = domShapes[d.code]
            return (
              <button
                key={d.code}
                type="button"
                className={chipClass(d.code)}
                disabled={locked}
                aria-label="Territoire d'outre-mer"
                onClick={() => onPick(d.code)}
              >
                {shape ? (
                  <svg viewBox={shape.viewBox} className="dom-shape-svg" aria-hidden>
                    <path d={shape.d} />
                  </svg>
                ) : (
                  <span className="dom-shape-fallback">?</span>
                )}
                {revealed && (d.code === answerCode || d.code === picked) ? (
                  <span className="dom-shape-label">
                    {d.code} {d.name}
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
