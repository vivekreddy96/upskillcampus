import { useMemo } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  hasPermission,
  hasAnyPermission,
  canAccessRoute,
  getNavItemsForRole,
  type Permission,
} from '@/utils/permissions'

export function usePermissions() {
  const { user } = useAuth()
  const role = user?.role

  return useMemo(() => ({
    user,
    role,
    can: (permission: Permission) => role ? hasPermission(role, permission) : false,
    canAny: (permissions: Permission | Permission[]) => role ? hasAnyPermission(role, permissions) : false,
    canAccessRoute: (path: string) => role ? canAccessRoute(role, path) : false,
    navItems: role ? getNavItemsForRole(role) : [],
    isSuperAdmin: role === 'super_admin',
    isAdmin: role === 'admin' || role === 'super_admin',
    isFaculty: role === 'faculty',
    isStudent: role === 'student',
  }), [user, role])
}

export function useRoleGuard(permission: Permission | Permission[]): boolean {
  const { canAny } = usePermissions()
  return canAny(permission)
}
