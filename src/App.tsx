import { useEffect, useState } from 'react'
import { CartesFranceView } from './cards/CartesFranceView'
import { CartesMondeView } from './cards/CartesMondeView'
import { GameView, type PlayVariant } from './game/GameView'
import {
  applyNightClass,
  loadOptions,
  saveOptions,
  type OptionsState,
} from './lib/storage'
import { OptionsModal } from './options/OptionsModal'
import './App.css'

type Tab = 'france' | 'monde' | 'entrainement' | 'jeu'

const TAB_LABEL: Record<Tab, string> = {
  france: 'Départements',
  monde: 'Pays',
  entrainement: 'Entraînement',
  jeu: 'Jeu',
}

function isLexique(tab: Tab): boolean {
  return tab === 'france' || tab === 'monde'
}

function CardPicto({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="7"
        y="3"
        width="18"
        height="26"
        rx="2.2"
        fill="currentColor"
        opacity="0.22"
        transform="rotate(-8 16 16)"
      />
      <rect x="8" y="4" width="16" height="24" rx="2" fill="currentColor" />
      <circle cx="12.2" cy="9.2" r="1.35" fill="#fff" />
      <path
        d="M16 12.2c1.7 1.7 2.9 3.3 2.9 5.1 0 1.55-1.2 2.7-2.9 2.7s-2.9-1.15-2.9-2.7c0-1.8 1.2-3.4 2.9-5.1z"
        fill="#fff"
      />
      <circle cx="19.8" cy="22.6" r="1.35" fill="#fff" />
    </svg>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>('france')
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [options, setOptions] = useState<OptionsState>(() => loadOptions())
  const lexique = isLexique(tab)

  useEffect(() => {
    applyNightClass(options.night)
  }, [options.night])

  function handleOptionsChange(next: OptionsState) {
    setOptions(next)
    applyNightClass(next.night)
  }

  function setMapDomTom(mapDomTom: boolean) {
    const next = { ...loadOptions(), mapDomTom }
    saveOptions(next)
    setOptions(next)
  }

  return (
    <div className="app">
      <header className={`topbar no-print ${lexique ? 'is-lexique' : 'is-quiz'}`}>
        {lexique ? (
          <div className="brand-stack">
            <div className="brand brand-static">
              <span className="brand-mark brand-mark-card" aria-hidden>
                <CardPicto className="brand-card-icon" />
              </span>
              <h1>Cartes à jouer</h1>
            </div>
            <button
              type="button"
              className="btn-pdf btn-pdf-primary btn-print-under"
              onClick={() => window.print()}
            >
              Imprimer
            </button>
          </div>
        ) : (
          <div className="brand-quiz">
            <p className="brand-mode">Mode actuel</p>
            <p className="brand-mode-sub">
              {tab === 'jeu' ? 'Jeu' : 'Entraînement'}
            </p>
          </div>
        )}

        <nav className="tabs" aria-label="Sections">
          {lexique ? (
            <div className="tabs-group" role="presentation">
              {(['france', 'monde'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`tab ${tab === t ? 'is-active' : ''}`}
                  onClick={() => setTab(t)}
                  aria-current={tab === t ? 'page' : undefined}
                >
                  {TAB_LABEL[t]}
                </button>
              ))}
            </div>
          ) : (
            <div className="tabs-group" role="presentation">
              {(['entrainement', 'jeu'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`tab ${tab === t ? 'is-active' : ''} ${t === 'jeu' ? 'tab-play' : ''}`}
                  onClick={() => setTab(t)}
                  aria-current={tab === t ? 'page' : undefined}
                >
                  {TAB_LABEL[t]}
                </button>
              ))}
            </div>
          )}
        </nav>

        <div className="topbar-right">
          <button
            type="button"
            className="btn-options"
            onClick={() => setOptionsOpen(true)}
            aria-label="Options"
            title="Options"
          >
            ⚙
          </button>
          {lexique ? (
            <button
              type="button"
              className="brand-link brand-link-jeux"
              onClick={() => setTab('jeu')}
            >
              <span className="brand-mark" aria-hidden>
                ◆
              </span>
              <span>Jeux</span>
            </button>
          ) : (
            <button
              type="button"
              className="brand-link"
              onClick={() => setTab('france')}
            >
              <span className="brand-mark brand-mark-card" aria-hidden>
                <CardPicto className="brand-card-icon" />
              </span>
              <span>Lexique</span>
            </button>
          )}
        </div>
      </header>

      <main>
        {tab === 'france' ? <CartesFranceView /> : null}
        {tab === 'monde' ? <CartesMondeView /> : null}
        {tab === 'entrainement' || tab === 'jeu' ? (
          <GameView
            variant={tab as PlayVariant}
            mapDomTom={options.mapDomTom}
            onMapDomTomChange={setMapDomTom}
          />
        ) : null}
      </main>

      <OptionsModal
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        onOptionsChange={handleOptionsChange}
      />
    </div>
  )
}
