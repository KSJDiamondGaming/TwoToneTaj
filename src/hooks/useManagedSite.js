import { useEffect, useState } from 'react'
import { KSJ_API_BASE, KSJ_SITE_ID, ksjAssetUrl, ksjPublicUrl } from '../config/ksjApi'
import { siteConfig } from '../config/siteConfig'

const fallbackPageRegistry = [
  { id: 'home', slug: '', path: '/', label: 'Home', type: 'layout', layoutKey: 'home', visible: true, navigable: true, editable: true, order: 1 },
  { id: 'about', slug: 'about', path: '/about', label: 'About', type: 'layout', layoutKey: 'about', visible: true, navigable: true, editable: true, order: 2 },
  { id: 'content', slug: 'content', path: '/content', label: 'Content', type: 'layout', layoutKey: 'contentPage', visible: true, navigable: true, editable: true, order: 3 },
  { id: 'community', slug: 'community', path: '/community', label: 'Community', type: 'layout', layoutKey: 'communityPage', visible: true, navigable: true, editable: true, order: 4 },
  { id: 'merch', slug: 'merch', path: '/merch', label: 'Merch', type: 'layout', layoutKey: 'merch', visible: true, navigable: true, editable: true, order: 5 },
  { id: 'contact', slug: 'contact', path: '/contact', label: 'Contact', type: 'layout', layoutKey: 'contactPage', visible: true, navigable: true, editable: true, order: 6 },
  { id: 'privacy', slug: 'privacy', path: '/privacy', label: 'Privacy', type: 'layout', layoutKey: 'privacy', visible: true, navigable: false, editable: true, order: 7 },
  { id: 'terms', slug: 'terms', path: '/terms', label: 'Terms', type: 'layout', layoutKey: 'terms', visible: true, navigable: false, editable: true, order: 8 },
]

const fallbackPages = {
  about: { title: "Hey, I'm Taj", subtitle: 'Average gamer • Professional scoreboard victim.', intro: 'Welcome to TwoToneTaj. A gaming community built on laughs, good people, and unforgettable moments.', quote: 'Gaming was never about the scoreboard for me, it was always about the people.', sections: [] },
  contentPage: { eyebrow: 'Videos • Streams • Clips', title: 'Watch The Chaos', intro: 'Gameplay, streams, community moments, shorts and clips.', latestTitle: 'Recent YouTube Uploads', latestText: 'Fresh videos and shorts from the official channel.', platformTitle: 'Choose Your Platform', footerTitle: 'It’s All About The 💩 And Giggles, Folks.', footerText: 'Just gaming, community and the moments worth sharing.' },
  communityPage: { eyebrow: 'Official Discord Community', title: 'TajSquad Community', intro: 'Good games, good laughs and the people who make the community worth building.', dashboardTitle: 'The Discord Is The Heart Of TajSquad', dashboardText: 'Community information and updates live here.', areasTitle: 'Everything TajSquad Needs', valuesTitle: 'Protect The Vibe', valuesText: 'Built around laughs, respect and support.' },
  contactPage: { eyebrow: 'Official Contact', title: 'Let’s Talk', intro: 'Use the official contact routes below.', linksTitle: 'Links & Support', enquiriesTitle: 'Enquiries Welcome', enquiriesText: 'Relevant opportunities are always considered.', thanksTitle: 'Thank You For Being Part Of The Community', thanksText: 'Every message and bit of support helps the community grow.' },
  privacy: { eyebrow: 'Legal', title: 'Privacy Policy', intro: 'This policy explains how this website handles information.', sections: [], updated: 'Last updated: June 2026' },
  terms: { eyebrow: 'Legal', title: 'Terms of Use', intro: 'These terms outline the guidelines for using this website.', sections: [], updated: 'Last updated: June 2026' },
}

function objectRecords(value) { return Array.isArray(value) ? value.filter(item => item && typeof item === 'object' && !Array.isArray(item)) : [] }
function booleanValue(value, fallback = false) { if (value === undefined || value === null || value === '') return fallback; if (typeof value === 'boolean') return value; return String(value).trim().toLowerCase() === 'true' }
function assetUrl(asset) { return ksjAssetUrl(asset?.url || '') }
function latestAsset(assets = [], slotId) { return objectRecords(assets).filter(asset => asset.slotId === slotId).sort((a, b) => Number(b.version || 0) - Number(a.version || 0))[0] }
function validCheckoutUrl(value = '') { try { const url = new URL(value); return url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)) } catch { return false } }
function providerCheckoutUrl(provider, productId) { const normalised = provider?.trim().toLowerCase(); if (!['stripe', 'paypal'].includes(normalised) || !productId) return ''; return `${KSJ_API_BASE}/checkout/${normalised}/start?${new URLSearchParams({ websiteId: KSJ_SITE_ID, productId, quantity: '1' })}` }

