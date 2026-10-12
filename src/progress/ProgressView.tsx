import { useMemo, useState } from 'react'
import {
  TROPHIES,
  loadProgress,
  trophyLevel,
  type ProgressState,
  type TrophyTier,
} from '../lib/progression'
import './ProgressView.css'

const TIER_LABEL: Record<TrophyTier, string> = {
  bronze: 'Bronze',
  argent: 'Argent',
  or: 'Or',
}

export function ProgressView({
  onBack,
  onProgressChange,
}: {
  onBack: () => void
  onProgressChange?: (p: ProgressState) => void
}) {
  const [state] = useState(() => loadProgress())
  const unlocked = useMemo(() => new Set(Object.keys(state.trophies)), [state.trophies])
  const level = trophyLevel(state)
  void onProgressChange

  return (
    <div className="prog-view">
      <div className="prog-top">
        <button type="button" className="prog-back" onClick={onBack}>
          ← Accueil
        </button>
        <h1>Trophées</h1>
        <p className="prog-lead">
          Niveau {level} · {Object.keys(state.trophies).length} / {TROPHIES.length} obtenus
        </p>
        <p className="prog-hint">
          Packs et album sont à part : les trophées suivent tes sans-fautes, duels et
          collection.
        </p>
      </div>

      <section className="prog-section">
        <ul className="prog-trophies">
          {TROPHIES.map((t) => {
            const got = unlocked.has(t.id)
            return (
              <li
                key={t.id}
                className={`prog-trophy is-${t.tier} ${got ? 'is-on' : 'is-off'} ${t.stub ? 'is-stub' : ''}`}
              >
                <span className="prog-trophy-tier">{TIER_LABEL[t.tier]}</span>
                <strong>{t.title}</strong>
                <span>{t.blurb}</span>
                {got ? <em>Obtenu</em> : t.stub ? <em>Bientôt</em> : <em>À débloquer</em>}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
