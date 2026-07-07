import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardCheck,
  Award, Megaphone, Library, BarChart3, Settings, User,
} from 'lucide-react'
import type { UserRole } from '@/types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: [
    '/',
    '/students',
    '/faculty',
    '/courses',
    '/attendance',
    '/results',
    '/announcements',
    '/library',
    '/analytics',
    '/settings',
  ],
  student: ['/', '/profile', '/attendance', '/results', '/courses'],
  faculty: ['/', '/courses', '/attendance', '/results', '/profile'],
}

const ALL_NAV_ITEMS: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/faculty', icon: GraduationCap, label: 'Faculty' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/results', icon: Award, label: 'Results' },
  { to: '/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const allowed = ROLE_ROUTES[role]
  return allowed.some((route) => {
    if (route === '/') return pathname === '/'
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

export function getNavItemsForRole(role: UserRole): NavItem[] {
  const allowed = ROLE_ROUTES[role]
  return ALL_NAV_ITEMS.filter((item) => allowed.includes(item.to))
}

export function getDefaultRoute(role: UserRole): string {
  return '/'
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin'
}

export function isStudent(role: UserRole): boolean {
  return role === 'student'
}
