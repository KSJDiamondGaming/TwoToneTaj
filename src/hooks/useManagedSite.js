import { useEffect, useState } from 'react'
import { KSJ_API_BASE, KSJ_SITE_ID, ksjAssetUrl, ksjPublicUrl } from '../config/ksjApi'
import { siteConfig } from '../config/siteConfig'

const fallbackNavigation = [
  { id: 'home', label: 'Home', target: '/', visible: true, external: false, order: 1 },
  { id: 'about', label: 'About', target: '/about', visible: true, external: false, order: 2 },
  { id: 'content', label: 'Content', target: '/content', visible: true, external: false, order: 3 },
  { id: 'community', label: 'Community', target: '/community', visible: true, external: false, order: 4 },
  { id: 'merch', label: 'Merch', target: '/merch', visible: true, external: false, order: 5 },
]

function assetUrl(asset) {
  return ksjAssetUrl(asset?.url || '')
}

function latestAsset(assets = [], slotId) {
  return assets.filter((asset) => asset.slotId === slotId).sort((a, b) => Number(b.version || 0) - Number(a.version || 0))[0]
}

function validCheckoutUrl(value = '') {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))
  } catch {
    return false
  }
}

function providerCheckoutUrl(provider, productId) {
  const normalisedProvider = provider?.trim().toLowerCase()
  if (!['stripe', 'paypal'].includes(normalisedProvider) || !productId) return ''
  const params = new URLSearchParams({ websiteId: KSJ_SITE_ID, productId, quantity: '1' })
  return `${KSJ_API_BASE}/checkout/${normalisedProvider}/start?${params}`
}

function sanitiseMerch(merch) {
  if (!merch || !Array.isArray(merch.products)) return null
  return {
    ...merch,
    products: merch.products.map((product) => {
      const checkout = product.checkout || {}
      const providerUrl = providerCheckoutUrl(checkout.provider, product.id)
      const url = providerUrl || checkout.url?.trim() || ''
      const madeToOrder = product.fulfilmentOptions?.madeToOrder === true
      const leadTimeMessage = product.fulfilmentOptions?.leadTimeMessage?.trim() || ''
      const stock = Math.max(0, Number(product.inventory?.quantity || product.inventory?.stock || 0))
      const checkoutReady = checkout.enabled === true && product.availability === 'available' && Number(product.priceGBP) > 0 && Boolean(product.name?.trim()) && Boolean(product.description?.trim()) && Boolean(product.shippingNote?.trim()) && (!madeToOrder || Boolean(leadTimeMessage)) && (checkout.mode === 'managed' || validCheckoutUrl(url))
      return {
        ...product,
        shippingNote: madeToOrder ? `* ${leadTimeMessage}` : product.shippingNote,
        fulfilmentOptions: { madeToOrder, leadTimeMessage },
        inventory: {
          ...(product.inventory || {}),
          trackStock: madeToOrder ? false : product.inventory?.trackStock === true,
          readyStock: stock,
          quantity: stock,
          stock,
          variants: Array.isArray(product.inventory?.variants) ? product.inventory.variants : [],
        },
        checkout: { ...checkout, enabled: checkoutReady, url: checkoutReady ? url : '' },
      }
    }),
  }
}

