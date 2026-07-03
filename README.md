# 🎮 TwoToneTaj Website

[![CI Status](https://github.com/KSJHub/TwoToneTaj/actions/workflows/validate.yml/badge.svg)](https://github.com/KSJHub/TwoToneTaj/actions)
[![Deploy Status](https://github.com/KSJHub/TwoToneTaj/actions/workflows/deploy.yml/badge.svg)](https://github.com/KSJHub/TwoToneTaj/actions)
[![License](https://img.shields.io/badge/license-private-blue.svg)](#)
[![Live Site](https://img.shields.io/badge/live-twotonetaj.ksjdigital.co.uk-green)](https://twotonetaj.ksjdigital.co.uk)

---

## 🌐 Live Website

👉 **https://twotonetaj.ksjdigital.co.uk**

---

## 🧠 Overview

**TwoToneTaj** is a gaming and creator brand website built for streaming, community engagement, and digital content.

It is the home of the **TajSquad** community and acts as the central hub for content, updates, and future creator tools.

The site is built with a modern React + Vite stack and styled with a dark neon gaming aesthetic.

---

## 🖼 Screenshots

> Replace with real screenshots in `/docs/screenshots/`

### 🏠 Home Page
![Home](docs/screenshots/home.png)

### 👤 About Page
![About](docs/screenshots/about.png)

### 🛒 Merch Page
![Merch](docs/screenshots/merch.png)

### 💬 Community Page
![Community](docs/screenshots/community.png)

---

## 📄 Pages

- Home
- About
- Content
- Community
- Merch
- Contact
- Privacy Policy
- Terms of Use

---

## 🛠 Tech Stack

- React
- Vite
- React Router
- CSS (custom design system)
- Node.js tooling
- Nginx (production server)
- GitHub Actions (CI/CD)

---

## 🚀 CI / CD Pipeline

### ✔ Automated Validation
Every push to `main` triggers:

- ESLint checks
- Merch validation
- Production build verification

### 🚀 Deployment Workflow
Production deployment is manually triggered via:

> GitHub → Actions → **Deploy TwoToneTaj**

---

## 📦 Project Structure

```
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

---

## 🛒 Merch System

Centralised data source:

```
src/data/merchProducts.js
```

Each product includes structured metadata such as:

- Name
- Price
- Image data
- Availability state

Example:

```js
{
  id: 'signature-hoodie',
  name: 'TwoToneTaj Signature Hoodie',
  priceGBP: 44.99,
  image: {
    id: 'media_hoodie_001',
    url: '',
    alt: 'TwoToneTaj Signature Hoodie'
  }
}
```

---

## 💳 Payments

This site does not process payments directly.

All transactions use secure external providers such as:

- Shopify Checkout
- Stripe Checkout
- PayPal

---

## 🚀 Deployment

### Production Location

```
/home/twotonetaj/site
```

### Manual Deploy (VPS)

```bash
cd /home/twotonetaj/site
chmod +x scripts/deploy-vps.sh
./scripts/deploy-vps.sh
```

---

## 🌍 Routing (SPA Config)

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Ensures React Router works on refresh and direct links.

---

## 🎨 Brand Identity

- Dark gaming UI
- Neon green accents
- Subtle red/orange dragon styling
- Modern typography
- Mobile-first responsive layout

---

## 🔐 Internal Systems

- GitHub is the source of truth
- VPS is production only
- All releases go through CI validation
- Manual deploy via GitHub Actions

---

## 🔮 Future Expansion

Planned upgrades:

- Advanced community systems
- Creator tools portal
- Merch automation
- KSJ Digital integration layer
- Discord-driven features

---

## 🤝 Status

🔥 Active development
⚡ CI/CD enabled
🚀 Production deployed
