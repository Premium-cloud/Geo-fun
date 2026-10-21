import './Proposals.css'

const IDS = ['b', 'd', 'f', 'a'] as const

const COPY: Record<(typeof IDS)[number], { name: string; line: string }> = {
  b: {
    name: 'B · Affiche',
    line: 'La feuille ne liste plus les modes. Jouer ouvre les filtres. Profil, réglages et lexique restent.',
  },
  d: {
    name: 'D · Musée',
    line: 'Même calme, mais le titre a du poids. Le carré rouge marque Jouer, il ne le remplace pas.',
  },
  f: {
    name: 'F · Titres',
    line: 'Trois mots, même taille, beaucoup d’air. Jouer est seulement d’une autre couleur.',
  },
  a: {
    name: 'A · Journal',
    line: 'Inchangé. Le corail n’est que le mot Jouer.',
  },
}

function AfficheHome() {
  return (
    <div className="prop prop-b">
      <header className="prop-top">
        <span>Ton profil</span>
        <span>Réglages</span>
      </header>
      <p className="prop-play">Jouer</p>
      <footer className="prop-foot">
        <span>Lexique</span>
        <span className="prop-ask">
          Installer ? <strong>Oui</strong>
        </span>
      </footer>
    </div>
  )
}

function AfficheFilters() {
  return (
    <div className="prop prop-b is-next">
      <p className="prop-back">Accueil</p>
      <p className="prop-modes">
        <strong>Jouer</strong>
        <span>Apprendre</span>
        <span>Défier</span>
      </p>
      <h2>
        Pays
        <span>Capitales · Territoires</span>
      </h2>
      <p className="prop-line">
        Par drapeau
        <span>Par nom · Carte</span>
      </p>
      <p className="prop-line">
        Facile
        <span>Difficile · Hardcore</span>
      </p>
    </div>
  )
}

function MuseeHome() {
  return (
    <div className="prop prop-d">
      <p className="prop-brand">GeoFun</p>
      <h2>
        Le monde
        <span>en cartes</span>
      </h2>
      <p className="prop-who">Ton profil</p>
      <nav>
        <span>Apprendre</span>
        <span className="is-play">
          <i />
          Jouer
        </span>
        <span>Défier</span>
        <span className="is-lex">Lexique</span>
      </nav>
      <p className="prop-ask">
        Installer ? <strong>Oui</strong> <em>×</em>
      </p>
    </div>
  )
}

function TitresHome() {
  return (
    <div className="prop prop-f">
      <header className="prop-top">
        <span>Ton profil</span>
        <span>Réglages</span>
      </header>
      <nav>
        <span>Apprendre</span>
        <span className="is-play">Jouer</span>
        <span>Défier</span>
      </nav>
      <footer className="prop-foot">
        <span>Lexique</span>
        <span className="prop-ask">
          Installer ? <strong>Oui</strong>
        </span>
      </footer>
    </div>
  )
}

function JournalHome() {
  return (
    <div className="prop prop-a">
      <p className="prop-brand">GeoFun</p>
      <h2>
        Le monde
        <span>en cartes</span>
      </h2>
      <p className="prop-who">Ton profil</p>
      <nav>
        <span>Apprendre</span>
        <span className="is-play">Jouer</span>
        <span>Défier</span>
        <span className="is-lex">Lexique</span>
      </nav>
      <p className="prop-ask">
        Installer ? <strong>Oui</strong> <em>×</em>
      </p>
    </div>
  )
}

function Profil({ id }: { id: (typeof IDS)[number] }) {
  const rows = [
    ['Ouvrir un pack', '400 cr.'],
    ['Album', '0 / 492'],
    ['Mes résultats', 'quiz'],
    ['Trophées', '0'],
  ] as const

  return (
    <div className={`prop prop-${id} is-profil`}>
      <p className="prop-back">Accueil</p>
      <h2>
        Ton profil
        <span>Niv. 1</span>
      </h2>
      <ul>
        {rows.map(([name, meta], i) => (
          <li key={name}>
            <b>{String(i + 1).padStart(2, '0')}</b>
            <span>{name}</span>
            <em>{meta}</em>
          </li>
        ))}
      </ul>
      <p className="prop-edit">Modifier le prénom</p>
    </div>
  )
}

export function Proposals() {
  return (
    <div className="prop-wall">
      <header className="sheet-colophon">
        <p className="sheet-kicker">GeoFun · propositions</p>
        <h1>Quatre bases. Le nuit viendra après.</h1>
        <p>
          Le mode nuit s’applique à l’identité choisie. Ce n’est pas une planche.
          Nuit et Marge sont retirées.
        </p>
      </header>

      <section className="prop-block" id="planche-b">
        <header>
          <h2>{COPY.b.name}</h2>
          <p>{COPY.b.line}</p>
        </header>
        <div className="prop-pair">
          <figure>
            <figcaption>Accueil</figcaption>
            <AfficheHome />
          </figure>
          <figure>
            <figcaption>Après Jouer</figcaption>
            <AfficheFilters />
          </figure>
          <figure>
            <figcaption>Profil</figcaption>
            <Profil id="b" />
          </figure>
        </div>
      </section>

      <section className="prop-block" id="planche-d">
        <header>
          <h2>{COPY.d.name}</h2>
          <p>{COPY.d.line}</p>
        </header>
        <div className="prop-pair">
          <figure>
            <figcaption>Accueil</figcaption>
            <MuseeHome />
          </figure>
          <figure>
            <figcaption>Profil</figcaption>
            <Profil id="d" />
          </figure>
        </div>
      </section>

      <section className="prop-block" id="planche-f">
        <header>
          <h2>{COPY.f.name}</h2>
          <p>{COPY.f.line}</p>
        </header>
        <div className="prop-pair">
          <figure>
            <figcaption>Accueil</figcaption>
            <TitresHome />
          </figure>
          <figure>
            <figcaption>Profil</figcaption>
            <Profil id="f" />
          </figure>
        </div>
      </section>

      <section className="prop-block" id="planche-a">
        <header>
          <h2>{COPY.a.name}</h2>
          <p>{COPY.a.line}</p>
        </header>
        <div className="prop-pair">
          <figure>
            <figcaption>Accueil</figcaption>
            <JournalHome />
          </figure>
          <figure>
            <figcaption>Profil</figcaption>
            <Profil id="a" />
          </figure>
        </div>
      </section>
    </div>
  )
}
