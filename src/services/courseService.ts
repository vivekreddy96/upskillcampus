import { getStorage, setStorage } from './storage'
import type { Course, Activity } from '@/types'
import { generateId } from '@/utils/cn'

function addActivity(action: string) {
  const activities = getStorage<Activity[]>('activities', [])
  activities.unshift({
    id: generateId(),
    action,
    user: 'Admin',
    timestamp: new Date().toISOString(),
    type: 'course',
  })
  setStorage('activities', activities.slice(0, 50))
}

export function getCourses(): Course[] {
  return getStorage<Course[]>('courses', [])
}

export function getCourse(id: string): Course | undefined {
  return getCourses().find((c) => c.id === id)
}

export function createCourse(data: Omit<Course, 'id'>): Course {
  const courses = getCourses()
  const course: Course = { ...data, id: generateId() }
  setStorage('courses', [...courses, course])
  addActivity(`Course ${course.code} added`)
  return course
}

export function updateCourse(id: string, data: Partial<Course>): Course | null {
  const courses = getCourses()
  const index = courses.findIndex((c) => c.id === id)
  if (index === -1) return null
  courses[index] = { ...courses[index], ...data }
  setStorage('courses', courses)
  return courses[index]
}

export function deleteCourse(id: string): boolean {
  const courses = getCourses()
  const course = courses.find((c) => c.id === id)
  if (!course) return false
  setStorage('courses', courses.filter((c) => c.id !== id))
  addActivity(`Course ${course.code} removed`)
  return true
}
