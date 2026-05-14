import { useEffect, useState } from 'react'
import { DownloadSimple, Export, X } from '@phosphor-icons/react'

// `beforeinstallprompt` isn't in the standard DOM lib types yet.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'pwa-install-dismissed'

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari exposes this non-standard flag instead of display-mode
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIOS(): boolean {
  const ua = navigator.userAgent
  // iPadOS 13+ reports as Mac — disambiguate via touch support
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
  )
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOS, setShowIOS] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === '1',
  )

  useEffect(() => {
    if (dismissed || isStandalone()) return

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)

    const onInstalled = () => setDeferred(null)
    window.addEventListener('appinstalled', onInstalled)

    // iOS has no beforeinstallprompt — offer manual instructions instead
    if (isIOS()) setShowIOS(true)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [dismissed])

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  const install = async () => {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
  }

  if (dismissed || (!deferred && !showIOS)) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-card border border-border bg-bg-card px-4 py-3 shadow-lg shadow-black/40">
        <DownloadSimple size={24} weight="bold" className="shrink-0 text-accent" />

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-display text-sm font-semibold text-text-primary">
            Instalar PokéVault
          </span>
          {deferred ? (
            <span className="font-mono text-[11px] text-text-muted">
              Adicione à tela inicial para abrir como app.
            </span>
          ) : (
            <span className="flex items-center gap-1 font-mono text-[11px] text-text-muted">
              Toque em
              <Export size={13} weight="bold" className="inline shrink-0" />
              Compartilhar e em "Adicionar à Tela de Início".
            </span>
          )}
        </div>

        {deferred && (
          <button
            type="button"
            onClick={install}
            className="flex h-9 shrink-0 items-center rounded-pill bg-accent px-4 font-display text-sm font-semibold text-text-primary active:scale-[0.97]"
          >
            Instalar
          </button>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dispensar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-border text-text-muted active:scale-[0.97]"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    </div>
  )
}
