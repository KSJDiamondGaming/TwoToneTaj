import { useMemo, useState } from 'react'

import logo from '../assets/logo.png'
import {
  merchCategories,
  merchCurrencies,
  merchProducts,
  merchSortOptions,
} from '../data/merchProducts'
import '../styles/merch.css'

const DISCORD_URL = 'https://discord.gg/WcbtQPuByd'
const CONTACT_URL = '/contact'

function getProductTags(product) {
  return Array.isArray(product.tags) ? product.tags : []
}

function getMediaUrl(product) {
  return product.image?.url?.trim() || ''
}

function formatPrice(priceGBP, currencyKey) {
  const currency = merchCurrencies[currencyKey] || merchCurrencies.GBP
  return `${currency.symbol}${(priceGBP * currency.rate).toFixed(2)}`
}

function productMatchesCategory(product, category) {
  const tags = getProductTags(product)

  if (category === 'All') return true
  if (category === 'Featured') return product.featured
  if (category === 'Limited Drops') return product.limited || tags.includes('Limited Drops')
  if (category === 'Coming Soon') return product.status === 'Coming Soon' || tags.includes('Coming Soon')

  return product.category === category
}

function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    if (sortBy === 'price-asc') return a.priceGBP - b.priceGBP
    if (sortBy === 'price-desc') return b.priceGBP - a.priceGBP
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'coming-soon') return Number(b.status === 'Coming Soon') - Number(a.status === 'Coming Soon')
    if (sortBy === 'limited') return Number(b.limited) - Number(a.limited)

    return Number(b.featured) - Number(a.featured)
  })
}

function MerchProductVisual({ product, compact = false }) {
  const [hasImageError, setHasImageError] = useState(false)
  const imageUrl = getMediaUrl(product)
  const shouldShowImage = imageUrl && !hasImageError
  const placeholderLabel = product.fallbackImage || 'default'

  if (shouldShowImage) {
    return (
      <img
        src={imageUrl}
        alt={product.image?.alt || product.name}
        loading="lazy"
        onError={() => setHasImageError(true)}
      />
    )
  }

  return (
    <div className={`merch-image-placeholder ${compact ? 'compact' : ''}`} data-placeholder={placeholderLabel}>
      <img src={logo} alt="" aria-hidden="true" loading="lazy" />
      <span>{product.type}</span>
      <small>Image coming soon</small>
    </div>
  )
}

function MerchImage({ product }) {
  return (
    <div className="merch-product-image-wrap">
      <MerchProductVisual product={product} />
    </div>
  )
}

