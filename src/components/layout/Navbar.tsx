import { Menu, Search, Bell, Sun, Moon, LogOut, Command } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { getAnnouncements } from '@/services/announcementService'
import { ROLE_LABELS, ROLE_BADGE_VARIANT } from '@/utils/permissions'

interface NavbarProps {
  onMenuClick: () => void
  onSearchClick: () => void
}

export function Navbar({ onMenuClick, onSearchClick }: NavbarProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const highPriority = getAnnouncements().filter((a) => a.priority === 'high' && a.published !== false).length

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-[var(--border)]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-[var(--bg-secondary)]"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] text-sm text-[var(--text-muted)] hover:border-indigo-500/30 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] text-xs">
              <Command className="h-3 w-3" />K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {highPriority > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full gradient-bg text-[10px] text-white flex items-center justify-center">
                {highPriority}
              </span>
            )}
          </Button>
          {user && (
            <div className="flex items-center gap-3 ml-2 pl-2 border-l border-[var(--border)]">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <Badge variant={ROLE_BADGE_VARIANT[user.role]}>
                  {ROLE_LABELS[user.role]}
                </Badge>
              </div>
              <Avatar name={user.name} src={user.avatar} size="sm" />
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
