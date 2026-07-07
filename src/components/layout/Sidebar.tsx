import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck,
  Award, Calendar, Megaphone, Library, Bot, User, Settings, X, ChevronLeft,
  Building2, Shield, ScrollText, Database, BarChart3, Building,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { usePermissions } from '@/hooks/usePermissions'
import type { NavItem } from '@/utils/permissions'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck,
  Award, Calendar, Megaphone, Library, Bot, User, Settings,
  Shield, ScrollText, Database, BarChart3, Building,
}

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

export function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const { navItems } = usePermissions()

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full glass border-r border-[var(--border)]',
          'flex flex-col transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--border)]">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm gradient-text">Smart Campus</span>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]"
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          </button>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <SidebarLink key={item.to} item={item} collapsed={collapsed} onClose={onClose} />
          ))}
        </nav>
      </aside>
    </>
  )
}

function SidebarLink({ item, collapsed, onClose }: { item: NavItem; collapsed: boolean; onClose: () => void }) {
  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
          isActive
            ? 'gradient-bg text-white shadow-md'
            : 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]'
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  )
}

export function useSidebarWidth(collapsed: boolean) {
  return collapsed ? 'lg:pl-[72px]' : 'lg:pl-64'
}
