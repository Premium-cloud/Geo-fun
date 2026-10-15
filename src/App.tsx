import { useEffect, useState } from 'react'
import { CardMockupsPreview } from './cards/CardMockupsPreview'
import { CartesMondeView } from './cards/CartesMondeView'
import { CartesTerritoiresView } from './cards/CartesTerritoiresView'
import { DuelView } from './duel/DuelView'
import { clearDuelInviteParam } from './duel/peerSync'
import { GameView, type PlayVariant } from './game/GameView'
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

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M6 4.75A1.75 1.75 0 0 1 7.75 3h9.5c.69 0 1.25.56 1.25 1.25V20a.75.75 0 0 1-1.1.66L12 17.4l-5.4 3.26A.75.75 0 0 1 5.5 20V5.75C5.5 5.2 5.7 4.75 6 4.75Zm1.5.5v12.7l4.15-2.5a.75.75 0 0 1 .7 0l4.15 2.5V5.25h-9z"
      />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M7 3h10v2h2.5a1 1 0 0 1 1 1v1a4.5 4.5 0 0 1-4.1 4.48A5.01 5.01 0 0 1 13 14.9V17h3v2H8v-2h3v-2.1a5.01 5.01 0 0 1-3.4-3.42A4.5 4.5 0 0 1 3.5 7V6a1 1 0 0 1 1-1H7V3Zm0 4H5.5a2.5 2.5 0 0 0 2.45 2.5A3.01 3.01 0 0 1 7 7Zm9.5 0H17a3.01 3.01 0 0 1-.95 2.5A2.5 2.5 0 0 0 18.5 7H16.5Z"
      />
    </svg>
  )
}

const HUB_TABS: Tab[] = ['progres', 'packs', 'album', 'profil']

/** Duel en pause (sync) — réouverture prévue le 17. */
const DUEL_LOCKED = true

export default function App() {
  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window === 'undefined') return 'home'
    const duel = new URL(window.location.href).searchParams.get('duel')
    if (duel && !DUEL_LOCKED) return 'duel'
    return 'home'
  })

  useEffect(() => {
    if (DUEL_LOCKED) clearDuelInviteParam()
  }, [])
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [options, setOptions] = useState<OptionsState>(() => loadOptions())
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress())
  const [showOnboarding, setShowOnboarding] = useState(
    () => !loadProgress().onboardingDone,
  )

  const previewCartes =
    typeof window !== 'undefined' &&
    new URL(window.location.href).searchParams.get('preview') === 'cartes'
  const lexique = isLexique(tab)
  const showHistoryBtn = tab === 'entrainement' || tab === 'jeu'
  const isHome = tab === 'home'
  const hideMainTabs = isHome || lexique || HUB_TABS.includes(tab)

  useEffect(() => {
    applyNightClass(options.night)
  }, [options.night])

  function handleOptionsChange(next: OptionsState) {
    setOptions(next)
    applyNightClass(next.night)
  }

  function goHomeDest(dest: HomeDest) {
    if (dest === 'apprendre') setTab('entrainement')
    else if (dest === 'jouer') setTab('jeu')
    else if (dest === 'defier') {
      if (DUEL_LOCKED) return
      setTab('duel')
    } else if (dest === 'lexique') setTab('territoires')
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

  return (
    <div className={`app ${lexique ? 'is-lexique-app' : ''}`}>
      <header className="topbar no-print is-quiz">
        <button
          type="button"
          className="brand-quiz brand-quiz-btn"
          onClick={() => setTab('home')}
          aria-label="Accueil GeoFun"
        >
          <BrandMark className="brand-mark-lg" />
          <div className="brand-quiz-copy">
            <p className="brand-mode">GeoFun</p>
            <p className={`brand-mode-sub ${lexique ? 'is-lexique-title' : ''}`}>
              {modeLabel}
            </p>
            {lexique ? (
              <span
                className="btn-print-inline"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  const imgs = Array.from(
                    document.querySelectorAll<HTMLImageElement>('.print-deck img'),
                  )
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    ;(e.target as HTMLElement).click()
                  }
                }}
              >
                Imprimer
              </span>
            ) : null}
          </div>
        </button>

        {!hideMainTabs ? (
          <nav className="tabs" aria-label="Sections">
            <div className="tabs-group" role="presentation">
              {(
                [
                  ['home', 'Accueil'],
                  ['entrainement', 'Apprendre'],
                  ['jeu', 'Jouer'],
                  ['duel', 'Défier'],
                ] as const
              ).map(([t, label]) => {
                const locked = DUEL_LOCKED && t === 'duel'
                return (
                  <button
                    key={t}
                    type="button"
                    className={`tab ${tab === t ? 'is-active' : ''} ${locked ? 'is-locked' : ''}`}
                    onClick={() => {
                      if (locked) return
                      setTab(t)
                    }}
                    disabled={locked}
                    title={locked ? 'Duel verrouillé — retour le 17' : undefined}
                    aria-current={tab === t ? 'page' : undefined}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </nav>
        ) : (
          <div className="tabs" aria-hidden />
        )}

        <div className="topbar-right">
          {showHistoryBtn ? (
            <button
              type="button"
              className="btn-history"
              onClick={() => setHistoryOpen(true)}
            >
              Historique
            </button>
          ) : null}
          <button
            type="button"
            className="btn-options"
            onClick={() => setOptionsOpen(true)}
            aria-label="Options"
            title="Options"
          >
            ⚙
          </button>
          <button
            type="button"
            className={`btn-lexique ${tab === 'progres' ? 'is-active' : ''}`}
            onClick={() => setTab('progres')}
            aria-label="Trophées"
            title="Trophées"
          >
            <TrophyIcon />
          </button>
          <button
            type="button"
            className={`btn-lexique ${lexique ? 'is-active' : ''}`}
            onClick={() => setTab(lexique ? 'home' : 'territoires')}
            aria-label={lexique ? 'Retour accueil' : 'Lexique'}
            title={lexique ? 'Accueil' : 'Lexique'}
          >
            <BookIcon />
          </button>
        </div>
      </header>

      <main>
        {tab === 'home' ? (
          <HomeView onGo={goHomeDest} progress={progress} />
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
              <p>
                <strong>Catalogue</strong> — tout est visible, rien n’est possédé ici.
              </p>
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
          />
        ) : null}
        {tab === 'duel' ? (
          DUEL_LOCKED ? (
            <div className="duel-locked-panel">
              <h2>Duel en pause</h2>
              <p>
                Mode verrouillé le temps de corriger la synchro. Réouverture prévue
                le <strong>17</strong>.
              </p>
              <button
                type="button"
                className="duel-locked-back"
                onClick={() => setTab('home')}
              >
                ← Accueil
              </button>
            </div>
          ) : (
            <DuelView />
          )
        ) : null}
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
