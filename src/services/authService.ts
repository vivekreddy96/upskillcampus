import { getStorage, setStorage } from './storage'

import { getSeedData } from './seed'

import { logAction } from './auditService'

import type { User, Session, Student, UserRole } from '@/types'

import { generateId } from '@/utils/cn'

import { assertPermission } from '@/utils/permissions'



const RBAC_VERSION = 2



function migrateToRbacV2(): void {

  const currentVersion = getStorage<number>('rbacVersion', 0)

  if (currentVersion >= RBAC_VERSION) return



  const data = getSeedData()

  setStorage('users', data.users)

  setStorage('faculty', data.faculty)

  setStorage('students', data.students)

  setStorage('departments', data.departments)

  setStorage('courses', data.courses)

  setStorage('attendance', data.attendance)

  setStorage('results', data.results)

  setStorage('timetable', data.timetable)

  setStorage('announcements', data.announcements)

  setStorage('library', data.library)

  setStorage('activities', data.activities)

  setStorage('auditLogs', data.auditLogs)

  setStorage('rbacVersion', RBAC_VERSION)

}



export function initializeDatabase(): void {

  const seeded = getStorage<boolean>('seeded', false)

  if (!seeded) {

    const data = getSeedData()

    setStorage('users', data.users)

    setStorage('faculty', data.faculty)

    setStorage('students', data.students)

    setStorage('departments', data.departments)

    setStorage('courses', data.courses)

    setStorage('attendance', data.attendance)

    setStorage('results', data.results)

    setStorage('timetable', data.timetable)

    setStorage('announcements', data.announcements)

    setStorage('library', data.library)

    setStorage('activities', data.activities)

    setStorage('auditLogs', data.auditLogs)

    setStorage('chatHistory', [])

    setStorage('settings', { theme: 'system', notifications: true, emailAlerts: true, sessionTimeout: 30 })

    setStorage('seeded', true)

    setStorage('rbacVersion', RBAC_VERSION)

  } else {

    migrateToRbacV2()

  }

}



export function login(

  email: string,

  password: string,

  rememberMe: boolean

): { success: boolean; user?: User; error?: string } {

  const users = getStorage<User[]>('users', [])

  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) return { success: false, error: 'Invalid email or password' }



  const expiresAt = new Date()

  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 1))



  const session: Session = {

    userId: user.id,

    role: user.role,

    rememberMe,

    expiresAt: expiresAt.toISOString(),

    lastActivity: new Date().toISOString(),

  }

  setStorage('session', session)



  logAction(user.id, user.name, user.role, 'LOGIN', 'auth', `User logged in`)



  return { success: true, user }

}



export function register(data: {

  name: string

  email: string

  password: string

}): { success: boolean; user?: User; error?: string } {

  const users = getStorage<User[]>('users', [])

  if (users.find((u) => u.email === data.email)) {

    return { success: false, error: 'Email already registered' }

  }



  const studentRecord: Student = {

    id: generateId(),

    name: data.name,

    rollNo: `CS${new Date().getFullYear()}${String(Math.floor(Math.random() * 900) + 100)}`,

    email: data.email,

    phone: '',

    department: 'Computer Science',

    year: 1,

    status: 'active',

    gpa: 0,

    enrollmentDate: new Date().toISOString(),

  }



  const students = getStorage<Student[]>('students', [])

  setStorage('students', [...students, studentRecord])



  const user: User = {

    id: generateId(),

    name: data.name,

    email: data.email,

    password: data.password,

    role: 'student',

    studentId: studentRecord.id,

    department: 'Computer Science',

    createdAt: new Date().toISOString(),

  }

  setStorage('users', [...users, user])



  logAction(user.id, user.name, user.role, 'REGISTER', 'auth', 'New student registered')



  return { success: true, user }

}



export function logout(): void {

  const user = getCurrentUser()

  if (user) {

    logAction(user.id, user.name, user.role, 'LOGOUT', 'auth', 'User logged out')

  }

  setStorage('session', null)

}



export function touchSession(): void {

  const session = getStorage<Session | null>('session', null)

  if (!session) return

  setStorage('session', { ...session, lastActivity: new Date().toISOString() })

}



export function getCurrentUser(): User | null {

  const session = getStorage<Session | null>('session', null)

  if (!session) return null

  if (new Date(session.expiresAt) < new Date()) {

    logout()

    return null

  }

  const users = getStorage<User[]>('users', [])

  const user = users.find((u) => u.id === session.userId)

  if (!user) return null

  return user

}



