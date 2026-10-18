import {
  albumUnlocked,
  loadProgress,
  profileInitial,
  profileLabel,
  profileTitleLabel,
  trophyLevel,
  uniqueFoilCount,
  uniqueOwnedCount,
  type ProgressState,
} from '../lib/progression'
import { weaknessCount } from '../lib/weaknesses'
import './HomeView.css'

export type HomeDest =
  | 'faiblesses'
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
  const foils = uniqueFoilCount(progress)
  const albumOk = albumUnlocked(progress)
  const title = profileTitleLabel(progress)
  const weakN = weaknessCount()
  const frameClass =
    progress.profileFrame === 'foil'
      ? 'is-frame-foil'
      : progress.profileFrame === 'album'
        ? 'is-frame-album'
        : ''

  return (
    <div className="home-view">
      <header className="home-hero">
        <p className="home-brand" aria-label="GeoFun">
          <span className="home-brand-mark" aria-hidden />
          GeoFun
        </p>
        <h1 className="home-title">Le monde en cartes</h1>
        <button
          type="button"
          className="home-profile-chip"
          onClick={() => onGo('profil')}
        >
          <span
            className={`home-avatar ${frameClass}`.trim()}
            style={{ background: progress.color }}
            aria-hidden
          >
            {initial}
          </span>
          <span>
            <strong>{label}</strong>
            {title ? <span className="home-profile-title">{title}</span> : null}
            <em>
              Niv. {level} · {progress.points} cr. · {owned} cartes
              {foils > 0 ? ` · ${foils} foil` : ''}
            </em>
          </span>
        </button>
      </header>

      <div className="home-actions" role="navigation" aria-label="Modes">
        <button type="button" className="home-cta is-learn" onClick={() => onGo('apprendre')}>
          <span className="home-cta-label">Apprendre</span>
        </button>
        <button type="button" className="home-cta is-play" onClick={() => onGo('jouer')}>
          <span className="home-cta-label">Jouer</span>
        </button>
        <button type="button" className="home-cta is-duel" onClick={() => onGo('defier')}>
          <span className="home-cta-label">Défier</span>
        </button>
        {weakN >= 3 ? (
          <button
            type="button"
            className="home-cta is-weak"
            onClick={() => onGo('faiblesses')}
          >
            <span className="home-cta-label">Mes erreurs</span>
            <span className="home-cta-sub">{Math.min(weakN, 12)}</span>
          </button>
        ) : null}
      </div>

      <button type="button" className="home-packs-promo is-lexique" onClick={() => onGo('lexique')}>
        <span className="home-packs-promo-copy">
          <strong>Lexique</strong>
        </span>
        <span className="home-packs-promo-go" aria-hidden>
          →
        </span>
      </button>

      <button type="button" className="home-packs-promo" onClick={() => onGo('packs')}>
        <span className="home-packs-promo-copy">
          <strong>Packs</strong>
          <em>
            {progress.points} cr.
            {owned > 0 ? ` · ${owned} cartes` : ''}
            {foils > 0 ? ` · ${foils} foil` : ''}
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
          Album
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
