import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const STORAGE_KEY = 'ksjMerchDiscountCode'

function normalise(value = '') {
  return String(value).toUpperCase().replace(/[^A-Z0-9_-]/g, '').slice(0, 24)
}

export default function MerchDiscountCode() {
  const { pathname } = useLocation()
  const [draft, setDraft] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [applied, setApplied] = useState(() => localStorage.getItem(STORAGE_KEY) || '')

  useEffect(() => {
    function addCodeToCheckout(event) {
      const link = event.target.closest('a[href]')
      if (!link || !applied) return
      const href = link.getAttribute('href') || ''
      if (!href.includes('/api/checkout/')) return

      try {
        const url = new URL(link.href, window.location.origin)
        url.searchParams.set('discountCode', applied)
        link.href = url.toString()
      } catch {
        // Leave malformed or external links untouched.
      }
    }

    document.addEventListener('click', addCodeToCheckout, true)
    return () => document.removeEventListener('click', addCodeToCheckout, true)
  }, [applied])

  if (pathname !== '/merch') return null

  function applyCode(event) {
    event.preventDefault()
    const code = normalise(draft)
    setDraft(code)
    setApplied(code)
    if (code) localStorage.setItem(STORAGE_KEY, code)
    else localStorage.removeItem(STORAGE_KEY)
  }

  function clearCode() {
    setDraft('')
    setApplied('')
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <aside className="merch-discount-bar" aria-label="Discount code">
      <form onSubmit={applyCode}>
        <label htmlFor="merch-discount-code">Discount code</label>
        <div>
          <input
            id="merch-discount-code"
            value={draft}
            onChange={event => setDraft(normalise(event.target.value))}
            placeholder="Enter code"
            autoComplete="off"
          />
          <button type="submit">Apply</button>
          {applied && <button type="button" onClick={clearCode}>Remove</button>}
        </div>
        <small>
          {applied
            ? `Code ${applied} will be validated during secure checkout.`
            : 'The discount is confirmed by the payment server before payment.'}
        </small>
      </form>
    </aside>
  )
}
