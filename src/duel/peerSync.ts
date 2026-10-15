import Peer, { type DataConnection } from 'peerjs'
import type { DuelConfig, DuelRound } from './types'

export type NetMsg =
  | { type: 'hello'; role: 'host' | 'guest'; name: string }
  /** Lobby : aperçu optionnel (ne lance pas la partie). */
  | { type: 'config'; config: DuelConfig; deck: DuelRound[] }
  | { type: 'ready' }
  /** Hôte → invité : un seul message atomique pour démarrer (évite 2 decks). */
  | { type: 'start'; config: DuelConfig; deck: DuelRound[] }
  | { type: 'answer'; roundId: string; player: 0 | 1; value: string; at: number }
  /** Host → guest : aligne le timer (ex. clamp 5 s). */
  | { type: 'clamp'; roundId: string; timeLeft: number }
  /**
   * Host → guest : fin de manche autoritaire.
   * `idx` = manche qui vient de finir ; `nextIdx` = suivante (ou === total ⇒ fin).
   */
  | {
      type: 'round-result'
      roundId: string
      idx: number
      scores: [number, number]
      combos: [number, number]
      nextIdx: number
    }
  /** Invité bloqué → demande l’état à l’hôte. */
  | { type: 'sync-req' }
  /** Hôte → invité : resync d’urgence. */
  | {
      type: 'sync'
      idx: number
      roundId: string
      scores: [number, number]
      combos: [number, number]
      timeLeft: number
      over: boolean
    }
  | { type: 'ping' }

export function createHostPeer(): Promise<{ peer: Peer; id: string }> {
  return new Promise((resolve, reject) => {
    const peer = new Peer()
    const t = window.setTimeout(() => reject(new Error('Peer timeout')), 12000)
    peer.on('open', (id) => {
      window.clearTimeout(t)
      resolve({ peer, id })
    })
    peer.on('error', (err) => {
      window.clearTimeout(t)
      reject(err)
    })
  })
}

export function connectToHost(
  hostId: string,
): Promise<{ peer: Peer; conn: DataConnection }> {
  return new Promise((resolve, reject) => {
    const peer = new Peer()
    const t = window.setTimeout(() => reject(new Error('Connexion timeout')), 15000)
    peer.on('open', () => {
      const conn = peer.connect(hostId, { reliable: true })
      conn.on('open', () => {
        window.clearTimeout(t)
        resolve({ peer, conn })
      })
      conn.on('error', (err) => {
        window.clearTimeout(t)
        reject(err)
      })
    })
    peer.on('error', (err) => {
      window.clearTimeout(t)
      reject(err)
    })
  })
}

export function send(conn: DataConnection | null, msg: NetMsg) {
  if (conn?.open) conn.send(msg)
}

export function duelInviteUrl(hostId: string): string {
  const u = new URL(window.location.href)
  u.searchParams.set('duel', hostId)
  return u.toString()
}

export function readDuelInviteParam(): string | null {
  const u = new URL(window.location.href)
  return u.searchParams.get('duel')
}

export function clearDuelInviteParam() {
  const u = new URL(window.location.href)
  if (!u.searchParams.has('duel')) return
  u.searchParams.delete('duel')
  window.history.replaceState({}, '', u.pathname + u.search + u.hash)
}
