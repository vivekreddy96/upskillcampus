import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { PageSkeleton } from '@/components/ui/Skeleton'
import { canAccessRoute, hasAnyPermission, type Permission } from '@/utils/permissions'

interface PermissionRouteProps {
  permission: Permission | Permission[]
  children?: React.ReactNode
}

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl"><PageSkeleton /></div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function GuestRoute() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <Outlet />
}

export function PermissionRoute({ permission, children }: PermissionRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-4xl"><PageSkeleton /></div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  const routeAllowed = canAccessRoute(user.role, location.pathname)
  const permAllowed = hasAnyPermission(user.role, permission)

  if (!routeAllowed && !permAllowed) {
    return <Navigate to="/unauthorized" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
