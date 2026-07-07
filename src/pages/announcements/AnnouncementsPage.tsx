import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Megaphone, Calendar, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/context/ToastContext'
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '@/services/announcementService'
import { formatDate } from '@/utils/cn'
import type { Announcement } from '@/types'

const schema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  type: z.enum(['notice', 'event', 'update']),
  priority: z.enum(['low', 'medium', 'high']),
  author: z.string().min(2),
})

type FormData = z.infer<typeof schema>

const typeIcons = { notice: Megaphone, event: Calendar, update: AlertCircle }
const priorityVariant = { low: 'default' as const, medium: 'warning' as const, high: 'danger' as const }

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(getAnnouncements())
  const [filter, setFilter] = useState<'all' | Announcement['type']>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'notice', priority: 'medium', author: 'Admin' },
  })

  const refresh = () => setAnnouncements(getAnnouncements())
  const filtered = filter === 'all' ? announcements : announcements.filter((a) => a.type === filter)

  const onSubmit = (data: FormData) => {
    createAnnouncement({ ...data, date: new Date().toISOString() })
    toast('Announcement published', 'success')
    setModalOpen(false)
    reset()
    refresh()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Announcements"
        description="Notices, events, and important updates"
        actions={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> New Announcement</Button>}
      />

      <div className="flex gap-2 mb-6">
        {(['all', 'notice', 'event', 'update'] as const).map((f) => (
          <Button key={f} variant={filter === f ? 'primary' : 'secondary'} size="sm" onClick={() => setFilter(f)} className="capitalize">
            {f === 'all' ? 'All' : f + 's'}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((a, i) => {
          const Icon = typeIcons[a.type]
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover>
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-[var(--gradient-subtle)]">
                    <Icon className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{a.title}</h3>
                      <Badge variant={priorityVariant[a.priority]}>{a.priority}</Badge>
                      <Badge variant="info">{a.type}</Badge>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-2">{a.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
                      <span>{formatDate(a.date)}</span>
                      <span>By {a.author}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { deleteAnnouncement(a.id); refresh(); toast('Deleted', 'success') }}>
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Announcement">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Title" error={errors.title?.message} {...register('title')} />
          <div>
            <label className="block text-sm font-medium mb-1.5">Content</label>
            <textarea
              {...register('content')}
              rows={4}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2 text-sm"
            />
            {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" options={[{ value: 'notice', label: 'Notice' }, { value: 'event', label: 'Event' }, { value: 'update', label: 'Update' }]} {...register('type')} />
            <Select label="Priority" options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} {...register('priority')} />
          </div>
          <Input label="Author" error={errors.author?.message} {...register('author')} />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Publish</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
