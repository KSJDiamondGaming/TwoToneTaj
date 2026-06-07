# TwoToneTaj Merch System Notes

This document explains the current merch page direction and the future portal-ready product/media structure.

## Current goal

The merch page should stay clean and minimal while preparing for a future KSJ Digital client portal where products, images, pricing, status, and checkout links can be changed without editing code.

The current static site uses:

```txt
src/data/merchProducts.js
src/data/merchMedia.js
src/pages/Merch.jsx
src/styles/merch.css
src/assets/merch/.gitkeep
```

## Core idea

Products do not rely on fixed image filenames.

Instead, each product uses an image ID:

```js
imageId: 'media_hoodie_001'
```

That image ID is resolved through the media registry in:

```txt
src/data/merchMedia.js
```

If a media URL is empty, the page shows a safe placeholder card instead of a broken image.

## Product records

Product details are stored in `src/data/merchProducts.js`.

Each product can include:

```js
{
  id: 'product_hoodie_001',
  name: 'TwoToneTaj Signature Hoodie',
  type: 'Hoodie',
  category: 'Apparel',
  description: 'Black hoodie with official TwoToneTaj dragon branding.',
  priceGBP: 34.99,
  status: 'Coming Soon',
  imageId: 'media_hoodie_001',
  fallbackImage: 'apparel',
  tags: ['Featured', 'Coming Soon'],
  featured: true,
  limited: false,
  showInCarousel: true,
  createdAt: '2026-06-07',
  checkoutUrl: ''
}
```

## Media records

Media details are stored in `src/data/merchMedia.js`.

Example:

```js
export const merchMedia = {
  media_hoodie_001: {
    id: 'media_hoodie_001',
    title: 'Hoodie product image',
    url: '',
    alt: 'TwoToneTaj Signature Hoodie'
  }
}
```

For now, `url` can stay blank. The site will show the placeholder state.

Later, the portal/dashboard can update this field with a live uploaded image URL.

## Product card text

Each merch card should display:

```txt
Product image or placeholder
Product name
Product type
Short description
Converted price
Status/feature badges
Buy Now or Coming Soon button
```

Example:

```txt
TwoToneTaj Signature Hoodie
Hoodie
Black hoodie with official TwoToneTaj dragon branding.
£34.99
Featured / Coming Soon
Coming Soon
```

## Filters and sorting

The merch page supports:

```txt
All
Featured
Apparel
Accessories
Digital
Limited Drops
Coming Soon
```

Sorting supports:

```txt
Featured
Name A-Z
Name Z-A
Price Low-High
Price High-Low
Newest
Coming Soon
Limited Drops
```

## Currency

Base prices are stored in GBP using `priceGBP` as a number.

The page can display estimated conversions for:

```txt
GBP
USD
EUR
CAD
AUD
```

The frontend price conversion is only an estimate. Final checkout pricing should be handled by the secure checkout provider later.

## Checkout direction

The site should not process payments directly in the React frontend.

Preferred secure checkout options later:

```txt
Shopify checkout links or Shopify Buy Button for physical merch
Stripe Checkout for digital items, services, bundles, or custom payments
PayPal as an optional extra payment method
```

Each product can use:

```js
checkoutUrl: ''
```

If the URL is blank, show `Coming Soon`.

If the URL exists, show `Buy Now`.

## Future KSJ/client portal direction

Eventually, clients should be able to edit products through a login/dashboard.

Editable fields should include:

```txt
Product image
Product name
Product type
Category
Description
Price
Status
Featured toggle
Carousel toggle
Limited drop toggle
Checkout link
Alt text
```

The future flow should be:

```txt
Client opens portal
Client edits product card
Client uploads/replaces image
Backend stores image in uploads/CDN storage
Backend updates product/media record
Public website displays the updated content
```

Clients should not need to rename files, edit code, touch GitHub, or rebuild the site just to update product content.

## Future storage direction

For production client uploads, images should eventually live outside source code, such as:

```txt
/uploads/clients/twotonetaj/merch/
https://cdn.ksjdigital.co.uk/clients/twotonetaj/merch/
Cloudflare R2
AWS S3
Supabase Storage
```

The current static files prepare the structure, but the upload system should be backend/database-driven later.

## Design direction

The merch page should match the existing TwoToneTaj website:

```txt
Dark black gaming background
Neon green accents
Subtle red/orange dragon/fire glow
Official TwoToneTaj dragon branding
Clean product cards
Responsive layout
No random purple esports branding
```

Use the saved black/neon green merch mockup with the official red dragon branding as the reference direction.
