import './Proposals.css'

const IDS = ['a', 'b', 'c', 'd', 'e'] as const

const COPY: Record<(typeof IDS)[number], { name: string; line: string }> = {
  a: {
    name: 'A · Journal',
    line: 'Un journal. Le corail n’est que le mot Jouer.',
  },
  b: {
    name: 'B · Affiche',
    line: 'Jouer occupe la feuille. Le reste est en note.',
  },
  c: {
    name: 'C · Nuit',
    line: 'Papier encre. Une seule bande chaude.',
  },
  d: {
    name: 'D · Musée',
    line: 'Beaucoup de marge. Un carré rouge, pas un bouton.',
  },
  e: {
    name: 'E · Marge',
    line: 'Un cadre noir, comme une marge. Dedans, seulement la base.',
  },
}

function Home({ id }: { id: (typeof IDS)[number] }) {
  if (id === 'b') {
    return (
      <div className={`prop prop-${id}`}>
        <p className="prop-brand">GeoFun</p>
        <p className="prop-play">Jouer</p>
        <p className="prop-notes">Apprendre · Défier · Lexique</p>
        <p className="prop-who">Ton profil</p>
        <p className="prop-ask">
          Installer ? <strong>Oui</strong>
        </p>
      </div>
    )
  }

  return (
    <div className={`prop prop-${id}`}>
      <p className="prop-brand">
        <i />
        GeoFun
      </p>
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
        <h1>Cinq bases. Pas de thème pays.</h1>
        <p>
          Même contenu partout : Jouer, Apprendre, Défier, Lexique, et un profil
          en quatre entrées. Seule l’identité change.
        </p>
      </header>

      {IDS.map((id) => (
        <section key={id} className="prop-block" id={`planche-${id}`}>
          <header>
            <h2>{COPY[id].name}</h2>
            <p>{COPY[id].line}</p>
          </header>
          <div className="prop-pair">
            <figure>
              <figcaption>Accueil</figcaption>
              <Home id={id} />
            </figure>
            <figure>
              <figcaption>Profil</figcaption>
              <Profil id={id} />
            </figure>
          </div>
        </section>
      ))}
    </div>
  )
}
