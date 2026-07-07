import { getStorage, setStorage } from './storage'
import type { Student, Activity } from '@/types'
import { generateId } from '@/utils/cn'

function addActivity(action: string, user: string, type: Activity['type']) {
  const activities = getStorage<Activity[]>('activities', [])
  activities.unshift({
    id: generateId(),
    action,
    user,
    timestamp: new Date().toISOString(),
    type,
  })
  setStorage('activities', activities.slice(0, 50))
}

export function getStudents(): Student[] {
  return getStorage<Student[]>('students', [])
}

export function getStudent(id: string): Student | undefined {
  return getStudents().find((s) => s.id === id)
}

export function getStudentByEmail(email: string): Student | undefined {
  return getStudents().find((s) => s.email === email)
}

export function createStudent(data: Omit<Student, 'id'>, actor = 'Admin'): Student {
  const students = getStudents()
  const student: Student = { ...data, id: generateId() }
  setStorage('students', [...students, student])
  addActivity(`Student ${student.name} added`, actor, 'student')
  return student
}

export function updateStudent(id: string, data: Partial<Student>, actor = 'Admin'): Student | null {
  const students = getStudents()
  const index = students.findIndex((s) => s.id === id)
  if (index === -1) return null
  students[index] = { ...students[index], ...data }
  setStorage('students', students)
  addActivity(`Student ${students[index].name} updated`, actor, 'student')
  return students[index]
}

export function deleteStudent(id: string, actor = 'Admin'): boolean {
  const students = getStudents()
  const student = students.find((s) => s.id === id)
  if (!student) return false
  setStorage('students', students.filter((s) => s.id !== id))
  addActivity(`Student ${student.name} removed`, actor, 'student')
  return true
}

export function searchStudents(query: string): Student[] {
  const q = query.toLowerCase()
  return getStudents().filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
  )
}