function sanitiseMerch(merch) {
  if (!merch || !Array.isArray(merch.products)) return null
  return { ...merch, products: objectRecords(merch.products).map(product => {
    const checkout = product.checkout || {}
    const providerUrl = providerCheckoutUrl(checkout.provider, product.id)
    const url = providerUrl || checkout.url?.trim() || ''
    const madeToOrder = product.fulfilmentOptions?.madeToOrder === true
    const leadTimeMessage = product.fulfilmentOptions?.leadTimeMessage?.trim() || ''
    const stock = Math.max(0, Number(product.inventory?.quantity || product.inventory?.stock || 0))
    const checkoutReady = checkout.enabled === true && product.availability === 'available' && Number(product.priceGBP) > 0 && Boolean(product.name?.trim()) && Boolean(product.description?.trim()) && Boolean(product.shippingNote?.trim()) && (!madeToOrder || Boolean(leadTimeMessage)) && (checkout.mode === 'managed' || validCheckoutUrl(url))
    return {
      ...product,
      featured: booleanValue(product.featured),
      limited: booleanValue(product.limited),
      showInCarousel: booleanValue(product.showInCarousel),
      visible: booleanValue(product.visible, true),
      shippingNote: madeToOrder ? `* ${leadTimeMessage}` : product.shippingNote,
      fulfilmentOptions: { madeToOrder, leadTimeMessage },
      inventory: { ...(product.inventory || {}), trackStock: madeToOrder ? false : product.inventory?.trackStock === true, readyStock: stock, quantity: stock, stock, variants: objectRecords(product.inventory?.variants) },
      checkout: { ...checkout, enabled: checkoutReady, url: checkoutReady ? url : '' },
    }
  }) }
}

function customRegistryEntries(pages = []) {
  return objectRecords(pages).map((page, index) => ({
    id: page.id || `custom-${page.slug || index}`,
    slug: page.slug || '',
    path: page.slug ? `/${page.slug}` : '/',
    label: page.label || page.title || 'Page',
    type: 'custom',
    layoutKey: 'dynamic',
    visible: page.visible !== false,
    navigable: page.visible !== false,
    editable: true,
    order: 100 + index,
    customPageId: page.id,
  }))
}

function mergeSiteContent(remote = {}) {
  const content = remote.content || remote || {}
  const assets = objectRecords(remote.assets)
  const customPages = objectRecords(Array.isArray(content.engine?.pages) ? content.engine.pages : content.pages)
  const storedRegistry = objectRecords(content.engine?.pageRegistry)
  const configuredRegistry = storedRegistry.length ? storedRegistry : fallbackPageRegistry
  const registryIds = new Set(configuredRegistry.map(page => page.id).filter(Boolean))
  const pageRegistry = [...configuredRegistry, ...customRegistryEntries(customPages).filter(page => !registryIds.has(page.id))].sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
  const navigationFallback = pageRegistry.filter(page => page.navigable !== false).map(page => ({ id: page.id, pageId: page.customPageId, label: page.label, target: page.path, visible: page.visible !== false, external: false, order: page.order }))
  const storedNavigation = objectRecords(content.engine?.navigation).length ? objectRecords(content.engine.navigation) : objectRecords(content.navigation)
  const navigation = storedNavigation.length ? storedNavigation : navigationFallback
  const theme = content.engine?.theme || content.theme || {}
  const globals = content.engine?.globals || content.globals || {}
  const pageBlocks = content.engine?.pageBlocks || content.pageBlocks || {}
  const pageSeo = content.engine?.pageSeo || content.pageSeo || {}
  const branding = content.branding || {}
  const uploadedPrimaryLogo = assetUrl(latestAsset(assets, 'primaryLogo'))
  const home = { heroTitle: siteConfig.brandName, heroText: 'TwoToneTaj, an average gamer with a passion for games, a pure heart, good laughs, and an awesome community.', aboutTitle: 'About Me', aboutText: 'I’ve been gaming since 1989 and I’m here for the fun, the challenge, and the community.', scheduleTitle: 'Stream Schedule', twitchTitle: 'Live on Twitch', youtubeTitle: 'Latest YouTube Videos', socialsTitle: 'Stay Connected', expectTitle: 'What to Expect', merchTitle: `Official ${siteConfig.brandName} Merch`, merchText: `Exclusive ${siteConfig.communityName} merchandise is in development.`, ...(content.home || {}) }
  if (Array.isArray(home.schedule)) home.schedule = objectRecords(home.schedule)
  return {
    website: remote.website || null,
    brand: { name: siteConfig.brandName, tagline: siteConfig.brandTagline, shortTagline: siteConfig.brandShortTagline, ownerName: siteConfig.ownerName, communityName: siteConfig.communityName, supportCredit: siteConfig.studioCredit, ...(content.brand || {}), primaryLogo: content.brand?.primaryLogo || branding.primaryLogo || uploadedPrimaryLogo },
    branding: { headerStyle: 'Contained', footerStyle: 'Simple', showAnnouncement: false, ...branding },
    contact: { supportEmail: siteConfig.supportEmail, businessEmail: siteConfig.businessEmail, ...(content.contact || {}) },
    socials: { ...siteConfig.socials, ...(content.socials || {}) },
    platforms: { twitchChannel: siteConfig.platforms.twitchChannel, youtubeChannelId: siteConfig.platforms.youtubeChannelId, ...(content.platforms || {}) },
    home,
    about: { ...fallbackPages.about, ...(content.about || {}), sections: objectRecords(content.about?.sections || fallbackPages.about.sections) },
    contentPage: { ...fallbackPages.contentPage, ...(content.contentPage || {}) },
    communityPage: { ...fallbackPages.communityPage, ...(content.communityPage || {}) },
    contactPage: { ...fallbackPages.contactPage, ...(content.contactPage || {}) },
    privacy: { ...fallbackPages.privacy, ...(content.privacy || {}), sections: objectRecords(content.privacy?.sections || fallbackPages.privacy.sections) },
    terms: { ...fallbackPages.terms, ...(content.terms || {}), sections: objectRecords(content.terms?.sections || fallbackPages.terms.sections) },
    merch: sanitiseMerch(content.merch),
    navigation: navigation.filter(item => item.editorOnly !== true && item.visible !== false).sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    pageRegistry,
    pageSeo,
    pages: customPages,
    pageBlocks,
    theme,
    globals,
    editorPolicy: content.editorPolicy || { fields: {}, sections: {} },
    assets,
    assetUrls: { primaryLogo: uploadedPrimaryLogo, favicon: assetUrl(latestAsset(assets, 'favicon')), socialImage: assetUrl(latestAsset(assets, 'socialIcon')) },
    publishedAt: remote.publishedAt || content.updatedAt || null,
  }
}

