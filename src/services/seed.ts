import type {
  User,
  Student,
  Faculty,
  Course,
  AttendanceRecord,
  Result,
  TimetableSlot,
  Announcement,
  Book,
  Activity,
  AuditLog,
} from '@/types'
import { generateId } from '@/utils/cn'
import { marksToGrade, calculateTotalMarks } from '@/utils/gpa'
import { seedDepartments } from './departmentService'

const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration']
const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Blake', 'Cameron', 'Dakota', 'Emery', 'Finley', 'Harper', 'Hayden', 'Jamie', 'Kendall', 'Logan', 'Parker', 'Reese', 'Sage', 'Skyler', 'Spencer', 'Sydney']
const LAST_NAMES = ['Anderson', 'Brown', 'Chen', 'Davis', 'Evans', 'Garcia', 'Harris', 'Johnson', 'Kim', 'Lee', 'Martinez', 'Miller', 'Patel', 'Robinson', 'Smith', 'Taylor', 'Thomas', 'Thompson', 'Walker', 'White', 'Wilson', 'Wright', 'Young', 'Zhang']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(start: Date, end: Date): string {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString()
}

export function seedUsers(): User[] {
  return [
    {
      id: 'user-superadmin-1',
      name: 'Super Admin',
      email: 'superadmin@campus.edu',
      password: 'Super@123',
      role: 'super_admin',
      avatar: '',
      department: 'Administration',
      phone: '+1 555-0000',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'user-admin-1',
      name: 'Admin User',
      email: 'admin@campus.edu',
      password: 'Admin@123',
      role: 'admin',
      avatar: '',
      department: 'Administration',
      phone: '+1 555-0100',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'user-faculty-1',
      name: 'Dr. Sarah Mitchell',
      email: 'faculty@campus.edu',
      password: 'Faculty@123',
      role: 'faculty',
      facultyId: 'faculty-1',
      department: 'Computer Science',
      phone: '+1 555-0101',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'user-student-1',
      name: 'Alex Johnson',
      email: 'student@campus.edu',
      password: 'Student@123',
      role: 'student',
      studentId: 'student-1',
      department: 'Computer Science',
      phone: '+1 555-0102',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ]
}

export function seedFaculty(): Faculty[] {
  const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer']
  const specs = ['Machine Learning', 'Software Engineering', 'Data Structures', 'Circuit Design', 'Thermodynamics', 'Marketing', 'Finance', 'Operations Research']
  const faculty = Array.from({ length: 15 }, (_, i) => ({
    id: `faculty-${i + 1}`,
    name: i === 0 ? 'Dr. Sarah Mitchell' : `Dr. ${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    email: i === 0 ? 'faculty@campus.edu' : `faculty${i + 1}@campus.edu`,
    phone: `+1 555-${String(1000 + i).padStart(4, '0')}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    designation: designations[i % designations.length],
    office: `Building ${String.fromCharCode(65 + (i % 4))}-${100 + i}`,
    specialization: specs[i % specs.length],
  }))
  return faculty
}

export function seedStudents(): Student[] {
  const students = Array.from({ length: 50 }, (_, i) => ({
    id: `student-${i + 1}`,
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    rollNo: `CS${2024}${String(i + 1).padStart(3, '0')}`,
    email: `student${i + 1}@campus.edu`,
    phone: `+1 555-${String(2000 + i).padStart(4, '0')}`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    year: (i % 4) + 1,
    status: (i % 10 === 0 ? 'inactive' : 'active') as Student['status'],
    gpa: Math.round((2.5 + Math.random() * 1.5) * 100) / 100,
    enrollmentDate: randomDate(new Date('2022-01-01'), new Date('2024-09-01')),
  }))

  students[0] = {
    id: 'student-1',
    name: 'Alex Johnson',
    rollNo: 'CS2024001',
    email: 'student@campus.edu',
    phone: '+1 555-0102',
    department: 'Computer Science',
    year: 2,
    status: 'active',
    gpa: 3.65,
    enrollmentDate: '2023-09-01T00:00:00.000Z',
  }

  return students
}

export function seedCourses(faculty: Faculty[]): Course[] {
  const courseData = [
    { code: 'CS101', title: 'Introduction to Programming', credits: 4, dept: 'Computer Science' },
    { code: 'CS201', title: 'Data Structures & Algorithms', credits: 4, dept: 'Computer Science' },
    { code: 'CS301', title: 'Database Management Systems', credits: 3, dept: 'Computer Science' },
    { code: 'CS401', title: 'Machine Learning', credits: 4, dept: 'Computer Science' },
    { code: 'CS402', title: 'Software Engineering', credits: 3, dept: 'Computer Science' },
    { code: 'EE101', title: 'Circuit Analysis', credits: 4, dept: 'Electrical Engineering' },
    { code: 'EE201', title: 'Digital Electronics', credits: 3, dept: 'Electrical Engineering' },
    { code: 'EE301', title: 'Signal Processing', credits: 4, dept: 'Electrical Engineering' },
    { code: 'ME101', title: 'Engineering Mechanics', credits: 4, dept: 'Mechanical Engineering' },
    { code: 'ME201', title: 'Thermodynamics', credits: 3, dept: 'Mechanical Engineering' },
    { code: 'ME301', title: 'Fluid Mechanics', credits: 4, dept: 'Mechanical Engineering' },
    { code: 'BA101', title: 'Principles of Management', credits: 3, dept: 'Business Administration' },
    { code: 'BA201', title: 'Financial Accounting', credits: 3, dept: 'Business Administration' },
    { code: 'BA301', title: 'Marketing Strategy', credits: 3, dept: 'Business Administration' },
    { code: 'BA401', title: 'Business Analytics', credits: 4, dept: 'Business Administration' },
    { code: 'CS302', title: 'Computer Networks', credits: 3, dept: 'Computer Science' },
    { code: 'CS303', title: 'Operating Systems', credits: 4, dept: 'Computer Science' },
    { code: 'EE401', title: 'Power Systems', credits: 3, dept: 'Electrical Engineering' },
    { code: 'ME401', title: 'Manufacturing Processes', credits: 3, dept: 'Mechanical Engineering' },
    { code: 'BA302', title: 'Entrepreneurship', credits: 3, dept: 'Business Administration' },
  ]
  return courseData.map((c, i) => ({
    id: `course-${i + 1}`,
    code: c.code,
    title: c.title,
    credits: c.credits,
    facultyId: faculty[i % faculty.length].id,
    department: c.dept,
    progress: Math.floor(Math.random() * 100),
    semester: (i % 8) + 1,
    description: `Comprehensive course covering ${c.title.toLowerCase()} fundamentals and advanced topics.`,
    enrolled: Math.floor(Math.random() * 40) + 10,
  }))
}

export function seedAttendance(students: Student[], courses: Course[]): AttendanceRecord[] {
  const records: AttendanceRecord[] = []
  const statuses: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'absent', 'late']
  for (let d = 0; d < 30; d++) {
    const date = new Date()
    date.setDate(date.getDate() - d)
    if (date.getDay() === 0 || date.getDay() === 6) continue
    const dateStr = date.toISOString().split('T')[0]
    for (const course of courses.slice(0, 5)) {
      for (const student of students.slice(0, 20)) {
        records.push({
          id: generateId(),
          studentId: student.id,
          courseId: course.id,
          date: dateStr,
          status: pick(statuses),
        })
      }
    }
  }
  return records
}

