function normalizeOrigin(origin: string) {
  return origin.replace(/\/+$/, '')
}

export function getPublicAppOrigin() {
  const envOrigin = process.env.NEXT_PUBLIC_APP_URL
  if (envOrigin && typeof envOrigin === 'string' && envOrigin.trim()) {
    return normalizeOrigin(envOrigin.trim())
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return normalizeOrigin(window.location.origin)
  }

  return ''
}

export function buildPublicAppUrl(pathname: string) {
  const origin = getPublicAppOrigin()
  if (!origin) return ''
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${origin}${path}`
}
