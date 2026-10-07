import { useEffect, useState } from 'react'
import { DEPT_CARDS } from '../cards/CartesFranceView'
import './MapQuiz.css'

type MapData = { viewBox: string; paths: Record<string, string> }

const OVERSEAS = DEPT_CARDS.filter((d) => d.group !== 'metro')

type Props = {
  answerCode: string
  locked: boolean
  picked: string | null
  onPick: (code: string) => void
}

export function FranceMapQuiz({ answerCode, locked, picked, onPick }: Props) {
  const [data, setData] = useState<MapData | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/maps/france-depts.json')
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

  function chipClass(code: string) {
    let cls = 'dom-chip'
    if (!revealed) return cls
    if (code === answerCode) cls += ' is-reveal is-correct'
    else if (code === picked) cls += ' is-wrong'
    return cls
  }

  return (
    <div className="map-quiz">
      <div className="map-quiz-frame">
        <svg
          className="map-svg"
          viewBox={data.viewBox}
          role="img"
          aria-label="Carte des départements"
        >
          {Object.entries(data.paths).map(([code, d]) => (
            <path
              key={code}
              d={d}
              className={regionClass(code)}
              onClick={() => {
                if (!locked) onPick(code)
              }}
            >
              <title>{code}</title>
            </path>
          ))}
        </svg>
      </div>

      <div className="dom-strip" role="group" aria-label="DOM-TOM">
        {OVERSEAS.map((d) => (
          <button
            key={d.code}
            type="button"
            className={chipClass(d.code)}
            disabled={locked}
            onClick={() => onPick(d.code)}
          >
            <span className="dom-chip-code">{d.code}</span>
            <span className="dom-chip-name">{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