export function seedResults(students: Student[], courses: Course[]): Result[] {
  const results: Result[] = []
  for (const student of students.slice(0, 30)) {
    for (const course of courses.slice(0, 4)) {
      const internal = Math.floor(Math.random() * 30) + 20
      const external = Math.floor(Math.random() * 50) + 30
      const total = calculateTotalMarks(internal, external)
      results.push({
        id: generateId(),
        studentId: student.id,
        courseId: course.id,
        internalMarks: internal,
        externalMarks: external,
        grade: marksToGrade(total),
        semester: course.semester,
      })
    }
  }
  return results
}

export function seedTimetable(courses: Course[]): TimetableSlot[] {
  const days: TimetableSlot['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const times = [
    { start: '09:00', end: '10:00' },
    { start: '10:15', end: '11:15' },
    { start: '11:30', end: '12:30' },
    { start: '14:00', end: '15:00' },
    { start: '15:15', end: '16:15' },
  ]
  const rooms = ['A101', 'A102', 'B201', 'B202', 'C301', 'Lab-1', 'Lab-2']
  const slots: TimetableSlot[] = []
  courses.slice(0, 15).forEach((course, i) => {
    const time = times[i % times.length]
    slots.push({
      id: generateId(),
      courseId: course.id,
      day: days[i % days.length],
      startTime: time.start,
      endTime: time.end,
      room: rooms[i % rooms.length],
    })
  })
  return slots
}

