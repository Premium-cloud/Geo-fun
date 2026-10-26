import { useState } from 'react'
import { AfficheBoard } from './AfficheBoard'
import { Proposals } from './Proposals'
import './DesignStudy.css'

/**
 * Planche. Pas l’app.
 * Une couleur pleine (Jouer). Le reste est de l’encre sur le papier.
 * L’install est une ligne en bas de feuille, pas un encart.
 */
function PlancheOne() {
  const [askInstall, setAskInstall] = useState(true)

  return (
    <div className="sheet-desk">
      <header className="sheet-colophon">
        <p className="sheet-kicker">GeoFun · planche 01</p>
        <h1>Encre, une couleur, une ligne.</h1>
        <p>
          L’accueil n’est plus une pile de pavés. Jouer est la seule masse.
          Le profil est une table des matières, pas une fiche.
        </p>
      </header>

      <div className="sheet-row">
        <figure className="sheet-phone">
          <figcaption>Accueil</figcaption>
          <div
            className="sheet"
            onClick={() => askInstall && setAskInstall(false)}
          >
            <p className="sheet-brand">
              <i />
              GeoFun
            </p>
            <a className="sheet-who" href="#profil">
              <b>?</b>
              <span>
                <strong>Ton profil</strong>
                <em>Niv. 1 · 400 cr.</em>
              </span>
            </a>

            <nav className="sheet-nav" aria-label="Modes">
              <span className="sheet-item">Apprendre</span>
              <span className="sheet-item is-play">Jouer</span>
              <span className="sheet-item">Défier</span>
              <span className="sheet-item is-quiet">
                Lexique
                <em>→</em>
              </span>
            </nav>

            {askInstall ? (
              <button
                type="button"
                className="sheet-ask"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <span>Installer GeoFun ?</span>
                <strong>Oui</strong>
                <em
                  aria-label="Fermer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setAskInstall(false)
                  }}
                >
                  ×
                </em>
              </button>
            ) : null}
          </div>
          <p className="sheet-note">
            Un tap sur la feuille ou sur × retire la question. Elle ne revient pas.
          </p>
        </figure>

        <figure className="sheet-phone" id="profil">
          <figcaption>Profil</figcaption>
          <div className="sheet">
            <p className="sheet-back">← Accueil</p>
            <header className="sheet-id">
              <b>?</b>
              <div>
                <h2>Ton profil</h2>
                <em>Niv. 1</em>
              </div>
            </header>

            <ul className="sheet-index">
              <li>
                <span>Ouvrir un pack</span>
                <em>400 cr.</em>
              </li>
              <li>
                <span>Album</span>
                <em>0 / 492</em>
              </li>
              <li>
                <span>Mes résultats</span>
                <em>quiz</em>
              </li>
              <li>
                <span>Trophées</span>
                <em>0</em>
              </li>
            </ul>

            <p className="sheet-edit">Modifier le prénom</p>
          </div>
          <p className="sheet-note">
            Quatre entrées, même graisse. Le chiffre est à droite, pas un sous-titre.
          </p>
        </figure>
      </div>
    </div>
  )
}

function HomeSheet({
  theme,
  ask,
  onDismiss,
}: {
  theme: 'none' | 'fr'
  ask: boolean
  onDismiss: () => void
}) {
  return (
    <div
      className={`p2-sheet ${theme === 'fr' ? 'is-fr' : ''}`}
      onClick={() => ask && onDismiss()}
    >
      {theme === 'fr' ? <i className="p2-stripe" aria-hidden /> : <i className="p2-stripe is-plain" aria-hidden />}
      <p className="p2-brand">
        GeoFun
        {theme === 'fr' ? <em>France</em> : null}
      </p>
      <p className="p2-who">
        <b>?</b>
        Ton profil
      </p>
      <nav className="p2-nav">
        <span>Apprendre</span>
        <span className="is-play">Jouer</span>
        <span>Défier</span>
        <span className="is-lex">
          Lexique <em>→</em>
        </span>
      </nav>
      {ask ? (
        <p
          className="p2-ask"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Installer ?</span>
          <button type="button">Oui</button>
          <button type="button" aria-label="Fermer" onClick={onDismiss}>
            ×
          </button>
        </p>
      ) : null}
    </div>
  )
}

function PlancheTwo() {
  const [ask, setAsk] = useState(true)

  return (
    <div className="sheet-desk p2-desk">
      <header className="sheet-colophon">
        <p className="sheet-kicker">GeoFun · planche 02</p>
        <h1>La même feuille, un pays en plus.</h1>
        <p>
          Moins de cadres. Jouer reste la seule masse. Un thème de pays
          ne change que le papier et cette masse — quand toutes les cartes
          du pays sont là.
        </p>
      </header>

      <div className="sheet-row">
        <figure className="sheet-phone">
          <figcaption>Accueil · sans thème</figcaption>
          <HomeSheet theme="none" ask={ask} onDismiss={() => setAsk(false)} />
          <p className="sheet-note">La question d’install est une ligne, pas une pastille.</p>
        </figure>

        <figure className="sheet-phone">
          <figcaption>Accueil · France 96/96</figcaption>
          <HomeSheet theme="fr" ask={false} onDismiss={() => {}} />
          <p className="sheet-note">
            Album France complet : papier chaud, filet, Jouer en bleu.
          </p>
        </figure>

        <figure className="sheet-phone">
          <figcaption>Profil</figcaption>
          <div className="p2-sheet">
            <i className="p2-stripe is-plain" aria-hidden />
            <p className="p2-back">Accueil</p>
            <h2 className="p2-name">
              Ton profil
              <span>Niv. 1</span>
            </h2>
            <ul className="p2-index">
              <li>
                <span>Ouvrir un pack</span>
                <em>400 cr.</em>
              </li>
              <li>
                <span>Album</span>
                <em>96 / 492</em>
              </li>
              <li>
                <span>Mes résultats</span>
                <em>quiz</em>
              </li>
              <li>
                <span>Trophées</span>
                <em>0</em>
              </li>
            </ul>
            <p className="p2-themes-label">Thèmes</p>
            <ul className="p2-themes">
              <li className="is-on">
                <i />
                <span>France</span>
                <em>96/96</em>
              </li>
              <li>
                <i />
                <span>Suisse</span>
                <em>18/26</em>
              </li>
              <li>
                <i />
                <span>Japon</span>
                <em>0/47</em>
              </li>
            </ul>
            <p className="sheet-edit">Modifier le prénom</p>
          </div>
          <p className="sheet-note">
            France est allumé. Suisse et Japon attendent l’album complet.
          </p>
        </figure>
      </div>
    </div>
  )
}

export function DesignStudy() {
  const [board, setBoard] = useState<'live' | 'propositions' | 1 | 2>('live')

  return (
    <div>
      <nav className="board-switch" aria-label="Planches">
        <button type="button" className={board === 'live' ? 'is-on' : ''} onClick={() => setBoard('live')}>
          Cliquable
        </button>
        <button
          type="button"
          className={board === 'propositions' ? 'is-on' : ''}
          onClick={() => setBoard('propositions')}
        >
          Propositions
        </button>
        <button type="button" className={board === 1 ? 'is-on' : ''} onClick={() => setBoard(1)}>
          Planche 01
        </button>
        <button type="button" className={board === 2 ? 'is-on' : ''} onClick={() => setBoard(2)}>
          Planche 02
        </button>
      </nav>
      {board === 'live' ? (
        <AfficheBoard />
      ) : board === 1 ? (
        <PlancheOne />
      ) : board === 2 ? (
        <PlancheTwo />
      ) : (
        <Proposals />
      )}
    </div>
  )
}
