import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const STORAGE_KEY_PREFIX = 'twotonetaj_notice_dismissed'
const SUPPORT_EMAIL = 'support@ksjdigital.co.uk'

export default function FloatingNotice() {
  const { pathname } = useLocation()
  const storageKey = `${STORAGE_KEY_PREFIX}_${pathname}`

  const [isVisible, setIsVisible] = useState(() => {
    return sessionStorage.getItem(storageKey) !== 'true'
  })

  const dismissNotice = () => {
    sessionStorage.setItem(storageKey, 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside className="floating-notice" aria-label="Website development notice">
      <div className="floating-notice__icon" aria-hidden="true">
        <span>!</span>
      </div>

      <div className="floating-notice__content">
        <strong>🚧 Website In Development</strong>

        <p>
          TwoToneTaj is currently being built and improved by KSJ Digital.
        </p>

        <p>
          Some pages, features, and content may change as updates are made.
        </p>

        <p className="floating-notice__help">Need help?</p>

        <a
          className="floating-notice__email"
          href={`mailto:${SUPPORT_EMAIL}?subject=TwoToneTaj Website Support`}
        >
          📧 {SUPPORT_EMAIL}
        </a>
      </div>

      <button
        className="floating-notice__close"
        type="button"
        aria-label="Dismiss website notice"
        onClick={dismissNotice}
      >
        Close
      </button>
    </aside>
  )
}