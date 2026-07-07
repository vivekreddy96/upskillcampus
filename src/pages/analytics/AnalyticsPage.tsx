import { motion } from 'framer-motion'
import {
  Users, GraduationCap, BookOpen, TrendingUp, Library, Award,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'
import { getStudents } from '@/services/studentService'
import { getCourses } from '@/services/courseService'
import { getFaculty } from '@/services/facultyService'
import { getAttendanceStats, getAttendanceChartData } from '@/services/attendanceService'
import { getResults } from '@/services/resultService'
import { getBooks } from '@/services/libraryService'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
}

export default function AnalyticsPage() {
  const students = getStudents()
  const courses = getCourses()
  const faculty = getFaculty()
  const attendanceStats = getAttendanceStats()
  const chartData = getAttendanceChartData(30)
  const results = getResults()
  const books = getBooks()

  const deptData = [...new Set(students.map((s) => s.department))].map((dept) => ({
    name: dept.split(' ')[0],
    value: students.filter((s) => s.department === dept).length,
  }))

  const enrollmentTrend = Array.from({ length: 6 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() - (5 - i))
    return {
      month: month.toLocaleDateString('en', { month: 'short' }),
      students: Math.floor(students.length * (0.7 + i * 0.05)),
      courses: Math.floor(courses.length * (0.8 + i * 0.03)),
    }
  })

  const gradeDistribution = ['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].map((grade) => ({
    grade,
    count: results.filter((r) => r.grade === grade).length,
  })).filter((g) => g.count > 0)

  const libraryStats = [
    { name: 'Available', value: books.filter((b) => b.available).length },
    { name: 'Borrowed', value: books.filter((b) => !b.available).length },
  ]

  const avgGpa = students.length
    ? (students.reduce((s, st) => s + st.gpa, 0) / students.length).toFixed(2)
    : '0.00'

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, color: 'from-indigo-500 to-purple-500' },
    { label: 'Faculty Members', value: faculty.length, icon: GraduationCap, color: 'from-purple-500 to-pink-500' },
    { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'from-emerald-500 to-teal-500' },
    { label: 'Attendance Rate', value: `${attendanceStats.rate}%`, icon: TrendingUp, color: 'from-amber-500 to-orange-500' },
    { label: 'Average GPA', value: avgGpa, icon: Award, color: 'from-rose-500 to-red-500' },
    { label: 'Library Books', value: books.length, icon: Library, color: 'from-cyan-500 to-blue-500' },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <PageHeader
          title="Analytics"
          description="Campus-wide insights and performance metrics"
        />
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>30-day campus attendance overview</CardDescription>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                  <Legend />
                  <Area type="monotone" dataKey="present" stroke="#10b981" fill="#10b98133" strokeWidth={2} />
                  <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="#ef444433" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardTitle>Students by Department</CardTitle>
            <CardDescription>Enrollment distribution across departments</CardDescription>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label>
                    {deptData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card>
            <CardTitle>Enrollment Growth</CardTitle>
            <CardDescription>Students and courses over time</CardDescription>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="courses" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Results breakdown by grade</CardDescription>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="grade" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardTitle>Library Utilization</CardTitle>
          <CardDescription>Book availability vs borrowed</CardDescription>
          <div className="h-64 mt-4 max-w-md mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={libraryStats} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
