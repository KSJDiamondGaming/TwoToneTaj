import { merchProducts } from './merchProducts'

// Compatibility export for the current Merch page.
// Product and image data now have one source of truth in merchProducts.js.
export const merchMedia = Object.fromEntries(
  merchProducts
    .filter((product) => product.image?.id)
    .map((product) => [product.image.id, product.image]),
)
