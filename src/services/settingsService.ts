import { getStorage, setStorage } from './storage'
import type { AppSettings } from '@/types'

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  notifications: true,
  emailAlerts: true,
}

export function getSettings(): AppSettings {
  return getStorage<AppSettings>('settings', DEFAULT_SETTINGS)
}

export function updateSettings(updates: Partial<AppSettings>): AppSettings {
  const current = getSettings()
  const updated = { ...current, ...updates }
  setStorage('settings', updated)
  return updated
}

export function resetSettings(): AppSettings {
  setStorage('settings', DEFAULT_SETTINGS)
  return DEFAULT_SETTINGS
}