export function seedAnnouncements(): Announcement[] {
  const items = [
    { id: 'ann-1', title: 'Semester Registration Open', content: 'Registration for Spring 2025 semester is now open. Complete your course selection by January 15.', type: 'notice' as const, date: new Date().toISOString(), priority: 'high' as const, author: 'Registrar Office', pinned: true, published: true },
    { id: 'ann-2', title: 'Annual Tech Fest 2025', content: 'Join us for the annual technology festival featuring hackathons, workshops, and keynote speakers.', type: 'event' as const, date: new Date(Date.now() + 86400000 * 7).toISOString(), priority: 'medium' as const, author: 'Student Council', pinned: false, published: true },
    { id: 'ann-3', title: 'Library Hours Extended', content: 'The central library will remain open until 11 PM during exam week.', type: 'update' as const, date: new Date().toISOString(), priority: 'low' as const, author: 'Library Admin', pinned: false, published: true },
    { id: 'ann-4', title: 'Mid-Semester Examinations', content: 'Mid-semester exams begin next Monday. Check your timetable for schedule details.', type: 'notice' as const, date: new Date(Date.now() + 86400000 * 3).toISOString(), priority: 'high' as const, author: 'Examination Cell', pinned: true, published: true },
    { id: 'ann-5', title: 'Career Fair 2025', content: 'Over 50 companies participating in the campus career fair. Register on the portal.', type: 'event' as const, date: new Date(Date.now() + 86400000 * 14).toISOString(), priority: 'medium' as const, author: 'Placement Cell', pinned: false, published: true },
    { id: 'ann-6', title: 'New AI Lab Inauguration', content: 'State-of-the-art AI research lab inaugurated in Building C. Open for all CS students.', type: 'update' as const, date: new Date().toISOString(), priority: 'medium' as const, author: 'CS Department', pinned: false, published: true },
    { id: 'ann-7', title: 'Sports Day Registration', content: 'Register for inter-department sports competitions. Last date: Friday.', type: 'event' as const, date: new Date(Date.now() + 86400000 * 5).toISOString(), priority: 'low' as const, author: 'Sports Committee', pinned: false, published: true },
    { id: 'ann-8', title: 'Fee Payment Deadline', content: 'Last date for semester fee payment is the 20th. Late fees apply after deadline.', type: 'notice' as const, date: new Date(Date.now() + 86400000 * 10).toISOString(), priority: 'high' as const, author: 'Accounts Office', pinned: false, published: true },
    { id: 'ann-9', title: 'Guest Lecture: AI Ethics', content: 'Renowned AI ethicist Dr. James Wilson delivers a guest lecture on Thursday at 3 PM.', type: 'event' as const, date: new Date(Date.now() + 86400000 * 4).toISOString(), priority: 'medium' as const, author: 'CS Department', pinned: false, published: true },
    { id: 'ann-10', title: 'Campus WiFi Upgrade', content: 'Campus-wide WiFi infrastructure upgrade completed. Enjoy faster connectivity.', type: 'update' as const, date: new Date().toISOString(), priority: 'low' as const, author: 'IT Department', pinned: false, published: true },
  ]
  return items
}

