import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import * as authService from '@/services/authService'
import { initializeDatabase } from '@/services/authService'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeDatabase()
    setUser(authService.getCurrentUser())
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string, rememberMe: boolean) => {
    const result = authService.login(email, password, rememberMe)
    if (result.success && result.user) {
      setUser(result.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }, [])

  const register = useCallback(async (data: { name: string; email: string; password: string }) => {
    const result = authService.register(data)
    if (result.success && result.user) {
      authService.login(data.email, data.password, false)
      setUser(result.user)
      return { success: true }
    }
    return { success: false, error: result.error }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (!user) return
    const updated = authService.updateUser(user.id, updates)
    if (updated) setUser(updated)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
