import { useEffect, useState } from 'react'
import { CartesFranceView } from './cards/CartesFranceView'
import { CartesMondeView } from './cards/CartesMondeView'
import { DuelView } from './duel/DuelView'
import { GameView, type PlayVariant } from './game/GameView'
import { HistoryPanel } from './game/HistoryPanel'
import {
  applyNightClass,
  loadOptions,
  saveOptions,
  type OptionsState,
} from './lib/storage'
import { OptionsModal } from './options/OptionsModal'
import './App.css'

type Tab = 'france' | 'monde' | 'entrainement' | 'jeu' | 'duel'

const TAB_LABEL: Record<Tab, string> = {
  france: 'Départements',
  monde: 'Pays',
  entrainement: 'Entraînement',
  jeu: 'Jeu',
  duel: 'Duel',
}

function isLexique(tab: Tab): boolean {
  return tab === 'france' || tab === 'monde'
}

/** M stylisé dans le carré bleu (logo provisoire). */
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
    return 'france'
  })
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [options, setOptions] = useState<OptionsState>(() => loadOptions())
  const lexique = isLexique(tab)
  const showHistoryBtn = tab === 'entrainement' || tab === 'jeu'

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
              <BrandMark />
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
            <BrandMark className="brand-mark-lg" />
            <div className="brand-quiz-copy">
              <p className="brand-mode">Mode actuel</p>
              <p className="brand-mode-sub">
                {tab === 'jeu' ? 'Jeu' : tab === 'duel' ? 'Duel' : 'Entraînement'}
              </p>
            </div>
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
              {(['entrainement', 'jeu', 'duel'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`tab ${tab === t ? 'is-active' : ''} ${t === 'jeu' || t === 'duel' ? 'tab-play' : ''}`}
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
          {lexique ? (
            <button
              type="button"
              className="brand-link brand-link-jeux"
              onClick={() => setTab('entrainement')}
            >
              <BrandMark className="brand-mark-sm" />
              <span>Jeux</span>
            </button>
          ) : (
            <button
              type="button"
              className="brand-link"
              onClick={() => setTab('france')}
            >
              <BrandMark className="brand-mark-sm" />
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
            onOpenHistory={() => setHistoryOpen(true)}
          />
        ) : null}
        {tab === 'duel' ? <DuelView /> : null}
      </main>

      <OptionsModal
        open={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        onOptionsChange={handleOptionsChange}
      />
      {historyOpen ? <HistoryPanel onClose={() => setHistoryOpen(false)} /> : null}
    </div>
  )
}
