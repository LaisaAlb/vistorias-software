import type { LoginResponse } from '../interfaces/auth'

const KEY = 'epta:session'

type JwtPayload = {
  exp?: number
  [key: string]: unknown
}

function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null

    // base64url -> base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=')
    const json = atob(padded)

    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  const exp = payload?.exp
  if (!exp || typeof exp !== 'number') return true

  const nowSec = Math.floor(Date.now() / 1000)
  return nowSec >= exp
}

export function saveSession(session: LoginResponse) {
  localStorage.setItem(KEY, JSON.stringify(session))
}

export function loadSession(): LoginResponse | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as LoginResponse
    if (!parsed?.token || !parsed?.user) return null
    if (isTokenExpired(parsed.token)) return null
    return parsed
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(KEY)
}
