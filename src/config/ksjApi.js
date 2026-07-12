const isLocal = import.meta.env.DEV || ['localhost', '127.0.0.1'].includes(window.location.hostname)

export const KSJ_SITE_ID = import.meta.env.VITE_KSJ_SITE_ID || 'twotonetaj'
export const KSJ_API_BASE = (
  import.meta.env.VITE_KSJ_PUBLIC_API_URL ||
  (isLocal ? 'http://localhost:4174/api' : 'https://ksjdigital.co.uk/api')
).replace(/\/$/, '')
export const KSJ_ASSET_BASE = (
  import.meta.env.VITE_KSJ_ASSET_URL ||
  (isLocal ? 'http://localhost:4174' : 'https://ksjdigital.co.uk')
).replace(/\/$/, '')

export function ksjPublicUrl(path = '') {
  const safePath = String(path).startsWith('/') ? path : `/${path}`
  return `${KSJ_API_BASE}${safePath}`
}

export function ksjAssetUrl(path = '') {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const safePath = String(path).startsWith('/') ? path : `/${path}`
  return `${KSJ_ASSET_BASE}${safePath}`
}
