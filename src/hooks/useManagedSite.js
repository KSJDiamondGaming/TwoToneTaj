import { useEffect, useState } from 'react'
import { siteConfig } from '../config/siteConfig'

const SITE_ID = import.meta.env.VITE_KSJ_SITE_ID || 'twotonetaj'
const API_BASE = import.meta.env.VITE_KSJ_PUBLIC_API_URL || 'https://ksjdigital.co.uk/api'
const ASSET_BASE = import.meta.env.VITE_KSJ_ASSET_URL || 'https://ksjdigital.co.uk'

const fallbackNavigation = [
  { id: 'home', label: 'Home', target: '/', visible: true, external: false, order: 1 },
  { id: 'about', label: 'About', target: '/about', visible: true, external: false, order: 2 },
  { id: 'content', label: 'Content', target: '/content', visible: true, external: false, order: 3 },
  { id: 'community', label: 'Community', target: '/community', visible: true, external: false, order: 4 },
  { id: 'merch', label: 'Merch', target: '/merch', visible: true, external: false, order: 5 },
]

function assetUrl(asset) {
  if (!asset?.url) return ''
  return asset.url.startsWith('http') ? asset.url : `${ASSET_BASE}${asset.url}`
}

function latestAsset(assets = [], slotId) {
  return assets
    .filter((asset) => asset.slotId === slotId)
    .sort((a, b) => Number(b.version || 0) - Number(a.version || 0))[0]
}

function validCheckoutUrl(value = '') {
  try {
    return new URL(value).protocol === 'https:'
  } catch {
    return false
  }
}

function sanitiseMerch(merch) {
  if (!merch || !Array.isArray(merch.products)) return null

  return {
    ...merch,
    products: merch.products.map((product) => {
      const checkout = product.checkout || {}
      const checkoutReady =
        checkout.enabled === true &&
        product.availability === 'available' &&
        Number(product.priceGBP) > 0 &&
        Boolean(product.name?.trim()) &&
        Boolean(product.description?.trim()) &&
        Boolean(product.image?.url?.trim()) &&
        Boolean(product.shippingNote?.trim()) &&
        Boolean(checkout.provider?.trim()) &&
        validCheckoutUrl(checkout.url)

      return {
        ...product,
        checkout: {
          ...checkout,
          enabled: checkoutReady,
          url: checkoutReady ? checkout.url : '',
        },
      }
    }),
  }
}

function mergeSiteContent(remote = {}) {
  const content = remote.content || {}
  const assets = remote.assets || []
  const navigation = content.engine?.navigation || content.navigation || fallbackNavigation
  const primaryLogo = latestAsset(assets, 'primaryLogo')
  const favicon = latestAsset(assets, 'favicon')

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
    socials: {
      ...siteConfig.socials,
      ...(content.socials || {}),
    },
    platforms: {
      twitchChannel: siteConfig.platforms.twitchChannel,
      youtubeChannelId: siteConfig.platforms.youtubeChannelId,
      ...(content.platforms || {}),
    },
    home: {
      heroTitle: siteConfig.brandName,
      heroText:
        'TwoToneTaj, an average gamer with a passion for games, a pure heart, good laughs, and an awesome community.',
      aboutText:
        'I’ve been gaming since 1989 and I’m here for the fun, the challenge, and the community. You’ll find gameplay, chill streams, and plenty of unforgettable moments with the TajSquad.',
      merchTitle: `Official ${siteConfig.brandName} Merch`,
      merchText: `Hoodies, creator apparel, and exclusive ${siteConfig.communityName} merchandise are in development.`,
      ...(content.home || {}),
    },
    merch: sanitiseMerch(content.merch),
    navigation: navigation
      .filter((item) => item.visible !== false)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    assets,
    assetUrls: {
      primaryLogo: assetUrl(primaryLogo),
      favicon: assetUrl(favicon),
    },
    publishedAt: remote.publishedAt || null,
  }
}

const fallbackSite = mergeSiteContent()

export function useManagedSite() {
  const [site, setSite] = useState(fallbackSite)
  const [status, setStatus] = useState('fallback')

  useEffect(() => {
    let cancelled = false

    async function loadSite() {
      try {
        const response = await fetch(`${API_BASE}/public/sites/${SITE_ID}`)

        if (!response.ok) {
          throw new Error(`Managed site failed: ${response.status}`)
        }

        const data = await response.json()
        if (!cancelled) {
          setSite(mergeSiteContent(data))
          setStatus('managed')
        }
      } catch (error) {
        console.warn('Using fallback site content:', error)
        if (!cancelled) setStatus('fallback')
      }
    }

    loadSite()

    return () => {
      cancelled = true
    }
  }, [])

  return { site, status }
}

export { fallbackSite }
