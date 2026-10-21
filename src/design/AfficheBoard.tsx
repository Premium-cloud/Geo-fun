import { useState, type ReactNode } from 'react'
import './AfficheBoard.css'

const MODES = ['Jouer', 'Apprendre', 'Défier'] as const
const CATS = ['Pays', 'Capitales', 'Territoires'] as const
const ANSWERS = ['Par drapeau', 'Par nom', 'Carte'] as const
const LEVELS = ['Facile', 'Difficile', 'Hardcore'] as const
const VENUES = ['Même écran', 'En ligne'] as const
const FORMATS = ['Battle royale', 'Chacun son tour', 'Split'] as const
const DOORS = ['Territoires', 'Monde'] as const
const COUNTRIES = ['France', 'Suisse', 'Japon', 'Espagne', 'USA', 'Allemagne', 'Canada', 'Brésil'] as const
const NIGHTS = ['Jour', 'Nuit'] as const
const MAPS = ['Métropole', 'DOM-TOM'] as const
const SOUNDS = ['Son', 'Silence'] as const

type Mode = (typeof MODES)[number]
type Cat = (typeof CATS)[number]
type Answer = (typeof ANSWERS)[number]
type Level = (typeof LEVELS)[number]
type Venue = (typeof VENUES)[number]
type Format = (typeof FORMATS)[number]
type Door = (typeof DOORS)[number]
type Country = (typeof COUNTRIES)[number]

type PickKey = 'mode' | 'cat' | 'answer' | 'level' | 'venue' | 'format' | 'door' | 'country' | 'night' | 'map' | 'sound'

type View =
  | { name: 'home' }
  | { name: 'play' }
  | { name: 'duel' }
  | { name: 'lex' }
  | { name: 'profil' }
  | { name: 'settings' }
  | { name: 'pick'; key: PickKey }
  | { name: 'leaf'; title: string; meta: string }

const PROFIL = [
  ['Ouvrir un pack', '400 cr.'],
  ['Album', '0 / 492'],
  ['Mes résultats', 'quiz'],
  ['Trophées', '0'],
] as const

function heroClass(word: string) {
  if (word.length > 9) return 'live-hero is-long'
  if (word.length > 5) return 'live-hero is-mid'
  return 'live-hero'
}

