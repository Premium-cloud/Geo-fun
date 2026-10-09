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

export default function App() {
  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window !== 'undefined') {
      const duel = new URL(window.location.href).searchParams.get('duel')
      if (duel) return 'duel'
    }
    return 'entrainement'
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

  const modeLabel = lexique
    ? 'LEXIQUE — CARTES À JOUER'
    : tab === 'jeu'
      ? 'Jeu'
      : tab === 'duel'
        ? 'Duel'
        : 'Entraînement'

  return (
    <div className={`app ${lexique ? 'is-lexique-app' : ''}`}>
      <header className="topbar no-print is-quiz">
        <div className="brand-quiz">
          <BrandMark className="brand-mark-lg" />
          <div className="brand-quiz-copy">
            <p className="brand-mode">Mode actuel</p>
            <p className={`brand-mode-sub ${lexique ? 'is-lexique-title' : ''}`}>
              {modeLabel}
            </p>
            {lexique ? (
              <button
                type="button"
                className="btn-print-inline"
                onClick={() => {
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
              >
                Imprimer
              </button>
            ) : null}
          </div>
        </div>

        <nav className="tabs" aria-label="Sections">
          <div className="tabs-group" role="presentation">
            {(['entrainement', 'jeu', 'duel'] as const).map((t) => (
              <button
                key={t}
                type="button"
                className={`tab ${!lexique && tab === t ? 'is-active' : ''}`}
                onClick={() => setTab(t)}
                aria-current={!lexique && tab === t ? 'page' : undefined}
              >
                {t === 'entrainement' ? 'Entraînement' : t === 'jeu' ? 'Jeu' : 'Duel'}
              </button>
            ))}
          </div>
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
          <button
            type="button"
            className={`btn-lexique ${lexique ? 'is-active' : ''}`}
            onClick={() => setTab(lexique ? 'entrainement' : 'france')}
            aria-label={lexique ? 'Retour aux jeux' : 'Lexique'}
            title={lexique ? 'Jeux' : 'Lexique'}
          >
            <BookIcon />
          </button>
        </div>
      </header>

      <main>
        {lexique ? (
          <div className="lexique-shell">
            <div className="lexique-switch no-print" role="tablist" aria-label="Lexique">
              <button
                type="button"
                role="tab"
                className={`lexique-switch-tab ${tab === 'france' ? 'is-active' : ''}`}
                aria-selected={tab === 'france'}
                onClick={() => setTab('france')}
              >
                <strong>France</strong>
                <span>Départements</span>
              </button>
              <button
                type="button"
                role="tab"
                className={`lexique-switch-tab ${tab === 'monde' ? 'is-active' : ''}`}
                aria-selected={tab === 'monde'}
                onClick={() => setTab('monde')}
              >
                <strong>Pays</strong>
                <span>Drapeaux</span>
              </button>
            </div>
            {tab === 'france' ? <CartesFranceView /> : <CartesMondeView />}
          </div>
        ) : null}
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
