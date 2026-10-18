import { useState } from 'react'
import {
  PROFILE_COLORS,
  PROFILE_TITLES,
  loadProgress,
  profileInitial,
  profileTitleLabel,
  trophyLevel,
  uniqueFoilCount,
  uniqueOwnedCount,
  getCardCatalog,
  setProfile,
  type ProgressState,
} from '../lib/progression'
import './ProfileView.css'

export function ProfileView({
  onBack,
  onOpenPacks,
  onOpenAlbum,
  onOpenLexique,
  onProgressChange,
}: {
  onBack: () => void
  onOpenPacks?: () => void
  onOpenAlbum?: () => void
  onOpenLexique?: () => void
  onProgressChange?: (p: ProgressState) => void
}) {
  const initial = loadProgress()
  const [pseudo, setPseudo] = useState(initial.pseudo)
  const [color, setColor] = useState(initial.color)
  const [saved, setSaved] = useState(false)
  const stats = loadProgress()
  const owned = uniqueOwnedCount(stats)
  const foils = uniqueFoilCount(stats)
  const level = trophyLevel(stats)
  const total = getCardCatalog().length
  const title = profileTitleLabel(stats)
  const frameClass =
    stats.profileFrame === 'foil'
      ? 'is-frame-foil'
      : stats.profileFrame === 'album'
        ? 'is-frame-album'
        : ''

  function save() {
    const next = setProfile({ pseudo, color })
    onProgressChange?.(next)
    setSaved(true)
  }

  return (
    <div className="profile-view">
      <button type="button" className="prog-back" onClick={onBack}>
        ← Accueil
      </button>

      <header className="profile-hero">
        <span
          className={`home-avatar profile-hero-avatar ${frameClass}`.trim()}
          style={{ background: color }}
          aria-hidden
        >
          {profileInitial(pseudo)}
        </span>
        <div>
          <h1>{pseudo.trim() || 'Ton profil'}</h1>
          {title ? <p className="profile-title-badge">{title}</p> : null}
        </div>
      </header>

      <ul className="profile-stats" aria-label="Stats">
        <li>
          <strong>{stats.points}</strong>
          <span>Crédits</span>
        </li>
        <li>
          <strong>{stats.packsOpened}</strong>
          <span>Packs</span>
        </li>
        <li>
          <strong>
            {owned}/{total}
          </strong>
          <span>Album</span>
        </li>
        <li>
          <strong>{foils}</strong>
          <span>Foil</span>
        </li>
      </ul>

      <section className="profile-rewards">
        <h2>Récompenses collection</h2>
        <ul>
          {PROFILE_TITLES.map((t) => {
            const got =
              (t.id === 'album_complete' && stats.profileFrame !== 'none') ||
              (t.id === 'foil_album_complete' && stats.profileFrame === 'foil') ||
              stats.profileTitleId === t.id ||
              Boolean(stats.trophies[t.id === 'album_complete' ? 'collec_all' : 'foil_album'])
            return (
              <li key={t.id} className={got ? 'is-on' : 'is-off'}>
                <strong>{t.label}</strong>
                <span>{t.blurb}</span>
                <em>{got ? 'Débloqué' : 'À débloquer'}</em>
              </li>
            )
          })}
        </ul>
        <p className="profile-rewards-note">
          Contour profil :{' '}
          {stats.profileFrame === 'foil'
            ? 'foil (stylé)'
            : stats.profileFrame === 'album'
              ? 'album'
              : 'aucun'}
          {level > 0 ? ` · ${level} trophées` : ''}
        </p>
      </section>

      <section className="profile-edit">
        <h2>Personnaliser</h2>
        <label className="profile-field">
          <span>Pseudo</span>
          <input
            value={pseudo}
            maxLength={20}
            placeholder="Ex. Alex"
            autoComplete="nickname"
            onChange={(e) => {
              setPseudo(e.target.value)
              setSaved(false)
            }}
          />
        </label>

        <div className="profile-field">
          <span>Couleur</span>
          <div className="profile-colors" role="group" aria-label="Couleur">
            {PROFILE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className={`profile-color ${color === c ? 'is-active' : ''}`}
                style={{ background: c }}
                aria-label={c}
                onClick={() => {
                  setColor(c)
                  setSaved(false)
                }}
              />
            ))}
          </div>
        </div>

        <button type="button" className="profile-save" onClick={save}>
          Enregistrer
        </button>
        {saved ? <p className="profile-ok">Profil enregistré.</p> : null}
      </section>

      <nav className="profile-shortcuts" aria-label="Raccourcis">
        {onOpenPacks ? (
          <button type="button" className="profile-shortcut is-packs" onClick={onOpenPacks}>
            Ouvrir un pack
          </button>
        ) : null}
        {onOpenAlbum ? (
          <button type="button" className="profile-shortcut" onClick={onOpenAlbum}>
            Mon album
          </button>
        ) : null}
        {onOpenLexique ? (
          <button type="button" className="profile-shortcut" onClick={onOpenLexique}>
            Lexique
          </button>
        ) : null}
      </nav>
    </div>
  )
}
