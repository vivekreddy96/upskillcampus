import { getStorage, setStorage } from './storage'
import type { TimetableSlot } from '@/types'
import { generateId } from '@/utils/cn'

export function getTimetable(): TimetableSlot[] {
  return getStorage<TimetableSlot[]>('timetable', [])
}

export function getTimetableByDay(day: TimetableSlot['day']): TimetableSlot[] {
  return getTimetable()
    .filter((s) => s.day === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function createSlot(data: Omit<TimetableSlot, 'id'>): TimetableSlot {
  const slots = getTimetable()
  const slot: TimetableSlot = { ...data, id: generateId() }
  setStorage('timetable', [...slots, slot])
  return slot
}

export function deleteSlot(id: string): boolean {
  const slots = getTimetable()
  if (!slots.find((s) => s.id === id)) return false
  setStorage('timetable', slots.filter((s) => s.id !== id))
  return true
}

export const DAYS: TimetableSlot['day'][] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00',
]
