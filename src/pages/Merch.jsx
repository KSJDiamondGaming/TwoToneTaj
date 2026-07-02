import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import logo from '../assets/logo.png'
import {
  merchCategories,
  merchCurrencies,
  merchProducts,
  merchSortOptions,
} from '../data/merchProducts'
import '../styles/merch.css'

const DISCORD_URL = 'https://discord.gg/WcbtQPuByd'

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
  if (category === 'Coming Soon') return product.availability !== 'available' || tags.includes('Coming Soon')

  return product.category === category
}

function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    if (sortBy === 'price-asc') return a.priceGBP - b.priceGBP
    if (sortBy === 'price-desc') return b.priceGBP - a.priceGBP
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'coming-soon') return Number(b.availability !== 'available') - Number(a.availability !== 'available')
    if (sortBy === 'limited') return Number(b.limited) - Number(a.limited)

    return Number(b.featured) - Number(a.featured)
  })
}

function getCheckoutState(product) {
  const checkout = product.checkout || {}
  const url = checkout.url?.trim() || ''
  const enabled = checkout.enabled === true
  const available = product.availability === 'available'

  return {
    canCheckout: enabled && available && Boolean(url),
    provider: checkout.provider?.trim() || '',
    label: checkout.label?.trim() || 'Buy Now',
    url,
  }
}

function getAvailabilityLabel(product) {
  if (product.availability === 'available') return 'Available Now'
  if (product.availability === 'sold-out') return 'Sold Out'
  if (product.availability === 'paused') return 'Temporarily Unavailable'
  return 'Coming Soon'
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

function MerchCheckoutAction({ product }) {
  const checkout = getCheckoutState(product)
  const availabilityLabel = getAvailabilityLabel(product)

  if (checkout.canCheckout) {
    return (
      <div className="merch-checkout-action">
        <a
          className="merch-buy-btn"
          href={checkout.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${checkout.label}: ${product.name}`}
        >
          {checkout.label}
        </a>
        <small>
          Secure checkout{checkout.provider ? ` via ${checkout.provider}` : ''}. Opens in a new tab.
        </small>
      </div>
    )
  }

  return (
    <div className="merch-checkout-action">
      <button className="merch-buy-btn disabled" type="button" disabled>
        {availabilityLabel}
      </button>
      <small>No payment is taken on this website.</small>
    </div>
  )
}

export default function Merch() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedCurrency, setSelectedCurrency] = useState('GBP')
  const [sortBy, setSortBy] = useState('featured')

  const carouselItems = useMemo(
    () => merchProducts.filter((product) => product.showInCarousel),
    [],
  )

  const visibleProducts = useMemo(() => {
    const filtered = merchProducts.filter((product) => productMatchesCategory(product, activeCategory))
    return sortProducts(filtered, sortBy)
  }, [activeCategory, sortBy])

  const availableProductCount = useMemo(
    () => merchProducts.filter((product) => getCheckoutState(product).canCheckout).length,
    [],
  )

  const resetFilters = () => {
    setActiveCategory('All')
    setSelectedCurrency('GBP')
    setSortBy('featured')
  }

  const selectedCurrencyInfo = merchCurrencies[selectedCurrency] || merchCurrencies.GBP

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
            Official creator apparel, accessories and digital drops for the TajSquad.
            Products will open a secure external checkout when they become available.
          </p>
        </div>

        <div className="merch-hero-brand" aria-label="TwoToneTaj official merch branding">
          <img src={logo} alt="TwoToneTaj official logo" />
          <strong>Average Gamer</strong>
          <small>Est. 1989</small>
        </div>
      </section>

      <section className="merch-development-note" aria-label="Store status">
        <span>{availableProductCount > 0 ? '🛒' : '🚧'}</span>
        <div>
          <strong>{availableProductCount > 0 ? 'Secure Checkout Available' : 'Merch Store Coming Soon'}</strong>
          <p>
            {availableProductCount > 0
              ? `${availableProductCount} product${availableProductCount === 1 ? '' : 's'} currently link to secure external checkout.`
              : 'The collection is being prepared. Products stay unavailable until an approved checkout link is enabled.'}
          </p>
        </div>
      </section>

      <section className="merch-checkout-notice" aria-label="Checkout information">
        <div>
          <span>🔒</span>
          <strong>Secure external checkout</strong>
          <p>TwoToneTaj does not collect card or payment details directly on this website.</p>
        </div>
        <div>
          <span>£</span>
          <strong>GBP is the source price</strong>
          <p>Other currencies are estimates. The checkout provider confirms the final amount.</p>
        </div>
        <div>
          <span>🚚</span>
          <strong>Delivery shown at checkout</strong>
          <p>Shipping, delivery times, downloads and returns depend on the selected product.</p>
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
            Available products link to an approved checkout provider. Unavailable products remain clearly marked and cannot take payment.
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
          <p className="merch-price-note">
            {selectedCurrency === 'GBP'
              ? 'Prices shown in GBP.'
              : `${selectedCurrencyInfo.note} conversion shown for guidance only.`}
          </p>
          <p className="merch-result-count">
            Showing {visibleProducts.length} of {merchProducts.length} products
          </p>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="merch-product-grid">
            {visibleProducts.map((product) => {
              const checkout = getCheckoutState(product)
              const availabilityLabel = getAvailabilityLabel(product)

              return (
                <article className={`merch-product-card${checkout.canCheckout ? ' is-available' : ''}`} key={product.id}>
                  <div className="merch-badges">
                    {product.featured && <span>Featured</span>}
                    {product.limited && <span>Limited</span>}
                    <span className={checkout.canCheckout ? 'available' : 'unavailable'}>{availabilityLabel}</span>
                  </div>

                  <MerchImage product={product} />

                  <div className="merch-product-copy">
                    <h2>{product.name}</h2>
                    <span>{product.type}</span>
                    <p>{product.description}</p>
                    <strong>{formatPrice(product.priceGBP, selectedCurrency)}</strong>
                    <small>{selectedCurrency === 'GBP' ? 'GBP price' : 'Estimated conversion'}</small>
                    <p className="merch-fulfilment-note">{product.shippingNote}</p>
                  </div>

                  <MerchCheckoutAction product={product} />
                </article>
              )
            })}
          </div>
        ) : (
          <div className="merch-empty-state">
            <img src={logo} alt="" aria-hidden="true" loading="lazy" />
            <strong>No merch found</strong>
            <p>Try another category or sort option.</p>
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
            <p>Only official TwoToneTaj and TajSquad products are listed.</p>
          </div>
        </article>

        <article>
          <span>🔒</span>
          <div>
            <strong>External Checkout</strong>
            <p>Payment is completed through the approved provider, not this website.</p>
          </div>
        </article>

        <article>
          <span>🚚</span>
          <div>
            <strong>Delivery Information</strong>
            <p>Shipping, downloads and returns are confirmed before payment.</p>
          </div>
        </article>

        <article>
          <span>★</span>
          <div>
            <strong>Limited Drops</strong>
            <p>Selected creator designs may have limited availability.</p>
          </div>
        </article>
      </section>

      <section className="merch-final-cta" aria-label="Merch launch updates">
        <div>
          <span className="eyebrow">Stay Updated</span>
          <h2>Want To Know When Merch Goes Live?</h2>
          <p>Join TajSquad for launch updates or use the contact page for merch enquiries.</p>
        </div>
        <div className="merch-final-actions">
          <a className="btn primary" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
            Join TajSquad
          </a>
          <Link className="btn ghost" to="/contact">
            Contact
          </Link>
        </div>
      </section>
    </main>
  )
}
