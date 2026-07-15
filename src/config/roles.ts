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
  super_admin: [
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
    '/timetable',
    '/ai-assistant',
    '/profile',
  ],
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
    '/timetable',
    '/ai-assistant',
    '/profile',
  ],
  student: ['/', '/profile', '/attendance', '/results', '/courses', '/timetable', '/announcements'],
  faculty: ['/', '/courses', '/attendance', '/results', '/profile', '/timetable', '/announcements'],
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

export interface RoleExperience {
  title: string
  badge: string
  description: string
  accent: string
  actions: string[]
}

export function getRoleExperience(role: UserRole): RoleExperience {
  switch (role) {
    case 'super_admin':
      return {
        title: 'Super Admin Command Center',
        badge: 'Super Admin',
        description: 'Oversee the full campus ecosystem with strategic controls and live insights.',
        accent: 'from-violet-500 to-fuchsia-500',
        actions: ['Manage campus operations', 'Monitor system health', 'Coordinate executive workflows'],
      }
    case 'admin':
      return {
        title: 'Admin Control Center',
        badge: 'Admin',
        description: 'Run day-to-day academic operations with secure, role-based oversight.',
        accent: 'from-indigo-500 to-purple-500',
        actions: ['Manage campus operations', 'Review analytics', 'Coordinate academic workflows'],
      }
    case 'faculty':
      return {
        title: 'Faculty Command Deck',
        badge: 'Faculty',
        description: 'Stay focused on teaching, mentorship, and course delivery.',
        accent: 'from-emerald-500 to-teal-500',
        actions: ['Manage assigned courses', 'Track attendance', 'Publish results'],
      }
    default:
      return {
        title: 'Student Experience Hub',
        badge: 'Student',
        description: 'Access your courses, attendance, grades, and campus updates effortlessly.',
        accent: 'from-amber-500 to-orange-500',
        actions: ['Manage learning progress', 'Review attendance', 'Stay informed'],
      }
  }
}

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
