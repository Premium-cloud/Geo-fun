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

type View = 'home' | 'play' | 'lex' | 'profil' | 'settings' | 'leaf'

const PROFIL = [
  ['Ouvrir un pack', '400 cr.'],
  ['Album', '0 / 492'],
  ['Mes résultats', 'quiz'],
  ['Trophées', '0'],
] as const

function heroClass(word: string) {
  if (word.length > 8) return 'live-hero is-long'
  if (word.length > 5) return 'live-hero is-mid'
  return 'live-hero'
}

function roundLine(cat: Cat, answer: Answer) {
  if (cat === 'Pays' && answer === 'Par drapeau') return 'Quel pays\u00a0?'
  if (cat === 'Pays' && answer === 'Par nom') return 'Italie'
  if (cat === 'Pays') return 'Où est-ce ?'
  if (cat === 'Capitales' && answer === 'Par nom') return 'Capitale de l’Italie'
  if (cat === 'Capitales' && answer === 'Carte') return 'La capitale'
  if (cat === 'Capitales') return 'Quelle capitale\u00a0?'
  if (answer === 'Par nom') return 'Le Rhône'
  if (answer === 'Carte') return 'Où est-ce ?'
  return 'Quel département\u00a0?'
}

function FilterRow<T extends string>({
  value,
  options,
  open,
  onOpen,
  onChange,
}: {
  value: T
  options: readonly T[]
  open: boolean
  onOpen: () => void
  onChange: (next: T) => void
}) {
  const others = options.filter((option) => option !== value)
  return (
    <div className="live-row">
      <button type="button" className="is-on" onClick={onOpen}>
        {value}
      </button>
      {open
        ? others.map((option) => (
            <button key={option} type="button" className="is-off" onClick={() => onChange(option)}>
              {option}
            </button>
          ))
        : null}
    </div>
  )
}

