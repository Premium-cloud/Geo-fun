import { useState } from 'react'
import {
  loadDuelHistory,
  loadStats,
  type DuelHistoryEntry,
  type ModeStats,
  type SessionFormatId,
} from '../lib/storage'
import { DUEL_CATEGORY_LABEL } from '../duel/types'
import './HistoryPanel.css'

const LABELS: Record<string, string> = {
  departements: 'Départements',
  pays: 'Pays',
  capitale: 'Capitales',
  territoires: 'Territoires',
  mixte: 'MIX',
  chiffre: 'Par chiffre',
  chefLieu: 'Par chef-lieu',
  blason: 'Par blason',
  region: 'Par région',
  carte: 'Carte',
  mixte_mode: 'Drapeau / capitale / chiffre',
  flagToName: 'Drapeau → nom',
  nameToFlag: 'Nom → drapeau',
  capitalToName: 'Capitale → pays',
  capitalToFlag: 'Capitale → drapeau',
  flagToCapital: 'Drapeau → capitale',
  nameToCapital: 'Nom → capitale',
  code: 'Par code',
  capital: 'Par capitale',
  emblem: 'Par blason',
  facile: 'Facile',
  difficile: 'Difficile',
  hardcore: 'Hardcore',
  qcm: 'QCM',
  saisie: 'Saisie',
  map: 'Carte',
  libre: 'Libre',
  session10: '10 questions',
  rapidite: 'Rapidité',
  local: 'Même écran',
  online: 'En ligne',
  battleroyal: 'Battle royale',
  tours: 'Chacun son tour',
  split: 'Split',
  race: 'Course',
}

function label(part: string) {
  return LABELS[part] ?? part
}

function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return m > 0 ? `${m} min ${s.toString().padStart(2, '0')} s` : `${s} s`
}

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

type Row = {
  key: string
  category: string
  mode: string
  difficulty: string
  answerMode: string
  format: SessionFormatId
  stats: ModeStats
}

function parseKey(key: string): Omit<Row, 'stats' | 'key'> {
  const parts = key.split('|')
  const [category, mode, difficulty, answerMode, format] = parts
  return {
    category: category ?? '',
    mode: mode ?? '',
    difficulty: difficulty ?? '',
    answerMode: answerMode ?? '',
    format: (format as SessionFormatId) || 'libre',
  }
}

type HistTab = 'quiz' | 'duels'

function QuizHistory() {
  const stats = loadStats()
  const rows: Row[] = Object.entries(stats)
    .map(([key, s]) => ({
      key,
      ...parseKey(key),
      stats: s,
    }))
    .filter((r) => r.stats.plays > 0 || r.stats.bestStreak > 0)
    .sort((a, b) => {
      const pa = a.stats.asked > 0 ? a.stats.correct / a.stats.asked : 0
      const pb = b.stats.asked > 0 ? b.stats.correct / b.stats.asked : 0
      if (pb !== pa) return pb - pa
      return b.stats.bestStreak - a.stats.bestStreak
    })

  const byCat = new Map<string, Row[]>()
  for (const r of rows) {
    const list = byCat.get(r.category) ?? []
    list.push(r)
    byCat.set(r.category, list)
  }

  if (rows.length === 0) {
    return <p className="hist-empty">Aucune partie quiz</p>
  }

  return (
    <div className="hist-groups">
      {[...byCat.entries()].map(([cat, list]) => (
        <section key={cat} className="hist-group">
          <h3 className="hist-group-title">{label(cat)}</h3>
          <ul className="hist-list">
            {list.map((r) => {
              const pct =
                r.stats.asked > 0
                  ? Math.round((r.stats.correct / r.stats.asked) * 100)
                  : 0
              const modeLabel =
                r.category === 'mixte' || r.mode === 'mixte'
                  ? 'Drapeau / capitale / chiffre'
                  : label(r.mode)
              return (
                <li key={r.key} className="hist-row">
                  <div className="hist-main">
                    <strong>{modeLabel}</strong>
                    <div className="hist-badges">
                      <span className={`hist-badge is-${r.difficulty}`}>
                        {label(r.difficulty)}
                      </span>
                      <span className="hist-badge">{label(r.answerMode)}</span>
                      {r.format !== 'libre' ? (
                        <span className="hist-badge is-format">
                          {label(r.format)}
                        </span>
                      ) : null}
                    </div>
                    <span className="hist-plays">
                      {r.stats.plays} partie{r.stats.plays > 1 ? 's' : ''}
                      {r.stats.bestStreak > 0
                        ? ` · série ×${r.stats.bestStreak}`
                        : ''}
                      {r.stats.bestTimeMs != null
                        ? ` · ${formatDuration(r.stats.bestTimeMs)}`
                        : ''}
                    </span>
                  </div>
                  <div className="hist-meta">
                    <span className="hist-pct">{pct}%</span>
                    <div className="hist-bar" aria-hidden>
                      <i style={{ width: `${pct}%` }} />
                    </div>
                    <span className="hist-best">record {r.stats.bestScore}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

function duelCategoryLabel(cat: string): string {
  if (cat in DUEL_CATEGORY_LABEL) {
    return DUEL_CATEGORY_LABEL[cat as keyof typeof DUEL_CATEGORY_LABEL]
  }
  return label(cat)
}

function DuelHistoryList({ entries }: { entries: DuelHistoryEntry[] }) {
  if (entries.length === 0) {
    return <p className="hist-empty">Aucun duel enregistré</p>
  }

  return (
    <ul className="hist-list hist-duel-list">
      {entries.map((e) => {
        const result =
          e.winner == null
            ? 'Égalité'
            : `${e.names[e.winner]} gagne`
        return (
          <li key={e.id} className="hist-row hist-duel-row">
            <div className="hist-main">
              <strong>{result}</strong>
              <div className="hist-badges">
                <span className="hist-badge">{label(e.venue)}</span>
                <span className="hist-badge">{label(e.format)}</span>
                <span className="hist-badge is-format">{duelCategoryLabel(e.category)}</span>
              </div>
              <span className="hist-plays">
                {e.names[0]} {e.scores[0]} – {e.scores[1]} {e.names[1]}
                {' · '}
                {formatWhen(e.at)}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function HistoryPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<HistTab>('quiz')
  const duels = loadDuelHistory()

  return (
    <div className="hist-overlay" role="presentation" onClick={onClose}>
      <div
        className="hist-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hist-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="hist-head">
          <h2 id="hist-title">Historique</h2>
          <button type="button" className="hist-close" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>

        <div className="hist-tabs" role="tablist" aria-label="Type d’historique">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'quiz'}
            className={`hist-tab ${tab === 'quiz' ? 'is-active' : ''}`}
            onClick={() => setTab('quiz')}
          >
            Quiz
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'duels'}
            className={`hist-tab ${tab === 'duels' ? 'is-active' : ''}`}
            onClick={() => setTab('duels')}
          >
            Duels{duels.length > 0 ? ` (${duels.length})` : ''}
          </button>
        </div>

        {tab === 'quiz' ? <QuizHistory /> : <DuelHistoryList entries={duels} />}
      </div>
    </div>
  )
}
