import { useEffect, useRef, useState, type FormEvent } from 'react'
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
  SPLIT_MIN_WIDTH,
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
    () => typeof window !== 'undefined' && window.innerWidth >= SPLIT_MIN_WIDTH,
  )
  useEffect(() => {
    const onResize = () => setOk(window.innerWidth >= SPLIT_MIN_WIDTH)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return ok
}

function checkAnswer(value: string, round: DuelRound, mode: DuelAnswerMode) {
  if (mode === 'qcm') return value === round.answer
  return answersMatch(value, round.answer, 'loose')
}

export function DuelView({ onBack }: { onBack: () => void }) {
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
      if (partial.localFormat === 'split' && !wide) next.localFormat = 'bombe'
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
          <button type="button" className="duel-back" onClick={onBack}>
            ← Retour
          </button>
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
                  className={`duel-chip ${config.localFormat === 'bombe' ? 'is-active' : ''}`}
                  onClick={() => patchConfig({ localFormat: 'bombe' })}
                >
                  Bombe
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
                  className={`duel-chip ${config.localFormat === 'split' ? 'is-active' : ''} ${!wide ? 'is-disabled' : ''}`}
                  disabled={!wide}
                  title={!wide ? `Écran trop étroit (< ${SPLIT_MIN_WIDTH}px)` : undefined}
                  onClick={() => patchConfig({ localFormat: 'split' })}
                >
                  Split{!wide ? ' (tablette/PC)' : ''}
                </button>
              </div>
              <p className="duel-hint">
                {config.localFormat === 'bombe'
                  ? 'Patate chaude : la bombe chauffe en secret. Bonne réponse → ça passe. Explosion = tu perds.'
                  : config.localFormat === 'tours'
                    ? 'Même question, J1 puis J2. 1 point si correct.'
                    : 'Course simultanée. 1er juste = 2 pts, 2ᵉ = 1 pt. Timer → 5 s dès qu’un trouve.'}
              </p>
            </div>
          ) : (
            <p className="duel-hint">
              Course en ligne : lien d’invitation, 1er juste = 2 pts, 2ᵉ = 1 pt. Timer → 5 s dès
              qu’un trouve.
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
    const isBomb = overTitle.includes('💥') || overTitle.toLowerCase().includes('bombe')
    const winner = isBomb
      ? overTitle
      : a === b
        ? 'Égalité !'
        : a > b
          ? `${PLAYER[0]} gagne`
          : `${PLAYER[1]} gagne`
    return (
      <div className="duel-view">
        <div className="duel-over">
          <h2>{isBomb ? 'Bombe' : 'Fin du duel'}</h2>
          <p className="duel-over-winner">{winner}</p>
          {!isBomb ? (
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
            <button type="button" className="duel-chip" onClick={onBack}>
              Quitter
            </button>
          </div>
        </div>
      </div>
    )
  }

  // play
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
        onNext={() => {
          if (idx + 1 >= deck.length) finish()
          else setIdx((i) => i + 1)
        }}
        onQuit={onBack}
      />
    )
  }

  if (config.localFormat === 'bombe') {
    return (
      <BombPlay
        config={config}
        category={config.category}
        onOver={finish}
        onQuit={onBack}
      />
    )
  }

  if (config.localFormat === 'split') {
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
        conn={null}
        onScore={(p, pts) => addScore(p, pts)}
        onCombo={bumpCombo}
        onNext={() => {
          if (idx + 1 >= deck.length) finish()
          else setIdx((i) => i + 1)
        }}
        onQuit={onBack}
      />
    )
  }

  return (
    <TurnsPlay
      key={round.id}
      round={round}
      config={config}
      scores={scores}
      combos={combos}
      idx={idx}
      total={deck.length}
      onScore={(p, pts) => addScore(p, pts)}
      onCombo={bumpCombo}
      onNext={() => {
        if (idx + 1 >= deck.length) finish()
        else setIdx((i) => i + 1)
      }}
      onQuit={onBack}
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

/* ——— BOMBE ——— */
/** PV secrets : drain invisible, explosion = défaite du porteur. */
function rollBombHp() {
  return 8 + Math.floor(Math.random() * 13) // 8–20 s
}

function BombPlay({
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
  const [hpMax, setHpMax] = useState(rollBombHp)
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
    setFlash(`💥 ${PLAYER[victim]} — bombe !`)
    window.setTimeout(() => {
      onOver(`💥 ${PLAYER[winner]} gagne — ${PLAYER[victim]} a explosé`)
    }, 1100)
  }, [hp, holder, flash, onOver])

  function passBomb() {
    const next = (1 - holder) as 0 | 1
    const nextHp = rollBombHp()
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
    if (ok) passBomb()
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
        <h2>Bombe</h2>
        <p className="duel-scoreline duel-bomb-rule">Explosion = tu perds</p>
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
  conn,
  onScore,
  onCombo,
  onNext,
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
  conn: DataConnection | null
  onScore: (p: 0 | 1, pts: number) => void
  onCombo: (p: 0 | 1, ok: boolean) => void
  onNext: () => void
  onQuit: () => void
}) {
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
  lockedRef.current = locked
  correctRef.current = correctAt

  function clampTimer() {
    setTimeLeft((t) => (t > 5 ? 5 : t))
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
    if (nextLocked[0] && nextLocked[1]) endRound()
  }

  useEffect(() => {
    if (!conn) return
    const handler = (raw: unknown) => {
      const msg = raw as NetMsg
      if (msg.type === 'answer' && msg.roundId === round.id) {
        markAnswer(msg.player, msg.value, msg.at)
      }
      if (msg.type === 'round-end' && msg.roundId === round.id) {
        endRound()
      }
    }
    conn.on('data', handler)
    return () => {
      conn.off('data', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conn, round.id])

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

  useEffect(() => {
    if (ended.current) return
    const t = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t)
          endRound()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round.id])

  function tryAnswer(player: 0 | 1, value: string) {
    if (ended.current || lockedRef.current[player]) return
    if (online && me !== null && player !== me) return
    const at = Date.now()
    markAnswer(player, value, at)
    if (online) {
      send(conn, { type: 'answer', roundId: round.id, player, value, at })
    }
  }

  function endRound() {
    if (ended.current) return
    ended.current = true
    if (online && me === 0) send(conn, { type: 'round-end', roundId: round.id })
    if (!scored.current) {
      scored.current = true
      const times = correctRef.current
      const valid = times
        .map((t, i) => (t != null ? { i: i as 0 | 1, t } : null))
        .filter(Boolean) as { i: 0 | 1; t: number }[]
      valid.sort((x, y) => x.t - y.t)
      if (valid.length === 1) onScore(valid[0]!.i, 2)
      else if (valid.length >= 2) {
        onScore(valid[0]!.i, 2)
        onScore(valid[1]!.i, 1)
      }
      onCombo(0, times[0] != null)
      onCombo(1, times[1] != null)
    }
    window.setTimeout(onNext, 900)
  }

  const panel = (player: 0 | 1) => {
    const mine = online ? me === player : true
    const disabled = !mine || locked[player] || ended.current
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
        </p>
        {mine ? (
          <AnswerBlock
            round={round}
            mode={config.answerMode}
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

/* ——— CHACUN SON TOUR ——— */
function TurnsPlay({
  round,
  config,
  scores,
  combos,
  idx,
  total,
  onScore,
  onCombo,
  onNext,
  onQuit,
}: {
  round: DuelRound
  config: DuelConfig
  scores: [number, number]
  combos: [number, number]
  idx: number
  total: number
  onScore: (p: 0 | 1, pts: number) => void
  onCombo: (p: 0 | 1, ok: boolean) => void
  onNext: () => void
  onQuit: () => void
}) {
  const [turn, setTurn] = useState<0 | 1>(0)
  const [timeLeft, setTimeLeft] = useState(config.timerSec)
  const [input, setInput] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const results = useRef<[boolean | null, boolean | null]>([null, null])

  useEffect(() => {
    setTurn(0)
    setTimeLeft(config.timerSec)
    setInput('')
    setMsg(null)
    results.current = [null, null]
  }, [round.id, config.timerSec])

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
        setTurn(1)
        setTimeLeft(config.timerSec)
        setInput('')
      } else {
        const [a, b] = results.current
        if (a) onScore(0, 1)
        if (b) onScore(1, 1)
        onNext()
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
          Tours · {idx + 1}/{total}
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
  input,
  setInput,
  onPick,
  disabled,
}: {
  round: DuelRound
  mode: DuelAnswerMode
  input: string
  setInput: (v: string) => void
  onPick: (v: string) => void
  disabled?: boolean
}) {
  if (mode === 'qcm') {
    return (
      <div className="duel-choices">
        {round.choices.map((c, i) => (
          <button
            key={c}
            type="button"
            className="duel-choice"
            disabled={disabled}
            onClick={() => onPick(c)}
          >
            <span className="duel-choice-n">{i + 1}</span>
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
