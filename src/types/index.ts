export type UserRole = 'super_admin' | 'admin' | 'faculty' | 'student'



export interface User {

  id: string

  name: string

  email: string

  password: string

  role: UserRole

  studentId?: string

  facultyId?: string

  avatar?: string

  department?: string

  phone?: string

  createdAt: string

}



export interface Session {

  userId: string

  role: UserRole

  rememberMe: boolean

  expiresAt: string

  lastActivity: string

}



export interface Student {

  id: string

  name: string

  rollNo: string

  email: string

  phone: string

  department: string

  year: number

  status: 'active' | 'inactive'

  avatar?: string

  gpa: number

  enrollmentDate: string

}



export interface Faculty {

  id: string

  name: string

  email: string

  phone: string

  department: string

  designation: string

  avatar?: string

  office: string

  specialization: string

}



export interface Department {

  id: string

  name: string

  code: string

  head: string

  facultyCount: number

  studentCount: number

  description: string

}



export interface Course {

  id: string

  code: string

  title: string

  credits: number

  facultyId: string

  department: string

  progress: number

  semester: number

  description: string

  enrolled: number

}



export interface AttendanceRecord {

  id: string

  studentId: string

  courseId: string

  date: string

  status: 'present' | 'absent' | 'late'

}



export interface Result {

  id: string

  studentId: string

  courseId: string

  internalMarks: number

  externalMarks: number

  grade: string

  semester: number

}



export interface TimetableSlot {

  id: string

  courseId: string

  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'

  startTime: string

  endTime: string

  room: string

}



export interface Announcement {

  id: string

  title: string

  content: string

  type: 'notice' | 'event' | 'update'

  date: string

  priority: 'low' | 'medium' | 'high'

  author: string

  pinned?: boolean

  published?: boolean

}



export interface Book {

  id: string

  title: string

  author: string

  isbn: string

  category: string

  available: boolean

  borrowedBy?: string

  dueDate?: string

}



export interface Activity {

  id: string

  action: string

  user: string

  timestamp: string

  type: 'student' | 'course' | 'attendance' | 'result' | 'system' | 'auth' | 'admin'

}



export interface AuditLog {

  id: string

  action: string

  userId: string

  userName: string

  userRole: UserRole

  resource: string

  details: string

  timestamp: string

  ip?: string

}



export interface ChatMessage {

  id: string

  role: 'user' | 'assistant'

  content: string

  timestamp: string

}



export interface AppSettings {

  theme: 'light' | 'dark' | 'system'

  notifications: boolean

  emailAlerts: boolean

  sessionTimeout?: number

  maintenanceMode?: boolean

}



export type StorageKey =

  | 'users'

  | 'session'

  | 'students'

  | 'faculty'

  | 'departments'

  | 'courses'

  | 'attendance'

  | 'results'

  | 'timetable'

  | 'announcements'

  | 'library'

  | 'activities'

  | 'auditLogs'

  | 'settings'

  | 'chatHistory'

  | 'seeded'

  | 'rbacVersion'


