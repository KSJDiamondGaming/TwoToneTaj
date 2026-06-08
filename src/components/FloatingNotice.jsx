import { useEffect, useState } from 'react'

const STORAGE_KEY = 'twotonetaj_notice_dismissed'

export default function FloatingNotice() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasDismissed = sessionStorage.getItem(STORAGE_KEY)

    if (!hasDismissed) {
      setIsVisible(true)
    }
  }, [])

  const dismissNotice = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside className="floating-notice" aria-label="Website development notice">
      <div className="floating-notice__icon" aria-hidden="true">
        <span>!</span>
      </div>

      <div className="floating-notice__content">
        <strong>Website In Development</strong>
        <p>
          TwoToneTaj is currently under active development. Pages, features, and
          content may change as improvements are made.
        </p>
        <a href="mailto:media@ksjdigital.co.uk">media@ksjdigital.co.uk</a>
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
