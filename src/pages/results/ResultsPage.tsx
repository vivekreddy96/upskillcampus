import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Plus, Award } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/context/ToastContext'
import { usePermissions } from '@/hooks/usePermissions'
import { useAuth } from '@/context/AuthContext'
import { getResults, getResultsByStudent, createResult, deleteResult } from '@/services/resultService'
import { getStudents } from '@/services/studentService'
import { getCourses } from '@/services/courseService'
import { calculateTotalMarks, marksToGrade, calculateGPA } from '@/utils/gpa'

const schema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1),
  internalMarks: z.coerce.number().min(0).max(50),
  externalMarks: z.coerce.number().min(0).max(100),
  semester: z.coerce.number().min(1).max(8),
})

type FormData = z.infer<typeof schema>

export default function ResultsPage() {
  const { can } = usePermissions()
  const { user } = useAuth()

  const [results, setResults] = useState(() => (can('results.view') ? getResults() : getResultsByStudent(user?.studentId ?? '')))
  const [modalOpen, setModalOpen] = useState(false)
  const [calcInternal, setCalcInternal] = useState(30)
  const [calcExternal, setCalcExternal] = useState(60)
  const [gpaMarks, setGpaMarks] = useState([{ grade: 'A', credits: 4 }, { grade: 'B+', credits: 3 }])
  const { toast } = useToast()
  const students = getStudents()
  const courses = getCourses()

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { internalMarks: 30, externalMarks: 60, semester: 1 },
  })

  const refresh = () => setResults(can('results.view') ? getResults() : getResultsByStudent(user?.studentId ?? ''))

  const watchedInternal = watch('internalMarks') || 0
  const watchedExternal = watch('externalMarks') || 0
  const previewTotal = calculateTotalMarks(watchedInternal, watchedExternal)
  const previewGrade = marksToGrade(previewTotal)

  const calcTotal = calculateTotalMarks(calcInternal, calcExternal)
  const calcGrade = marksToGrade(calcTotal)
  const gpa = calculateGPA(gpaMarks)

  const getStudentName = (id: string) => students.find((s) => s.id === id)?.name ?? 'Unknown'
  const getCourseName = (id: string) => courses.find((c) => c.id === id)?.code ?? 'Unknown'

  const onSubmit = (data: FormData) => {
    createResult(data)
    toast('Result added', 'success')
    setModalOpen(false)
    reset()
    refresh()
  }

  const gradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'success'
    if (grade.startsWith('B')) return 'info'
    if (grade.startsWith('C')) return 'warning'
    return 'danger'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Results & Grades"
        description="Manage internal and external marks, calculate grades and GPA"
        actions={can('results.upload') ? <Button onClick={() => { reset(); setModalOpen(true) }}><Plus className="h-4 w-4" /> Add Result</Button> : null}
      />

      {!can('results.view') && (
        <div role="alert" className="p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
          You do not have permission to view all students' results — showing only your own results.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-indigo-500" />
            <CardTitle>Grade Calculator</CardTitle>
          </div>
          <div className="space-y-4">
            <Input label="Internal Marks (40%)" type="number" value={calcInternal} onChange={(e) => setCalcInternal(+e.target.value)} />
            <Input label="External Marks (60%)" type="number" value={calcExternal} onChange={(e) => setCalcExternal(+e.target.value)} />
            <div className="p-4 rounded-xl bg-[var(--gradient-subtle)] text-center">
              <p className="text-sm text-[var(--text-muted)]">Total Marks</p>
              <p className="text-3xl font-bold">{calcTotal}</p>
              <Badge variant={gradeColor(calcGrade) as 'success'} className="mt-2">{calcGrade}</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-indigo-500" />
            <CardTitle>GPA Calculator</CardTitle>
          </div>
          <div className="space-y-3">
            {gpaMarks.map((m, i) => (
              <div key={i} className="flex gap-2">
                <Select
                  options={['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'].map((g) => ({ value: g, label: g }))}
                  value={m.grade}
                  onChange={(e) => {
                    const updated = [...gpaMarks]
                    updated[i] = { ...updated[i], grade: e.target.value }
                    setGpaMarks(updated)
                  }}
                />
                <Input type="number" value={m.credits} onChange={(e) => {
                  const updated = [...gpaMarks]
                  updated[i] = { ...updated[i], credits: +e.target.value }
                  setGpaMarks(updated)
                }} />
              </div>
            ))}
            <Button variant="secondary" size="sm" onClick={() => setGpaMarks([...gpaMarks, { grade: 'B', credits: 3 }])}>
              Add Course
            </Button>
            <div className="p-4 rounded-xl bg-[var(--gradient-subtle)] text-center">
              <p className="text-sm text-[var(--text-muted)]">Calculated GPA</p>
              <p className="text-4xl font-bold gradient-text">{gpa.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Student</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Internal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">External</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Grade</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 30).map((r) => {
                const total = calculateTotalMarks(r.internalMarks, r.externalMarks)
                return (
                  <tr key={r.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)]">
                    <td className="px-4 py-3 text-sm">{getStudentName(r.studentId)}</td>
                    <td className="px-4 py-3 text-sm">{getCourseName(r.courseId)}</td>
                    <td className="px-4 py-3 text-sm">{r.internalMarks}</td>
                    <td className="px-4 py-3 text-sm">{r.externalMarks}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{total}</td>
                    <td className="px-4 py-3"><Badge variant={gradeColor(r.grade) as 'success'}>{r.grade}</Badge></td>
                    <td className="px-4 py-3">
                      {can('results.upload') && (
                        <Button variant="ghost" size="sm" onClick={() => { deleteResult(r.id); refresh(); toast('Deleted', 'success') }}>Delete</Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Result">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Student" options={students.map((s) => ({ value: s.id, label: `${s.name} (${s.rollNo})` }))} error={errors.studentId?.message} {...register('studentId')} />
          <Select label="Course" options={courses.map((c) => ({ value: c.id, label: `${c.code} - ${c.title}` }))} error={errors.courseId?.message} {...register('courseId')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Internal Marks" type="number" error={errors.internalMarks?.message} {...register('internalMarks')} />
            <Input label="External Marks" type="number" error={errors.externalMarks?.message} {...register('externalMarks')} />
          </div>
          <Input label="Semester" type="number" error={errors.semester?.message} {...register('semester')} />
          <div className="p-3 rounded-xl bg-[var(--bg-secondary)] text-center">
            <span className="text-sm">Preview: </span>
            <span className="font-bold">{previewTotal}</span>
            <Badge variant={gradeColor(previewGrade) as 'success'} className="ml-2">{previewGrade}</Badge>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Result</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
