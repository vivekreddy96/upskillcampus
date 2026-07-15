import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, BookOpen, Users, Pencil, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import { usePermissions } from '@/hooks/usePermissions'
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/services/courseService'
import { getFaculty } from '@/services/facultyService'
import type { Course } from '@/types'

const schema = z.object({
  code: z.string().min(2),
  title: z.string().min(2),
  credits: z.coerce.number().min(1).max(6),
  facultyId: z.string().min(1),
  department: z.string().min(1),
  semester: z.coerce.number().min(1).max(8),
  progress: z.coerce.number().min(0).max(100),
  description: z.string().min(5),
  enrolled: z.coerce.number().min(0),
})

type FormData = z.infer<typeof schema>

export default function CoursesPage() {
  const [courses, setCourses] = useState(getCourses())
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const { toast } = useToast()
  const faculty = getFaculty()
  const { can } = usePermissions()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { credits: 3, semester: 1, progress: 0, enrolled: 0 },
  })

  const refresh = () => setCourses(getCourses())

  const getFacultyName = (id: string) => faculty.find((f) => f.id === id)?.name ?? 'Unassigned'

  const openAdd = () => {
    setEditing(null)
    reset({ code: '', title: '', credits: 3, facultyId: faculty[0]?.id || '', department: 'Computer Science', semester: 1, progress: 0, description: '', enrolled: 0 })
    setModalOpen(true)
  }

  const openEdit = (c: Course) => {
    setEditing(c)
    reset(c)
    setModalOpen(true)
  }

  const onSubmit = (data: FormData) => {
    if (editing) {
      updateCourse(editing.id, data)
      toast('Course updated', 'success')
    } else {
      createCourse(data)
      toast('Course added', 'success')
    }
    setModalOpen(false)
    refresh()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Course Management"
        description="Manage courses, credits, and faculty assignments"
        actions={can('courses.create') ? <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Course</Button> : null}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card hover className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl bg-[var(--gradient-subtle)]">
                  <BookOpen className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="flex gap-1">
                  {can('courses.edit') && <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>}
                  {can('courses.delete') && (
                    <Button variant="ghost" size="icon" onClick={() => { deleteCourse(c.id); refresh(); toast('Course deleted', 'success') }}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
              <Badge variant="info">{c.code}</Badge>
              <CardTitle className="mt-2">{c.title}</CardTitle>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{c.description}</p>
              <div className="mt-4 space-y-2 text-sm flex-1">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Credits</span>
                  <span className="font-medium">{c.credits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Faculty</span>
                  <span className="font-medium text-xs truncate max-w-[150px]">{getFacultyName(c.facultyId)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Enrolled</span>
                  <span className="font-medium flex items-center gap-1"><Users className="h-3 w-3" /> {c.enrolled}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--text-muted)]">Progress</span>
                  <span className="font-medium">{c.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                  <div className="h-full gradient-bg rounded-full transition-all" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Course' : 'Add Course'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Course Code" error={errors.code?.message} {...register('code')} />
          <Input label="Title" error={errors.title?.message} {...register('title')} />
          <Input label="Credits" type="number" error={errors.credits?.message} {...register('credits')} />
          <Input label="Semester" type="number" error={errors.semester?.message} {...register('semester')} />
          <Select label="Faculty" options={faculty.map((f) => ({ value: f.id, label: f.name }))} {...register('facultyId')} />
          <Input label="Department" error={errors.department?.message} {...register('department')} />
          <Input label="Enrolled" type="number" error={errors.enrolled?.message} {...register('enrolled')} />
          <Input label="Progress %" type="number" error={errors.progress?.message} {...register('progress')} />
          <Input label="Description" className="sm:col-span-2" error={errors.description?.message} {...register('description')} />
          <div className="sm:col-span-2 flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
