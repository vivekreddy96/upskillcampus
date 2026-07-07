import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Award, BookOpen, ClipboardCheck, TrendingUp, User, Calendar,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { getLinkedStudent } from '@/utils/studentUser'
import { getResultsByStudent } from '@/services/resultService'
import { getStudentAttendanceStats, getStudentAttendanceChartData } from '@/services/attendanceService'
import { getCourses } from '@/services/courseService'
import { getAttendanceByStudent } from '@/services/attendanceService'
import { calculateGPA } from '@/utils/gpa'
import { formatDate } from '@/utils/cn'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const student = getLinkedStudent(user)

  if (!student) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--text-muted)]">Your student profile could not be loaded.</p>
      </div>
    )
  }

  const results = getResultsByStudent(student.id)
  const attendanceStats = getStudentAttendanceStats(student.id)
  const chartData = getStudentAttendanceChartData(student.id)
  const attendanceRecords = getAttendanceByStudent(student.id)
  const enrolledCourseIds = [...new Set([
    ...results.map((r) => r.courseId),
    ...attendanceRecords.map((a) => a.courseId),
  ])]
  const courses = getCourses().filter((c) => enrolledCourseIds.includes(c.id))
  const gpa = results.length
    ? calculateGPA(results.map((r) => ({ grade: r.grade, credits: courses.find((c) => c.id === r.courseId)?.credits ?? 3 })))
    : student.gpa

  const stats = [
    { label: 'My GPA', value: gpa.toFixed(2), icon: Award, color: 'from-indigo-500 to-purple-500' },
    { label: 'Attendance', value: `${attendanceStats.rate}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500' },
    { label: 'Courses', value: courses.length, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Results', value: results.length, icon: ClipboardCheck, color: 'from-amber-500 to-orange-500' },
  ]

  const courseProgress = courses.slice(0, 5).map((c) => ({
    name: c.code,
    progress: c.progress,
  }))

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <PageHeader
          title={`Welcome, ${student.name.split(' ')[0]}!`}
          description={`${student.department} · Year ${student.year} · ${student.rollNo}`}
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardTitle>My Attendance</CardTitle>
            <CardDescription>Your attendance over the last 14 days</CardDescription>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="studentPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                  <Legend />
                  <Area type="monotone" dataKey="present" stroke="#6366f1" fill="url(#studentPresent)" strokeWidth={2} />
                  <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="h-full">
            <CardTitle>Quick Links</CardTitle>
            <div className="grid grid-cols-1 gap-3 mt-4">
              <Link to="/courses">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4" /> My Courses
                </Button>
              </Link>
              <Link to="/attendance">
                <Button variant="outline" className="w-full justify-start">
                  <ClipboardCheck className="h-4 w-4" /> My Attendance
                </Button>
              </Link>
              <Link to="/results">
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4" /> My Results
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4" /> My Profile
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card>
            <CardTitle>Course Progress</CardTitle>
            <div className="h-64 mt-4">
              {courseProgress.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={courseProgress} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                    <YAxis dataKey="name" type="category" width={60} tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                    <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                    <Bar dataKey="progress" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-[var(--text-muted)] text-center py-12">No enrolled courses yet</p>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <CardTitle>Recent Results</CardTitle>
            </div>
            <div className="space-y-3">
              {results.slice(0, 5).map((r) => {
                const course = courses.find((c) => c.id === r.courseId)
                return (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)]">
                    <div>
                      <p className="text-sm font-medium">{course?.code ?? 'Course'}</p>
                      <p className="text-xs text-[var(--text-muted)]">Semester {r.semester}</p>
                    </div>
                    <Badge variant={r.grade.startsWith('A') ? 'success' : r.grade.startsWith('B') ? 'info' : 'warning'}>
                      {r.grade}
                    </Badge>
                  </div>
                )
              })}
              {results.length === 0 && (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">No results published yet</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
