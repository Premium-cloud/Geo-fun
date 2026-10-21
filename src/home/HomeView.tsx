import { useState } from 'react'
import { loadProgress, type ProgressState } from '../lib/progression'
import { weaknessCount } from '../lib/weaknesses'
import { InstallHint } from './InstallHint'
import './HomeView.css'

const POSTER_MODES = ['Jouer', 'Apprendre', 'Défier'] as const
type PosterMode = (typeof POSTER_MODES)[number]

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
  onSettings,
  onHistory,
}: {
  onGo: (dest: HomeDest) => void
  onSettings: () => void
  onHistory: () => void
  progress: ProgressState
}) {
  const weakN = weaknessCount()
  const [poster, setPoster] = useState<PosterMode>('Jouer')

  function enter(next: PosterMode) {
    if (next === 'Apprendre') onGo('apprendre')
    else if (next === 'Défier') onGo('defier')
    else onGo('jouer')
  }

  return (
    <div className="home-poster">
      <header className="home-poster-top">
        <button type="button" onClick={() => onGo('profil')}>
          Ton profil
        </button>
        <button type="button" onClick={onSettings}>
          Réglages
        </button>
      </header>

      <div className="home-poster-stack">
        <button
          type="button"
          className={`home-poster-hero ${poster.length > 8 ? 'is-long' : poster.length > 5 ? 'is-mid' : ''}`}
          onClick={() => enter(poster)}
        >
          {poster}
        </button>
        <div className="home-poster-carousel" aria-label="Autres modes">
          {POSTER_MODES.filter((item) => item !== poster).map((item) => (
            <button key={item} type="button" onClick={() => setPoster(item)}>
              {item}
            </button>
          ))}
          {weakN >= 3 ? (
            <button type="button" onClick={() => onGo('faiblesses')}>
              Mes erreurs
            </button>
          ) : null}
        </div>
      </div>

      <footer className="home-poster-foot">
        <button type="button" onClick={() => onGo('lexique')}>
          Lexique
        </button>
        <button type="button" onClick={onHistory}>
          Historique
        </button>
        <InstallHint variant="line" />
      </footer>
    </div>
  )
}

export function readHomeProgress() {
  return loadProgress()
}