export default function Merch() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedCurrency, setSelectedCurrency] = useState('GBP')
  const [sortBy, setSortBy] = useState('featured')

  const carouselItems = useMemo(
    () => merchProducts.filter((product) => product.showInCarousel),
    []
  )

  const visibleProducts = useMemo(() => {
    const filtered = merchProducts.filter((product) => productMatchesCategory(product, activeCategory))
    return sortProducts(filtered, sortBy)
  }, [activeCategory, sortBy])

  const resetFilters = () => {
    setActiveCategory('All')
    setSelectedCurrency('GBP')
    setSortBy('featured')
  }

  return (
    <main className="merch-page">
      <section className="merch-hero">
        <div className="merch-hero-copy">
          <span className="eyebrow">Official TajSquad Gear</span>
          <h1>
            TwoToneTaj
            <span>Merch</span>
          </h1>

          <p className="merch-subtitle">
            Official creator apparel, accessories and digital drops are being prepared for the TajSquad.
            The shop is in development, with GBP pricing previews ready below.
          </p>
        </div>

        <div className="merch-hero-brand" aria-label="TwoToneTaj official merch branding">
          <img src={logo} alt="TwoToneTaj official logo" />
          <strong>Average Gamer</strong>
          <small>Est. 1989</small>
        </div>
      </section>

      <section className="merch-development-note" aria-label="Store development notice">
        <span>🚧</span>
        <div>
          <strong>Merch Store Coming Soon</strong>
          <p>
            Products, prices and checkout are placeholders while the official store is prepared.
            PayPal or Shopify checkout can be connected in a later phase.
          </p>
        </div>
      </section>

      <section className="merch-carousel" aria-label="Featured merch carousel">
        <div className="merch-carousel-head">
          <span>♛</span>
          <strong>Featured Drops</strong>
        </div>

        <div className="merch-carousel-track">
          {[...carouselItems, ...carouselItems].map((product, index) => (
            <article className="merch-carousel-item" key={`${product.id}-${index}`}>
              <MerchProductVisual product={product} compact />
              <span>{product.type}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="merch-drops" className="merch-section">
        <div className="merch-section-head">
          <div>
            <span className="eyebrow">Browse The Drop</span>
            <h2>Product Preview</h2>
          </div>
          <p>
            Browse the planned collection by category. All listed prices are estimated placeholders until checkout goes live.
          </p>
        </div>

        <div className="merch-toolbar">
          <div className="merch-tabs" aria-label="Merch categories">
            {merchCategories.map((category) => (
              <button
                className={activeCategory === category ? 'active' : ''}
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="merch-controls">
            <label>
              <span>Currency</span>
              <select value={selectedCurrency} onChange={(event) => setSelectedCurrency(event.target.value)}>
                {Object.entries(merchCurrencies).map(([key, currency]) => (
                  <option key={key} value={key}>
                    {currency.label} {currency.symbol}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {merchSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button className="merch-reset-btn" type="button" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>

        <div className="merch-results-row">
          <p className="merch-price-note">Estimated pricing shown in {selectedCurrency}. Final checkout price may vary.</p>
          <p className="merch-result-count">
            Showing {visibleProducts.length} of {merchProducts.length} products
          </p>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="merch-product-grid">
            {visibleProducts.map((product) => (
              <article className="merch-product-card" key={product.id}>
                <div className="merch-badges">
                  {product.featured && <span>Featured</span>}
                  {product.limited && <span>Limited</span>}
                  {product.status === 'Coming Soon' && <span>Coming Soon</span>}
                </div>

                <MerchImage product={product} />

                <div className="merch-product-copy">
                  <h2>{product.name}</h2>
                  <span>{product.type}</span>
                  <p>{product.description}</p>
                  <strong>{formatPrice(product.priceGBP, selectedCurrency)}</strong>
                  <small>Estimated placeholder price</small>
                </div>

                {product.checkoutUrl ? (
                  <a className="merch-buy-btn" href={product.checkoutUrl} target="_blank" rel="noreferrer">
                    Buy Now
                  </a>
                ) : (
                  <button className="merch-buy-btn disabled" type="button" disabled>
                    Coming Soon
                  </button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="merch-empty-state">
            <img src={logo} alt="" aria-hidden="true" loading="lazy" />
            <strong>No merch found</strong>
            <p>Try another category, currency, or sort option.</p>
            <button type="button" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </section>

      <section className="merch-trust-strip" aria-label="Merch information">
        <article>
          <span>✓</span>
          <div>
            <strong>Official Merch</strong>
            <p>100% official TwoToneTaj and TajSquad gear.</p>
          </div>
        </article>

        <article>
          <span>🔒</span>
          <div>
            <strong>Secure Checkout</strong>
            <p>Safe and trusted checkout when the store goes live.</p>
          </div>
        </article>

        <article>
          <span>🚚</span>
          <div>
            <strong>Delivery Info</strong>
            <p>Delivery and returns information will be added before launch.</p>
          </div>
        </article>

        <article>
          <span>★</span>
          <div>
            <strong>Limited Drops</strong>
            <p>Exclusive creator designs with limited availability.</p>
          </div>
        </article>
      </section>

      <section className="merch-final-cta" aria-label="Merch launch updates">
        <div>
          <span className="eyebrow">Stay Updated</span>
          <h2>Want To Know When Merch Goes Live?</h2>
          <p>
            Join TajSquad or use the contact page for creator enquiries while the official store is being built.
          </p>
        </div>
        <div className="merch-final-actions">
          <a className="btn primary" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
            Join TajSquad
          </a>
          <a className="btn ghost" href={CONTACT_URL}>
            Contact
          </a>
        </div>
      </section>
    </main>
  )
}
