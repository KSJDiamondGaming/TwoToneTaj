import { useEffect, useState } from 'react'
import { siteConfig } from '../config/siteConfig'

const SITE_ID = import.meta.env.VITE_KSJ_SITE_ID || 'twotonetaj'
const API_BASE = import.meta.env.VITE_KSJ_PUBLIC_API_URL || 'https://ksjdigital.co.uk/api'

function mergeSiteContent(remote = {}) {
  const content = remote.content || {}

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
    assets: remote.assets || [],
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
