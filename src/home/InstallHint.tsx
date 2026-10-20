import { useEffect, useState } from 'react'
import './InstallHint.css'

const DISMISS_KEY = 'cartes.installHint.v2'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return true
  const mq = window.matchMedia('(display-mode: standalone)').matches
  const ios =
    'standalone' in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return mq || ios
}

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function isMobile(): boolean {
  if (typeof navigator === 'undefined') return false
  if (isIos()) return true
  return /Android|Mobile/i.test(navigator.userAgent)
}

export function InstallHint() {
  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === '1' || isStandalone()
    } catch {
      return isStandalone()
    }
  })
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [ios, setIos] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [swReady, setSwReady] = useState(false)

  useEffect(() => {
    if (isStandalone()) {
      setHidden(true)
      return
    }
    setIos(isIos())
    setMobile(isMobile())

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBip)

    let cancelled = false
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.ready.then((reg) => {
        if (!cancelled) setSwReady(Boolean(reg.active))
      })
    }

    return () => {
      cancelled = true
      window.removeEventListener('beforeinstallprompt', onBip)
    }
  }, [])

  if (hidden) return null
  // Mobile, ou desktop dès qu’Android/Chrome propose l’install
  if (!mobile && !deferred) return null

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
    setHidden(true)
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    try {
      await deferred.userChoice
    } catch {
      /* ignore */
    }
    setDeferred(null)
    dismiss()
  }

  const copy = ios
    ? 'Safari → Partager → Sur l’écran d’accueil. Ouvre une fois en ligne, puis tu peux jouer en mode avion.'
    : deferred
      ? 'Installe GeoFun pour l’avoir comme une app, puis ouvre-la une fois en ligne pour le hors-ligne.'
      : 'Menu du navigateur → Installer l’application (ou Ajouter à l’écran d’accueil).'

  return (
    <aside className="install-hint" aria-label="Installer l’app">
      <div className="install-hint-copy">
        <strong>Sur l’écran d’accueil</strong>
        <span>{copy}</span>
        {swReady ? (
          <em className="install-hint-sw">Cache prêt — hors-ligne OK après install</em>
        ) : (
          <em className="install-hint-sw">Laisse charger une fois en Wi‑Fi…</em>
        )}
      </div>
      <div className="install-hint-actions">
        {deferred ? (
          <button type="button" className="install-hint-btn" onClick={() => void install()}>
            Installer
          </button>
        ) : null}
        <button type="button" className="install-hint-dismiss" onClick={dismiss}>
          OK
        </button>
      </div>
    </aside>
  )
}
