import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import fallbackLogo from '../assets/logo.png'
import {
  merchCategories,
  merchCurrencies,
  merchProducts as fallbackProducts,
  merchSortOptions,
} from '../data/merchProducts'
import { useManagedSite } from '../hooks/useManagedSite'
import '../styles/merch.css'

const BASKET_KEY = 'twotonetajMerchBasket'

function getProductTags(product) {
  return Array.isArray(product.tags) ? product.tags : []
}

function getMediaUrl(product) {
  return product.image?.url?.trim() || ''
}

function formatPrice(priceGBP, currencyKey = 'GBP') {
  const currency = merchCurrencies[currencyKey] || merchCurrencies.GBP
  return `${currency.symbol}${(Number(priceGBP || 0) * currency.rate).toFixed(2)}`
}

function productMatchesCategory(product, category) {
  const tags = getProductTags(product)
  if (category === 'All') return true
  if (category === 'Featured') return product.featured
  if (category === 'Limited Drops') return product.limited || tags.includes('Limited Drops')
  if (category === 'Coming Soon') {
    return product.availability !== 'available' || tags.includes('Coming Soon')
  }
  return product.category === category
}

function sortProducts(products, sortBy) {
  return [...products].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
    if (sortBy === 'price-asc') return Number(a.priceGBP || 0) - Number(b.priceGBP || 0)
    if (sortBy === 'price-desc') return Number(b.priceGBP || 0) - Number(a.priceGBP || 0)
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'coming-soon') {
      return Number(b.availability !== 'available') - Number(a.availability !== 'available')
    }
    if (sortBy === 'limited') return Number(b.limited) - Number(a.limited)
    return Number(b.featured) - Number(a.featured)
  })
}

function getCheckoutState(product) {
  const checkout = product.checkout || {}
  const url = checkout.url?.trim() || ''
  const stockAvailable =
    !product.inventory?.trackStock || Number(product.inventory?.stock || 0) > 0

  return {
    canCheckout:
      checkout.enabled === true &&
      product.availability === 'available' &&
      stockAvailable &&
      Boolean(url),
    provider: checkout.provider?.trim() || '',
    url,
  }
}

function getAvailabilityLabel(product) {
  if (product.inventory?.trackStock && Number(product.inventory?.stock || 0) <= 0) {
    return 'Sold Out'
  }
  if (product.availability === 'available') return 'Available Now'
  if (product.availability === 'sold-out') return 'Sold Out'
  if (product.availability === 'paused') return 'Temporarily Unavailable'
  return 'Coming Soon'
}

function options(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)
  }
  return []
}

function checkoutUrl(baseUrl, { size, colour, quantity }) {
  try {
    const url = new URL(baseUrl, window.location.origin)
    url.searchParams.set('quantity', String(quantity))
    if (size) url.searchParams.set('size', size)
    if (colour) url.searchParams.set('colour', colour)
    return url.toString()
  } catch {
    return baseUrl
  }
}

function basketKey(item) {
  return [item.productId, item.variant?.size || '', item.variant?.colour || ''].join('::')
}

