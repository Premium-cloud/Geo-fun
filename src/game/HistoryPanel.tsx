import { loadStats, type ModeStats } from '../lib/storage'
import './HistoryPanel.css'

const LABELS: Record<string, string> = {
  departements: 'Départements',
  pays: 'Pays',
  capitale: 'Capitales',
  chiffre: 'Par chiffre',
  chefLieu: 'Par chef-lieu',
  blason: 'Par blason',
  region: 'Par région',
  carte: 'Carte',
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
}

function label(part: string) {
  return LABELS[part] ?? part
}

type Row = {
  key: string
  category: string
  mode: string
  difficulty: string
  answerMode: string
  stats: ModeStats
}

export function HistoryPanel({ onClose }: { onClose: () => void }) {
  const stats = loadStats()
  const rows: Row[] = Object.entries(stats)
    .map(([key, s]) => {
      const [category, mode, difficulty, answerMode] = key.split('|')
      return {
        key,
        category: category ?? '',
        mode: mode ?? '',
        difficulty: difficulty ?? '',
        answerMode: answerMode ?? '',
        stats: s,
      }
    })
    .filter((r) => r.stats.plays > 0 || r.stats.bestStreak > 0)
    .sort((a, b) => b.stats.bestStreak - a.stats.bestStreak)

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
        <p className="hist-hint">Records locaux sur cet appareil (meilleures séries).</p>
        {rows.length === 0 ? (
          <p className="hist-empty">Aucune partie enregistrée pour l’instant.</p>
        ) : (
          <ul className="hist-list">
            {rows.map((r) => (
              <li key={r.key} className="hist-row">
                <div className="hist-main">
                  <strong>
                    {label(r.category)} · {label(r.mode)}
                  </strong>
                  <span>
                    {label(r.difficulty)} · {label(r.answerMode)}
                  </span>
                </div>
                <div className="hist-meta">
                  <span className="hist-streak">×{r.stats.bestStreak}</span>
                  <span>
                    {r.stats.plays} partie{r.stats.plays > 1 ? 's' : ''}
                    {r.stats.asked > 0
                      ? ` · ${Math.round((r.stats.correct / r.stats.asked) * 100)} %`
                      : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
