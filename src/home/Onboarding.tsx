import { setOnboardingDone } from '../lib/progression'
import './Onboarding.css'

export function Onboarding({ onDone }: { onDone: () => void }) {
  function finish() {
    setOnboardingDone()
    onDone()
  }

  return (
    <div className="ob-overlay" role="dialog" aria-modal aria-labelledby="ob-title">
      <div className="ob-card">
        <h2 id="ob-title" className="ob-brand">
          GeoFun
        </h2>
        <div className="ob-actions">
          <button type="button" className="ob-btn" onClick={finish}>
            Commencer
          </button>
        </div>
      </div>
    </div>
  )
}
