import { useState } from 'react'

const SITE_ID = import.meta.env.VITE_KSJ_SITE_ID || 'twotonetaj'
const API_BASE = import.meta.env.VITE_KSJ_PUBLIC_API_URL || 'https://ksjdigital.co.uk/api'
const STATUS_STEPS = ['New', 'Processing', 'Awaiting Stock', 'Dispatched', 'Delivered']

function money(value, currency = 'GBP') {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(Number(value || 0))
}

function statusIndex(status) {
  if (status === 'Cancelled' || status === 'Refunded') return -1
  return STATUS_STEPS.indexOf(status)
}

export default function TrackOrder() {
  const [form, setForm] = useState({ orderNumber: '', email: '' })
  const [order, setOrder] = useState(null)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setNotice('')
    setOrder(null)

    try {
      const response = await fetch(`${API_BASE}/public/orders/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: SITE_ID,
          orderNumber: form.orderNumber,
          email: form.email,
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || 'Unable to find that order.')
      setOrder(data)
    } catch (error) {
      setNotice(error.message || 'Unable to find that order.')
    } finally {
      setLoading(false)
    }
  }

  const currentStep = order ? statusIndex(order.fulfilmentStatus) : -1

  return (
    <main className="order-track-page">
      <section className="order-track-hero">
        <span className="eyebrow">Order Updates</span>
        <h1>Track Your Order</h1>
        <p>Enter the order number from your confirmation email and the email address used at checkout.</p>
      </section>

      <section className="order-track-panel">
        <form className="order-track-form" onSubmit={submit}>
          <label>
            <span>Order Number</span>
            <input
              autoComplete="off"
              value={form.orderNumber}
              onChange={event => setForm(current => ({ ...current, orderNumber: event.target.value.toUpperCase() }))}
              placeholder="TAJ-HOODIE-2026-000001"
              required
            />
          </label>
          <label>
            <span>Checkout Email</span>
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={event => setForm(current => ({ ...current, email: event.target.value }))}
              placeholder="you@example.com"
              required
            />
          </label>
          <button type="submit" disabled={loading}>{loading ? 'Checking…' : 'Find My Order'}</button>
        </form>
        {notice && <p className="order-track-error">{notice}</p>}
      </section>

      {order && (
        <section className="order-track-result">
          <div className="order-track-head">
            <div>
              <span className="eyebrow">Verified Order</span>
              <h2>{order.orderNumber}</h2>
              <p>{order.paymentStatus} · {order.fulfilmentStatus}</p>
            </div>
            <strong>{money(order.total, order.currency)}</strong>
          </div>

          {currentStep >= 0 ? (
            <div className="order-track-timeline" aria-label="Order progress">
              {STATUS_STEPS.map((step, index) => (
                <div className={index <= currentStep ? 'complete' : ''} key={step}>
                  <i>{index < currentStep ? '✓' : index + 1}</i>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="order-track-alert">This order is {order.fulfilmentStatus.toLowerCase()}.</p>
          )}

          <div className="order-track-grid">
            <div>
              <h3>Items</h3>
              {order.items.map((item, index) => (
                <article key={`${item.name}-${index}`}>
                  <strong>{item.quantity} × {item.name}</strong>
                  <small>{[item.variant?.size, item.variant?.colour].filter(Boolean).join(' · ') || 'Standard item'}</small>
                  {item.madeToOrder && <p>* {item.leadTimeMessage || 'This item is made to order.'}</p>}
                </article>
              ))}
            </div>

            <div>
              <h3>Delivery</h3>
              <p>{order.shippingMethod || 'Delivery details will be confirmed separately.'}</p>
              {order.tracking?.number ? (
                <>
                  <p><strong>{order.tracking.courier}</strong><br />{order.tracking.number}</p>
                  {order.tracking.dispatchedAt && <small>Dispatched {new Date(order.tracking.dispatchedAt).toLocaleString('en-GB')}</small>}
                  {order.tracking.url && <a href={order.tracking.url} target="_blank" rel="noreferrer">Track Parcel</a>}
                </>
              ) : (
                <small>Tracking details will appear here after dispatch.</small>
              )}
            </div>
          </div>

          <div className="order-track-actions">
            <a href={`${API_BASE.replace(/\/$/, '')}${order.invoiceUrl.replace('/api', '')}`} target="_blank" rel="noreferrer">Open Invoice</a>
            <button type="button" onClick={() => { setOrder(null); setNotice('') }}>Check Another Order</button>
          </div>
          <small className="order-track-expiry">For security, the invoice link expires after 15 minutes. Verify the order again to create a new link.</small>
        </section>
      )}
    </main>
  )
}
