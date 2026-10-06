import { CartesMondeView } from './cards/CartesMondeView'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="topbar no-print">
        <div className="brand">
          <span className="brand-mark">◆</span>
          <div>
            <p className="brand-kicker">Jeu de cartes</p>
            <h1>Drapeaux du monde</h1>
          </div>
        </div>
        <p className="topbar-hint">
          Cliquez une carte pour la retourner · Ctrl/Cmd+P pour imprimer
        </p>
      </header>
      <main>
        <CartesMondeView />
      </main>
    </div>
  )
}
