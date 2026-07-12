import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ksjPublicUrl } from '../config/ksjApi'

function ResultShell({ status, title, message, reference = '' }) {
  return (
    <main className="merch-page">
      <section className="merch-final-cta" aria-live="polite">
        <div>
          <span className="eyebrow">{status}</span>
          <h1>{title}</h1>
          <p>{message}</p>
          {reference && <p>Order reference: <strong>{reference}</strong></p>}
        </div>
        <div className="merch-final-actions">
          <Link className="btn primary" to="/track-order">Track an Order</Link>
          <Link className="btn ghost" to="/merch">Return to Merch</Link>
          <Link className="btn ghost" to="/contact">Contact Support</Link>
        </div>
      </section>
    </main>
  )
}

export function MerchCheckoutSuccess() {
  const params = new URLSearchParams(useLocation().search)
  const sessionId = params.get('session_id')
  const [state, setState] = useState(() =>
    sessionId
      ? {
          status: 'Processing Payment',
          title: 'Confirming Your Card Payment',
          message: 'Please keep this page open while Stripe confirms your order.',
          reference: sessionId,
        }
      : {
          status: 'Payment Error',
          title: 'Stripe Session Missing',
          message: 'The Stripe session reference was not returned. No additional payment attempt has been made.',
          reference: '',
        },
  )

  useEffect(() => {
    if (!sessionId) return undefined

    let cancelled = false

    fetch(ksjPublicUrl(`/checkout/stripe/sessions/${encodeURIComponent(sessionId)}/complete`), {
      method: 'POST',
    })
      .then(async response => {
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.error || 'Stripe confirmation failed')
        return data
      })
      .then(data => {
        if (cancelled) return
        setState({
          status: 'Payment Received',
          title: 'Thank You For Your Order',
          message: 'Your card payment was completed and your order confirmation is being sent by email. Use that order number to track your order.',
          reference: data.order?.orderNumber || sessionId,
        })
      })
      .catch(error => {
        if (cancelled) return
        setState({
          status: 'Payment Error',
          title: 'We Could Not Confirm The Card Order',
          message: `${error.message}. Please contact support before attempting another payment if your bank shows a charge.`,
          reference: sessionId,
        })
      })

    return () => {
      cancelled = true
    }
  }, [sessionId])

  return <ResultShell {...state} />
}

export function MerchCheckoutCancelled() {
  const params = new URLSearchParams(useLocation().search)
  const reservationId = params.get('reservation_id')

  useEffect(() => {
    if (!reservationId) return
    fetch(ksjPublicUrl(`/checkout/reservations/${encodeURIComponent(reservationId)}/release`), {
      method: 'POST',
    }).catch(() => {})
  }, [reservationId])

  return (
    <ResultShell
      status="Checkout Cancelled"
      title="No Payment Was Taken"
      message="The checkout was cancelled before completion. Any reserved stock has been released, and you can return to the merch page whenever you are ready."
    />
  )
}

export function PayPalCheckoutReturn() {
  const params = new URLSearchParams(useLocation().search)
  const token = params.get('token')
  const [state, setState] = useState(() =>
    token
      ? {
          status: 'Processing Payment',
          title: 'Confirming Your PayPal Order',
          message: 'Please keep this page open while PayPal confirms the payment.',
          reference: token,
        }
      : {
          status: 'Payment Error',
          title: 'PayPal Order Missing',
          message:
            'The PayPal order reference was not returned. No additional payment attempt has been made.',
          reference: '',
        },
  )

  useEffect(() => {
    if (!token) return undefined

    let cancelled = false

    fetch(ksjPublicUrl(`/checkout/paypal/orders/${encodeURIComponent(token)}/capture`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then(async response => {
        const data = await response.json().catch(() => null)
        if (!response.ok) throw new Error(data?.error || 'PayPal capture failed')
        return data
      })
      .then(data => {
        if (cancelled) return
        if (!data.completed) throw new Error('PayPal has not completed the payment')
        setState({
          status: 'Payment Received',
          title: 'Thank You For Your Order',
          message:
            'Your PayPal payment was completed and your order confirmation is being sent by email. Use that order number to track your order.',
          reference: data.order?.orderNumber || token,
        })
      })
      .catch(error => {
        if (cancelled) return
        setState({
          status: 'Payment Error',
          title: 'We Could Not Confirm The PayPal Order',
          message: `${error.message}. Please contact support before attempting another payment if PayPal shows a charge.`,
          reference: token,
        })
      })

    return () => {
      cancelled = true
    }
  }, [token])

  return <ResultShell {...state} />
}
