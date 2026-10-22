import { useEffect, useState } from 'react'
import { CardMockupsPreview } from './cards/CardMockupsPreview'
import { DesignStudy } from './design/DesignStudy'
import { CartesMondeView } from './cards/CartesMondeView'
import { CartesTerritoiresView } from './cards/CartesTerritoiresView'
import { DuelView } from './duel/DuelView'
import { GameView, type GameLaunch, type PlayVariant } from './game/GameView'
import { HistoryPanel } from './game/HistoryPanel'
import { HomeView, type HomeDest } from './home/HomeView'
import { Onboarding } from './home/Onboarding'
import { loadProgress, type ProgressState } from './lib/progression'
import {
  applyNightClass,
  loadOptions,
  type OptionsState,
} from './lib/storage'
import { OptionsModal } from './options/OptionsModal'
import { AlbumView } from './progress/AlbumView'
import { PacksView } from './progress/PacksView'
import { ProfileView } from './progress/ProfileView'
import { ProgressView } from './progress/ProgressView'
import './App.css'
import './home/HomeView.css'

type Tab =
  | 'home'
  | 'territoires'
  | 'monde'
  | 'entrainement'
  | 'jeu'
  | 'duel'
  | 'progres'
  | 'packs'
  | 'album'
  | 'profil'

function isLexique(tab: Tab): boolean {
  return tab === 'territoires' || tab === 'monde'
}