export function seedLibrary(): Book[] {
  const books = [
    { title: 'Introduction to Algorithms', author: 'Cormen, Leiserson', category: 'Computer Science' },
    { title: 'Clean Code', author: 'Robert Martin', category: 'Software Engineering' },
    { title: 'Design Patterns', author: 'Gang of Four', category: 'Software Engineering' },
    { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', category: 'Software Engineering' },
    { title: 'Database System Concepts', author: 'Silberschatz', category: 'Computer Science' },
    { title: 'Computer Networks', author: 'Tanenbaum', category: 'Computer Science' },
    { title: 'Operating System Concepts', author: 'Silberschatz', category: 'Computer Science' },
    { title: 'Artificial Intelligence', author: 'Russell & Norvig', category: 'AI/ML' },
    { title: 'Deep Learning', author: 'Goodfellow', category: 'AI/ML' },
    { title: 'Pattern Recognition', author: 'Bishop', category: 'AI/ML' },
    { title: 'Microelectronic Circuits', author: 'Sedra & Smith', category: 'Electrical' },
    { title: 'Fundamentals of Electric Circuits', author: 'Alexander', category: 'Electrical' },
    { title: 'Engineering Mechanics', author: 'Hibbeler', category: 'Mechanical' },
    { title: 'Thermodynamics', author: 'Cengel & Boles', category: 'Mechanical' },
    { title: 'Principles of Marketing', author: 'Kotler', category: 'Business' },
    { title: 'Financial Management', author: 'Brigham', category: 'Business' },
    { title: 'Organizational Behavior', author: 'Robbins', category: 'Business' },
    { title: 'Data Science for Business', author: 'Provost', category: 'Business' },
    { title: 'Structure and Interpretation of Computer Programs', author: 'Abelson', category: 'Computer Science' },
    { title: 'Compilers: Principles and Practice', author: 'Aho', category: 'Computer Science' },
  ]
  return Array.from({ length: 100 }, (_, i) => {
    const book = books[i % books.length]
    const borrowed = i % 5 === 0
    return {
      id: `book-${i + 1}`,
      title: i >= books.length ? `${book.title} (Vol. ${Math.floor(i / books.length) + 1})` : book.title,
      author: book.author,
      isbn: `978-${String(1000000000 + i).slice(0, 10)}`,
      category: book.category,
      available: !borrowed,
      borrowedBy: borrowed ? `student-${(i % 20) + 1}` : undefined,
      dueDate: borrowed ? new Date(Date.now() + 86400000 * (7 + (i % 14))).toISOString() : undefined,
    }
  })
}

export function seedActivities(): Activity[] {
  return [
    { id: 'act-1', action: 'New student registered', user: 'Admin User', timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'student' },
    { id: 'act-2', action: 'Attendance marked for CS201', user: 'Dr. Sarah Mitchell', timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'attendance' },
    { id: 'act-3', action: 'Results published for Semester 3', user: 'Admin User', timestamp: new Date(Date.now() - 86400000).toISOString(), type: 'result' },
    { id: 'act-4', action: 'New course CS402 added', user: 'Admin User', timestamp: new Date(Date.now() - 172800000).toISOString(), type: 'course' },
    { id: 'act-5', action: 'System backup completed', user: 'System', timestamp: new Date(Date.now() - 259200000).toISOString(), type: 'system' },
    { id: 'act-6', action: 'Student profile updated', user: 'Alex Johnson', timestamp: new Date(Date.now() - 43200000).toISOString(), type: 'student' },
    { id: 'act-7', action: 'Library book returned', user: 'Jordan Smith', timestamp: new Date(Date.now() - 129600000).toISOString(), type: 'system' },
    { id: 'act-8', action: 'Mid-sem exam schedule released', user: 'Admin User', timestamp: new Date(Date.now() - 345600000).toISOString(), type: 'system' },
  ]
}

export function seedAll(): void {
  const faculty = seedFaculty()
  const students = seedStudents()
  const courses = seedCourses(faculty)

  return void {
    users: seedUsers(),
    faculty,
    students,
    courses,
    attendance: seedAttendance(students, courses),
    results: seedResults(students, courses),
    timetable: seedTimetable(courses),
    announcements: seedAnnouncements(),
    library: seedLibrary(),
    activities: seedActivities(),
  }
}

export function seedAuditLogs(): AuditLog[] {
  return [
    { id: 'audit-1', action: 'LOGIN', userId: 'user-admin-1', userName: 'Admin User', userRole: 'admin', resource: 'auth', details: 'Successful login', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: 'audit-2', action: 'CREATE', userId: 'user-admin-1', userName: 'Admin User', userRole: 'admin', resource: 'student', details: 'Created student record CS2024050', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: 'audit-3', action: 'UPDATE', userId: 'user-faculty-1', userName: 'Dr. Sarah Mitchell', userRole: 'faculty', resource: 'attendance', details: 'Marked attendance for CS201', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'audit-4', action: 'PUBLISH', userId: 'user-admin-1', userName: 'Admin User', userRole: 'admin', resource: 'announcement', details: 'Published mid-semester exam notice', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: 'audit-5', action: 'BACKUP', userId: 'user-superadmin-1', userName: 'Super Admin', userRole: 'super_admin', resource: 'system', details: 'System backup completed', timestamp: new Date(Date.now() - 259200000).toISOString() },
    { id: 'audit-6', action: 'ROLE_CHANGE', userId: 'user-superadmin-1', userName: 'Super Admin', userRole: 'super_admin', resource: 'user', details: 'Changed user role to faculty', timestamp: new Date(Date.now() - 345600000).toISOString() },
  ]
}

export function getSeedData() {
  const faculty = seedFaculty()
  const students = seedStudents()
  const courses = seedCourses(faculty)
  return {
    users: seedUsers(),
    faculty,
    students,
    departments: seedDepartments(),
    courses,
    attendance: seedAttendance(students, courses),
    results: seedResults(students, courses),
    timetable: seedTimetable(courses),
    announcements: seedAnnouncements(),
    library: seedLibrary(),
    activities: seedActivities(),
    auditLogs: seedAuditLogs(),
  }
}
