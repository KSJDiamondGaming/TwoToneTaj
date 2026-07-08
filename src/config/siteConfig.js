const env = import.meta.env

const getEnv = (key, fallback = '') => env[key] || fallback

const appHost = getEnv('VITE_APP_HOST', 'twotonetaj.ksjdigital.co.uk')
const localTwitchParent = getEnv('VITE_TWITCH_LOCAL_PARENT', 'localhost')

export const siteConfig = {
  brandName: getEnv('VITE_BRAND_NAME', 'TwoToneTaj'),
  brandTagline: getEnv('VITE_BRAND_TAGLINE', 'Average Gamer • Est. 1989'),
  brandShortTagline: getEnv('VITE_BRAND_SHORT_TAGLINE', 'Average gamer. Legendary vibes.'),
  ownerName: getEnv('VITE_OWNER_NAME', 'Taj'),
  communityName: getEnv('VITE_COMMUNITY_NAME', 'TajSquad'),
  appHost,
  siteUrl: getEnv('VITE_SITE_URL', `https://${appHost}`),
  supportEmail: getEnv('VITE_SUPPORT_EMAIL', 'support@ksjdigital.co.uk'),
  businessEmail: getEnv('VITE_BUSINESS_EMAIL', 'media@ksjdigital.co.uk'),
  studioCredit: getEnv('VITE_STUDIO_CREDIT', 'KSJ Digital'),
  socials: {
    twitch: getEnv('VITE_TWITCH_URL', 'https://www.twitch.tv/twotonetaj'),
    youtube: getEnv('VITE_YOUTUBE_URL', 'https://www.youtube.com/@twotonetaj'),
    tiktok: getEnv('VITE_TIKTOK_URL', 'https://www.tiktok.com/@twotonetaj'),
    kick: getEnv('VITE_KICK_URL', 'https://kick.com/twotonetaj'),
    instagram: getEnv('VITE_INSTAGRAM_URL', 'https://www.instagram.com/twotonetaj'),
    discord: getEnv('VITE_DISCORD_URL', 'https://discord.gg/WcbtQPuByd'),
    linktree: getEnv('VITE_LINKTREE_URL', 'https://linktr.ee/Twotonetaj'),
    paypal: getEnv('VITE_PAYPAL_URL', 'https://paypal.me/2tonetaj'),
  },
  platforms: {
    twitchChannel: getEnv('VITE_TWITCH_CHANNEL', 'twotonetaj'),
    twitchParents: [appHost, localTwitchParent].filter(Boolean),
    youtubeChannelId: getEnv('VITE_YOUTUBE_CHANNEL_ID', 'UC54tVexRR4IXeXpzg2Dq1UA'),
  },
}

export const getMailTo = (email, subject) =>
  `mailto:${email}?subject=${encodeURIComponent(subject)}`

export const getTwitchEmbedUrl = () => {
  const params = new URLSearchParams({
    channel: siteConfig.platforms.twitchChannel,
    muted: 'true',
  })

  siteConfig.platforms.twitchParents.forEach((parent) => {
    params.append('parent', parent)
  })

  return `https://player.twitch.tv/?${params.toString()}`
}

export const getYouTubeFeedUrl = () =>
  `https://www.youtube.com/feeds/videos.xml?channel_id=${siteConfig.platforms.youtubeChannelId}`
