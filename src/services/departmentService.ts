import { getStorage, setStorage } from './storage'
import type { Department } from '@/types'
import { generateId } from '@/utils/cn'
import { assertPermission } from '@/utils/permissions'
import type { UserRole } from '@/types'

export function getDepartments(): Department[] {
  return getStorage<Department[]>('departments', [])
}

export function getDepartment(id: string): Department | undefined {
  return getDepartments().find((d) => d.id === id)
}

export function createDepartment(
  role: UserRole | undefined,
  data: Omit<Department, 'id'>
): Department {
  assertPermission(role, 'departments.manage')
  const departments = getDepartments()
  const dept: Department = { ...data, id: generateId() }
  setStorage('departments', [...departments, dept])
  return dept
}

export function updateDepartment(
  role: UserRole | undefined,
  id: string,
  data: Partial<Department>
): Department | null {
  assertPermission(role, 'departments.manage')
  const departments = getDepartments()
  const index = departments.findIndex((d) => d.id === id)
  if (index === -1) return null
  departments[index] = { ...departments[index], ...data }
  setStorage('departments', departments)
  return departments[index]
}

export function deleteDepartment(role: UserRole | undefined, id: string): boolean {
  assertPermission(role, 'departments.manage')
  const departments = getDepartments()
  if (!departments.find((d) => d.id === id)) return false
  setStorage('departments', departments.filter((d) => d.id !== id))
  return true
}

export function seedDepartments(): Department[] {
  return [
    { id: 'dept-1', name: 'Computer Science', code: 'CS', head: 'Dr. Sarah Mitchell', facultyCount: 4, studentCount: 15, description: 'Computing, AI, and software engineering programs.' },
    { id: 'dept-2', name: 'Electrical Engineering', code: 'EE', head: 'Dr. James Wilson', facultyCount: 4, studentCount: 12, description: 'Electronics, circuits, and power systems.' },
    { id: 'dept-3', name: 'Mechanical Engineering', code: 'ME', head: 'Dr. Emily Chen', facultyCount: 4, studentCount: 12, description: 'Mechanics, thermodynamics, and manufacturing.' },
    { id: 'dept-4', name: 'Business Administration', code: 'BA', head: 'Dr. Michael Brown', facultyCount: 3, studentCount: 11, description: 'Management, finance, and entrepreneurship.' },
  ]
}