function mergeSiteContent(remote = {}) {
  const content = remote.content || remote || {}
  const assets = remote.assets || []
  const navigation = content.engine?.navigation || content.navigation || fallbackNavigation
  const primaryLogo = latestAsset(assets, 'primaryLogo')
  const favicon = latestAsset(assets, 'favicon')
  const socialImage = latestAsset(assets, 'socialIcon')
  const theme = content.engine?.theme || content.theme || {}
  const globals = content.engine?.globals || content.globals || {}

  return {
    website: remote.website || null,
    brand: {
      name: siteConfig.brandName,
      tagline: siteConfig.brandTagline,
      shortTagline: siteConfig.brandShortTagline,
      ownerName: siteConfig.ownerName,
      communityName: siteConfig.communityName,
      supportCredit: siteConfig.studioCredit,
      ...(content.brand || {}),
    },
    contact: {
      supportEmail: siteConfig.supportEmail,
      businessEmail: siteConfig.businessEmail,
      ...(content.contact || {}),
    },
    socials: { ...siteConfig.socials, ...(content.socials || {}) },
    platforms: {
      twitchChannel: siteConfig.platforms.twitchChannel,
      youtubeChannelId: siteConfig.platforms.youtubeChannelId,
      ...(content.platforms || {}),
    },
    home: {
      heroTitle: siteConfig.brandName,
      heroText: 'TwoToneTaj, an average gamer with a passion for games, a pure heart, good laughs, and an awesome community.',
      aboutTitle: 'About Me',
      aboutText: 'I’ve been gaming since 1989 and I’m here for the fun, the challenge, and the community. You’ll find gameplay, chill streams, and plenty of unforgettable moments with the TajSquad.',
      scheduleTitle: 'Stream Schedule',
      twitchTitle: 'Live on Twitch',
      youtubeTitle: 'Latest YouTube Videos',
      socialsTitle: 'Stay Connected',
      expectTitle: 'What to Expect',
      merchTitle: `Official ${siteConfig.brandName} Merch`,
      merchText: `Hoodies, creator apparel, and exclusive ${siteConfig.communityName} merchandise are in development.`,
      ...(content.home || {}),
    },
    merch: sanitiseMerch(content.merch),
    navigation: navigation.filter((item) => item.visible !== false).sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    theme,
    globals,
    editorPolicy: content.editorPolicy || { fields: {}, sections: {} },
    assets,
    assetUrls: {
      primaryLogo: assetUrl(primaryLogo),
      favicon: assetUrl(favicon),
      socialImage: assetUrl(socialImage),
    },
    publishedAt: remote.publishedAt || content.updatedAt || null,
  }
}

function setPathValue(source, path, value) {
  const keys = String(path || '').split('.').filter(Boolean)
  if (!keys.length) return source
  const next = structuredClone(source)
  let target = next
  keys.forEach((key, index) => {
    if (index === keys.length - 1) target[key] = value
    else {
      target[key] = target[key] && typeof target[key] === 'object' ? { ...target[key] } : {}
      target = target[key]
    }
  })
  return next
}

function applyTheme(site) {
  const root = document.documentElement
  const theme = site.theme || {}
  if (theme.primary) root.style.setProperty('--primary', theme.primary)
  if (theme.secondary) root.style.setProperty('--secondary', theme.secondary)
  if (theme.background) root.style.setProperty('--background', theme.background)
  if (theme.text) root.style.setProperty('--text', theme.text)
  if (theme.radius !== undefined) root.style.setProperty('--brand-radius', `${theme.radius}px`)
  if (theme.font) root.style.setProperty('--brand-font', theme.font)
}

const fallbackSite = mergeSiteContent()

export function useManagedSite() {
  const [site, setSite] = useState(fallbackSite)
  const [status, setStatus] = useState('fallback')

  useEffect(() => {
    let cancelled = false
    async function loadSite() {
      try {
        const response = await fetch(ksjPublicUrl(`/public/sites/${KSJ_SITE_ID}`))
        if (!response.ok) throw new Error(`Managed site failed: ${response.status}`)
        const data = await response.json()
        if (!cancelled) {
          const next = mergeSiteContent(data)
          setSite(next)
          applyTheme(next)
          setStatus('managed')
        }
      } catch (error) {
        console.warn('Using fallback site content:', error)
        if (!cancelled) setStatus('fallback')
      }
    }
    loadSite()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    function receive(event) {
      if (event.data?.source !== 'ksj-portal-editor') return
      if (event.data.type === 'initialise' && event.data.content) {
        setSite((current) => {
          const next = mergeSiteContent({ content: event.data.content, assets: current.assets, website: current.website })
          applyTheme(next)
          return next
        })
      }
      if (event.data.type === 'patch-field' && event.data.fieldId) {
        setSite((current) => {
          let next = setPathValue(current, event.data.fieldId, event.data.value)
          if (event.data.rule) {
            next = {
              ...next,
              editorPolicy: {
                ...(next.editorPolicy || {}),
                fields: {
                  ...(next.editorPolicy?.fields || {}),
                  [event.data.fieldId]: event.data.rule,
                },
              },
            }
          }
          applyTheme(next)
          return next
        })
      }
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [])

  return { site, status }
}

export { fallbackSite }
