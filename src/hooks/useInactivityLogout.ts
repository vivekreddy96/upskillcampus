import { useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { touchSession } from '@/services/authService'

const INACTIVITY_MS = 30 * 60 * 1000 // 30 minutes

export function useInactivityLogout(enabled = true) {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = useCallback(() => {
    if (!enabled || !user) return
    touchSession()
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      logout()
      toast('Session expired due to inactivity', 'info')
    }, INACTIVITY_MS)
  }, [enabled, user, logout, toast])

  useEffect(() => {
    if (!enabled || !user) return

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, resetTimer))
    resetTimer()

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [enabled, user, resetTimer])
}