export function AfficheBoard() {
  const [view, setView] = useState<View>('home')
  const [ask, setAsk] = useState(true)
  const [open, setOpen] = useState<string | null>(null)
  const [leaf, setLeaf] = useState<{ title: string; meta: string } | null>(null)
  const [mode, setMode] = useState<Mode>('Jouer')
  const [cat, setCat] = useState<Cat>('Capitales')
  const [answer, setAnswer] = useState<Answer>('Par drapeau')
  const [level, setLevel] = useState<Level>('Facile')
  const [venue, setVenue] = useState<Venue>('Même écran')
  const [format, setFormat] = useState<Format>('Battle royale')
  const [door, setDoor] = useState<Door>('Territoires')
  const [country, setCountry] = useState<Country>('France')
  const [night, setNight] = useState<(typeof NIGHTS)[number]>('Jour')
  const [map, setMap] = useState<(typeof MAPS)[number]>('Métropole')
  const [sound, setSound] = useState<(typeof SOUNDS)[number]>('Son')

  function toggle(id: string) {
    setOpen((current) => (current === id ? null : id))
  }

  function enter(next: Mode) {
    setMode(next)
    setOpen(null)
    setView('play')
  }

  const round = roundLine(cat, answer)

  let body: ReactNode
  if (view === 'home') {
    body = (
      <div
        className="live is-home"
        onClick={(event) => {
          if (!ask) return
          const target = event.target as HTMLElement
          if (target.closest('button')) return
          setAsk(false)
        }}
      >
        <header className="live-top">
          <button type="button" onClick={() => setView('profil')}>
            Ton profil
          </button>
          <button type="button" onClick={() => setView('settings')}>
            Réglages
          </button>
        </header>
        <div className="live-stack">
          <button type="button" className={heroClass(mode)} onClick={() => enter(mode)}>
            {mode}
          </button>
          <div className="live-carousel" aria-label="Autres modes">
            {MODES.filter((item) => item !== mode).map((item) => (
              <button key={item} type="button" onClick={() => setMode(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <footer className="live-foot">
          <button type="button" onClick={() => setView('lex')}>
            Lexique
          </button>
          {ask ? (
            <button type="button" className="live-ask" onClick={() => setAsk(false)}>
              Installer ? <strong>Oui</strong>
            </button>
          ) : null}
        </footer>
      </div>
    )
  } else if (view === 'play') {
    body = (
      <div className="live is-play">
        <header className="live-top">
          <div className="live-modes" role="tablist" aria-label="Mode">
            {MODES.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={item === mode}
                className={item === mode ? 'is-on' : 'is-off'}
                onClick={() => {
                  setMode(item)
                  setOpen(null)
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="live-back"
            onClick={() => {
              setOpen(null)
              setView('home')
            }}
          >
            Accueil
          </button>
        </header>
        <div className="live-stage">
          {mode === 'Défier' ? (
            <p className="live-vs">
              <span>Alex</span>
              <i>vs</i>
              <span>Sam</span>
            </p>
          ) : null}
          <p className={`${heroClass(round)} live-round`}>{round}</p>
        </div>
        <div className="live-filters">
          {mode === 'Défier' ? (
            <>
              <FilterRow
                value={venue}
                options={VENUES}
                open={open === 'venue'}
                onOpen={() => toggle('venue')}
                onChange={(next) => {
                  setVenue(next)
                  setOpen('venue')
                }}
              />
              {venue === 'Même écran' ? (
                <FilterRow
                  value={format}
                  options={FORMATS}
                  open={open === 'format'}
                  onOpen={() => toggle('format')}
                  onChange={(next) => {
                    setFormat(next)
                    setOpen('format')
                  }}
                />
              ) : null}
            </>
          ) : (
            <>
              <FilterRow
                value={cat}
                options={CATS}
                open={open === 'cat'}
                onOpen={() => toggle('cat')}
                onChange={(next) => {
                  setCat(next)
                  setOpen('cat')
                }}
              />
              <FilterRow
                value={answer}
                options={ANSWERS}
                open={open === 'answer'}
                onOpen={() => toggle('answer')}
                onChange={(next) => {
                  setAnswer(next)
                  setOpen('answer')
                }}
              />
              <FilterRow
                value={level}
                options={LEVELS}
                open={open === 'level'}
                onOpen={() => toggle('level')}
                onChange={(next) => {
                  setLevel(next)
                  setOpen('level')
                }}
              />
            </>
          )}
        </div>
      </div>
    )
  } else if (view === 'lex') {
    body = (
      <div className="live is-play">
        <button type="button" className="live-back" onClick={() => setView('home')}>
          Accueil
        </button>
        <p className="live-hero is-mid">Lexique</p>
        <div className="live-filters">
          <FilterRow
            value={door}
            options={DOORS}
            open={open === 'door'}
            onOpen={() => toggle('door')}
            onChange={(next) => {
              setDoor(next)
              setOpen('door')
            }}
          />
          {door === 'Territoires' ? (
            <FilterRow
              value={country}
              options={COUNTRIES}
              open={open === 'country'}
              onOpen={() => toggle('country')}
              onChange={(next) => {
                setCountry(next)
                setOpen('country')
              }}
            />
          ) : null}
        </div>
      </div>
    )
  } else if (view === 'settings') {
    body = (
      <div className="live is-play">
        <button type="button" className="live-back" onClick={() => setView('home')}>
          Accueil
        </button>
        <p className="live-hero is-mid">Réglages</p>
        <div className="live-filters">
          <FilterRow
            value={night}
            options={NIGHTS}
            open={open === 'night'}
            onOpen={() => toggle('night')}
            onChange={(next) => {
              setNight(next)
              setOpen('night')
            }}
          />
          <FilterRow
            value={map}
            options={MAPS}
            open={open === 'map'}
            onOpen={() => toggle('map')}
            onChange={(next) => {
              setMap(next)
              setOpen('map')
            }}
          />
          <FilterRow
            value={sound}
            options={SOUNDS}
            open={open === 'sound'}
            onOpen={() => toggle('sound')}
            onChange={(next) => {
              setSound(next)
              setOpen('sound')
            }}
          />
        </div>
      </div>
    )
  } else if (view === 'profil') {
    body = (
      <div className="live is-index">
        <button type="button" className="live-back" onClick={() => setView('home')}>
          Accueil
        </button>
        <p className="live-hero">Profil</p>
        <div className="live-lines">
          {PROFIL.map(([title, meta]) => (
            <button
              key={title}
              type="button"
              onClick={() => {
                setLeaf({ title, meta })
                setView('leaf')
              }}
            >
              {title}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="live-edit"
          onClick={() => {
            setLeaf({ title: 'Alex', meta: 'Ton prénom' })
            setView('leaf')
          }}
        >
          Modifier le prénom
        </button>
      </div>
    )
  } else {
    body = (
      <div className="live is-play">
        <button type="button" className="live-back" onClick={() => setView('profil')}>
          Profil
        </button>
        <p className={heroClass(leaf?.title ?? '')}>{leaf?.title}</p>
        <p className="live-foot">{leaf?.meta}</p>
      </div>
    )
  }

  return (
    <div className="live-desk">
      <header className="sheet-colophon">
        <p className="sheet-kicker">B · Affiche</p>
        <h1>Tu restes sur la feuille.</h1>
        <p>Jouer lance la partie. Le carrousel change de mode. Un filtre s’ouvre à droite, en gris.</p>
      </header>
      <div className="live-phone">{body}</div>
    </div>
  )
}
