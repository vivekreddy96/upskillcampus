import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Download, Save } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from 'recharts'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/context/ToastContext'
import { useAuth } from '@/context/AuthContext'
import { getCourses } from '@/services/courseService'
import { getStudents } from '@/services/studentService'
import {
  getAttendanceByDate, markAttendance, getAttendanceStats, getAttendanceChartData,
} from '@/services/attendanceService'
import { exportToCSV } from '@/utils/exportCsv'
import type { AttendanceRecord } from '@/types'

const COLORS = ['#10b981', '#ef4444', '#f59e0b']

export default function AttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [courseId, setCourseId] = useState(getCourses()[0]?.id || '')
  const [marks, setMarks] = useState<Record<string, AttendanceRecord['status']>>({})
  const { toast } = useToast()
  const { user } = useAuth()
  const courses = getCourses()
  const students = getStudents().filter((s) => s.status === 'active').slice(0, 20)
  const stats = getAttendanceStats(courseId)
  const chartData = getAttendanceChartData()

  const pieData = [
    { name: 'Present', value: stats.present },
    { name: 'Absent', value: stats.absent },
    { name: 'Late', value: stats.late },
  ]

  const existing = useMemo(() => {
    const records = getAttendanceByDate(date).filter((a) => a.courseId === courseId)
    const map: Record<string, AttendanceRecord['status']> = {}
    records.forEach((r) => { map[r.studentId] = r.status })
    return map
  }, [date, courseId])

  const currentMarks = { ...existing, ...marks }

  const handleSave = () => {
    const records = students.map((s) => ({
      studentId: s.id,
      courseId,
      date,
      status: currentMarks[s.id] || 'present' as const,
    }))
    markAttendance(records, user?.name || 'Admin')
    setMarks({})
    toast('Attendance saved successfully', 'success')
  }

  const handleExport = () => {
    const records = getAttendanceByDate(date).filter((a) => a.courseId === courseId)
    const data = records.map((r) => {
      const student = students.find((s) => s.id === r.studentId)
      return { date: r.date, student: student?.name, rollNo: student?.rollNo, status: r.status }
    })
    exportToCSV(data, `attendance-${date}.csv`)
    toast('Exported to CSV', 'success')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Mark and track student attendance"
        actions={
          <>
            <Button variant="secondary" onClick={handleExport}><Download className="h-4 w-4" /> Export CSV</Button>
            <Button onClick={handleSave}><Save className="h-4 w-4" /> Save Attendance</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding className="text-center">
          <p className="text-3xl font-bold text-emerald-500">{stats.rate}%</p>
          <p className="text-sm text-[var(--text-muted)]">Attendance Rate</p>
        </Card>
        <Card padding className="text-center">
          <p className="text-3xl font-bold">{stats.present}</p>
          <p className="text-sm text-[var(--text-muted)]">Present</p>
        </Card>
        <Card padding className="text-center">
          <p className="text-3xl font-bold text-red-500">{stats.absent}</p>
          <p className="text-sm text-[var(--text-muted)]">Absent</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Attendance Trends</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--text-muted)" />
                <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle>Distribution</CardTitle>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--surface-solid)', border: '1px solid var(--border)', borderRadius: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select
            label="Course"
            options={courses.map((c) => ({ value: c.id, label: `${c.code} - ${c.title}` }))}
            value={courseId}
            onChange={(e) => { setCourseId(e.target.value); setMarks({}) }}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setMarks({}) }}
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-3 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Roll No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-sm font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-muted)]">{s.rollNo}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {(['present', 'absent', 'late'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setMarks((m) => ({ ...m, [s.id]: status }))}
                          className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                            (currentMarks[s.id] || 'present') === status
                              ? status === 'present' ? 'bg-emerald-500 text-white' : status === 'absent' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  )
}
