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

const BRAND: Record<Tab, { kicker: string; title: string }> = {
  france: { kicker: 'Collection', title: 'Départements de France' },
  monde: { kicker: 'Collection', title: 'Drapeaux du monde' },
  jeu: { kicker: 'Entraînement', title: 'Mode Jeu' },
}

export default function App() {
  const [tab, setTab] = useState<Tab>('france')
  const brand = BRAND[tab]

  return (
    <div className="app">
      <header className="topbar no-print">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            ◆
          </span>
          <div>
            <p className="brand-kicker">{brand.kicker}</p>
            <h1>{brand.title}</h1>
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

        {tab !== 'jeu' ? (
          <div className="topbar-actions">
            <button
              type="button"
              className="btn-pdf btn-pdf-primary"
              onClick={() => window.print()}
            >
              Imprimer recto-verso
            </button>
            {tab === 'monde' ? (
              <>
                <a className="btn-pdf" href="/feuille-test.pdf" download>
                  PDF test (1 feuille)
                </a>
                <a className="btn-pdf" href="/drapeaux-du-monde.pdf" download>
                  PDF complet
                </a>
              </>
            ) : null}
            <p className="topbar-hint">
              Recto-verso : duplex, retournement sur le <strong>bord long</strong>. Une
              feuille = 9 cartes (face + dos).
            </p>
          </div>
        ) : (
          <p className="topbar-hint topbar-hint-solo">
            Quiz : blason/drapeau, chef-lieu/capitale, ou nom — France, monde ou mixte.
          </p>
        )}
      </header>

      <main>
        {tab === 'france' ? <CartesFranceView /> : null}
        {tab === 'monde' ? <CartesMondeView /> : null}
        {tab === 'jeu' ? <GameView /> : null}
      </main>
    </div>
  )
}
