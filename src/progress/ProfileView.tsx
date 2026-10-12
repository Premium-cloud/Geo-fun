import { useState } from 'react'
import {
  PROFILE_COLORS,
  loadProgress,
  profileInitial,
  setProfile,
  type ProgressState,
} from '../lib/progression'
import './ProfileView.css'

export function ProfileView({
  onBack,
  onProgressChange,
}: {
  onBack: () => void
  onProgressChange?: (p: ProgressState) => void
}) {
  const initial = loadProgress()
  const [pseudo, setPseudo] = useState(initial.pseudo)
  const [color, setColor] = useState(initial.color)
  const [saved, setSaved] = useState(false)

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
      <h1>Mon profil</h1>
      <p className="profile-lead">
        Stocké sur cet appareil — pas de compte. Utile pour le duel (ton pseudo).
      </p>

      <div className="profile-preview">
        <span className="home-avatar" style={{ background: color }} aria-hidden>
          {profileInitial(pseudo)}
        </span>
        <div>
          <strong>{pseudo.trim() || 'Ton pseudo'}</strong>
          <em>Profil local</em>
        </div>
      </div>

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
    </div>
  )
}
