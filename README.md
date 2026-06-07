# TwoToneTaj Website

Official website for **TwoToneTaj**, a creator/streamer brand and home of the **TajSquad** community.

The site is built as a modern dark gaming-style React/Vite website using the existing TwoToneTaj branding, including black/neon green styling, red dragon visuals, creator content sections, community links, and a future-ready merch page.

## What this website is

This website is designed to be the main public home for TwoToneTaj.

It includes or will include:

- Home page and brand hero section
- About page
- Content/social sections
- Community links
- Contact/support information
- Privacy and Terms pages
- Merch page for future TwoToneTaj/TajSquad products
- Website construction/production notice
- Future live content/feed integrations

## Brand direction

The visual style should stay consistent with the current TwoToneTaj identity:

- Dark black gaming background
- Neon green accents
- Subtle red/orange dragon/fire glow
- Official TwoToneTaj dragon/logo assets
- Clean creator/streamer layout
- Mobile responsive pages
- No random replacement logos or unrelated colour schemes

## Tech stack

- React
- Vite
- CSS
- React Router

## Project structure

Main folders:

```txt
src/
  assets/
  components/
  data/
  pages/
  sections/
  styles/
```

Merch-specific files:

```txt
src/data/merchProducts.js
src/data/merchMedia.js
src/pages/Merch.jsx
src/styles/merch.css
src/assets/merch/.gitkeep
```

The merch system is intentionally minimal and portal-ready. Product information is stored separately from media information so that a future KSJ Digital client/admin portal can update products, images, pricing, statuses, and checkout links without requiring code edits.

More details are documented in:

```txt
MERCH_NOTES.md
```

## Merch system overview

The merch page uses:

```txt
Product record → imageId → media registry → uploaded image URL or placeholder
```

Products are controlled in:

```txt
src/data/merchProducts.js
```

Media/image references are controlled in:

```txt
src/data/merchMedia.js
```

If a product has no uploaded image URL, the site shows a clean placeholder state instead of a broken image.

The merch page supports:

- Category tabs
- Featured products
- Coming Soon products
- Limited Drops
- Product descriptions
- GBP base pricing
- Estimated currency display
- Sort/filter controls
- Future checkout links

## Future checkout direction

The React frontend should not directly process payments.

Future checkout should use secure external providers such as:

- Shopify checkout links or Shopify Buy Button for physical merch
- Stripe Checkout for digital products, bundles, services, or custom payments
- PayPal as an optional extra method

Each product can hold a checkout URL. If no URL is set, the product shows as Coming Soon.

## Future KSJ Digital portal direction

This site is being structured with the future KSJ/client portal in mind.

Eventually, authorised users should be able to update editable website content through a dashboard, including:

- Product names
- Product descriptions
- Product prices
- Product images
- Product statuses
- Featured/carousel toggles
- Checkout links
- Page text/images where allowed

Clients should not need to rename files, edit code, access GitHub, or rebuild the site for simple content changes.

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Notes

This site is part of the wider KSJ Digital ecosystem and is intended to remain clean, maintainable, and easy to expand.