export function getUsers(): User[] {

  return getStorage<User[]>('users', [])

}



export function getAdmins(): User[] {

  return getUsers().filter((u) => u.role === 'admin' || u.role === 'super_admin')

}



export function createAdmin(

  actorRole: UserRole | undefined,

  data: { name: string; email: string; password: string; role: 'admin' | 'super_admin' }

): { success: boolean; user?: User; error?: string } {

  assertPermission(actorRole, 'admins.create')

  if (actorRole === 'admin' && data.role === 'super_admin') {

    return { success: false, error: 'Only Super Admin can create Super Admin accounts' }

  }



  const users = getUsers()

  if (users.find((u) => u.email === data.email)) {

    return { success: false, error: 'Email already exists' }

  }



  const user: User = {

    id: generateId(),

    name: data.name,

    email: data.email,

    password: data.password,

    role: data.role,

    department: 'Administration',

    createdAt: new Date().toISOString(),

  }

  setStorage('users', [...users, user])

  return { success: true, user }

}



export function updateAdmin(

  actorRole: UserRole | undefined,

  actorId: string,

  id: string,

  updates: Partial<User>

): { success: boolean; user?: User; error?: string } {

  assertPermission(actorRole, 'admins.edit')



  const users = getUsers()

  const target = users.find((u) => u.id === id)

  if (!target) return { success: false, error: 'User not found' }



  if (target.role === 'super_admin' && actorRole !== 'super_admin') {

    return { success: false, error: 'Cannot modify Super Admin' }

  }



  if (actorRole === 'admin' && (target.role === 'super_admin' || updates.role === 'super_admin')) {

    return { success: false, error: 'Insufficient permissions' }

  }



  if (updates.role && actorRole !== 'super_admin') {

    delete updates.role

  }



  const index = users.findIndex((u) => u.id === id)

  users[index] = { ...users[index], ...updates, id: users[index].id }

  setStorage('users', users)

  return { success: true, user: users[index] }

}



export function deleteAdmin(

  actorRole: UserRole | undefined,

  actorId: string,

  id: string

): { success: boolean; error?: string } {

  assertPermission(actorRole, 'admins.delete')



  if (id === actorId) return { success: false, error: 'Cannot delete your own account' }



  const users = getUsers()

  const target = users.find((u) => u.id === id)

  if (!target) return { success: false, error: 'User not found' }



  if (target.role === 'super_admin') {

    return { success: false, error: 'Cannot delete Super Admin' }

  }



  if (actorRole === 'admin' && target.role !== 'admin') {

    return { success: false, error: 'Insufficient permissions' }

  }



  setStorage('users', users.filter((u) => u.id !== id))

  return { success: true }

}



export function changeUserRole(

  actorRole: UserRole | undefined,

  userId: string,

  newRole: UserRole

): { success: boolean; error?: string } {

  assertPermission(actorRole, 'users.change_role')



  const users = getUsers()

  const target = users.find((u) => u.id === userId)

  if (!target) return { success: false, error: 'User not found' }

  if (target.role === 'super_admin' && actorRole !== 'super_admin') {

    return { success: false, error: 'Cannot change Super Admin role' }

  }



  const index = users.findIndex((u) => u.id === userId)

  users[index] = { ...users[index], role: newRole }

  setStorage('users', users)

  return { success: true }

}



export function updateUser(id: string, updates: Partial<User>): User | null {

  const users = getUsers()

  const index = users.findIndex((u) => u.id === id)

  if (index === -1) return null

  users[index] = { ...users[index], ...updates }

  setStorage('users', users)

  return users[index]

}



export function resetPassword(email: string): { success: boolean; message: string } {

  const users = getUsers()

  const user = users.find((u) => u.email === email)

  if (!user) {

    return { success: true, message: 'If an account exists, a reset link has been sent.' }

  }

  return { success: true, message: 'Password reset link sent to your email.' }

}



export function changePassword(

  userId: string,

  currentPassword: string,

  newPassword: string

): { success: boolean; error?: string } {

  const users = getUsers()

  const user = users.find((u) => u.id === userId)

  if (!user || user.password !== currentPassword) {

    return { success: false, error: 'Current password is incorrect' }

  }

  updateUser(userId, { password: newPassword })

  logAction(userId, user.name, user.role, 'PASSWORD_CHANGE', 'auth', 'Password updated')

  return { success: true }

}


