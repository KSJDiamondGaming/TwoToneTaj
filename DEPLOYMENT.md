# TwoToneTaj Internal Deployment Notes

**Private internal document for KSJ Digital / TwoToneTaj operations.**

This file is intended for the private GitHub repository only. It must not be copied into `public/`, `src`, `dist`, or any website-served folder.

---

## Website overview

Official website for **TwoToneTaj**, a creator/streamer brand and home of the **TajSquad** community.

The site is a dark gaming-style React/Vite website using the TwoToneTaj black, neon-green, and dragon-led visual identity.

## Live site

```txt
https://twotonetaj.ksjdigital.co.uk
```

## Main pages

- Home
- About
- Content
- Community
- Merch
- Contact
- Privacy
- Terms

## Tech stack

- React
- Vite
- React Router
- CSS
- Nginx on the production VPS
- GitHub Actions for validation and deployment
- KSJ Digital managed-content API

## Project structure

```txt
src/
  assets/
  components/
  config/
  data/
  hooks/
  pages/
  sections/
  styles/

deploy/
  nginx.twotonetaj.conf.example

scripts/
  deploy-vps.sh
```

---

## Managed content

TwoToneTaj can load editable site data from KSJ Digital.

Default production API base:

```txt
https://ksjdigital.co.uk/api
```

Default site ID:

```txt
twotonetaj
```

The live site reads:

```txt
/api/public/sites/twotonetaj
```

If the KSJ Digital API is unavailable, the React frontend falls back to safe local defaults from:

```txt
src/config/siteConfig.js
src/hooks/useManagedSite.js
```

Optional Vite environment overrides:

```txt
VITE_KSJ_PUBLIC_API_URL=https://ksjdigital.co.uk/api
VITE_KSJ_SITE_ID=twotonetaj
VITE_APP_HOST=twotonetaj.ksjdigital.co.uk
```

---

## Local development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Run lint checks:

```bash
npm run lint
```

Run merch validation:

```bash
npm run validate:merch
```

Run the full local check:

```bash
npm run check
```

Run the production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Merch data

The merch system uses one source of truth:

```txt
src/data/merchProducts.js
```

Each product record contains its own product information, availability, fulfilment, checkout status, and image metadata.

Example product record:

```js
{
  id: 'product_hoodie_001',
  name: 'TwoToneTaj Signature Hoodie',
  priceGBP: 34.99,
  availability: 'prelaunch',
  fulfilment: 'physical',
  shippingNote: 'Shipping information will be confirmed before launch.',
  image: {
    id: 'media_hoodie_001',
    title: 'Hoodie product image',
    url: '',
    alt: 'TwoToneTaj Signature Hoodie',
  },
  checkout: {
    enabled: false,
    provider: '',
    url: '',
    label: 'Buy Now',
  },
}
```

If no image URL is available, the Merch page renders a branded placeholder instead of a broken image.

The React frontend does not process payments directly. Future checkout links should use secure external services such as Shopify Checkout, Stripe Checkout, or PayPal.

Before a product can go live:

- `availability` must be set to `available`;
- `checkout.enabled` must be `true`;
- `checkout.provider` must be filled;
- `checkout.url` must be a valid HTTPS URL;
- a real product image URL must be present;
- `npm run validate:merch` must pass.

---

## GitHub validation workflow

Automatic validation workflow:

```txt
.github/workflows/validate.yml
```

Runs on:

- push to `main`;
- pull request to `main`.

It runs:

```bash
npm ci
npm run check
```

This includes:

- ESLint;
- merch configuration validation;
- production build.

A failed validation means the update is not ready for production deployment.

---

## GitHub production deployment workflow

Manual deployment workflow:

```txt
.github/workflows/deploy.yml
```

Run from:

```txt
GitHub → Actions → Deploy TwoToneTaj → Run workflow
```

Deployment flow:

1. GitHub validates the release again.
2. GitHub connects to the VPS through SSH.
3. GitHub synchronises the VPS copy to `origin/main`.
4. The VPS runs `scripts/deploy-vps.sh`.
5. The script builds the site, reloads Nginx, and smoke-tests live routes.

Important rule:

```txt
Push to GitHub does not deploy live.
Only the manual Deploy TwoToneTaj workflow updates production.
```

---

## GitHub Actions secrets

Required repository secrets:

```txt
TWOTONETAJ_SSH_HOST
TWOTONETAJ_SSH_USER
TWOTONETAJ_SSH_KEY
TWOTONETAJ_SSH_PORT
TWOTONETAJ_SITE_DIR
TWOTONETAJ_LIVE_URL
```

Current VPS host:

```txt
198.186.130.112
```

`TWOTONETAJ_SSH_KEY` must be the private deployment key.

Do not commit private keys, server passwords, `.env` files, token values, or secret values into this repository.

---

## VPS deployment target

Production project location:

```txt
/home/twotonetaj/site
```

Live build directory used by Nginx:

```txt
/home/twotonetaj/site/dist
```

Manual script location:

```txt
scripts/deploy-vps.sh
```

Manual deployment command if GitHub Actions is unavailable:

```bash
cd /home/twotonetaj/site
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

This script:

1. Fetches the latest `main` branch.
2. Pulls with fast-forward-only protection.
3. Installs dependencies using `npm ci`.
4. Runs merch validation.
5. Runs the production build.
6. Confirms `dist/index.html` exists.
7. Validates and reloads Nginx.
8. Smoke-tests every public route on the live site.

Optional environment overrides:

```bash
SITE_DIR=/home/twotonetaj/site \
BRANCH=main \
LIVE_URL=https://twotonetaj.ksjdigital.co.uk \
./scripts/deploy-vps.sh
```

---

## Nginx requirements

React Router requires an SPA fallback for direct route visits and browser refreshes:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

A complete example is provided at:

```txt
deploy/nginx.twotonetaj.conf.example
```

The example also:

- caches hashed Vite assets long-term;
- prevents strong caching of `index.html`;
- adds basic security headers;
- serves the build from `/home/twotonetaj/site/dist`.
