import { getStorage, setStorage } from './storage'
import type { Faculty } from '@/types'
import { generateId } from '@/utils/cn'

export function getFaculty(): Faculty[] {
  return getStorage<Faculty[]>('faculty', [])
}

export function getFacultyMember(id: string): Faculty | undefined {
  return getFaculty().find((f) => f.id === id)
}

export function createFaculty(data: Omit<Faculty, 'id'>): Faculty {
  const faculty = getFaculty()
  const member: Faculty = { ...data, id: generateId() }
  setStorage('faculty', [...faculty, member])
  return member
}

export function updateFaculty(id: string, data: Partial<Faculty>): Faculty | null {
  const faculty = getFaculty()
  const index = faculty.findIndex((f) => f.id === id)
  if (index === -1) return null
  faculty[index] = { ...faculty[index], ...data }
  setStorage('faculty', faculty)
  return faculty[index]
}

export function deleteFaculty(id: string): boolean {
  const faculty = getFaculty()
  if (!faculty.find((f) => f.id === id)) return false
  setStorage('faculty', faculty.filter((f) => f.id !== id))
  return true
}

export function getDepartments(): string[] {
  return [...new Set(getFaculty().map((f) => f.department))].sort()
}
