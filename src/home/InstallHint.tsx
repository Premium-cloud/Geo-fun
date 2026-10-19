import { useEffect, useState } from 'react'
import './InstallHint.css'

const DISMISS_KEY = 'cartes.installHint.v1'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return true
  const mq = window.matchMedia('(display-mode: standalone)').matches
  const ios = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return mq || ios
}

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const webkit = /WebKit/.test(ua)
  const chrome = /CriOS|FxiOS|EdgiOS/.test(ua)
  return iOS && webkit && !chrome
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

  useEffect(() => {
    if (isStandalone()) {
      setHidden(true)
      return
    }
    setIos(isIosSafari())

    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  if (hidden) return null
  if (!ios && !deferred) return null

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

  return (
    <aside className="install-hint" aria-label="Installer l’app">
      <div className="install-hint-copy">
        <strong>Sur l’écran d’accueil</strong>
        <span>
          {ios
            ? 'Safari → Partager → Sur l’écran d’accueil. Puis ouvre une fois en ligne pour le hors-ligne.'
            : 'Installe GeoFun pour jouer hors ligne après un premier chargement.'}
        </span>
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
