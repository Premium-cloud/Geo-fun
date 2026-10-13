import { useState } from 'react'
import { setOnboardingDone } from '../lib/progression'
import './Onboarding.css'

const STEPS = [
  {
    title: 'GeoFun',
    body: 'Apprends, joue, défie. Profil local — pas de compte.',
  },
  {
    title: 'Packs & album',
    body: 'Ouvre des packs pour collectionner. Lexique = tout voir.',
  },
] as const

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const last = step >= STEPS.length - 1
  const cur = STEPS[step]!

  function finish() {
    setOnboardingDone()
    onDone()
  }

  return (
    <div className="ob-overlay" role="dialog" aria-modal aria-labelledby="ob-title">
      <div className="ob-card">
        <p className="ob-step">
          {step + 1}/{STEPS.length}
        </p>
        <h2 id="ob-title">{cur.title}</h2>
        <p className="ob-body">{cur.body}</p>
        <div className="ob-actions">
          {!last ? (
            <button type="button" className="ob-btn" onClick={() => setStep((s) => s + 1)}>
              Suite
            </button>
          ) : (
            <button type="button" className="ob-btn" onClick={finish}>
              Go
            </button>
          )}
          <button type="button" className="ob-skip" onClick={finish}>
            Passer
          </button>
        </div>
      </div>
    </div>
  )
}