function loadBasket() {
  try {
    const value = JSON.parse(localStorage.getItem(BASKET_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function MerchProductVisual({ product, logo, compact = false }) {
  const [hasImageError, setHasImageError] = useState(false)
  const imageUrl = getMediaUrl(product)

  if (imageUrl && !hasImageError) {
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
    <div
      className={`merch-image-placeholder ${compact ? 'compact' : ''}`}
      data-placeholder={product.fallbackImage || 'default'}
    >
      <img src={logo} alt="" aria-hidden="true" loading="lazy" />
      <span>{product.type}</span>
      <small>Image coming soon</small>
    </div>
  )
}

function MerchCheckoutAction({ product, onAdd }) {
  const checkout = getCheckoutState(product)
  const sizes = options(product.variants?.sizes)
  const colours = options(product.variants?.colours)
  const stock = product.inventory?.trackStock
    ? Math.max(0, Number(product.inventory?.stock || 0))
    : 10
  const maxQuantity = Math.max(1, Math.min(10, stock || 1))
  const [size, setSize] = useState(sizes[0] || '')
  const [colour, setColour] = useState(colours[0] || '')
  const [quantity, setQuantity] = useState(1)

  if (!checkout.canCheckout) {
    return (
      <div className="merch-checkout-action">
        <button className="merch-buy-btn disabled" type="button" disabled>
          {getAvailabilityLabel(product)}
        </button>
        <small>No payment is taken while this product is unavailable.</small>
      </div>
    )
  }

  return (
    <div className="merch-checkout-action">
      {(sizes.length > 0 || colours.length > 0 || maxQuantity > 1) && (
        <div className="merch-variant-controls">
          {sizes.length > 0 && (
            <label>
              <span>Size</span>
              <select value={size} onChange={event => setSize(event.target.value)}>
                {sizes.map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
          )}
          {colours.length > 0 && (
            <label>
              <span>Colour</span>
              <select value={colour} onChange={event => setColour(event.target.value)}>
                {colours.map(value => <option key={value}>{value}</option>)}
              </select>
            </label>
          )}
          {maxQuantity > 1 && (
            <label>
              <span>Quantity</span>
              <select value={quantity} onChange={event => setQuantity(Number(event.target.value))}>
                {Array.from({ length: maxQuantity }, (_, index) => index + 1).map(value => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}
      <button
        className="merch-buy-btn"
        type="button"
        onClick={() =>
          onAdd({
            productId: product.id,
            name: product.name,
            image: getMediaUrl(product),
            unitPrice: Number(product.priceGBP || 0),
            quantity,
            variant: { size, colour },
            provider: checkout.provider,
            checkoutUrl: checkoutUrl(checkout.url, { size, colour, quantity }),
            stock,
            trackStock: product.inventory?.trackStock === true,
          })
        }
      >
        Add to Basket
      </button>
      <small>
        Secure checkout{checkout.provider ? ` via ${checkout.provider}` : ''}.
        {product.inventory?.trackStock ? ` ${stock} currently in stock.` : ''}
      </small>
    </div>
  )
}

function MerchBasket({ basket, currency, onQuantity, onRemove, onClear }) {
  const itemCount = basket.reduce((total, item) => total + item.quantity, 0)
  const subtotal = basket.reduce((total, item) => total + item.unitPrice * item.quantity, 0)

  if (!basket.length) return null

  return (
    <section className="merch-basket" aria-label="Merch basket">
      <div className="merch-basket-head">
        <div>
          <span className="eyebrow">Your Basket</span>
          <h2>{itemCount} Item{itemCount === 1 ? '' : 's'}</h2>
        </div>
        <button type="button" onClick={onClear}>Clear Basket</button>
      </div>
      <div className="merch-basket-items">
        {basket.map(item => {
          const max = item.trackStock ? Math.max(1, Math.min(10, item.stock)) : 10
          return (
            <article key={basketKey(item)}>
              {item.image ? <img src={item.image} alt="" /> : <div className="merch-basket-placeholder">MERCH</div>}
              <div className="merch-basket-copy">
                <strong>{item.name}</strong>
                <small>
                  {[item.variant?.size, item.variant?.colour].filter(Boolean).join(' • ') || 'Standard item'}
                </small>
                <span>{formatPrice(item.unitPrice, currency)} each</span>
              </div>
              <label>
                <span>Qty</span>
                <select value={item.quantity} onChange={event => onQuantity(item, Number(event.target.value))}>
                  {Array.from({ length: max }, (_, index) => index + 1).map(value => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <div className="merch-basket-actions">
                <strong>{formatPrice(item.unitPrice * item.quantity, currency)}</strong>
                <a href={checkoutUrl(item.checkoutUrl, { ...item.variant, quantity: item.quantity })}>
                  Checkout Item
                </a>
                <button type="button" onClick={() => onRemove(item)}>Remove</button>
              </div>
            </article>
          )
        })}
      </div>
      <div className="merch-basket-total">
        <span>Basket subtotal</span>
        <strong>{formatPrice(subtotal, currency)}</strong>
      </div>
      <p className="merch-basket-note">
        Each line opens its verified provider checkout with the selected variant and quantity.
      </p>
    </section>
  )
}

export default function Merch() {
  const { site } = useManagedSite()
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedCurrency, setSelectedCurrency] = useState('GBP')
  const [sortBy, setSortBy] = useState('featured')
  const [basket, setBasket] = useState(loadBasket)
  const products = site.merch?.products?.length ? site.merch.products : fallbackProducts
  const logo = site.assetUrls?.primaryLogo || fallbackLogo
  const discordUrl = site.socials?.discord || 'https://discord.gg/WcbtQPuByd'
  const storeEyebrow = site.merch?.eyebrow || `Official ${site.brand.communityName} Gear`
  const storeSubtitle =
    site.merch?.subtitle ||
    `Official creator apparel, accessories and digital drops for the ${site.brand.communityName}.`

  useEffect(() => {
    localStorage.setItem(BASKET_KEY, JSON.stringify(basket))
  }, [basket])

  const carouselItems = useMemo(
    () => products.filter(product => product.showInCarousel),
    [products],
  )
  const visibleProducts = useMemo(
    () => sortProducts(products.filter(product => productMatchesCategory(product, activeCategory)), sortBy),
    [activeCategory, products, sortBy],
  )
  const availableProductCount = useMemo(
    () => products.filter(product => getCheckoutState(product).canCheckout).length,
    [products],
  )

  function addToBasket(item) {
    setBasket(current => {
      const key = basketKey(item)
      const existing = current.find(entry => basketKey(entry) === key)
      if (!existing) return [...current, item]
      const max = item.trackStock ? Math.max(1, Math.min(10, item.stock)) : 10
      return current.map(entry =>
        basketKey(entry) === key
          ? { ...entry, quantity: Math.min(max, entry.quantity + item.quantity) }
          : entry,
      )
    })
  }

  function resetFilters() {
    setActiveCategory('All')
    setSelectedCurrency('GBP')
    setSortBy('featured')
  }

  const selectedCurrencyInfo = merchCurrencies[selectedCurrency] || merchCurrencies.GBP

  return (
    <main className="merch-page">
      <section className="merch-hero">
        <div className="merch-hero-copy">
          <span className="eyebrow">{storeEyebrow}</span>
          <h1>{site.brand.name}<span>Merch</span></h1>
          <p className="merch-subtitle">{storeSubtitle}</p>
        </div>
        <div className="merch-hero-brand" aria-label={`${site.brand.name} official merch branding`}>
          <img src={logo} alt={`${site.brand.name} official logo`} />
          <strong>{site.brand.tagline?.split('•')[0]?.trim() || 'Average Gamer'}</strong>
          <small>{site.brand.tagline?.split('•')[1]?.trim() || 'Est. 1989'}</small>
        </div>
      </section>

      <section className="merch-development-note" aria-label="Store status">
        <span>{availableProductCount > 0 ? '🛒' : '🚧'}</span>
        <div>
          <strong>{availableProductCount > 0 ? 'Secure Checkout Available' : 'Merch Store Coming Soon'}</strong>
          <p>
            {availableProductCount > 0
              ? `${availableProductCount} product${availableProductCount === 1 ? '' : 's'} currently support secure checkout.`
              : 'Products stay unavailable until checkout is enabled in the client portal.'}
          </p>
        </div>
      </section>

      <MerchBasket
        basket={basket}
        currency={selectedCurrency}
        onQuantity={(item, quantity) =>
          setBasket(current =>
            current.map(entry => basketKey(entry) === basketKey(item) ? { ...entry, quantity } : entry),
          )
        }
        onRemove={item =>
          setBasket(current => current.filter(entry => basketKey(entry) !== basketKey(item)))
        }
        onClear={() => setBasket([])}
      />

      {carouselItems.length > 0 && (
        <section className="merch-carousel" aria-label="Featured merch carousel">
          <div className="merch-carousel-head"><span>♛</span><strong>Featured Drops</strong></div>
          <div className="merch-carousel-track">
            {[...carouselItems, ...carouselItems].map((product, index) => (
              <article className="merch-carousel-item" key={`${product.id}-${index}`}>
                <MerchProductVisual product={product} logo={logo} compact />
                <span>{product.type}</span>
              </article>
            ))}
          </div>
        </section>
      )}

      <section id="merch-drops" className="merch-section">
        <div className="merch-section-head">
          <div><span className="eyebrow">Browse The Drop</span><h2>Product Preview</h2></div>
          <p>Products, prices, stock and checkout settings are managed through KSJ Digital.</p>
        </div>
        <div className="merch-toolbar">
          <div className="merch-tabs" aria-label="Merch categories">
            {merchCategories.map(category => (
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
              <select value={selectedCurrency} onChange={event => setSelectedCurrency(event.target.value)}>
                {Object.entries(merchCurrencies).map(([key, currency]) => (
                  <option key={key} value={key}>{currency.label} {currency.symbol}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Sort</span>
              <select value={sortBy} onChange={event => setSortBy(event.target.value)}>
                {merchSortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <button className="merch-reset-btn" type="button" onClick={resetFilters}>Reset</button>
          </div>
        </div>
        <div className="merch-results-row">
          <p className="merch-price-note">
            {selectedCurrency === 'GBP'
              ? 'Prices shown in GBP.'
              : `${selectedCurrencyInfo.note} conversion shown for guidance only.`}
          </p>
          <p className="merch-result-count">Showing {visibleProducts.length} of {products.length} products</p>
        </div>
        {visibleProducts.length > 0 ? (
          <div className="merch-product-grid">
            {visibleProducts.map(product => {
              const checkout = getCheckoutState(product)
              return (
                <article className={`merch-product-card${checkout.canCheckout ? ' is-available' : ''}`} key={product.id}>
                  <div className="merch-badges">
                    {product.featured && <span>Featured</span>}
                    {product.limited && <span>Limited</span>}
                    <span className={checkout.canCheckout ? 'available' : 'unavailable'}>
                      {getAvailabilityLabel(product)}
                    </span>
                  </div>
                  <div className="merch-product-image-wrap">
                    <MerchProductVisual product={product} logo={logo} />
                  </div>
                  <div className="merch-product-copy">
                    <h2>{product.name}</h2>
                    <span>{product.type}</span>
                    <p>{product.description}</p>
                    <strong>{formatPrice(product.priceGBP, selectedCurrency)}</strong>
                    <small>{selectedCurrency === 'GBP' ? 'GBP price' : 'Estimated conversion'}</small>
                    <p className="merch-fulfilment-note">{product.shippingNote}</p>
                  </div>
                  <MerchCheckoutAction product={product} onAdd={addToBasket} />
                </article>
              )
            })}
          </div>
        ) : (
          <div className="merch-empty-state">
            <img src={logo} alt="" aria-hidden="true" loading="lazy" />
            <strong>No merch found</strong>
            <p>Try another category or sort option.</p>
            <button type="button" onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </section>

      <section className="merch-final-cta" aria-label="Merch launch updates">
        <div>
          <span className="eyebrow">Stay Updated</span>
          <h2>Want To Know When Merch Goes Live?</h2>
          <p>Join {site.brand.communityName} for launch updates.</p>
        </div>
        <div className="merch-final-actions">
          <a className="btn primary" href={discordUrl} target="_blank" rel="noopener noreferrer">
            Join {site.brand.communityName}
          </a>
          <Link className="btn ghost" to="/contact">Contact</Link>
        </div>
      </section>
    </main>
  )
}
