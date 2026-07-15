import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useManagedSite } from '../hooks/useManagedSite'

const builtInPageContent = {
  '/': site => ({ title: site.home?.heroTitle || site.brand?.name, description: site.home?.heroText }),
  '/about': site => ({ title: site.about?.title || 'About', description: site.about?.intro }),
  '/content': site => ({ title: site.contentPage?.title || 'Content', description: site.contentPage?.intro }),
  '/community': site => ({ title: site.communityPage?.title || 'Community', description: site.communityPage?.intro }),
  '/merch': site => ({ title: site.merch?.heading || site.home?.merchTitle || 'Merch', description: site.merch?.description || site.home?.merchText }),
  '/contact': site => ({ title: site.contactPage?.title || 'Contact', description: site.contactPage?.intro }),
  '/privacy': site => ({ title: site.privacy?.title || 'Privacy Policy', description: site.privacy?.intro, noIndex: false }),
  '/terms': site => ({ title: site.terms?.title || 'Terms of Use', description: site.terms?.intro, noIndex: false }),
  '/track-order': () => ({ title: 'Track Order', description: 'Track the progress of your TwoToneTaj merchandise order.', noIndex: true }),
  '/merch/success': () => ({ title: 'Order Confirmed', description: 'Your TwoToneTaj order has been confirmed.', noIndex: true }),
  '/merch/cancelled': () => ({ title: 'Checkout Cancelled', description: 'Your checkout was cancelled and no payment was completed.', noIndex: true }),
  '/merch/paypal-return': () => ({ title: 'Completing PayPal Payment', description: 'Completing your TwoToneTaj PayPal payment.', noIndex: true }),
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

function pageMetadata(site, pathname) {
  const customSlug = pathname.replace(/^\//, '')
  const customPage = site.pages?.find(page => page.slug === customSlug || page.target === pathname)

  if (customPage) {
    return {
      title: customPage.seo?.title || customPage.title || customPage.label,
      description: customPage.seo?.description || customPage.intro,
      image: customPage.seo?.image,
      noIndex: customPage.seo?.noIndex === true || customPage.visible === false,
    }
  }

  return builtInPageContent[pathname]?.(site) || {
    title: site.brand?.name,
    description: site.brand?.shortTagline || site.brand?.tagline,
    noIndex: true,
  }
}

export default function PageMetadata() {
  const { pathname } = useLocation()
  const { site } = useManagedSite()

  useEffect(() => {
    const brandName = clean(site.brand?.name, 'TwoToneTaj')
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
