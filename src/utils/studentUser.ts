import type { User, Student } from '@/types'
import { getStudent, getStudents } from '@/services/studentService'

export function getLinkedStudent(user: User | null): Student | null {
  if (!user || user.role !== 'student') return null

  if (user.studentId) {
    return getStudent(user.studentId) ?? null
  }

  return getStudents().find((s) => s.email === user.email) ?? null
}
