import {
  albumUnlocked,
  loadProgress,
  profileInitial,
  profileLabel,
  trophyLevel,
  uniqueOwnedCount,
  type ProgressState,
} from '../lib/progression'
import './HomeView.css'

export type HomeDest =
  | 'apprendre'
  | 'jouer'
  | 'defier'
  | 'lexique'
  | 'packs'
  | 'album'
  | 'trophees'
  | 'profil'

export function HomeView({
  onGo,
  progress,
}: {
  onGo: (dest: HomeDest) => void
  progress: ProgressState
}) {
  const level = trophyLevel(progress)
  const label = profileLabel(progress)
  const initial = profileInitial(progress.pseudo)
  const owned = uniqueOwnedCount(progress)
  const albumOk = albumUnlocked(progress)

  return (
    <div className="home-view">
      <header className="home-hero">
        <p className="home-kicker">GeoFun</p>
        <h1 className="home-title">Cartes & défis</h1>
        <p className="home-lead">
          Apprends les pays et territoires, joue chronométré, défie un ami.
        </p>
        <button
          type="button"
          className="home-profile-chip"
          onClick={() => onGo('profil')}
        >
          <span
            className="home-avatar"
            style={{ background: progress.color }}
            aria-hidden
          >
            {initial}
          </span>
          <span>
            <strong>{label}</strong>
            <em>
              Niv. {level} · {progress.points} crédits · album {owned}
            </em>
          </span>
        </button>
      </header>

      <div className="home-actions" role="navigation" aria-label="Modes">
        <button type="button" className="home-cta is-learn" onClick={() => onGo('apprendre')}>
          <span className="home-cta-label">Apprendre</span>
          <span className="home-cta-sub">Entraînement sans pression</span>
        </button>
        <button type="button" className="home-cta is-play" onClick={() => onGo('jouer')}>
          <span className="home-cta-label">Jouer</span>
          <span className="home-cta-sub">Vies, timer, score</span>
        </button>
        <button type="button" className="home-cta is-duel" onClick={() => onGo('defier')}>
          <span className="home-cta-label">Défier</span>
          <span className="home-cta-sub">Duel même écran ou en ligne</span>
        </button>
      </div>

      <button type="button" className="home-packs-promo" onClick={() => onGo('packs')}>
        <span className="home-packs-promo-copy">
          <strong>Ouvrir un pack</strong>
          <em>
            {progress.points} crédits · album {owned}
            {albumOk ? '' : ' · verrouillé'}
          </em>
        </span>
        <span className="home-packs-promo-go" aria-hidden>
          →
        </span>
      </button>

      <div className="home-secondary">
        <button
          type="button"
          className={`home-link ${albumOk ? '' : 'is-muted'}`}
          onClick={() => onGo('album')}
        >
          Album{albumOk ? '' : ' (verrouillé)'}
        </button>
        <button type="button" className="home-link" onClick={() => onGo('lexique')}>
          Lexique
        </button>
        <button type="button" className="home-link" onClick={() => onGo('trophees')}>
          Trophées
        </button>
      </div>
    </div>
  )
}

export function readHomeProgress() {
  return loadProgress()
}
