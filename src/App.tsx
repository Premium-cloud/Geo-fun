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
          <a className="btn-pdf" href="/feuille-test.pdf" download>
            Feuille test
          </a>
          <a className="btn-pdf btn-pdf-primary" href="/drapeaux-du-monde.pdf" download>
            PDF complet
          </a>
          <p className="topbar-hint">Cliquez une carte pour la retourner</p>
        </div>
      </header>
      <main>
        <CartesMondeView />
      </main>
    </div>
  )
}
