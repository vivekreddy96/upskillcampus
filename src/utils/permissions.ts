import type { UserRole } from '@/types'

export type Permission =
  | 'dashboard.view'
  | 'students.view'
  | 'students.view_own'
  | 'students.create'
  | 'students.edit'
  | 'students.delete'
  | 'faculty.view'
  | 'faculty.create'
  | 'faculty.edit'
  | 'faculty.delete'
  | 'courses.view'
  | 'courses.view_assigned'
  | 'courses.create'
  | 'courses.edit'
  | 'courses.delete'
  | 'departments.view'
  | 'departments.manage'
  | 'attendance.view'
  | 'attendance.view_own'
  | 'attendance.mark'
  | 'results.view'
  | 'results.view_own'
  | 'results.upload'
  | 'announcements.view'
  | 'announcements.create'
  | 'announcements.edit'
  | 'announcements.delete'
  | 'announcements.publish'
  | 'announcements.pin'
  | 'library.view'
  | 'library.manage'
  | 'timetable.view'
  | 'analytics.view'
  | 'reports.view'
  | 'audit.view'
  | 'settings.view'
  | 'settings.system'
  | 'admins.view'
  | 'admins.create'
  | 'admins.edit'
  | 'admins.delete'
  | 'users.change_role'
  | 'backup.manage'
  | 'ai.use'
  | 'profile.edit'

const ALL_PERMISSIONS: Permission[] = [
  'dashboard.view', 'students.view', 'students.view_own', 'students.create', 'students.edit', 'students.delete',
  'faculty.view', 'faculty.create', 'faculty.edit', 'faculty.delete',
  'courses.view', 'courses.view_assigned', 'courses.create', 'courses.edit', 'courses.delete',
  'departments.view', 'departments.manage',
  'attendance.view', 'attendance.view_own', 'attendance.mark',
  'results.view', 'results.view_own', 'results.upload',
  'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete', 'announcements.publish', 'announcements.pin',
  'library.view', 'library.manage', 'timetable.view',
  'analytics.view', 'reports.view', 'audit.view',
  'settings.view', 'settings.system',
  'admins.view', 'admins.create', 'admins.edit', 'admins.delete', 'users.change_role',
  'backup.manage', 'ai.use', 'profile.edit',
]

const ADMIN_PERMISSIONS: Permission[] = [
  'dashboard.view', 'students.view', 'students.create', 'students.edit', 'students.delete',
  'faculty.view', 'faculty.create', 'faculty.edit', 'faculty.delete',
  'courses.view', 'courses.create', 'courses.edit', 'courses.delete',
  'departments.view',
  'attendance.view', 'attendance.mark',
  'results.view', 'results.upload',
  'announcements.view', 'announcements.create', 'announcements.edit', 'announcements.delete', 'announcements.publish', 'announcements.pin',
  'library.view',
  'timetable.view', 'analytics.view', 'reports.view',
  'settings.view', 'ai.use', 'profile.edit',
]

const FACULTY_PERMISSIONS: Permission[] = [
  'dashboard.view', 'courses.view_assigned',
  'attendance.view', 'attendance.mark',
  'results.view', 'results.upload',
  'students.view',
  'announcements.view',
  'timetable.view', 'ai.use', 'profile.edit',
]

const STUDENT_PERMISSIONS: Permission[] = [
  'dashboard.view',
  'attendance.view_own', 'results.view_own',
  'courses.view', 'announcements.view', 'timetable.view',
  'ai.use', 'profile.edit', 'students.view_own',
]

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: ALL_PERMISSIONS,
  admin: ADMIN_PERMISSIONS,
  faculty: FACULTY_PERMISSIONS,
  student: STUDENT_PERMISSIONS,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  faculty: 'Faculty',
  student: 'Student',
}

export const ROLE_BADGE_VARIANT: Record<UserRole, 'purple' | 'info' | 'success' | 'warning'> = {
  super_admin: 'purple',
  admin: 'info',
  faculty: 'success',
  student: 'warning',
}

export interface NavItem {
  to: string
  label: string
  icon: string
  permission: Permission | Permission[]
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: 'LayoutDashboard', permission: 'dashboard.view', end: true },
  { to: '/students', label: 'Students', icon: 'Users', permission: ['students.view', 'students.view_own'] },
  { to: '/faculty', label: 'Faculty', icon: 'GraduationCap', permission: 'faculty.view' },
  { to: '/courses', label: 'Courses', icon: 'BookOpen', permission: ['courses.view', 'courses.view_assigned'] },
  { to: '/departments', label: 'Departments', icon: 'Building', permission: 'departments.view' },
  { to: '/attendance', label: 'Attendance', icon: 'ClipboardCheck', permission: ['attendance.view', 'attendance.view_own'] },
  { to: '/results', label: 'Results', icon: 'Award', permission: ['results.view', 'results.view_own'] },
  { to: '/timetable', label: 'Timetable', icon: 'Calendar', permission: 'timetable.view' },
  { to: '/announcements', label: 'Announcements', icon: 'Megaphone', permission: 'announcements.view' },
  { to: '/library', label: 'Library', icon: 'Library', permission: 'library.view' },
  { to: '/analytics', label: 'Analytics', icon: 'BarChart3', permission: 'analytics.view' },
  { to: '/admins', label: 'Admin Management', icon: 'Shield', permission: 'admins.view' },
  { to: '/audit-logs', label: 'Audit Logs', icon: 'ScrollText', permission: 'audit.view' },
  { to: '/backup', label: 'Backup & Restore', icon: 'Database', permission: 'backup.manage' },
  { to: '/ai-assistant', label: 'AI Assistant', icon: 'Bot', permission: 'ai.use' },
  { to: '/profile', label: 'Profile', icon: 'User', permission: 'profile.edit' },
  { to: '/settings', label: 'Settings', icon: 'Settings', permission: 'settings.view' },
]

export const ROUTE_PERMISSIONS: Record<string, Permission | Permission[]> = {
  '/': 'dashboard.view',
  '/students': ['students.view', 'students.view_own'],
  '/faculty': 'faculty.view',
  '/courses': ['courses.view', 'courses.view_assigned'],
  '/departments': 'departments.view',
  '/attendance': ['attendance.view', 'attendance.view_own'],
  '/results': ['results.view', 'results.view_own'],
  '/timetable': 'timetable.view',
  '/announcements': 'announcements.view',
  '/library': 'library.view',
  '/analytics': 'analytics.view',
  '/admins': 'admins.view',
  '/audit-logs': 'audit.view',
  '/backup': 'backup.manage',
  '/ai-assistant': 'ai.use',
  '/profile': 'profile.edit',
  '/settings': 'settings.view',
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function hasAnyPermission(role: UserRole, permissions: Permission | Permission[]): boolean {
  const list = Array.isArray(permissions) ? permissions : [permissions]
  return list.some((p) => hasPermission(role, p))
}

export function canAccessRoute(role: UserRole, path: string): boolean {
  const normalized = path.split('?')[0].replace(/\/$/, '') || '/'
  const required = ROUTE_PERMISSIONS[normalized]
  if (!required) return true
  return hasAnyPermission(role, required)
}

export function getNavItemsForRole(role: UserRole): NavItem[] {
  return NAV_ITEMS.filter((item) => hasAnyPermission(role, item.permission))
}

export function getDefaultRoute(_role: UserRole): string {
  return '/'
}

export function assertPermission(role: UserRole | undefined, permission: Permission): void {
  if (!role || !hasPermission(role, permission)) {
    throw new Error('You do not have permission to perform this action')
  }
}