export function AfficheBoard() {
  const [view, setView] = useState<View>({ name: 'home' })
  const [ask, setAsk] = useState(true)
  const [mode, setMode] = useState<Mode>('Jouer')
  const [cat, setCat] = useState<Cat>('Pays')
  const [answer, setAnswer] = useState<Answer>('Par drapeau')
  const [level, setLevel] = useState<Level>('Facile')
  const [venue, setVenue] = useState<Venue>('Même écran')
  const [format, setFormat] = useState<Format>('Battle royale')
  const [door, setDoor] = useState<Door>('Territoires')
  const [country, setCountry] = useState<Country>('France')
  const [night, setNight] = useState<(typeof NIGHTS)[number]>('Jour')
  const [map, setMap] = useState<(typeof MAPS)[number]>('Métropole')
  const [sound, setSound] = useState<(typeof SOUNDS)[number]>('Son')

  function chooseMode(next: Mode) {
    setMode(next)
    setView(next === 'Défier' ? { name: 'duel' } : { name: 'play' })
  }

  function sheet(node: {
    back?: string
    onBack?: () => void
    top?: ReactNode
    hero: string
    onHero?: () => void
    lines?: { label: string; onClick: () => void }[]
    foot?: ReactNode
  }) {
    return (
      <div
        className="live"
        onClick={(e) => {
          if (view.name !== 'home' || !ask) return
          const target = e.target as HTMLElement
          if (target.closest('button')) return
          setAsk(false)
        }}
      >
        {node.top ?? (
          <button type="button" className="live-back" onClick={node.onBack}>
            {node.back}
          </button>
        )}
        {node.onHero ? (
          <button type="button" className={heroClass(node.hero)} onClick={node.onHero}>
            {node.hero}
          </button>
        ) : (
          <p className={heroClass(node.hero)}>{node.hero}</p>
        )}
        {node.lines && node.lines.length > 0 ? (
          <div className="live-lines">
            {node.lines.map((line) => (
              <button key={line.label} type="button" onClick={line.onClick}>
                {line.label}
              </button>
            ))}
          </div>
        ) : (
          <span />
        )}
        {node.foot ?? <span />}
      </div>
    )
  }

  function home() {
    return sheet({
      top: (
        <header className="live-top">
          <button type="button" onClick={() => setView({ name: 'profil' })}>
            Ton profil
          </button>
          <button type="button" onClick={() => setView({ name: 'settings' })}>
            Réglages
          </button>
        </header>
      ),
      hero: 'Jouer',
      onHero: () => setView({ name: 'play' }),
      foot: (
        <footer className="live-foot">
          <button type="button" onClick={() => setView({ name: 'lex' })}>
            Lexique
          </button>
          {ask ? (
            <button type="button" className="live-ask" onClick={() => setAsk(false)}>
              Installer ? <strong>Oui</strong>
            </button>
          ) : null}
        </footer>
      ),
    })
  }

  function play() {
    return sheet({
      back: 'Accueil',
      onBack: () => setView({ name: 'home' }),
      hero: mode,
      onHero: () => setView({ name: 'pick', key: 'mode' }),
      lines: [
        { label: cat, onClick: () => setView({ name: 'pick', key: 'cat' }) },
        { label: answer, onClick: () => setView({ name: 'pick', key: 'answer' }) },
        { label: level, onClick: () => setView({ name: 'pick', key: 'level' }) },
      ],
    })
  }

  function duel() {
    const lines = [
      { label: venue, onClick: () => setView({ name: 'pick', key: 'venue' }) },
      ...(venue === 'Même écran'
        ? [{ label: format, onClick: () => setView({ name: 'pick', key: 'format' }) }]
        : []),
    ]
    return sheet({
      back: 'Accueil',
      onBack: () => setView({ name: 'home' }),
      hero: 'Défier',
      onHero: () => setView({ name: 'pick', key: 'mode' }),
      lines,
      foot: <p className="live-foot">Alex · Sam</p>,
    })
  }

  function lex() {
    const lines = [
      { label: door, onClick: () => setView({ name: 'pick', key: 'door' }) },
      ...(door === 'Territoires'
        ? [{ label: country, onClick: () => setView({ name: 'pick', key: 'country' }) }]
        : []),
    ]
    return sheet({
      back: 'Accueil',
      onBack: () => setView({ name: 'home' }),
      hero: 'Lexique',
      lines,
    })
  }

  function profil() {
    return sheet({
      back: 'Accueil',
      onBack: () => setView({ name: 'home' }),
      hero: 'Profil',
      lines: PROFIL.map(([title, meta]) => ({
        label: title,
        onClick: () => setView({ name: 'leaf', title, meta }),
      })),
      foot: (
        <button type="button" className="live-edit" onClick={() => setView({ name: 'leaf', title: 'Alex', meta: 'Ton prénom' })}>
          Modifier le prénom
        </button>
      ),
    })
  }

  function settings() {
    return sheet({
      back: 'Accueil',
      onBack: () => setView({ name: 'home' }),
      hero: 'Réglages',
      lines: [
        { label: night, onClick: () => setView({ name: 'pick', key: 'night' }) },
        { label: map, onClick: () => setView({ name: 'pick', key: 'map' }) },
        { label: sound, onClick: () => setView({ name: 'pick', key: 'sound' }) },
      ],
    })
  }

  function pick(key: PickKey) {
    const table = {
      mode: {
        back: mode === 'Défier' ? 'Défier' : mode,
        parent: (): View => (mode === 'Défier' ? { name: 'duel' } : { name: 'play' }),
        current: mode,
        options: MODES,
        set: (value: Mode) => chooseMode(value),
      },
      cat: {
        back: mode,
        parent: (): View => ({ name: 'play' }),
        current: cat,
        options: CATS,
        set: (value: Cat) => {
          setCat(value)
          setView({ name: 'play' })
        },
      },
      answer: {
        back: mode,
        parent: (): View => ({ name: 'play' }),
        current: answer,
        options: ANSWERS,
        set: (value: Answer) => {
          setAnswer(value)
          setView({ name: 'play' })
        },
      },
      level: {
        back: mode,
        parent: (): View => ({ name: 'play' }),
        current: level,
        options: LEVELS,
        set: (value: Level) => {
          setLevel(value)
          setView({ name: 'play' })
        },
      },
      venue: {
        back: 'Défier',
        parent: (): View => ({ name: 'duel' }),
        current: venue,
        options: VENUES,
        set: (value: Venue) => {
          setVenue(value)
          setView({ name: 'duel' })
        },
      },
      format: {
        back: 'Défier',
        parent: (): View => ({ name: 'duel' }),
        current: format,
        options: FORMATS,
        set: (value: Format) => {
          setFormat(value)
          setView({ name: 'duel' })
        },
      },
      door: {
        back: 'Lexique',
        parent: (): View => ({ name: 'lex' }),
        current: door,
        options: DOORS,
        set: (value: Door) => {
          setDoor(value)
          setView({ name: 'lex' })
        },
      },
      country: {
        back: 'Lexique',
        parent: (): View => ({ name: 'lex' }),
        current: country,
        options: COUNTRIES,
        set: (value: Country) => {
          setCountry(value)
          setView({ name: 'lex' })
        },
      },
      night: {
        back: 'Réglages',
        parent: (): View => ({ name: 'settings' }),
        current: night,
        options: NIGHTS,
        set: (value: (typeof NIGHTS)[number]) => {
          setNight(value)
          setView({ name: 'settings' })
        },
      },
      map: {
        back: 'Réglages',
        parent: (): View => ({ name: 'settings' }),
        current: map,
        options: MAPS,
        set: (value: (typeof MAPS)[number]) => {
          setMap(value)
          setView({ name: 'settings' })
        },
      },
      sound: {
        back: 'Réglages',
        parent: (): View => ({ name: 'settings' }),
        current: sound,
        options: SOUNDS,
        set: (value: (typeof SOUNDS)[number]) => {
          setSound(value)
          setView({ name: 'settings' })
        },
      },
    }[key]

    const others = table.options.filter((option) => option !== table.current)
    return sheet({
      back: table.back,
      onBack: () => setView(table.parent()),
      hero: table.current,
      lines: others.map((option) => ({
        label: option,
        onClick: () => table.set(option as never),
      })),
    })
  }

  function leaf(title: string, meta: string) {
    return sheet({
      back: 'Profil',
      onBack: () => setView({ name: 'profil' }),
      hero: title,
      foot: <p className="live-foot">{meta}</p>,
    })
  }

  let body: React.ReactNode
  if (view.name === 'home') body = home()
  else if (view.name === 'play') body = play()
  else if (view.name === 'duel') body = duel()
  else if (view.name === 'lex') body = lex()
  else if (view.name === 'profil') body = profil()
  else if (view.name === 'settings') body = settings()
  else if (view.name === 'pick') body = pick(view.key)
  else body = leaf(view.title, view.meta)

  return (
    <div className="live-desk">
      <header className="sheet-colophon">
        <p className="sheet-kicker">B · Affiche</p>
        <h1>Tape une ligne.</h1>
        <p>La feuille ne montre que le choix en cours. La ligne ouverte, les autres mots arrivent.</p>
      </header>
      <div className="live-phone">{body}</div>
    </div>
  )
}
