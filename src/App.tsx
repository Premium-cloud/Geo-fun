import { CartesMondeView } from './cards/CartesMondeView'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="topbar no-print">
        <div className="brand">
          <span className="brand-mark">◆</span>
          <div>
            <p className="brand-kicker">Collection</p>
            <h1>Drapeaux du monde</h1>
          </div>
        </div>
        <div className="topbar-actions">
          <button type="button" className="btn-pdf btn-pdf-primary" onClick={() => window.print()}>
            Imprimer recto-verso
          </button>
          <a className="btn-pdf" href="/feuille-test.pdf" download>
            PDF test (1 feuille)
          </a>
          <a className="btn-pdf" href="/drapeaux-du-monde.pdf" download>
            PDF complet
          </a>
          <p className="topbar-hint">
            Recto-verso : activez le duplex, retournement sur le <strong>bord long</strong>.
            Une feuille = 9 cartes complètes (face + dos).
          </p>
        </div>
      </header>
      <main>
        <CartesMondeView />
      </main>
    </div>
  )
}
