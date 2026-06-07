import '../styles/merch.css'

const products = [
  {
    title: 'TwoToneTaj Hoodie',
    type: 'Merch Drop',
    price: 'Coming Soon',
    text: 'Black creator hoodie with neon green TwoToneTaj energy.',
    icon: '🟢',
  },
  {
    title: 'TajSquad Tee',
    type: 'Community Wear',
    price: 'Coming Soon',
    text: 'Clean everyday gaming tee made for the squad.',
    icon: '🎮',
  },
  {
    title: 'Stream Pack',
    type: 'Digital Item',
    price: 'Coming Soon',
    text: 'Panels, overlays, alerts, and creator assets.',
    icon: '⚡',
  },
]

export default function Merch() {
  return (
    <main className="merch-page">
      <section className="merch-hero">
        <div className="merch-hero-copy">
          <span className="eyebrow">TwoToneTaj Merch</span>
          <h1>Merch Loading</h1>

          <p className="merch-subtitle">
            TajSquad merch, creator drops, digital packs, and gaming-inspired gear are on the way.
          </p>

          <div className="merch-actions">
            <a className="btn primary" href="#merch-preview">
              Preview Drops
            </a>

            <a
              className="btn ghost"
              href="https://discord.gg/WcbtQPuByd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join TajSquad
            </a>
          </div>
        </div>

        <div className="merch-hero-card">
          <span>MERCH</span>
          <strong>Coming Soon</strong>
          <small>Clothing • Digital • Creator Gear</small>
        </div>
      </section>

      <section id="merch-preview" className="merch-section">
        <div className="merch-section-head">
          <span className="eyebrow">Featured Preview</span>
          <h2>Future Drops</h2>
        </div>

        <div className="merch-grid">
          {products.map((product) => (
            <article className="merch-card" key={product.title}>
              <div className="merch-card-icon">{product.icon}</div>

              <span>{product.type}</span>
              <h3>{product.title}</h3>
              <p>{product.text}</p>
              <strong>{product.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="merch-info-grid">
        <article className="merch-notice">
          <span className="eyebrow">Coming Soon</span>
          <h2>Built properly first.</h2>

          <p>
            The merch page is being prepared before checkout goes live, so the first drop feels
            clean, secure, and worthy of the TwoToneTaj brand.
          </p>
        </article>

        <article className="merch-trust-card">
          <span className="eyebrow">Payment Ready</span>
          <h2>Secure checkout planned.</h2>

          <ul>
            <li>GBP pricing</li>
            <li>Secure payment provider</li>
            <li>Order confirmation emails</li>
            <li>Clean mobile checkout flow</li>
          </ul>
        </article>
      </section>

      <section className="merch-cta">
        <div>
          <span className="eyebrow">TajSquad First</span>
          <h2>Want first look?</h2>

          <p>
            Join the Discord for drop updates, early previews, and community-only announcements.
          </p>
        </div>

        <a
          className="btn primary"
          href="https://discord.gg/WcbtQPuByd"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join TajSquad
        </a>
      </section>
    </main>
  )
}