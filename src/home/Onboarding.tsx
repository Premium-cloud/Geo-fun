import { setOnboardingDone } from '../lib/progression'
import './Onboarding.css'

export type OnboardingStart = 'quick' | null

export function Onboarding({
  onDone,
}: {
  onDone: (start?: OnboardingStart) => void
}) {
  function finish(start: OnboardingStart = null) {
    setOnboardingDone()
    onDone(start)
  }

  return (
    <div className="ob-overlay" role="dialog" aria-modal aria-labelledby="ob-title">
      <div className="ob-card">
        <p className="ob-brand" aria-hidden>
          GeoFun
        </p>
        <h2 id="ob-title">Deux minutes pour commencer</h2>
        <p className="ob-body">
          10 questions MIX, un score, des crédits pour les packs. Tout reste sur
          le téléphone — même hors ligne après une première ouverture.
        </p>
        <div className="ob-actions">
          <button type="button" className="ob-btn" onClick={() => finish('quick')}>
            Partie rapide · 2 min
          </button>
          <button type="button" className="ob-skip" onClick={() => finish(null)}>
            Voir l’accueil
          </button>
        </div>
      </div>
    </div>
  )
}
