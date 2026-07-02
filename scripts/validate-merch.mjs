import { merchProducts } from '../src/data/merchProducts.js'

const errors = []
const warnings = []
const ids = new Set()
const allowedAvailability = new Set(['prelaunch', 'available', 'sold-out', 'paused'])
const allowedFulfilment = new Set(['physical', 'digital'])
const allowedCheckoutProtocols = new Set(['https:'])

function addError(product, message) {
  errors.push(`${product.id || 'unknown-product'}: ${message}`)
}

function addWarning(product, message) {
  warnings.push(`${product.id || 'unknown-product'}: ${message}`)
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function validateCheckoutUrl(product, checkout) {
  if (!hasText(checkout.url)) {
    addError(product, 'checkout is enabled but checkout.url is empty')
    return
  }

  try {
    const url = new URL(checkout.url)

    if (!allowedCheckoutProtocols.has(url.protocol)) {
      addError(product, 'checkout.url must use HTTPS')
    }
  } catch {
    addError(product, 'checkout.url is not a valid absolute URL')
  }
}

for (const product of merchProducts) {
  if (!hasText(product.id)) {
    addError(product, 'missing product id')
  } else if (ids.has(product.id)) {
    addError(product, 'duplicate product id')
  } else {
    ids.add(product.id)
  }

  if (!hasText(product.name)) addError(product, 'missing product name')
  if (!hasText(product.category)) addError(product, 'missing category')
  if (!hasText(product.type)) addError(product, 'missing product type')
  if (!hasText(product.description)) addError(product, 'missing description')

  if (!Number.isFinite(product.priceGBP) || product.priceGBP <= 0) {
    addError(product, 'priceGBP must be a positive number')
  }

  if (!allowedAvailability.has(product.availability)) {
    addError(product, `availability must be one of: ${[...allowedAvailability].join(', ')}`)
  }

  if (!allowedFulfilment.has(product.fulfilment)) {
    addError(product, `fulfilment must be one of: ${[...allowedFulfilment].join(', ')}`)
  }

  if (!hasText(product.shippingNote)) {
    addError(product, 'missing shipping or fulfilment note')
  }

  if (!product.image || typeof product.image !== 'object') {
    addError(product, 'missing image configuration')
  } else {
    if (!hasText(product.image.alt)) addError(product, 'missing image alt text')

    if (product.availability === 'available' && !hasText(product.image.url)) {
      addError(product, 'available products must have a real image URL')
    } else if (!hasText(product.image.url)) {
      addWarning(product, 'product image is still using the branded placeholder')
    }
  }

  const checkout = product.checkout || {}
  const checkoutEnabled = checkout.enabled === true

  if (product.availability === 'available' && !checkoutEnabled) {
    addError(product, 'available products must have checkout.enabled set to true')
  }

  if (checkoutEnabled && product.availability !== 'available') {
    addError(product, 'checkout cannot be enabled unless availability is available')
  }

  if (checkoutEnabled) {
    if (!hasText(checkout.provider)) addError(product, 'enabled checkout requires a provider name')
    if (!hasText(checkout.label)) addError(product, 'enabled checkout requires a button label')
    validateCheckoutUrl(product, checkout)
  } else if (hasText(checkout.url)) {
    addWarning(product, 'checkout URL is present but checkout.enabled is false')
  }

  if (product.fulfilment === 'digital' && /shipping/i.test(product.shippingNote || '')) {
    addWarning(product, 'digital product fulfilment note mentions shipping')
  }
}

console.log(`Checked ${merchProducts.length} merch products.`)

if (warnings.length > 0) {
  console.log(`\nWarnings (${warnings.length}):`)
  for (const warning of warnings) console.log(`  - ${warning}`)
}

if (errors.length > 0) {
  console.error(`\nErrors (${errors.length}):`)
  for (const error of errors) console.error(`  - ${error}`)
  console.error('\nMerch validation failed. No deployment should be performed.')
  process.exit(1)
}

console.log('\nMerch validation passed.')
