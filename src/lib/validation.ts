export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidUsername(value: string): boolean {
  return /^[a-z0-9_-]+$/.test(value.trim())
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function isOptionalHttpUrl(value: string): boolean {
  if (!value.trim()) return true
  return isValidHttpUrl(value)
}
