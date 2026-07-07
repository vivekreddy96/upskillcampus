import { getStorage, setStorage } from './storage'
import type { AuditLog, UserRole } from '@/types'
import { generateId } from '@/utils/cn'

export function getAuditLogs(): AuditLog[] {
  return getStorage<AuditLog[]>('auditLogs', [])
}

export function logAudit(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
  const logs = getAuditLogs()
  const log: AuditLog = {
    ...entry,
    id: generateId(),
    timestamp: new Date().toISOString(),
  }
  setStorage('auditLogs', [log, ...logs].slice(0, 500))
  return log
}

export function logAction(
  userId: string,
  userName: string,
  userRole: UserRole,
  action: string,
  resource: string,
  details = ''
): AuditLog {
  return logAudit({ userId, userName, userRole, action, resource, details })
}

export function clearAuditLogs(): void {
  setStorage('auditLogs', [])
}

export function searchAuditLogs(query: string): AuditLog[] {
  const q = query.toLowerCase()
  return getAuditLogs().filter(
    (l) =>
      l.action.toLowerCase().includes(q) ||
      l.userName.toLowerCase().includes(q) ||
      l.resource.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q)
  )
}
