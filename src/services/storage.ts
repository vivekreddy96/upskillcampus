import type { StorageKey } from '@/types'

const PREFIX = 'sc_'

const KEY_MAP: Record<StorageKey, string> = {
  users: `${PREFIX}users`,
  session: `${PREFIX}session`,
  students: `${PREFIX}students`,
  faculty: `${PREFIX}faculty`,
  departments: `${PREFIX}departments`,
  courses: `${PREFIX}courses`,
  attendance: `${PREFIX}attendance`,
  results: `${PREFIX}results`,
  timetable: `${PREFIX}timetable`,
  announcements: `${PREFIX}announcements`,
  library: `${PREFIX}library`,
  activities: `${PREFIX}activities`,
  auditLogs: `${PREFIX}auditLogs`,
  settings: `${PREFIX}settings`,
  chatHistory: `${PREFIX}chatHistory`,
  seeded: `${PREFIX}seeded`,
  rbacVersion: `${PREFIX}rbacVersion`,
}

export function getStorage<T>(key: StorageKey, fallback: T): T {
  try {
    const raw = localStorage.getItem(KEY_MAP[key])
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorage<T>(key: StorageKey, value: T): void {
  localStorage.setItem(KEY_MAP[key], JSON.stringify(value))
}

export function removeStorage(key: StorageKey): void {
  localStorage.removeItem(KEY_MAP[key])
}

export function clearAllStorage(): void {
  Object.values(KEY_MAP).forEach((k) => localStorage.removeItem(k))
}
