import { useState } from 'react'
import { CartesFranceView } from './cards/CartesFranceView'
import { CartesMondeView } from './cards/CartesMondeView'
import { GameView, type PlayVariant } from './game/GameView'
import './App.css'

type Tab = 'france' | 'monde' | 'entrainement' | 'jeu'

const TAB_LABEL: Record<Tab, string> = {
  france: 'France',
  monde: 'Monde',
  entrainement: 'Entraînement',
  jeu: 'Jeu',
}

function isLexique(tab: Tab): boolean {
  return tab === 'france' || tab === 'monde'
}

export default function App() {
  const [tab, setTab] = useState<Tab>('france')
  const lexique = isLexique(tab)

  return (
    <div className="app">
      <header className={`topbar no-print ${lexique ? 'is-lexique' : 'is-quiz'}`}>
        {lexique ? (
          <button
            type="button"
            className="brand"
            onClick={() => setTab('france')}
            aria-label="Lexique Cartes"
          >
            <span className="brand-mark" aria-hidden>
              ◆
            </span>
            <div>
              <p className="brand-kicker">Lexique</p>
              <h1>Cartes</h1>
            </div>
          </button>
        ) : (
          <div className="brand-quiz">
            <p className="brand-mode">
              {tab === 'jeu' ? 'Mode Jeu' : 'Entraînement'}
            </p>
            <button
              type="button"
              className="brand-back"
              onClick={() => setTab('france')}
            >
              <span className="brand-mark" aria-hidden>
                ◆
              </span>
              <span>Lexique</span>
            </button>
          </div>
        )}

        <nav className="tabs" aria-label="Sections">
          {lexique ? (
            <>
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
              <span className="tabs-sep" aria-hidden />
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
            </>
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
          {lexique ? (
            <div className="topbar-actions">
              <button
                type="button"
                className="btn-pdf btn-pdf-primary"
                onClick={() => window.print()}
              >
                Imprimer
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main>
        {tab === 'france' ? <CartesFranceView /> : null}
        {tab === 'monde' ? <CartesMondeView /> : null}
        {tab === 'entrainement' || tab === 'jeu' ? (
          <GameView variant={tab as PlayVariant} />
        ) : null}
      </main>
    </div>
  )
}
