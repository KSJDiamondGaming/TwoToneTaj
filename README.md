# TwoToneTaj Website

Official website for **TwoToneTaj**, a creator/streamer brand and home of the **TajSquad** community.

The site is a dark gaming-style React/Vite website using the TwoToneTaj black, neon-green, and dragon-led visual identity.

## Live site

`https://twotonetaj.ksjdigital.co.uk`

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

## Project structure

```txt
src/
  assets/
  components/
  data/
  pages/
  sections/
  styles/

deploy/
  nginx.twotonetaj.conf.example

scripts/
  deploy-vps.sh
```

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Run the production build:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Merch data

The merch system now uses one source of truth:

```txt
src/data/merchProducts.js
```

Each product record contains its own product information and image metadata:

```js
{
  id: 'signature-hoodie',
  name: 'TwoToneTaj Signature Hoodie',
  priceGBP: 44.99,
  image: {
    id: 'media_hoodie_001',
    title: 'Hoodie product image',
    url: '',
    alt: 'TwoToneTaj Signature Hoodie',
  },
}
```

If no image URL is available, the Merch page renders a branded placeholder instead of a broken image.

The React frontend does not process payments directly. Future checkout links should use secure external services such as Shopify Checkout, Stripe Checkout, or PayPal.

## VPS deployment

The production project lives at:

```txt
/home/twotonetaj/site
```

A repeatable deployment script is included:

```bash
cd /home/twotonetaj/site
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

The script:

1. Pulls the latest `main` branch with fast-forward-only protection.
2. Installs dependencies using `npm ci`.
3. Runs the production build.
4. Confirms `dist/index.html` exists.
5. Validates and reloads Nginx.
6. Smoke-tests every public route on the live site.

Optional environment overrides:

```bash
SITE_DIR=/home/twotonetaj/site \
BRANCH=main \
LIVE_URL=https://twotonetaj.ksjdigital.co.uk \
./scripts/deploy-vps.sh
```

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

Review the example before applying it because the live server may already include HTTPS and Certbot-managed directives.

## Brand direction

The site should remain consistent with the established TwoToneTaj identity:

- dark black gaming background;
- neon-green accents;
- subtle red/orange dragon and fire glow;
- official TwoToneTaj dragon and logo assets;
- Russo One, Bebas Neue, and Inter typography;
- responsive desktop, tablet, and mobile layouts;
- no unrelated replacement logos or colour schemes.

## Future portal direction

The site is structured so a future KSJ Digital client portal can manage approved editable content without requiring clients to edit code, rename files, use GitHub, or rebuild the site manually.
