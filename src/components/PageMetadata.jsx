import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useManagedSite } from '../hooks/useManagedSite'

const protectedRoutes = {
  '/track-order': { title: 'Track Order', description: 'Track the progress of your order.', noIndex: true },
  '/merch/success': { title: 'Order Confirmed', description: 'Your order has been confirmed.', noIndex: true },
  '/merch/cancelled': { title: 'Checkout Cancelled', description: 'Your checkout was cancelled and no payment was completed.', noIndex: true },
  '/merch/paypal-return': { title: 'Completing PayPal Payment', description: 'Completing your PayPal payment.', noIndex: true },
}

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector)
  if (!value) {
    element?.remove()
    return
  }
  if (!element) {
    element = document.createElement('meta')
    const match = selector.match(/meta\[([^=]+)="([^"]+)"\]/)
    if (match) element.setAttribute(match[1], match[2])
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

function setCanonical(url) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.appendChild(element)
  }
  element.href = url
}

function clean(value, fallback = '') {
  return String(value || fallback).replace(/\s+/g, ' ').trim()
}

function contentFallback(site, entry) {
  if (!entry) return {}
  const source = entry.layoutKey ? site[entry.layoutKey] : null
  const custom = entry.customPageId ? site.pages?.find(page => page.id === entry.customPageId) : site.pages?.find(page => page.slug === entry.slug)
  if (custom) return { title: custom.title || custom.label, description: custom.intro, image: custom.seo?.image, noIndex: custom.seo?.noIndex }
  if (entry.id === 'home') return { title: site.home?.heroTitle || site.brand?.name, description: site.home?.heroText }
  if (entry.id === 'merch') return { title: site.merch?.heading || site.home?.merchTitle || entry.label, description: site.merch?.description || site.home?.merchText }
  return { title: source?.title || entry.label, description: source?.intro || source?.description }
}

function pageMetadata(site, pathname) {
  if (protectedRoutes[pathname]) return protectedRoutes[pathname]
  const entry = site.pageRegistry?.find(page => page.path === pathname || `/${page.slug || ''}` === pathname)
  if (!entry) return { title: site.brand?.name, description: site.brand?.shortTagline || site.brand?.tagline, noIndex: true }

  const registrySeo = site.pageSeo?.[entry.id] || {}
  const fallback = contentFallback(site, entry)
  return {
    title: registrySeo.title || fallback.title || entry.label,
    description: registrySeo.description || fallback.description,
    image: registrySeo.image || fallback.image,
    noIndex: registrySeo.noIndex === true || fallback.noIndex === true || entry.visible === false,
  }
}

export default function PageMetadata() {
  const { pathname } = useLocation()
  const { site } = useManagedSite()

  useEffect(() => {
    const brandName = clean(site.brand?.name, 'Website')
    const metadata = pageMetadata(site, pathname)
    const pageTitle = clean(metadata.title, brandName)
    const title = pageTitle === brandName ? brandName : `${pageTitle} | ${brandName}`
    const description = clean(metadata.description, site.brand?.shortTagline || site.brand?.tagline).slice(0, 200)
    const image = clean(metadata.image || site.assetUrls?.socialImage || site.branding?.socialIcon)
    const canonical = new URL(pathname, site.website?.domain || window.location.origin).toString()
    const robots = metadata.noIndex ? 'noindex, nofollow' : 'index, follow'

    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[name="robots"]', 'content', robots)
    setMeta('meta[property="og:type"]', 'content', 'website')
    setMeta('meta[property="og:site_name"]', 'content', brandName)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', canonical)
    setMeta('meta[property="og:image"]', 'content', image)
    setMeta('meta[name="twitter:card"]', 'content', image ? 'summary_large_image' : 'summary')
    setMeta('meta[name="twitter:title"]', 'content', title)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('meta[name="twitter:image"]', 'content', image)
    setCanonical(canonical)
  }, [pathname, site])

  return null
}
