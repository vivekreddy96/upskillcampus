import { getStorage, setStorage } from './storage'
import type { Announcement } from '@/types'
import { generateId } from '@/utils/cn'
import { assertPermission } from '@/utils/permissions'
import * as authService from './authService'

export function getAnnouncements(): Announcement[] {
  return getStorage<Announcement[]>('announcements', [])
}

export function getAnnouncement(id: string): Announcement | undefined {
  return getAnnouncements().find((a) => a.id === id)
}

export function createAnnouncement(data: Omit<Announcement, 'id'>): Announcement {
  const role = authService.getCurrentUser()?.role
  assertPermission(role, 'announcements.create')
  const announcements = getAnnouncements()
  const announcement: Announcement = { ...data, id: generateId() }
  setStorage('announcements', [announcement, ...announcements])
  return announcement
}

export function updateAnnouncement(id: string, data: Partial<Announcement>): Announcement | null {
  const role = authService.getCurrentUser()?.role
  assertPermission(role, 'announcements.edit')
  const announcements = getAnnouncements()
  const index = announcements.findIndex((a) => a.id === id)
  if (index === -1) return null
  announcements[index] = { ...announcements[index], ...data }
  setStorage('announcements', announcements)
  return announcements[index]
}

export function deleteAnnouncement(id: string): boolean {
  const role = authService.getCurrentUser()?.role
  assertPermission(role, 'announcements.delete')
  const announcements = getAnnouncements()
  if (!announcements.find((a) => a.id === id)) return false
  setStorage('announcements', announcements.filter((a) => a.id !== id))
  return true
}

export function getAnnouncementsByType(type: Announcement['type']): Announcement[] {
  return getAnnouncements().filter((a) => a.type === type)
}
