import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { DataConnection } from 'peerjs'
import { answersMatch } from '../lib/answerMatch'
import { DuelPrompt } from './DuelPrompt'
import { makeDuelDeck } from './makeRound'
import {
  clearDuelInviteParam,
  connectToHost,
  createHostPeer,
  duelInviteUrl,
  readDuelInviteParam,
  send,
  type NetMsg,
} from './peerSync'
import {
  DEFAULT_DUEL_CONFIG,
  DUEL_CATEGORY_LABEL,
  SPLIT_WIDE_WIDTH,
  type DuelAnswerMode,
  type DuelCategory,
  type DuelConfig,
  type DuelRound,
  type DuelVenue,
} from './types'
import './DuelView.css'

type Phase = 'setup' | 'lobby' | 'play' | 'over'

const PLAYER = ['Joueur 1', 'Joueur 2'] as const

function useWideEnough() {
  const [ok, setOk] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= SPLIT_WIDE_WIDTH,
  )
  useEffect(() => {
    const onResize = () => setOk(window.innerWidth >= SPLIT_WIDE_WIDTH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return ok
}

function checkAnswer(value: string, round: DuelRound, mode: DuelAnswerMode) {
  if (mode === 'qcm') return value === round.answer
  return answersMatch(value, round.answer, 'loose')
}

function roundPromptKey(round: DuelRound) {
  return `${round.kind}|${round.show}|${round.showValue ?? ''}|${round.showCode ?? ''}|${round.answer}`
}

function shuffleChoices(list: string[]): string[] {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function DuelView() {
  const wide = useWideEnough()
  const [phase, setPhase] = useState<Phase>('setup')
  const [config, setConfig] = useState<DuelConfig>(DEFAULT_DUEL_CONFIG)
  const [deck, setDeck] = useState<DuelRound[]>([])
  const [idx, setIdx] = useState(0)
  const [scores, setScores] = useState<[number, number]>([0, 0])
  const [combos, setCombos] = useState<[number, number]>([0, 0])
  const [overTitle, setOverTitle] = useState('Fin du duel')
  const [status, setStatus] = useState('')
  const [inviteId, setInviteId] = useState<string | null>(null)
  const [inviteUrl, setInviteUrl] = useState('')
  const [isHost, setIsHost] = useState(true)
  const [peerReady, setPeerReady] = useState(false)
  const peerRef = useRef<import('peerjs').default | null>(null)
  const connRef = useRef<DataConnection | null>(null)

  // Auto-join si ?duel=
  useEffect(() => {
    const id = readDuelInviteParam()
    if (!id) return
    void joinOnline(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      peerRef.current?.destroy()
    }
  }, [])

  const round = deck[idx] ?? null

  function patchConfig(partial: Partial<DuelConfig>) {
    setConfig((c) => {
      const next = { ...c, ...partial }
      // Téléphone : Split miroir → QCM plus confortable au tactile
      if (partial.localFormat === 'split' && !wide) next.answerMode = 'qcm'
      return next
    })
  }

  async function hostOnline() {
    setStatus('Création du salon…')
    setIsHost(true)
    try {
      const { peer, id } = await createHostPeer()
      peerRef.current = peer
      setInviteId(id)
      setInviteUrl(duelInviteUrl(id))
      setPhase('lobby')
      setStatus('En attente d’un adversaire…')
      peer.on('connection', (conn) => {
        connRef.current = conn
        conn.on('open', () => {
          setPeerReady(true)
          setStatus('Adversaire connecté — lance la partie')
          const nextDeck = makeDuelDeck(config.category, config.answerMode, config.rounds)
          setDeck(nextDeck)
          send(conn, { type: 'config', config, deck: nextDeck })
        })
        conn.on('data', (raw) => onNet(raw as NetMsg))
      })
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Erreur réseau')
    }
  }

  async function joinOnline(hostId: string) {
    setStatus('Connexion…')
    setIsHost(false)
    setConfig((c) => ({ ...c, venue: 'online' }))
    setPhase('lobby')
    try {
      const { peer, conn } = await connectToHost(hostId.trim())
      peerRef.current = peer
      connRef.current = conn
      setPeerReady(true)
      setStatus('Connecté — en attente du début…')
      clearDuelInviteParam()
      conn.on('data', (raw) => onNet(raw as NetMsg))
      send(conn, { type: 'hello', role: 'guest', name: 'Joueur 2' })
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Connexion impossible')
    }
  }

  function onNet(msg: NetMsg) {
    if (msg.type === 'config') {
      setConfig(msg.config)
      setDeck(msg.deck)
      setStatus('Partie reçue — prêt')
    }
    if (msg.type === 'start') {
      setIdx(0)
      setScores([0, 0])
      setCombos([0, 0])
      setOverTitle('Fin du duel')
      setPhase('play')
    }
  }

  function startLocal() {
    const nextDeck = makeDuelDeck(config.category, config.answerMode, config.rounds)
    setDeck(nextDeck)
    setIdx(0)
    setScores([0, 0])
    setCombos([0, 0])
    setOverTitle('Fin du duel')
    setPhase('play')
  }

  function startOnlineHost() {
    if (!connRef.current || !deck.length) {
      const nextDeck = makeDuelDeck(config.category, config.answerMode, config.rounds)
      setDeck(nextDeck)
      send(connRef.current, { type: 'config', config, deck: nextDeck })
    }
    send(connRef.current, { type: 'start' })
    setIdx(0)
    setScores([0, 0])
    setCombos([0, 0])
    setOverTitle('Fin du duel')
    setPhase('play')
  }

  function finish(title = 'Fin du duel') {
    setOverTitle(title)
    setPhase('over')
  }

  function addScore(player: 0 | 1, pts: number) {
    setScores((s) => {
      const next: [number, number] = [...s]
      next[player] += pts
      return next
    })
  }

  function bumpCombo(player: 0 | 1, ok: boolean) {
    setCombos((c) => {
      const next: [number, number] = [...c]
      next[player] = ok ? next[player] + 1 : 0
      return next
    })
  }

  if (phase === 'setup') {
    return (
      <div className="duel-view">
        <header className="duel-head">
          <h2>Duel</h2>
        </header>

        <section className="duel-setup">
          <div className="duel-field">
            <span className="duel-label">Lieu</span>
            <div className="duel-chips">
              {(
                [
                  ['local', 'Même écran'],
                  ['online', 'En ligne'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`duel-chip ${config.venue === id ? 'is-active' : ''}`}
                  onClick={() => patchConfig({ venue: id satisfies DuelVenue })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {config.venue === 'local' ? (
            <div className="duel-field">
              <span className="duel-label">Format</span>
              <div className="duel-chips">
                <button
                  type="button"
                  className={`duel-chip ${config.localFormat === 'battleroyal' ? 'is-active' : ''}`}
                  onClick={() => patchConfig({ localFormat: 'battleroyal' })}
                >
                  Battle royale
                </button>
                <button
                  type="button"
                  className={`duel-chip ${config.localFormat === 'tours' ? 'is-active' : ''}`}
                  onClick={() => patchConfig({ localFormat: 'tours' })}
                >
                  Chacun son tour
                </button>
                <button
                  type="button"
                  className={`duel-chip ${config.localFormat === 'split' ? 'is-active' : ''}`}
                  onClick={() => patchConfig({ localFormat: 'split' })}
                >
                  Split{wide ? '' : ' (téléphone)'}
                </button>
              </div>
              <p className="duel-hint">
                {config.localFormat === 'battleroyal'
                  ? 'Premier qui se trompe a perdu. Bonne réponse → ça passe à l’autre.'
                  : config.localFormat === 'tours'
                    ? 'Chacun sa question (pas la même). 1 point si correct.'
                    : wide
                      ? 'Course simultanée — 1 pt par bonne réponse. PC : J1 = 1–2–3–4, J2 = A–Z–E–R. Timer → 5 s dès qu’un trouve.'
                      : 'Téléphone au milieu : moitié d’écran chacun, J2 en haut (miroir). 1 pt par bonne réponse.'}
              </p>
            </div>
          ) : (
            <p className="duel-hint">
              Course en ligne : lien d’invitation, 1 pt par bonne réponse. Timer → 5 s dès qu’un
              trouve.
            </p>
          )}

          <div className="duel-field">
            <span className="duel-label">Catégorie</span>
            <div className="duel-chips">
              {(Object.keys(DUEL_CATEGORY_LABEL) as DuelCategory[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`duel-chip ${config.category === id ? 'is-active' : ''}`}
                  onClick={() => patchConfig({ category: id })}
                >
                  {DUEL_CATEGORY_LABEL[id]}
                </button>
              ))}
            </div>
            <p className="duel-hint">
              {config.category === 'departements' && 'Numéro → département'}
              {config.category === 'pays' && 'Drapeau → pays'}
              {config.category === 'capitale' && 'Pays → capitale'}
              {config.category === 'mixte' && 'Les 3 types'}
            </p>
          </div>

          <div className="duel-field">
            <span className="duel-label">Réponse</span>
            <div className="duel-chips">
              {(
                [
                  ['qcm', 'QCM'],
                  ['saisie', 'Réponse unique'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`duel-chip ${config.answerMode === id ? 'is-active' : ''}`}
                  onClick={() =>
                    patchConfig({ answerMode: id satisfies DuelAnswerMode })
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="duel-actions">
            {config.venue === 'local' ? (
              <button type="button" className="duel-btn-primary" onClick={startLocal}>
                Lancer le duel
              </button>
            ) : (
              <>
                <button type="button" className="duel-btn-primary" onClick={() => void hostOnline()}>
                  Créer un salon
                </button>
                <JoinForm onJoin={(id) => void joinOnline(id)} />
              </>
            )}
          </div>
          {status ? <p className="duel-status">{status}</p> : null}
        </section>
      </div>
    )
  }

  if (phase === 'lobby') {
    return (
      <div className="duel-view">
        <header className="duel-head">
          <button
            type="button"
            className="duel-back"
            onClick={() => {
              peerRef.current?.destroy()
              peerRef.current = null
              connRef.current = null
              setPhase('setup')
              setStatus('')
            }}
          >
            ← Retour
          </button>
          <h2>Salon en ligne</h2>
        </header>
        <div className="duel-lobby">
          {isHost && inviteUrl ? (
            <>
              <p className="duel-hint">Envoie ce lien à l’autre joueur :</p>
              <code className="duel-invite">{inviteUrl}</code>
              <button
                type="button"
                className="duel-chip"
                onClick={() => void navigator.clipboard?.writeText(inviteUrl)}
              >
                Copier le lien
              </button>
            </>
          ) : null}
          <p className="duel-status">{status}</p>
          {isHost ? (
            <button
              type="button"
              className="duel-btn-primary"
              disabled={!peerReady}
              onClick={startOnlineHost}
            >
              Démarrer
            </button>
          ) : (
            <p className="duel-hint">L’hôte lance la partie…</p>
          )}
          {inviteId ? <p className="duel-meta">ID salon : {inviteId}</p> : null}
        </div>
      </div>
    )
  }

  if (phase === 'over') {
    const [a, b] = scores
    const isBattle =
      overTitle.includes('💥') || overTitle.toLowerCase().includes('battle')
    const winner = isBattle
      ? overTitle
      : a === b
        ? 'Égalité !'
        : a > b
          ? `${PLAYER[0]} gagne`
          : `${PLAYER[1]} gagne`
    return (
      <div className="duel-view">
        <div className="duel-over">
          <h2>{isBattle ? 'Battle royale' : 'Fin du duel'}</h2>
          <p className="duel-over-winner">{winner}</p>
          {!isBattle ? (
            <div className="duel-scoreboard">
              <div className="duel-score-pill is-p0">
                <span className="duel-score-name">{PLAYER[0]}</span>
                <span className="duel-score-pts">{a}</span>
              </div>
              <div className="duel-score-pill is-p1">
                <span className="duel-score-name">{PLAYER[1]}</span>
                <span className="duel-score-pts">{b}</span>
              </div>
            </div>
          ) : null}
          <div className="duel-actions">
            <button type="button" className="duel-btn-primary" onClick={() => setPhase('setup')}>
              Nouveau duel
            </button>
            <button type="button" className="duel-chip" onClick={() => setPhase('setup')}>
              Quitter
            </button>
          </div>
        </div>
      </div>
    )
  }

  // play — modes autonomes d’abord (pas besoin du deck parent)
  if (config.venue === 'local' && config.localFormat === 'battleroyal') {
    return (
      <BattleRoyalePlay
        config={config}
        category={config.category}
        onOver={finish}
        onQuit={() => setPhase('setup')}
      />
    )
  }

  if (config.venue === 'local' && config.localFormat === 'tours') {
    return (
      <TurnsPlay
        config={config}
        scores={scores}
        combos={combos}
        onScore={(p, pts) => addScore(p, pts)}
        onCombo={bumpCombo}
        onOver={finish}
        onQuit={() => setPhase('setup')}
      />
    )
  }

  if (!round) {
    finish()
    return null
  }

  if (config.venue === 'online') {
    return (
      <RacePlay
        key={round.id}
        label="En ligne"
        me={isHost ? 0 : 1}
        round={round}
        config={config}
        scores={scores}
        combos={combos}
        idx={idx}
        total={deck.length}
        online
        conn={connRef.current}
        onScore={(p, pts) => addScore(p, pts)}
        onCombo={bumpCombo}
        onApplyState={(next) => {
          setScores(next.scores)
          setCombos(next.combos)
        }}
        onNext={() => {
          if (idx + 1 >= deck.length) finish()
          else setIdx((i) => i + 1)
        }}
        onGoToIdx={(nextIdx) => {
          if (nextIdx >= deck.length) finish()
          else setIdx(nextIdx)
        }}
        onQuit={() => setPhase('setup')}
      />
    )
  }

  // split
  return (
    <RacePlay
      key={round.id}
      label="Split"
      me={null}
      round={round}
      config={config}
      scores={scores}
      combos={combos}
      idx={idx}
      total={deck.length}
      online={false}
      split
      mirror={!wide}
      conn={null}
      onScore={(p, pts) => addScore(p, pts)}
      onCombo={bumpCombo}
      onNext={() => {
        if (idx + 1 >= deck.length) finish()
        else setIdx((i) => i + 1)
      }}
      onQuit={() => setPhase('setup')}
    />
  )
}

function JoinForm({ onJoin }: { onJoin: (id: string) => void }) {
  const [val, setVal] = useState('')
  return (
    <form
      className="duel-join"
      onSubmit={(e) => {
        e.preventDefault()
        const raw = val.trim()
        if (!raw) return
        try {
          const u = new URL(raw)
          const id = u.searchParams.get('duel') || raw
          onJoin(id)
        } catch {
          onJoin(raw)
        }
      }}
    >
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Colle le lien ou l’ID du salon"
        aria-label="Lien ou ID duel"
      />
      <button type="submit" className="duel-chip">
        Rejoindre
      </button>
    </form>
  )
}

/* ——— BATTLE ROYALE ——— */
/** PV secrets : drain invisible, premier faux (ou timeout) = défaite du porteur. */
function rollBattleHp() {
  return 8 + Math.floor(Math.random() * 13) // 8–20 s
}

function BattleRoyalePlay({
  config,
  category,
  onOver,
  onQuit,
}: {
  config: DuelConfig
  category: DuelConfig['category']
  onOver: (title?: string) => void
  onQuit: () => void
}) {
  const [holder, setHolder] = useState<0 | 1>(0)
  const [round, setRound] = useState(() =>
    makeDuelDeck(category, config.answerMode, 1)[0]!,
  )
  const [hpMax, setHpMax] = useState(rollBattleHp)
  const [hp, setHp] = useState(hpMax)
  const [flash, setFlash] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const dead = useRef(false)

  useEffect(() => {
    if (flash || dead.current) return
    const t = window.setInterval(() => {
      setHp((h) => {
        if (h <= 1) {
          window.clearInterval(t)
          return 0
        }
        return h - 1
      })
    }, 1000)
    return () => window.clearInterval(t)
  }, [round.id, holder, flash])

  useEffect(() => {
    if (hp !== 0 || dead.current || flash) return
    dead.current = true
    const victim = holder
    const winner = (1 - victim) as 0 | 1
    setFlash(`💥 ${PLAYER[victim]} éliminé`)
    window.setTimeout(() => {
      onOver(`💥 ${PLAYER[winner]} gagne — ${PLAYER[victim]} éliminé`)
    }, 1100)
  }, [hp, holder, flash, onOver])

  function passTurn() {
    const next = (1 - holder) as 0 | 1
    const nextHp = rollBattleHp()
    setFlash(`✓ Passe à ${PLAYER[next]}`)
    window.setTimeout(() => {
      setFlash(null)
      setHolder(next)
      setRound(makeDuelDeck(category, config.answerMode, 1)[0]!)
      setHpMax(nextHp)
      setHp(nextHp)
      setInput('')
    }, 700)
  }

  function submit(value: string) {
    if (flash || dead.current || hp <= 0) return
    const ok = checkAnswer(value, round, config.answerMode)
    if (ok) passTurn()
    else setHp(0)
  }

  const heat = 1 - hp / Math.max(1, hpMax)

  return (
    <div
      className={`duel-view duel-bomb is-p${holder} ${heat > 0.66 ? 'is-hot' : heat > 0.33 ? 'is-warm' : ''}`}
    >
      <header className="duel-head">
        <button type="button" className="duel-back" onClick={onQuit}>
          ← Quitter
        </button>
        <h2>Battle royale</h2>
        <p className="duel-scoreline duel-bomb-rule">Premier faux = perdu</p>
      </header>

      <div className={`duel-bomb-card is-p${holder}`}>
        <p className={`duel-bomb-holder is-p${holder}`}>
          À {PLAYER[holder]}
          <span className="duel-fuse" aria-hidden="true">
            ●
          </span>
        </p>
        {flash ? <p className="duel-flash">{flash}</p> : <DuelPrompt round={round} />}
        {!flash ? (
          <AnswerBlock
            round={round}
            mode={config.answerMode}
            input={input}
            setInput={setInput}
            onPick={submit}
          />
        ) : null}
      </div>
    </div>
  )
}

function Scoreboard({
  scores,
  combos,
  timeLeft,
}: {
  scores: [number, number]
  combos: [number, number]
  timeLeft?: number
}) {
  return (
    <div className="duel-scoreboard">
      {([0, 1] as const).map((p) => (
        <div key={p} className={`duel-score-pill is-p${p}`}>
          <span className="duel-score-name">{PLAYER[p]}</span>
          <span className="duel-score-pts">{scores[p]}</span>
          {combos[p] > 1 ? <span className="duel-combo">×{combos[p]}</span> : null}
        </div>
      ))}
      {timeLeft != null ? <span className="duel-timer">⏱ {timeLeft}s</span> : null}
    </div>
  )
}

/* ——— COURSE (split / online) ——— */
function RacePlay({
  label,
  me,
  round,
  config,
  scores,
  combos,
  idx,
  total,
  online,
  split,
  mirror,
  conn,
  onScore,
  onCombo,
  onApplyState,
  onNext,
  onGoToIdx,
  onQuit,
}: {
  label: string
  me: 0 | 1 | null
  round: DuelRound
  config: DuelConfig
  scores: [number, number]
  combos: [number, number]
  idx: number
  total: number
  online: boolean
  split?: boolean
  /** Téléphone : deux moitiés, J2 en haut retourné à 180°. */
  mirror?: boolean
  conn: DataConnection | null
  onScore: (p: 0 | 1, pts: number) => void
  onCombo: (p: 0 | 1, ok: boolean) => void
  onApplyState?: (next: { scores: [number, number]; combos: [number, number] }) => void
  onNext: () => void
  onGoToIdx?: (nextIdx: number) => void
  onQuit: () => void
}) {
  const isHost = !online || me === 0
  const [timeLeft, setTimeLeft] = useState(config.timerSec)
  const [locked, setLocked] = useState<[boolean, boolean]>([false, false])
  const [correctAt, setCorrectAt] = useState<[number | null, number | null]>([
    null,
    null,
  ])
  const [inputs, setInputs] = useState<[string, string]>(['', ''])
  const ended = useRef(false)
  const scored = useRef(false)
  const lockedRef = useRef(locked)
  const correctRef = useRef(correctAt)
  const scoresRef = useRef(scores)
  const combosRef = useRef(combos)
  lockedRef.current = locked
  correctRef.current = correctAt
  scoresRef.current = scores
  combosRef.current = combos

  function clampTimer() {
    setTimeLeft((t) => (t > 5 ? 5 : t))
    if (online && isHost) {
      send(conn, { type: 'clamp', roundId: round.id, timeLeft: 5 })
    }
  }

  function markAnswer(player: 0 | 1, value: string, at: number) {
    if (ended.current || lockedRef.current[player]) return
    const ok = checkAnswer(value, round, config.answerMode)
    const nextLocked: [boolean, boolean] = [...lockedRef.current]
    nextLocked[player] = true
    lockedRef.current = nextLocked
    setLocked(nextLocked)
    if (ok) {
      const nextCorrect: [number | null, number | null] = [...correctRef.current]
      nextCorrect[player] = at
      correctRef.current = nextCorrect
      setCorrectAt(nextCorrect)
      clampTimer()
    }
    // En ligne : seul l’hôte clôt la manche
    if (nextLocked[0] && nextLocked[1] && isHost) endRound()
  }

  useEffect(() => {
    if (!conn) return
    const handler = (raw: unknown) => {
      const msg = raw as NetMsg
      if (msg.type === 'answer' && msg.roundId === round.id) {
        markAnswer(msg.player, msg.value, msg.at)
      }
      if (msg.type === 'clamp' && msg.roundId === round.id && !isHost) {
        setTimeLeft((t) => (t > msg.timeLeft ? msg.timeLeft : t))
      }
      if (msg.type === 'round-result' && msg.roundId === round.id && !isHost) {
        if (ended.current) return
        ended.current = true
        scored.current = true
        onApplyState?.({ scores: msg.scores, combos: msg.combos })
        window.setTimeout(() => {
          onGoToIdx?.(msg.nextIdx)
        }, 900)
      }
    }
    conn.on('data', handler)
    return () => {
      conn.off('data', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conn, round.id, isHost])

  useEffect(() => {
    ended.current = false
    scored.current = false
    setTimeLeft(config.timerSec)
    setLocked([false, false])
    setCorrectAt([null, null])
    lockedRef.current = [false, false]
    correctRef.current = [null, null]
    setInputs(['', ''])
  }, [round.id, config.timerSec])

  // Timer : l’hôte (ou split local) décide la fin ; le guest affiche seulement
  useEffect(() => {
    if (ended.current) return
    const t = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t)
          if (isHost) endRound()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id, isHost])

  function tryAnswer(player: 0 | 1, value: string) {
    if (ended.current || lockedRef.current[player]) return
    if (online && me !== null && player !== me) return
    const at = Date.now()
    markAnswer(player, value, at)
    if (online) {
      send(conn, { type: 'answer', roundId: round.id, player, value, at })
    }
  }

  /** Split : ordres QCM différents pour que « 1 » ne soit pas la même réponse. */
  const choiceOrders = useMemo((): [string[], string[]] => {
    if (!split || config.answerMode !== 'qcm' || round.choices.length < 2) {
      return [round.choices, round.choices]
    }
    const a = shuffleChoices(round.choices)
    let b = shuffleChoices(round.choices)
    for (let i = 0; i < 12 && a.join('\0') === b.join('\0'); i++) {
      b = shuffleChoices(round.choices)
    }
    return [a, b]
  }, [split, config.answerMode, round.id, round.choices])

  // Split PC (pas miroir) : J1 = 1–2–3–4, J2 = A–Z–E–R (QCM)
  useEffect(() => {
    if (!split || mirror || config.answerMode !== 'qcm') return
    const j1 = ['1', '2', '3', '4']
    const j2 = ['a', 'z', 'e', 'r']
    const onKey = (e: KeyboardEvent) => {
      if (ended.current) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const key = e.key.toLowerCase()
      let player: 0 | 1 | null = null
      let choiceIdx = -1
      if (j1.includes(key)) {
        player = 0
        choiceIdx = j1.indexOf(key)
      } else if (j2.includes(key)) {
        player = 1
        choiceIdx = j2.indexOf(key)
      }
      if (player == null || choiceIdx < 0) return
      const choice = choiceOrders[player][choiceIdx]
      if (!choice) return
      e.preventDefault()
      tryAnswer(player, choice)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [split, mirror, round.id, config.answerMode, choiceOrders])

  function endRound() {
    if (ended.current) return
    // Guest online : n’avance jamais tout seul
    if (online && !isHost) return
    ended.current = true

    let nextScores: [number, number] = [...scoresRef.current]
    let nextCombos: [number, number] = [...combosRef.current]

    if (!scored.current) {
      scored.current = true
      const times = correctRef.current
      ;([0, 1] as const).forEach((p) => {
        if (times[p] != null) {
          nextScores[p] += 1
          onScore(p, 1)
        }
      })
      nextCombos = [
        times[0] != null ? nextCombos[0] + 1 : 0,
        times[1] != null ? nextCombos[1] + 1 : 0,
      ]
      onCombo(0, times[0] != null)
      onCombo(1, times[1] != null)
    }

    const nextIdx = idx + 1
    if (online && isHost) {
      send(conn, {
        type: 'round-result',
        roundId: round.id,
        scores: nextScores,
        combos: nextCombos,
        nextIdx,
      })
    }

    window.setTimeout(() => {
      if (online && onGoToIdx) onGoToIdx(nextIdx)
      else onNext()
    }, 900)
  }

  const showKeys = Boolean(split && !mirror && config.answerMode === 'qcm')

  const panel = (player: 0 | 1) => {
    const mine = online ? me === player : true
    const disabled = !mine || locked[player] || ended.current
    const keys = player === 0 ? (['1', '2', '3', '4'] as const) : (['A', 'Z', 'E', 'R'] as const)
    return (
      <div
        className={`duel-race-panel is-p${player} ${locked[player] ? 'is-done' : ''} ${correctAt[player] != null ? 'is-ok' : locked[player] ? 'is-ko' : ''}`}
      >
        <p className={`duel-race-name is-p${player}`}>
          {PLAYER[player]}
          {online && me === player ? ' (toi)' : ''}
          {combos[player] > 1 ? (
            <span className="duel-combo"> ×{combos[player]}</span>
          ) : null}
          {showKeys ? <span className="duel-keys-hint"> {keys.join(' ')}</span> : null}
        </p>
        {mine ? (
          <AnswerBlock
            round={round}
            mode={config.answerMode}
            choices={split ? choiceOrders[player] : undefined}
            input={inputs[player]}
            setInput={(v) =>
              setInputs((prev) => {
                const n: [string, string] = [...prev]
                n[player] = v
                return n
              })
            }
            onPick={(v) => tryAnswer(player, v)}
            disabled={disabled}
            keyLabels={showKeys ? [...keys] : undefined}
          />
        ) : (
          <p className="duel-hint">
            {locked[player]
              ? correctAt[player] != null
                ? 'A trouvé !'
                : 'A répondu'
              : 'En train de jouer…'}
          </p>
        )}
      </div>
    )
  }

  if (split && mirror) {
    return (
      <div className="duel-view duel-race is-split is-mirror">
        <section className="duel-mirror-half is-p1 is-flipped" aria-label="Joueur 2">
          <div className="duel-mirror-inner">
            <p className="duel-mirror-meta">
              {idx + 1}/{total}
            </p>
            <DuelPrompt round={round} />
            {panel(1)}
          </div>
        </section>
        <div className="duel-mirror-bar">
          <button type="button" className="duel-back" onClick={onQuit}>
            Quitter
          </button>
          <Scoreboard scores={scores} combos={combos} timeLeft={timeLeft} />
        </div>
        <section className="duel-mirror-half is-p0" aria-label="Joueur 1">
          <div className="duel-mirror-inner">
            <p className="duel-mirror-meta">
              {idx + 1}/{total}
            </p>
            <DuelPrompt round={round} />
            {panel(0)}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={`duel-view duel-race ${split ? 'is-split' : 'is-online'}`}>
      <header className="duel-head">
        <button type="button" className="duel-back" onClick={onQuit}>
          ← Quitter
        </button>
        <h2>
          {label} · {idx + 1}/{total}
        </h2>
      </header>
      <Scoreboard scores={scores} combos={combos} timeLeft={timeLeft} />
      <DuelPrompt round={round} />
      <div className={`duel-race-grid ${split ? 'cols-2' : 'cols-1'}`}>
        {split ? (
          <>
            {panel(0)}
            {panel(1)}
          </>
        ) : (
          panel(me ?? 0)
        )}
      </div>
    </div>
  )
}

/* ——— CHACUN SON TOUR (question différente par joueur) ——— */
function TurnsPlay({
  config,
  scores,
  combos,
  onScore,
  onCombo,
  onOver,
  onQuit,
}: {
  config: DuelConfig
  scores: [number, number]
  combos: [number, number]
  onScore: (p: 0 | 1, pts: number) => void
  onCombo: (p: 0 | 1, ok: boolean) => void
  onOver: () => void
  onQuit: () => void
}) {
  const [manche, setManche] = useState(0)
  const [turn, setTurn] = useState<0 | 1>(0)
  const [round, setRound] = useState(() =>
    makeDuelDeck(config.category, config.answerMode, 1)[0]!,
  )
  const [timeLeft, setTimeLeft] = useState(config.timerSec)
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const results = useRef<[boolean | null, boolean | null]>([null, null])
  const lastPromptKey = useRef(roundPromptKey(round))

  function freshRound(): DuelRound {
    for (let i = 0; i < 16; i++) {
      const next = makeDuelDeck(config.category, config.answerMode, 1)[0]!
      const key = roundPromptKey(next)
      if (key !== lastPromptKey.current) {
        lastPromptKey.current = key
        return next
      }
    }
    const next = makeDuelDeck(config.category, config.answerMode, 1)[0]!
    lastPromptKey.current = roundPromptKey(next)
    return next
  }

  useEffect(() => {
    if (msg) return
    const t = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t)
          resolveTurn(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id, turn, msg])

  function resolveTurn(ok: boolean) {
    results.current[turn] = ok
    onCombo(turn, ok)
    setMsg(ok ? `✓ ${PLAYER[turn]}` : `✗ ${PLAYER[turn]}`)
    window.setTimeout(() => {
      setMsg(null)
      if (turn === 0) {
        // Nouvelle question pour J2 — pas la même
        setTurn(1)
        setRound(freshRound())
        setTimeLeft(config.timerSec)
        setInput('')
      } else {
        const [a, b] = results.current
        if (a) onScore(0, 1)
        if (b) onScore(1, 1)
        results.current = [null, null]
        if (manche + 1 >= config.rounds) {
          onOver()
        } else {
          setManche((m) => m + 1)
          setTurn(0)
          setRound(freshRound())
          setTimeLeft(config.timerSec)
          setInput('')
        }
      }
    }, 800)
  }

  function submit(value: string) {
    if (msg) return
    resolveTurn(checkAnswer(value, round, config.answerMode))
  }

  return (
    <div className={`duel-view duel-turns is-turn-${turn}`}>
      <header className="duel-head">
        <button type="button" className="duel-back" onClick={onQuit}>
          ← Quitter
        </button>
        <h2>
          Tours · {manche + 1}/{config.rounds}
        </h2>
      </header>
      <Scoreboard scores={scores} combos={combos} timeLeft={timeLeft} />
      <p className={`duel-turn-banner is-p${turn}`}>Tour de {PLAYER[turn]}</p>
      {msg ? <p className="duel-flash">{msg}</p> : <DuelPrompt round={round} />}
      {!msg ? (
        <AnswerBlock
          round={round}
          mode={config.answerMode}
          input={input}
          setInput={setInput}
          onPick={submit}
        />
      ) : null}
    </div>
  )
}

function AnswerBlock({
  round,
  mode,
  choices,
  input,
  setInput,
  onPick,
  disabled,
  keyLabels,
}: {
  round: DuelRound
  mode: DuelAnswerMode
  /** Ordre d’affichage QCM (ex. shuffle par joueur en split). */
  choices?: string[]
  input: string
  setInput: (v: string) => void
  onPick: (v: string) => void
  disabled?: boolean
  keyLabels?: string[]
}) {
  if (mode === 'qcm') {
    const list = choices ?? round.choices
    return (
      <div className="duel-choices">
        {list.map((c, i) => (
          <button
            key={c}
            type="button"
            className="duel-choice"
            disabled={disabled}
            onClick={() => onPick(c)}
          >
            <span className="duel-choice-n">{keyLabels?.[i] ?? i + 1}</span>
            {c}
          </button>
        ))}
      </div>
    )
  }
  return (
    <form
      className="duel-saisie"
      onSubmit={(e: FormEvent) => {
        e.preventDefault()
        if (!input.trim() || disabled) return
        onPick(input.trim())
      }}
    >
      <input
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ta réponse…"
        autoComplete="off"
      />
      <button type="submit" className="duel-btn-primary" disabled={disabled}>
        OK
      </button>
    </form>
  )
}
