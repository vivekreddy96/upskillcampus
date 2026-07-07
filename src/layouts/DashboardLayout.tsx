import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar, useSidebarWidth } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { SearchModal } from '@/components/layout/SearchModal'
import { useGlobalShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useInactivityLogout } from '@/hooks/useInactivityLogout'
import { RoutePermissionGuard } from '@/routes/RoutePermissionGuard'
import { cn } from '@/utils/cn'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useGlobalShortcuts(() => setSearchOpen(true))
  useInactivityLogout(true)

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />
      <div className={cn('transition-all duration-300', useSidebarWidth(collapsed))}>
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onSearchClick={() => setSearchOpen(true)}
        />
        <main className="p-4 lg:p-6 max-w-[1600px] mx-auto">
          <RoutePermissionGuard>
            <Outlet />
          </RoutePermissionGuard>
        </main>
      </div>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
