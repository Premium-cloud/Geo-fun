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
  const foils = uniqueFoilCount(progress)
  const albumOk = albumUnlocked(progress)
  const title = profileTitleLabel(progress)
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
        <p className="home-lead">
          Entraîne-toi, chronomètre-toi, défie un ami. Tes packs restent sur le
          téléphone.
        </p>
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
          <span className="home-cta-sub">Sans chrono, à ton rythme</span>
        </button>
        <button type="button" className="home-cta is-play" onClick={() => onGo('jouer')}>
          <span className="home-cta-label">Jouer</span>
          <span className="home-cta-sub">Vies, timer, score</span>
        </button>
        <button type="button" className="home-cta is-duel is-locked" disabled aria-disabled>
          <span className="home-cta-label">Défier</span>
          <span className="home-cta-sub">Verrouillé — retour le 17</span>
        </button>
      </div>

      <button type="button" className="home-packs-promo is-lexique" onClick={() => onGo('lexique')}>
        <span className="home-packs-promo-copy">
          <strong>Lexique</strong>
          <em>Pays & territoires — recherche rapide, même hors ligne</em>
        </span>
        <span className="home-packs-promo-go" aria-hidden>
          →
        </span>
      </button>

      <button type="button" className="home-packs-promo" onClick={() => onGo('packs')}>
        <span className="home-packs-promo-copy">
          <strong>Ouvrir un pack</strong>
          <em>
            {progress.points} crédits · {owned} cartes
            {foils > 0 ? ` · ${foils} foil` : ''}
            {albumOk ? '' : ' · album verrouillé'}
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
