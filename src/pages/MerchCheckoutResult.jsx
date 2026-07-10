import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_KSJ_PUBLIC_API_URL || 'https://ksjdigital.co.uk/api'

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
          <Link className="btn primary" to="/merch">Return to Merch</Link>
          <Link className="btn ghost" to="/contact">Contact Support</Link>
        </div>
      </section>
    </main>
  )
}

export function MerchCheckoutSuccess() {
  const params = new URLSearchParams(useLocation().search)
  const sessionId = params.get('session_id')

  return (
    <ResultShell
      status="Payment Received"
      title="Thank You For Your Order"
      message="Your payment was completed. Your order confirmation will be sent by email once KSJ Digital finishes processing the verified payment event."
      reference={sessionId || ''}
    />
  )
}

export function MerchCheckoutCancelled() {
  return (
    <ResultShell
      status="Checkout Cancelled"
      title="No Payment Was Taken"
      message="The checkout was cancelled before completion. You can return to the merch page whenever you are ready."
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

    fetch(`${API_BASE}/checkout/paypal/orders/${encodeURIComponent(token)}/capture`, {
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
            'Your PayPal payment was completed and your order confirmation is being sent by email.',
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
