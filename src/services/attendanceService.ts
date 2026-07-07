import { getStorage, setStorage } from './storage'
import type { AttendanceRecord, Activity } from '@/types'
import { generateId } from '@/utils/cn'

function addActivity(action: string, user: string) {
  const activities = getStorage<Activity[]>('activities', [])
  activities.unshift({
    id: generateId(),
    action,
    user,
    timestamp: new Date().toISOString(),
    type: 'attendance',
  })
  setStorage('activities', activities.slice(0, 50))
}

export function getAttendance(): AttendanceRecord[] {
  return getStorage<AttendanceRecord[]>('attendance', [])
}

export function getAttendanceByDate(date: string): AttendanceRecord[] {
  return getAttendance().filter((a) => a.date === date)
}

export function getAttendanceByCourse(courseId: string): AttendanceRecord[] {
  return getAttendance().filter((a) => a.courseId === courseId)
}

export function getAttendanceByStudent(studentId: string): AttendanceRecord[] {
  return getAttendance().filter((a) => a.studentId === studentId)
}

export function markAttendance(
  records: Omit<AttendanceRecord, 'id'>[],
  actor: string
): void {
  const existing = getAttendance()
  const filtered = existing.filter(
    (a) =>
      !records.some(
        (r) =>
          r.studentId === a.studentId &&
          r.courseId === a.courseId &&
          r.date === a.date
      )
  )
  const newRecords = records.map((r) => ({ ...r, id: generateId() }))
  setStorage('attendance', [...filtered, ...newRecords])
  addActivity(`Attendance marked for ${records.length} students`, actor)
}

export function getAttendanceStats(courseId?: string) {
  const records = courseId
    ? getAttendanceByCourse(courseId)
    : getAttendance()
  const total = records.length
  const present = records.filter((r) => r.status === 'present').length
  const absent = records.filter((r) => r.status === 'absent').length
  const late = records.filter((r) => r.status === 'late').length
  return { total, present, absent, late, rate: total ? Math.round((present / total) * 100) : 0 }
}

export function getStudentAttendanceStats(studentId: string) {
  const records = getAttendanceByStudent(studentId)
  const total = records.length
  const present = records.filter((r) => r.status === 'present').length
  const absent = records.filter((r) => r.status === 'absent').length
  const late = records.filter((r) => r.status === 'late').length
  return { total, present, absent, late, rate: total ? Math.round((present / total) * 100) : 0 }
}

export function getStudentAttendanceChartData(studentId: string, days = 14) {
  const records = getAttendanceByStudent(studentId)
  const data: { date: string; present: number; absent: number; late: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayRecords = records.filter((r) => r.date === dateStr)
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      present: dayRecords.filter((r) => r.status === 'present').length,
      absent: dayRecords.filter((r) => r.status === 'absent').length,
      late: dayRecords.filter((r) => r.status === 'late').length,
    })
  }
  return data
}

export function getAttendanceChartData(days = 14) {
  const records = getAttendance()
  const data: { date: string; present: number; absent: number; late: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayRecords = records.filter((r) => r.date === dateStr)
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      present: dayRecords.filter((r) => r.status === 'present').length,
      absent: dayRecords.filter((r) => r.status === 'absent').length,
      late: dayRecords.filter((r) => r.status === 'late').length,
    })
  }
  return data
}