function BrandMark({ className }: { className?: string }) {
  return (
    <span className={`brand-mark ${className ?? ''}`.trim()} aria-hidden>
      <svg className="brand-m" viewBox="0 0 32 32" focusable="false">
        <path
          d="M5.2 25.2V7.4c0-.7.8-1.1 1.35-.7l7.55 5.55c.35.26.85.26 1.2 0L23.45 6.7c.55-.4 1.35 0 1.35.7v17.8c0 .55-.45 1-1 1h-2.15c-.55 0-1-.45-1-1V14.6c0-.55-.65-.85-1.1-.5l-3.85 2.95c-.5.38-1.2.38-1.7 0l-3.85-2.95c-.45-.35-1.1-.05-1.1.5v9.6c0 .55-.45 1-1 1H6.2c-.55 0-1-.45-1-1z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window !== 'undefined') {
      const duel = new URL(window.location.href).searchParams.get('duel')
      if (duel) return 'duel'
    }
    return 'home'
  })
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [options, setOptions] = useState<OptionsState>(() => loadOptions())
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [showOnboarding, setShowOnboarding] = useState(
    () => !loadProgress().onboardingDone,
  )
  const [gameLaunch, setGameLaunch] = useState<GameLaunch>(null)
  /** Recliquer le mode en cours → retour aux filtres, sans couper une question. */
  const [modeBump, setModeBump] = useState(0)

  useEffect(() => {
    if (tab !== 'jeu') setGameLaunch(null)
  }, [tab])

  const preview =
    typeof window !== 'undefined'
      ? new URL(window.location.href).searchParams.get('preview')
      : null
  const previewCartes = preview === 'cartes'
  const previewDesign = preview === 'design'
  const lexique = isLexique(tab)
  const showHistoryBtn = true
  const isHome = tab === 'home'

  useEffect(() => {
    applyNightClass(options.night)
  }, [options.night])

  function handleOptionsChange(next: OptionsState) {
    setOptions(next)
    applyNightClass(next.night)
  }

  function goHomeDest(dest: HomeDest) {
    if (dest === 'apprendre') {
      setGameLaunch(null)
      setTab('entrainement')
    } else if (dest === 'jouer') {
      setGameLaunch(null)
      setTab('jeu')
    } else if (dest === 'defier') setTab('duel')
    else if (dest === 'lexique') setTab('territoires')
    else if (dest === 'packs') setTab('packs')
    else if (dest === 'album') setTab('album')
    else if (dest === 'trophees') setTab('progres')
    else setTab('profil')
  }

  const modeLabel = isHome
    ? 'Accueil'
    : lexique
      ? 'LEXIQUE'
      : tab === 'jeu'
        ? 'Jouer'
        : tab === 'duel'
          ? 'Défier'
          : tab === 'progres'
            ? 'Trophées'
            : tab === 'packs'
              ? 'Packs'
              : tab === 'album'
                ? 'Album'
                : tab === 'profil'
                  ? 'Profil'
                  : 'Apprendre'

  if (previewDesign) {
    return <DesignStudy />
  }

  if (previewCartes) {
    return (
      <div className="app">
        <header className="topbar no-print is-quiz">
          <div className="brand-quiz">
            <BrandMark className="brand-mark-lg" />
            <div className="brand-quiz-copy">
              <p className="brand-mode">Aperçu</p>
              <p className="brand-mode-sub">Maquettes cartes</p>
            </div>
          </div>
          <div className="topbar-right">
            <a className="btn-history" href="/">
              Retour app
            </a>
          </div>
        </header>
        <main>
          <CardMockupsPreview />
        </main>
      </div>
    )
  }

  const playTab = tab === 'jeu' || tab === 'entrainement' || tab === 'duel'
  const playModes = [
    ['jeu', 'Jouer'],
    ['entrainement', 'Apprendre'],
    ['duel', 'Défier'],
  ] as const

  return (
    <div className={`app ${lexique ? 'is-lexique-app' : ''} ${isHome ? 'is-poster' : ''}`}>
      {isHome ? null : (
      <header className="topbar no-print is-affiche">
        {playTab ? (
          <div className="affiche-modes" role="tablist" aria-label="Mode">
            {playModes.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                className={tab === id ? 'is-on' : 'is-off'}
                aria-selected={tab === id}
                onClick={() => {
                  if (id === 'jeu') setGameLaunch(null)
                  if (id === tab && (id === 'jeu' || id === 'entrainement')) {
                    setModeBump((n) => n + 1)
                  } else setTab(id)
                }}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <p className="affiche-screen">{modeLabel}</p>
        )}

        <div className="affiche-tools">
          {lexique ? (
            <button
              type="button"
              onClick={() => {
                const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('.print-deck img'))
                void Promise.all(
                  imgs.map(
                    (img) =>
                      img.complete ||
                      new Promise<void>((resolve) => {
                        img.addEventListener('load', () => resolve(), { once: true })
                        img.addEventListener('error', () => resolve(), { once: true })
                      }),
                  ),
                ).then(() => window.print())
              }}
            >
              Imprimer
            </button>
          ) : null}
          {showHistoryBtn ? (
            <button type="button" onClick={() => setHistoryOpen(true)}>
              Historique
            </button>
          ) : null}
          <button type="button" onClick={() => setOptionsOpen(true)}>
            Réglages
          </button>
          <button type="button" onClick={() => setTab('home')}>
            Accueil
          </button>
        </div>
      </header>
      )}

      <main>
        {tab === 'home' ? (
          <HomeView
            onGo={goHomeDest}
            onSettings={() => setOptionsOpen(true)}
            onHistory={() => setHistoryOpen(true)}
            progress={progress}
          />
        ) : null}

        {tab === 'profil' ? (
          <ProfileView
            onBack={() => setTab('home')}
            onOpenPacks={() => setTab('packs')}
            onOpenAlbum={() => setTab('album')}
            onOpenLexique={() => setTab('territoires')}
            onProgressChange={setProgress}
          />
        ) : null}

        {tab === 'packs' ? (
          <PacksView
            onBack={() => setTab('home')}
            onOpenAlbum={() => setTab('album')}
            onProgressChange={setProgress}
          />
        ) : null}

        {tab === 'album' ? (
          <AlbumView
            onBack={() => setTab('home')}
            onOpenPacks={() => setTab('packs')}
            onProgressChange={setProgress}
          />
        ) : null}

        {tab === 'progres' ? (
          <ProgressView onBack={() => setTab('home')} onProgressChange={setProgress} />
        ) : null}

        {lexique ? (
          <div className="lexique-shell">
            <div className="lexique-switch no-print" role="tablist" aria-label="Lexique">
              <button
                type="button"
                role="tab"
                className={`lexique-switch-tab ${tab === 'territoires' ? 'is-active' : ''}`}
                aria-selected={tab === 'territoires'}
                onClick={() => setTab('territoires')}
              >
                <strong>Territoires</strong>
                <span>FR · CH · ES · US…</span>
              </button>
              <button
                type="button"
                role="tab"
                className={`lexique-switch-tab ${tab === 'monde' ? 'is-active' : ''}`}
                aria-selected={tab === 'monde'}
                onClick={() => setTab('monde')}
              >
                <strong>Monde</strong>
                <span>Drapeaux</span>
              </button>
            </div>
            <div className="lexique-banner no-print">
              <div className="lexique-banner-actions">
                <button type="button" className="lexique-banner-btn is-pack" onClick={() => setTab('packs')}>
                  Packs
                </button>
                <button type="button" className="lexique-banner-btn" onClick={() => setTab('album')}>
                  Album
                </button>
              </div>
            </div>
            {tab === 'territoires' ? <CartesTerritoiresView /> : <CartesMondeView />}
          </div>
        ) : null}

        {tab === 'entrainement' || tab === 'jeu' ? (
          <GameView
            variant={tab as PlayVariant}
            mapDomTom={options.mapDomTom}
            onOpenHistory={() => setHistoryOpen(true)}
            onProgressChange={setProgress}
            launch={tab === 'jeu' ? gameLaunch : null}
            lobbyBump={modeBump}
            onOpenPacks={() => setTab('packs')}
            onLeave={() => setTab('home')}
          />
        ) : null}
        {tab === 'duel' ? <DuelView onLeave={() => setTab('home')} /> : null}
      </main>

      <OptionsModal
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        onOptionsChange={handleOptionsChange}
      />
      {historyOpen ? <HistoryPanel onClose={() => setHistoryOpen(false)} /> : null}
      {showOnboarding ? (
        <Onboarding
          onDone={() => {
            setShowOnboarding(false)
            setProgress(loadProgress())
          }}
        />
      ) : null}
    </div>
  )
}
