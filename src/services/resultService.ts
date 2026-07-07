import { getStorage, setStorage } from './storage'
import type { Result, Activity } from '@/types'
import { generateId } from '@/utils/cn'
import { marksToGrade, calculateTotalMarks } from '@/utils/gpa'

function addActivity(action: string) {
  const activities = getStorage<Activity[]>('activities', [])
  activities.unshift({
    id: generateId(),
    action,
    user: 'Admin',
    timestamp: new Date().toISOString(),
    type: 'result',
  })
  setStorage('activities', activities.slice(0, 50))
}

export function getResults(): Result[] {
  return getStorage<Result[]>('results', [])
}

export function getResultsByStudent(studentId: string): Result[] {
  return getResults().filter((r) => r.studentId === studentId)
}

export function createResult(data: Omit<Result, 'id' | 'grade'>): Result {
  const results = getResults()
  const total = calculateTotalMarks(data.internalMarks, data.externalMarks)
  const result: Result = { ...data, id: generateId(), grade: marksToGrade(total) }
  setStorage('results', [...results, result])
  addActivity(`Result added for student ${data.studentId}`)
  return result
}

export function updateResult(id: string, data: Partial<Result>): Result | null {
  const results = getResults()
  const index = results.findIndex((r) => r.id === id)
  if (index === -1) return null
  const updated = { ...results[index], ...data }
  if (data.internalMarks !== undefined || data.externalMarks !== undefined) {
    const total = calculateTotalMarks(updated.internalMarks, updated.externalMarks)
    updated.grade = marksToGrade(total)
  }
  results[index] = updated
  setStorage('results', results)
  return results[index]
}

export function deleteResult(id: string): boolean {
  const results = getResults()
  if (!results.find((r) => r.id === id)) return false
  setStorage('results', results.filter((r) => r.id !== id))
  return true
}
