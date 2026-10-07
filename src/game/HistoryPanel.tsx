import { loadStats, type ModeStats, type SessionFormatId } from '../lib/storage'
import './HistoryPanel.css'

const LABELS: Record<string, string> = {
  departements: 'Départements',
  pays: 'Pays',
  capitale: 'Capitales',
  mixte: 'Mixte',
  chiffre: 'Par chiffre',
  chefLieu: 'Par chef-lieu',
  blason: 'Par blason',
  region: 'Par région',
  carte: 'Carte',
  mixte_mode: 'Aléatoire',
  flagToName: 'Drapeau → nom',
  nameToFlag: 'Nom → drapeau',
  capitalToName: 'Capitale → pays',
  capitalToFlag: 'Capitale → drapeau',
  flagToCapital: 'Drapeau → capitale',
  nameToCapital: 'Nom → capitale',
  facile: 'Facile',
  difficile: 'Difficile',
  hardcore: 'Hardcore',
  qcm: 'QCM',
  saisie: 'Saisie',
  map: 'Carte',
  libre: 'Libre',
  session10: '10 questions',
  rapidite: 'Rapidité',
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

export function HistoryPanel({ onClose }: { onClose: () => void }) {
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
        <p className="hist-hint">
          Meilleurs scores et séries sur cet appareil, classés par réussite.
        </p>
        {rows.length === 0 ? (
          <p className="hist-empty">Aucune partie enregistrée pour l’instant.</p>
        ) : (
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
                        ? 'Aléatoire'
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
                          <span className="hist-best">
                            record {r.stats.bestScore}
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
