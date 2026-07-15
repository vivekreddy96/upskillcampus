import { motion } from 'framer-motion'
import { Users, GraduationCap, TrendingUp, Award, Shield, Database, ScrollText, BookOpen, ClipboardCheck, Calendar, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { getRoleExperience } from '@/config/roles'
import { getStudents } from '@/services/studentService'
import { getFaculty } from '@/services/facultyService'
import { getCourses } from '@/services/courseService'
import { getAttendanceStats, getAttendanceChartData, getAttendanceByStudent } from '@/services/attendanceService'
import { getResultsByStudent } from '@/services/resultService'
import { getAuditLogs } from '@/services/auditService'
import { getAnnouncements } from '@/services/announcementService'
import { formatDate, formatDateTime } from '@/utils/cn'
import { calculateGPA } from '@/utils/gpa'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']

export function SuperAdminDashboard() {
  const students = getStudents()
  const faculty = getFaculty()
  const attendanceStats = getAttendanceStats()
  const chartData = getAttendanceChartData()
  const auditLogs = getAuditLogs().slice(0, 5)
  const avgGpa = students.length ? (students.reduce((s, st) => s + st.gpa, 0) / students.length).toFixed(2) : '0.00'

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'from-indigo-500 to-purple-500' },
    { label: 'Faculty Members', value: faculty.length, icon: GraduationCap, color: 'from-purple-500 to-pink-500' },
    { label: 'Attendance Rate', value: `${attendanceStats.rate}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: 'Average GPA', value: avgGpa, icon: Award, color: 'from-amber-500 to-orange-500' },
  ]

  const quickLinks = [
    { label: 'Admin Management', icon: Shield, to: '/admins' },
    { label: 'Audit Logs', icon: ScrollText, to: '/audit-logs' },
    { label: 'Backup & Restore', icon: Database, to: '/backup' },
    { label: 'Analytics', icon: TrendingUp, to: '/analytics' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Super Admin Dashboard" description="Full system overview and control panel" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Attendance Overview</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                <Area type="monotone" dataKey="present" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Recent Audit Logs</CardTitle>
          <div className="space-y-3 mt-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2 rounded-xl bg-[var(--bg-secondary)]">
                <div className="h-2 w-2 rounded-full gradient-bg mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{log.action} — {log.resource}</p>
                  <p className="text-xs text-[var(--text-muted)]">{log.userName} · {formatDateTime(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card>
        <CardTitle>System Controls</CardTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {quickLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--gradient-subtle)] transition-colors">
                <link.icon className="h-5 w-5 text-indigo-500" />
                <span className="text-xs font-medium text-center">{link.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

export function AdminDashboard() {
  const experience = getRoleExperience('admin')
  const students = getStudents()
  const faculty = getFaculty()
  const attendanceStats = getAttendanceStats()
  const chartData = getAttendanceChartData()
  const deptData = [...new Set(students.map((s) => s.department))].map((dept) => ({
    name: dept.split(' ')[0],
    students: students.filter((s) => s.department === dept).length,
  }))

  const stats = [
    { label: 'Students', value: students.length, icon: Users },
    { label: 'Faculty', value: faculty.length, icon: GraduationCap },
    { label: 'Attendance', value: `${attendanceStats.rate}%`, icon: TrendingUp },
    { label: 'Departments', value: deptData.length, icon: Award },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-3xl border border-indigo-500/20 bg-gradient-to-r ${experience.accent} p-[1px] shadow-sm`}>
        <div className="rounded-[calc(1.5rem-1px)] bg-[var(--surface-solid)]/95 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">
                <Sparkles className="h-4 w-4" />
                {experience.badge} experience
              </div>
              <h2 className="text-2xl font-semibold mt-1">{experience.title}</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">{experience.description}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-muted)]">
              <div className="font-medium text-[var(--text)] mb-1">Highlights</div>
              <ul className="space-y-1 text-xs">
                {experience.actions.map((action) => (
                  <li key={action}>• {action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <PageHeader title="Admin Dashboard" description="Campus management overview and reports" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-indigo-500 opacity-60" />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Attendance Trends</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Students by Department</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptData} dataKey="students" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export function FacultyDashboard() {
  const { user } = useAuth()
  const experience = getRoleExperience('faculty')
  const courses = getCourses().filter((c) => c.facultyId === user?.facultyId)
  const students = getStudents()
  const announcements = getAnnouncements().filter((a) => a.published !== false).slice(0, 4)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-3xl border border-emerald-500/20 bg-gradient-to-r ${experience.accent} p-[1px] shadow-sm`}>
        <div className="rounded-[calc(1.5rem-1px)] bg-[var(--surface-solid)]/95 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
                <Sparkles className="h-4 w-4" />
                {experience.badge} experience
              </div>
              <h2 className="text-2xl font-semibold mt-1">{experience.title}</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">{experience.description}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-muted)]">
              <div className="font-medium text-[var(--text)] mb-1">Highlights</div>
              <ul className="space-y-1 text-xs">
                {experience.actions.map((action) => (
                  <li key={action}>• {action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <PageHeader title="Faculty Dashboard" description={`Welcome, ${user?.name}. Manage your courses and students.`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover>
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-indigo-500" />
            <div>
              <p className="text-sm text-[var(--text-muted)]">Assigned Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-[var(--text-muted)]">Total Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>
        </Card>
        <Card hover>
          <div className="flex items-center gap-3">
            <ClipboardCheck className="h-8 w-8 text-emerald-500" />
            <div>
              <p className="text-sm text-[var(--text-muted)]">Quick Action</p>
              <Link to="/attendance" className="text-sm font-medium text-indigo-500 hover:underline">Mark Attendance</Link>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>My Courses</CardTitle>
          <div className="space-y-3 mt-4">
            {courses.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)]">No courses assigned yet.</p>
            ) : courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
                <div>
                  <p className="font-medium text-sm">{c.code} — {c.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{c.enrolled} students enrolled</p>
                </div>
                <Badge variant="info">{c.progress}%</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Recent Announcements</CardTitle>
          <div className="space-y-3 mt-4">
            {announcements.map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-[var(--bg-secondary)]">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatDate(a.date)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export function StudentDashboard() {
  const { user } = useAuth()
  const experience = getRoleExperience('student')
  const studentId = user?.studentId ?? ''
  const attendance = getAttendanceByStudent(studentId)
  const results = getResultsByStudent(studentId)
  const gpa = results.length ? calculateGPA(results.map((r) => ({ grade: r.grade, credits: 3 }))) : 0
  const present = attendance.filter((a) => a.status === 'present').length
  const rate = attendance.length ? Math.round((present / attendance.length) * 100) : 0
  const announcements = getAnnouncements().filter((a) => a.published !== false).slice(0, 3)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className={`rounded-3xl border border-amber-500/20 bg-gradient-to-r ${experience.accent} p-[1px] shadow-sm`}>
        <div className="rounded-[calc(1.5rem-1px)] bg-[var(--surface-solid)]/95 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-300">
                <Sparkles className="h-4 w-4" />
                {experience.badge} experience
              </div>
              <h2 className="text-2xl font-semibold mt-1">{experience.title}</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">{experience.description}</p>
            </div>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-muted)]">
              <div className="font-medium text-[var(--text)] mb-1">Highlights</div>
              <ul className="space-y-1 text-xs">
                {experience.actions.map((action) => (
                  <li key={action}>• {action}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <PageHeader title="Student Dashboard" description={`Welcome back, ${user?.name}!`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover>
          <p className="text-sm text-[var(--text-muted)]">My GPA</p>
          <p className="text-4xl font-bold gradient-text mt-1">{gpa.toFixed(2)}</p>
        </Card>
        <Card hover>
          <p className="text-sm text-[var(--text-muted)]">Attendance Rate</p>
          <p className="text-4xl font-bold mt-1">{rate}%</p>
        </Card>
        <Card hover>
          <p className="text-sm text-[var(--text-muted)]">Courses</p>
          <p className="text-4xl font-bold mt-1">{results.length}</p>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Quick Links</CardTitle>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Timetable', icon: Calendar, to: '/timetable' },
              { label: 'Results', icon: Award, to: '/results' },
              { label: 'Attendance', icon: ClipboardCheck, to: '/attendance' },
              { label: 'Courses', icon: BookOpen, to: '/courses' },
            ].map((link) => (
              <Link key={link.to} to={link.to}>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--gradient-subtle)] transition-colors">
                  <link.icon className="h-5 w-5 text-indigo-500" />
                  <span className="text-xs font-medium">{link.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Announcements</CardTitle>
          <div className="space-y-3 mt-4">
            {announcements.map((a) => (
              <div key={a.id} className="p-3 rounded-xl bg-[var(--bg-secondary)]">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatDate(a.date)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
