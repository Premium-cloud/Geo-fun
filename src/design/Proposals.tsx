import './Proposals.css'

const IDS = ['b', 'd', 'f', 'a'] as const

const COPY: Record<(typeof IDS)[number], { name: string; line: string }> = {
  b: {
    name: 'B · Affiche',
    line: 'Chaque menu est une affiche. Un mot en corail, le choix en dessous, le reste en gris.',
  },
  d: {
    name: 'D · Musée',
    line: 'Même calme, mais le titre a du poids. Le carré rouge marque Jouer, il ne le remplace pas.',
  },
  f: {
    name: 'F · Titres',
    line: 'Même taille partout. Le mot du menu est seulement d’une autre couleur.',
  },
  a: {
    name: 'A · Journal',
    line: 'Masthead, filet, index. Le corail reste le mot Jouer, même dans les autres menus.',
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

function AfficheDuel() {
  return (
    <div className="prop prop-b">
      <p className="prop-back">Accueil</p>
      <p className="prop-play is-duel">Défier</p>
      <div>
        <p className="prop-line">
          Même écran
          <span>En ligne</span>
        </p>
        <p className="prop-line">
          Battle royale
          <span>Chacun son tour · Split</span>
        </p>
        <p className="prop-foot">
          <span>Alex · Sam</span>
        </p>
      </div>
    </div>
  )
}

function AfficheLexique() {
  return (
    <div className="prop prop-b">
      <p className="prop-back">Accueil</p>
      <p className="prop-play is-lex">Lexique</p>
      <div>
        <p className="prop-line">
          Territoires
          <span>Monde</span>
        </p>
        <p className="prop-line">
          France
          <span>Suisse · Japon · Espagne</span>
        </p>
      </div>
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

function TitresJouer() {
  return (
    <div className="prop prop-f is-menu">
      <header className="prop-top">
        <span>Accueil</span>
        <span>Réglages</span>
      </header>
      <nav>
        <span className="is-play">Jouer</span>
        <span>Apprendre</span>
        <span>Défier</span>
        <span className="is-group">Pays</span>
        <span className="is-off">Capitales</span>
        <span className="is-off">Territoires</span>
        <span className="is-group">Par drapeau</span>
        <span className="is-off">Par nom</span>
        <span className="is-off">Carte</span>
        <span className="is-group">Facile</span>
        <span className="is-off">Difficile</span>
        <span className="is-off">Hardcore</span>
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

function TitresDuel() {
  return (
    <div className="prop prop-f is-tight">
      <header className="prop-top">
        <span>Accueil</span>
        <span>Réglages</span>
      </header>
      <nav>
        <span className="is-play">Défier</span>
        <span>Même écran</span>
        <span className="is-off">En ligne</span>
        <span className="is-group">Battle royale</span>
        <span className="is-off">Chacun son tour</span>
        <span className="is-off">Split</span>
      </nav>
      <footer className="prop-foot">
        <span>Alex · Sam</span>
      </footer>
    </div>
  )
}

function TitresLexique() {
  return (
    <div className="prop prop-f">
      <header className="prop-top">
        <span>Accueil</span>
        <span>Réglages</span>
      </header>
      <nav>
        <span className="is-play">Lexique</span>
        <span>Territoires</span>
        <span className="is-off">Monde</span>
        <span className="is-group">France</span>
        <span>Suisse</span>
        <span>Japon</span>
      </nav>
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

function JournalJouer() {
  return (
    <div className="prop prop-a is-menu">
      <p className="prop-brand">GeoFun</p>
      <h2 className="is-play">Jouer</h2>
      <nav>
        <span>Apprendre</span>
        <span>Défier</span>
        <span className="is-gap" />
        <span className="is-on">Pays</span>
        <span className="is-off">Capitales</span>
        <span className="is-off">Territoires</span>
        <span className="is-gap" />
        <span className="is-on">Par drapeau</span>
        <span className="is-off">Par nom</span>
        <span className="is-off">Carte</span>
        <span className="is-gap" />
        <span className="is-on">Facile</span>
        <span className="is-off">Difficile</span>
        <span className="is-off">Hardcore</span>
      </nav>
      <p className="prop-ask">
        Installer ? <strong>Oui</strong> <em>×</em>
      </p>
    </div>
  )
}

function JournalDuel() {
  return (
    <div className="prop prop-a is-menu">
      <p className="prop-brand">GeoFun</p>
      <h2>Défier</h2>
      <nav>
        <span className="is-on">Même écran</span>
        <span className="is-off">En ligne</span>
        <span className="is-gap" />
        <span className="is-on">Battle royale</span>
        <span className="is-off">Chacun son tour</span>
        <span className="is-off">Split</span>
        <span className="is-gap" />
        <span>Alex · Sam</span>
      </nav>
      <p className="prop-ask">
        Installer ? <strong>Oui</strong> <em>×</em>
      </p>
    </div>
  )
}

function JournalLexique() {
  const rows = [
    ['France', '96'],
    ['Suisse', '26'],
    ['Japon', '47'],
    ['USA', '50'],
  ] as const

  return (
    <div className="prop prop-a is-menu">
      <p className="prop-brand">GeoFun</p>
      <h2>Lexique</h2>
      <nav>
        <span className="is-on">Territoires</span>
        <span className="is-off">Monde</span>
      </nav>
      <ul>
        {rows.map(([name, meta], i) => (
          <li key={name}>
            <b>{String(i + 1).padStart(2, '0')}</b>
            <span>{name}</span>
            <em>{meta}</em>
          </li>
        ))}
      </ul>
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
      {id === 'a' ? <p className="prop-brand">GeoFun</p> : null}
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
            <figcaption>Jouer</figcaption>
            <AfficheFilters />
          </figure>
          <figure>
            <figcaption>Défier</figcaption>
            <AfficheDuel />
          </figure>
          <figure>
            <figcaption>Lexique</figcaption>
            <AfficheLexique />
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
            <figcaption>Jouer</figcaption>
            <TitresJouer />
          </figure>
          <figure>
            <figcaption>Défier</figcaption>
            <TitresDuel />
          </figure>
          <figure>
            <figcaption>Lexique</figcaption>
            <TitresLexique />
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
            <figcaption>Jouer</figcaption>
            <JournalJouer />
          </figure>
          <figure>
            <figcaption>Défier</figcaption>
            <JournalDuel />
          </figure>
          <figure>
            <figcaption>Lexique</figcaption>
            <JournalLexique />
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
