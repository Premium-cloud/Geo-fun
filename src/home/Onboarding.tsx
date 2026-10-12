import { useState } from 'react'
import { setOnboardingDone } from '../lib/progression'
import './Onboarding.css'

const STEPS = [
  {
    title: 'Bienvenue sur GeoFun',
    body: 'Apprends, joue, défie. Ton profil reste sur cet appareil — pas besoin de compte.',
  },
  {
    title: 'Lexique ≠ Album',
    body: 'Lexique = tout voir. Pack = tirage au hasard sur toutes les cartes. Album = ce que tu possèdes (doublons = +5 crédits).',
  },
  {
    title: 'Trophées',
    body: 'Sans-fautes et duels débloquent bronze, argent et or. Personnalise ton pseudo quand tu veux.',
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
          {step + 1} / {STEPS.length}
        </p>
        <h2 id="ob-title">{cur.title}</h2>
        <p className="ob-body">{cur.body}</p>
        <div className="ob-actions">
          {!last ? (
            <button type="button" className="ob-btn" onClick={() => setStep((s) => s + 1)}>
              Continuer
            </button>
          ) : (
            <button type="button" className="ob-btn" onClick={finish}>
              C’est parti
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
