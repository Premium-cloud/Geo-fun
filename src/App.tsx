import { useState } from 'react'
import { CartesFranceView } from './cards/CartesFranceView'
import { CartesMondeView } from './cards/CartesMondeView'
import { GameView } from './game/GameView'
import './App.css'

type Tab = 'france' | 'monde' | 'jeu'

const TAB_LABEL: Record<Tab, string> = {
  france: 'France',
  monde: 'Monde',
  jeu: 'Mode Jeu',
}

export default function App() {
  const [tab, setTab] = useState<Tab>('france')

  return (
    <div className="app">
      <header className="topbar no-print">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            ◆
          </span>
          <div>
            <p className="brand-kicker">Collection</p>
            <h1>Cartes</h1>
          </div>
        </div>

        <nav className="tabs" aria-label="Sections">
          {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
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
        </nav>

        <div className="topbar-right">
          {tab === 'france' || tab === 'monde' ? (
            <div className="topbar-actions">
              <button
                type="button"
                className="btn-pdf btn-pdf-primary"
                onClick={() => window.print()}
              >
                Imprimer
              </button>
              {tab === 'monde' ? (
                <>
                  <a className="btn-pdf" href="/feuille-test.pdf" download>
                    PDF test
                  </a>
                  <a className="btn-pdf" href="/drapeaux-du-monde.pdf" download>
                    PDF complet
                  </a>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      <main>
        {tab === 'france' ? <CartesFranceView /> : null}
        {tab === 'monde' ? <CartesMondeView /> : null}
        {tab === 'jeu' ? <GameView /> : null}
      </main>
    </div>
  )
}
