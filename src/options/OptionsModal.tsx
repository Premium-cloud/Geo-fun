import { useEffect, useRef, useState } from 'react'
import {
  applyNightClass,
  clearAllData,
  exportSave,
  importSave,
  loadOptions,
  saveOptions,
  type OptionsState,
} from '../lib/storage'
import './OptionsModal.css'

type Props = {
  open: boolean
  onClose: () => void
  onOptionsChange?: (o: OptionsState) => void
}

export function OptionsModal({ open, onClose, onOptionsChange }: Props) {
  const [options, setOptions] = useState<OptionsState>(() => loadOptions())
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setOptions(loadOptions())
      setMsg(null)
    }
  }, [open])

  function patch(partial: Partial<OptionsState>) {
    const next = { ...options, ...partial }
    setOptions(next)
    saveOptions(next)
    applyNightClass(next.night)
    onOptionsChange?.(next)
  }

  function downloadExport() {
    const blob = new Blob([exportSave()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cartes-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Sauvegarde téléchargée.')
  }

  function onImportFile(file: File | null) {
    if (!file) return
    file.text().then((raw) => {
      const res = importSave(raw)
      if (!res.ok) {
        setMsg(res.error)
        return
      }
      const o = loadOptions()
      setOptions(o)
      applyNightClass(o.night)
      onOptionsChange?.(o)
      setMsg('Données importées.')
    })
  }

  function wipe() {
    if (!confirm('Supprimer toutes les données locales (scores, options) ?')) return
    clearAllData()
    const o = loadOptions()
    setOptions(o)
    applyNightClass(o.night)
    onOptionsChange?.(o)
    setMsg('Données effacées.')
  }

  if (!open) return null

  return (
    <div className="opt-overlay" role="presentation" onClick={onClose}>
      <div
        className="opt-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="opt-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="opt-head">
          <h2 id="opt-title">Options</h2>
          <button type="button" className="opt-close" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </header>

        <section className="opt-section">
          <h3>Affichage</h3>
          <label className="opt-row">
            <span>Mode nuit</span>
            <input
              type="checkbox"
              checked={options.night}
              onChange={(e) => patch({ night: e.target.checked })}
            />
          </label>
        </section>

        <section className="opt-section">
          <h3>Mode Carte</h3>
          <label className="opt-row">
            <span>Inclure les DOM-TOM</span>
            <input
              type="checkbox"
              checked={options.mapDomTom}
              onChange={(e) => patch({ mapDomTom: e.target.checked })}
            />
          </label>
          <p className="opt-hint">
            Silhouettes sans nom ni code (révélés après réponse). Sinon métropole
            seulement.
          </p>
        </section>

        <section className="opt-section">
          <h3>Audio</h3>
          <label className="opt-row">
            <span>Son</span>
            <input
              type="checkbox"
              checked={options.sound}
              onChange={(e) => patch({ sound: e.target.checked })}
            />
          </label>
          <label className="opt-row opt-row-col">
            <span>Volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              disabled={!options.sound}
              value={options.volume}
              onChange={(e) => patch({ volume: Number(e.target.value) })}
            />
          </label>
        </section>

        <section className="opt-section opt-section-data">
          <h3>Données</h3>
          <p className="opt-hint">
            Scores et options sont stockés sur cet appareil. Import / export pour
            sauvegarder ou changer de téléphone.
          </p>
          <div className="opt-data-actions">
            <button type="button" className="opt-btn" onClick={wipe}>
              Supprimer les données
            </button>
            <button type="button" className="opt-btn opt-btn-quiet" onClick={downloadExport}>
              Exporter…
            </button>
            <button
              type="button"
              className="opt-btn opt-btn-quiet"
              onClick={() => fileRef.current?.click()}
            >
              Importer…
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="opt-file"
              onChange={(e) => onImportFile(e.target.files?.[0] ?? null)}
            />
          </div>
          {msg ? <p className="opt-msg">{msg}</p> : null}
        </section>
      </div>
    </div>
  )
}
