import type { ReactNode } from 'react'
import { usePermissions } from '@/hooks/usePermissions'
import type { Permission } from '@/utils/permissions'

interface PermissionGateProps {
  permission: Permission | Permission[]
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const { canAny } = usePermissions()
  if (!canAny(permission)) return <>{fallback}</>
  return <>{children}</>
}
