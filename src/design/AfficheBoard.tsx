import { useEffect, useRef, useState, type ReactNode } from 'react'
import './AfficheBoard.css'

const MODES = ['Jouer', 'Apprendre', 'Défier'] as const
const CATS = ['Capitales', 'Pays', 'Territoires'] as const
const WORLD_ANSWERS = ['Par drapeau', 'Par nom', 'Carte'] as const
const TERR_ANSWERS = ['Par code', 'Par blason', 'Par chef-lieu', 'Carte'] as const
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

type MapData = { viewBox: string; paths: Record<string, string> }

let mapsPromise: Promise<{ world: MapData; fr: MapData }> | null = null

function loadMaps() {
  if (!mapsPromise) {
    mapsPromise = Promise.all([
      fetch('/maps/world-countries.json').then((r) => r.json()),
      fetch('/maps/territoires/fr.json').then((r) => r.json()),
    ]).then(([world, fr]) => ({ world: world as MapData, fr: fr as MapData }))
  }
  return mapsPromise
}

function pathBounds(d: string) {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? []
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i]!
    const y = nums[i + 1]!
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }
  const padX = (maxX - minX) * 0.08
  const padY = (maxY - minY) * 0.08
  return {
    minX: minX - padX,
    minY: minY - padY,
    width: maxX - minX + padX * 2,
    height: maxY - minY + padY * 2,
    x0: minX,
    y0: minY,
    w: maxX - minX,
    h: maxY - minY,
  }
}

function answersFor(cat: Cat) {
  return cat === 'Territoires' ? TERR_ANSWERS : WORLD_ANSWERS
}

function defaultAnswer(cat: Cat) {
  if (cat === 'Territoires') return 'Par code'
  if (cat === 'Pays') return 'Par drapeau'
  return 'Par nom'
}

function RoundFace({ cat, answer }: { cat: Cat; answer: string }) {
  const [maps, setMaps] = useState<{ world: MapData; fr: MapData } | null>(null)

  useEffect(() => {
    let alive = true
    loadMaps().then((data) => {
      if (alive) setMaps(data)
    })
    return () => {
      alive = false
    }
  }, [])

  if (answer === 'Par nom' && cat !== 'Territoires') {
    return <p className="live-hero live-round">Italie</p>
  }
  if (answer === 'Par drapeau') {
    return <img className="live-flag" src="/flags/it.svg" alt="Drapeau de l’Italie" />
  }
  if (answer === 'Par code') {
    return <p className="live-hero live-round">69</p>
  }
  if (answer === 'Par chef-lieu') {
    return <p className="live-hero live-round">Lyon</p>
  }
  if (answer === 'Par blason') {
    return <img className="live-blason" src="/blasons/69.png" alt="Blason du Rhône" />
  }
  if (!maps) return null

  if (cat === 'Territoires') {
    return (
      <svg className="live-map" viewBox={maps.fr.viewBox} role="img" aria-label="Carte des départements">
        {Object.entries(maps.fr.paths).map(([code, d]) => (
          <path key={code} d={d} className={code === '69' ? 'is-hot' : 'is-region'} />
        ))}
      </svg>
    )
  }

  const d = maps.world.paths.IT
  if (!d) return null
  const box = pathBounds(d)
  const cities = [
    [0.36, 0.2, false],
    [0.5, 0.18, false],
    [0.44, 0.36, false],
    [0.5, 0.48, true],
    [0.62, 0.56, false],
  ] as const
  return (
    <svg
      className="live-map"
      viewBox={`${box.minX} ${box.minY} ${box.width} ${box.height}`}
      role="img"
      aria-label={cat === 'Capitales' ? 'Carte et villes' : 'Carte de l’Italie'}
    >
      <path d={d} className={cat === 'Capitales' ? 'is-land' : 'is-country'} />
      {cat === 'Capitales'
        ? cities.map(([fx, fy, hot]) => (
            <circle
              key={`${fx}-${fy}`}
              cx={box.minX + box.width * fx}
              cy={box.minY + box.height * fy}
              r={(hot ? 0.028 : 0.016) * box.width}
              className={hot ? 'is-city' : 'is-dot'}
            />
          ))
        : null}
    </svg>
  )
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
  const scroller = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scroller.current?.scrollTo({ left: 0 })
  }, [value, open])
  return (
    <div className="live-row" ref={scroller}>
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
  const [answer, setAnswer] = useState('Par nom')
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
          <RoundFace cat={cat} answer={answer} />
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
                  setAnswer((current) =>
                    (answersFor(next) as readonly string[]).includes(current) ? current : defaultAnswer(next),
                  )
                  setOpen('cat')
                }}
              />
              <FilterRow
                value={answer}
                options={answersFor(cat)}
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
        <p>
          Jouer lance la partie. Pays et capitales : drapeau, nom, carte. Territoires : code, blason,
          chef-lieu, carte.
        </p>
      </header>
      <div className="live-phone">{body}</div>
    </div>
  )
}
