import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { loginService } from '../services/auth.service'
import { clearSession, loadSession, saveSession, isTokenExpired } from '../utils/auth-storage'
import type { User, LoginResponse, Role } from '../interfaces/auth'

type AuthContextValue = {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isReady: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
  hasRole: (role: Role) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ✅ hidrata na criação do state (antes do primeiro render)
  const session = loadSession()

  const [token, setToken] = useState<string | null>(() => session?.token ?? null)
  const [user, setUser] = useState<User | null>(() => session?.user ?? null)
  const [isReady, setIsReady] = useState<boolean>(() => true)

  // ✅ se quiser, valida token ao montar
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      clearSession()
      setToken(null)
      setUser(null)
    }
  }, [])

  // ✅ auto logout quando expirar
  useEffect(() => {
    if (!token) return
    if (isTokenExpired(token)) {
      clearSession()
      setToken(null)
      setUser(null)
      return
    }

    const payload = (() => {
      try {
        const [, p] = token.split('.')
        const base64 = p.replace(/-/g, '+').replace(/_/g, '/')
        const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=')
        return JSON.parse(atob(padded)) as { exp?: number }
      } catch {
        return null
      }
    })()

    const expSec = payload?.exp
    if (!expSec) return

    const ms = expSec * 1000 - Date.now()
    if (ms <= 0) return

    const t = window.setTimeout(() => {
      clearSession()
      setToken(null)
      setUser(null)
    }, ms)

    return () => window.clearTimeout(t)
  }, [token])

  async function login(email: string, password: string) {
    const data = await loginService({ email, password })

    setToken(data.token)
    setUser(data.user)
    saveSession(data)

    return data
  }

  function logout() {
    clearSession()
    setToken(null)
    setUser(null)
  }

  function hasRole(role: Role) {
    return user?.role === role
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: !!token && !!user,
      isReady,
      login,
      logout,
      hasRole,
    }),
    [token, user, isReady]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
