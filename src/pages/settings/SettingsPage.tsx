import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings, Sun, Moon, Monitor, Bell, Mail, Database, Trash2, RotateCcw,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/context/ToastContext'
import { getSettings, updateSettings, resetSettings } from '@/services/settingsService'
import { clearChatHistory } from '@/services/aiService'
import { cn } from '@/utils/cn'
import type { AppSettings } from '@/types'

const themeOptions = [
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Monitor },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [settings, setSettingsState] = useState<AppSettings>(getSettings())

  const handleThemeChange = (value: AppSettings['theme']) => {
    setTheme(value)
    const updated = updateSettings({ theme: value })
    setSettingsState(updated)
    toast('Theme updated', 'success')
  }

  const toggleSetting = (key: 'notifications' | 'emailAlerts') => {
    const updated = updateSettings({ [key]: !settings[key] })
    setSettingsState(updated)
    toast(`${key === 'notifications' ? 'Notifications' : 'Email alerts'} ${updated[key] ? 'enabled' : 'disabled'}`, 'success')
  }

  const handleClearChat = () => {
    clearChatHistory()
    toast('AI chat history cleared', 'success')
  }

  const handleResetSettings = () => {
    const reset = resetSettings()
    setSettingsState(reset)
    setTheme(reset.theme)
    toast('Settings reset to defaults', 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-3xl"
    >
      <PageHeader
        title="Settings"
        description="Customize your Smart Campus experience"
      />

      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="h-5 w-5 text-indigo-500" />
          <CardTitle>Appearance</CardTitle>
        </div>
        <CardDescription>Choose how Smart Campus looks on your device</CardDescription>
        <div className="grid grid-cols-3 gap-3 mt-6">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                theme === option.value
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-md'
                  : 'border-[var(--border)] hover:border-indigo-500/30 hover:bg-[var(--bg-secondary)]'
              )}
            >
              <option.icon className={cn('h-6 w-6', theme === option.value ? 'text-indigo-500' : 'text-[var(--text-muted)]')} />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Bell className="h-5 w-5 text-indigo-500" />
          <CardTitle>Notifications</CardTitle>
        </div>
        <CardDescription>Manage how you receive updates</CardDescription>
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-[var(--text-muted)]" />
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-[var(--text-muted)]">Receive campus announcements and alerts</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('notifications')}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                settings.notifications ? 'bg-indigo-500' : 'bg-[var(--border)]'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  settings.notifications && 'translate-x-5'
                )}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[var(--text-muted)]" />
              <div>
                <p className="text-sm font-medium">Email Alerts</p>
                <p className="text-xs text-[var(--text-muted)]">Get important updates via email</p>
              </div>
            </div>
            <button
              onClick={() => toggleSetting('emailAlerts')}
              className={cn(
                'relative w-11 h-6 rounded-full transition-colors',
                settings.emailAlerts ? 'bg-indigo-500' : 'bg-[var(--border)]'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  settings.emailAlerts && 'translate-x-5'
                )}
              />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Database className="h-5 w-5 text-indigo-500" />
          <CardTitle>Data Management</CardTitle>
        </div>
        <CardDescription>Manage local data stored in your browser</CardDescription>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button variant="outline" onClick={handleClearChat}>
            <Trash2 className="h-4 w-4" />
            Clear AI Chat History
          </Button>
          <Button variant="secondary" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4" />
            Reset Settings
          </Button>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-4">
          All data is stored locally in your browser. Clearing data cannot be undone.
        </p>
      </Card>
    </motion.div>
  )
}
