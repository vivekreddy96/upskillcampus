import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { canAccessRoute } from '@/utils/permissions'

export function RoutePermissionGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return null

  const path = location.pathname.replace(/\/$/, '') || '/'
  if (!canAccessRoute(user.role, path)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
