import { useMemo, useState } from 'react'

import {
  merchCategories,
  merchCurrencies,
  merchProducts,
  merchSortOptions,
} from '../data/merchProducts'
import '../styles/merch.css'

const DISCORD_URL = 'https://discord.gg/WcbtQPuByd'

function formatPrice(priceGBP, currencyKey) {
  const currency = merchCurrencies[currencyKey] || merchCurrencies.GBP
  return `${currency.symbol}${(priceGBP * currency.rate).toFixed(2)}`
}

function productMatchesCategory(product, category) {
  if (category === 'All') return true
  if (category === 'Featured') return product.featured
  if (category === 'Limited Drops') return product.limited || product.tags.includes('Limited Drops')
  if (category === 'Coming Soon') return product.status === 'Coming Soon' || product.tags.includes('Coming Soon')
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

function MerchImage({ product }) {
  return (
    <div className="merch-product-image-wrap">
      <img src={product.image} alt={product.name} loading="lazy" />
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
            Official TajSquad drops, creator gear, apparel, accessories and digital items.
          </p>

          <div className="merch-actions">
            <a className="btn primary" href="#merch-drops">
              Browse Merch
            </a>

            <a className="btn ghost" href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              Join TajSquad
            </a>
          </div>
        </div>

        <div className="merch-hero-brand" aria-label="TwoToneTaj merch preview">
          <div className="merch-dragon-orb">
            <span>TT</span>
          </div>
          <strong>Average Gamer</strong>
          <small>Est. 1989</small>
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
              <img src={product.image} alt="" loading="lazy" />
              <span>{product.type}</span>
            </article>
          ))}
        </div>
      </section>

      <section id="merch-drops" className="merch-section">
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
          </div>
        </div>

        <p className="merch-price-note">Estimated price. Final checkout price may vary.</p>

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
                <span>{product.type}</span>
                <h2>{product.name}</h2>
                <strong>{formatPrice(product.priceGBP, selectedCurrency)}</strong>
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
      </section>

      <section className="merch-trust-strip" aria-label="Merch information">
        <article>
          <span>✓</span>
          <strong>Official Merch</strong>
          <p>100% official TwoToneTaj and TajSquad gear.</p>
        </article>

        <article>
          <span>🔒</span>
          <strong>Secure Checkout</strong>
          <p>Safe, encrypted and trusted checkout when the store goes live.</p>
        </article>

        <article>
          <span>🚚</span>
          <strong>Worldwide Shipping</strong>
          <p>Shipping options available when checkout is connected.</p>
        </article>

        <article>
          <span>★</span>
          <strong>Limited Drops</strong>
          <p>Exclusive designs with limited availability.</p>
        </article>
      </section>
    </main>
  )
}
