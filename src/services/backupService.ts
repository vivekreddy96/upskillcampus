import { getStorage, setStorage } from './storage'
import type { StorageKey } from '@/types'

const DATA_KEYS: StorageKey[] = [
  'users', 'students', 'faculty', 'departments', 'courses',
  'attendance', 'results', 'timetable', 'announcements', 'library',
  'activities', 'auditLogs', 'settings',
]

export interface BackupData {
  version: number
  exportedAt: string
  data: Partial<Record<StorageKey, unknown>>
}

export function exportBackup(): BackupData {
  const data: Partial<Record<StorageKey, unknown>> = {}
  for (const key of DATA_KEYS) {
    data[key] = getStorage(key, null)
  }
  return { version: 2, exportedAt: new Date().toISOString(), data }
}

export function importBackup(backup: BackupData): boolean {
  if (!backup?.data) return false
  for (const key of DATA_KEYS) {
    if (backup.data[key] !== undefined) {
      setStorage(key, backup.data[key])
    }
  }
  return true
}

export function downloadBackup(): void {
  const backup = exportBackup()
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `smart-campus-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function restoreFromFile(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const backup = JSON.parse(reader.result as string) as BackupData
        resolve(importBackup(backup))
      } catch {
        resolve(false)
      }
    }
    reader.onerror = () => resolve(false)
    reader.readAsText(file)
  })
}

export function resetAllData(): void {
  for (const key of DATA_KEYS) {
    setStorage(key, null)
  }
  setStorage('seeded', false)
  setStorage('rbacVersion', null)
  setStorage('session', null)
}
