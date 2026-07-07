import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Plus, Pencil, Trash2, GraduationCap } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import { getFaculty, createFaculty, updateFaculty, deleteFaculty, getDepartments } from '@/services/facultyService'
import type { Faculty } from '@/types'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  department: z.string().min(1),
  designation: z.string().min(1),
  office: z.string().min(1),
  specialization: z.string().min(1),
})

type FormData = z.infer<typeof schema>

export default function FacultyPage() {
  const [faculty, setFaculty] = useState(getFaculty())
  const [deptFilter, setDeptFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Faculty | null>(null)
  const { toast } = useToast()
  const departments = getDepartments()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const refresh = () => setFaculty(getFaculty())

  const filtered = deptFilter === 'all' ? faculty : faculty.filter((f) => f.department === deptFilter)

  const openAdd = () => {
    setEditing(null)
    reset({ name: '', email: '', phone: '', department: departments[0] || '', designation: 'Lecturer', office: '', specialization: '' })
    setModalOpen(true)
  }

  const openEdit = (f: Faculty) => {
    setEditing(f)
    reset(f)
    setModalOpen(true)
  }

  const onSubmit = (data: FormData) => {
    if (editing) {
      updateFaculty(editing.id, data)
      toast('Faculty updated', 'success')
    } else {
      createFaculty(data)
      toast('Faculty added', 'success')
    }
    setModalOpen(false)
    refresh()
  }

  const handleDelete = (f: Faculty) => {
    deleteFaculty(f.id)
    toast('Faculty removed', 'success')
    refresh()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Faculty Management"
        description="Manage faculty profiles and departments"
        actions={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Faculty</Button>}
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        <Button variant={deptFilter === 'all' ? 'primary' : 'secondary'} size="sm" onClick={() => setDeptFilter('all')}>All</Button>
        {departments.map((d) => (
          <Button key={d} variant={deptFilter === d ? 'primary' : 'secondary'} size="sm" onClick={() => setDeptFilter(d)}>
            {d.split(' ')[0]}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((f, i) => (
          <motion.div key={f.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card hover>
              <div className="flex items-start gap-4">
                <Avatar name={f.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{f.name}</h3>
                  <Badge variant="purple" className="mt-1">{f.designation}</Badge>
                  <p className="text-xs text-[var(--text-muted)] mt-2">{f.specialization}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(f)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <GraduationCap className="h-4 w-4" /> {f.department}
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Mail className="h-4 w-4" /> {f.email}
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Phone className="h-4 w-4" /> {f.phone}
                </div>
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <MapPin className="h-4 w-4" /> {f.office}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Faculty' : 'Add Faculty'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Select label="Department" options={departments.map((d) => ({ value: d, label: d }))} {...register('department')} />
          <Input label="Designation" error={errors.designation?.message} {...register('designation')} />
          <Input label="Office" error={errors.office?.message} {...register('office')} />
          <Input label="Specialization" className="sm:col-span-2" error={errors.specialization?.message} {...register('specialization')} />
          <div className="sm:col-span-2 flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
