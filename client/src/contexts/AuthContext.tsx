import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Role, User, LoginResponse } from "../interfaces/auth"
import { loginService } from "../services/auth.service"

type AuthState = {
  token: string | null
  user: User | null
}

type AuthContextType = {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
  hasRole: (...roles: Role[]) => boolean
}

const STORAGE_KEY = "epta.auth"

const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    user: null,
  })

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as AuthState
      if (parsed?.token && parsed?.user) {
        setState(parsed)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  const isAuthenticated = !!state.token && !!state.user

  async function login(email: string, password: string) {
    const data = await loginService({ email, password })

    const next: AuthState = {
      token: data.token,
      user: data.user,
    }

    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

    return data
  }

  function logout() {
    setState({ token: null, user: null })
    localStorage.removeItem(STORAGE_KEY)
  }

  function hasRole(...roles: Role[]) {
    return !!state.user && roles.includes(state.user.role)
  }

  const value = useMemo(
    () => ({
      token: state.token,
      user: state.user,
      isAuthenticated,
      login,
      logout,
      hasRole,
    }),
    [state.token, state.user, isAuthenticated]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