function sitePath(fieldId) { return fieldId.replace(/^engine\.(navigation|theme|globals|pages|pageBlocks|pageRegistry|pageSeo)\./, '$1.') }
function setPathValue(source, path, value) { const keys = String(path || '').split('.').filter(Boolean); if (!keys.length) return source; const next = structuredClone(source); let target = next; keys.forEach((key, index) => { if (index === keys.length - 1) target[key] = value; else { const child = target[key]; const nextIsIndex = /^\d+$/.test(keys[index + 1]); target[key] = Array.isArray(child) ? [...child] : child && typeof child === 'object' ? { ...child } : nextIsIndex ? [] : {}; target = target[key] } }); return next }
function applyTheme(site) { const root = document.documentElement; const theme = site.theme || {}; if (theme.primary) root.style.setProperty('--primary', theme.primary); if (theme.secondary) root.style.setProperty('--secondary', theme.secondary); if (theme.background) root.style.setProperty('--background', theme.background); if (theme.text) root.style.setProperty('--text', theme.text); if (theme.radius !== undefined) root.style.setProperty('--brand-radius', `${theme.radius}px`); if (theme.font) root.style.setProperty('--brand-font', theme.font) }

const fallbackSite = mergeSiteContent()

export function useManagedSite() {
  const [site, setSite] = useState(fallbackSite)
  const [status, setStatus] = useState('fallback')
  useEffect(() => { let cancelled = false; async function loadSite() { try { const response = await fetch(ksjPublicUrl(`/public/sites/${KSJ_SITE_ID}`)); if (!response.ok) throw new Error(`Managed site failed: ${response.status}`); const data = await response.json(); if (!cancelled) { const next = mergeSiteContent(data); setSite(next); applyTheme(next); setStatus('managed') } } catch (error) { console.warn('Using fallback site content:', error); if (!cancelled) setStatus('fallback') } } loadSite(); return () => { cancelled = true } }, [])
  useEffect(() => { function receive(event) { if (event.data?.source !== 'ksj-portal-editor') return; if (event.data.type === 'initialise' && event.data.content) setSite(current => { const next = mergeSiteContent({ content: event.data.content, assets: current.assets, website: current.website }); applyTheme(next); return next }); if (event.data.type === 'patch-field' && event.data.fieldId) setSite(current => { let next = setPathValue(current, sitePath(event.data.fieldId), event.data.value); if (event.data.rule) next = { ...next, editorPolicy: { ...(next.editorPolicy || {}), fields: { ...(next.editorPolicy?.fields || {}), [event.data.fieldId]: event.data.rule } } }; applyTheme(next); return next }) } window.addEventListener('message', receive); return () => window.removeEventListener('message', receive) }, [])
  return { site, status }
}

export { fallbackSite }
