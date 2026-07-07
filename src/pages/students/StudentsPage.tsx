import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, flexRender, type SortingState, type ColumnDef,
} from '@tanstack/react-table'
import { Plus, Search, Pencil, Trash2, Download, ChevronUp, ChevronDown, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { useToast } from '@/context/ToastContext'
import { getStudents, createStudent, updateStudent, deleteStudent } from '@/services/studentService'
import { exportToCSV } from '@/utils/exportCsv'
import type { Student } from '@/types'

const schema = z.object({
  name: z.string().min(2),
  rollNo: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  department: z.string().min(1),
  year: z.coerce.number().min(1).max(4),
  status: z.enum(['active', 'inactive']),
  gpa: z.coerce.number().min(0).max(4),
})

type FormData = z.infer<typeof schema>

const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Business Administration']

export default function StudentsPage() {
  const [students, setStudents] = useState(getStudents())
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteModal, setDeleteModal] = useState<Student | null>(null)
  const [editing, setEditing] = useState<Student | null>(null)
  const { toast } = useToast()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'active', year: 1, gpa: 3.0 },
  })

  const refresh = () => setStudents(getStudents())

  const filtered = useMemo(() => {
    let data = students
    if (deptFilter !== 'all') data = data.filter((s) => s.department === deptFilter)
    return data
  }, [students, deptFilter])

  const columns: ColumnDef<Student>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Student',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar name={row.original.name} size="sm" />
          <div>
            <p className="font-medium text-sm">{row.original.name}</p>
            <p className="text-xs text-[var(--text-muted)]">{row.original.rollNo}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'year', header: 'Year' },
    {
      accessorKey: 'gpa',
      header: 'GPA',
      cell: ({ getValue }) => <span className="font-semibold">{getValue() as number}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => (
        <Badge variant={getValue() === 'active' ? 'success' : 'danger'}>{getValue() as string}</Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteModal(row.original)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ], [])

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const openAdd = () => {
    setEditing(null)
    reset({ name: '', rollNo: '', email: '', phone: '', department: DEPARTMENTS[0], year: 1, status: 'active', gpa: 3.0 })
    setModalOpen(true)
  }

  const openEdit = (s: Student) => {
    setEditing(s)
    reset({ name: s.name, rollNo: s.rollNo, email: s.email, phone: s.phone, department: s.department, year: s.year, status: s.status, gpa: s.gpa })
    setModalOpen(true)
  }

  const onSubmit = (data: FormData) => {
    if (editing) {
      updateStudent(editing.id, { ...data, enrollmentDate: editing.enrollmentDate })
      toast('Student updated', 'success')
    } else {
      createStudent({ ...data, enrollmentDate: new Date().toISOString() })
      toast('Student added', 'success')
    }
    setModalOpen(false)
    refresh()
  }

  const handleDelete = () => {
    if (deleteModal) {
      deleteStudent(deleteModal.id)
      toast('Student deleted', 'success')
      setDeleteModal(null)
      refresh()
    }
  }

  const handleExport = () => {
    exportToCSV(
      students.map((s) => ({
        name: s.name,
        rollNo: s.rollNo,
        email: s.email,
        phone: s.phone,
        department: s.department,
        year: s.year,
        status: s.status,
        gpa: s.gpa,
        enrollmentDate: s.enrollmentDate,
      })),
      'students.csv'
    )
    toast('Exported to CSV', 'success')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Student Management"
        description="Manage student records, enrollment, and profiles"
        actions={
          <>
            <Button variant="secondary" onClick={handleExport}><Download className="h-4 w-4" /> Export</Button>
            <Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Student</Button>
          </>
        }
      />

      <div className="glass rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search students..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] text-sm"
            />
          </div>
          <Select
            options={[{ value: 'all', label: 'All Departments' }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]}
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      {students.length === 0 ? (
        <EmptyState icon={Users} title="No students yet" description="Add your first student to get started" action={{ label: 'Add Student', onClick: openAdd }} />
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b border-[var(--border)]">
                    {hg.headers.map((h) => (
                      <th key={h.id} className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase">
                        {h.isPlaceholder ? null : (
                          <button
                            className="flex items-center gap-1"
                            onClick={h.column.getToggleSortingHandler()}
                          >
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            {{ asc: <ChevronUp className="h-3 w-3" />, desc: <ChevronDown className="h-3 w-3" /> }[h.column.getIsSorted() as string] ?? null}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 text-sm">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)]">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
              <Button variant="secondary" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Student' : 'Add Student'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" error={errors.name?.message} {...register('name')} />
          <Input label="Roll Number" error={errors.rollNo?.message} {...register('rollNo')} />
          <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
          <Input label="Phone" error={errors.phone?.message} {...register('phone')} />
          <Select label="Department" options={DEPARTMENTS.map((d) => ({ value: d, label: d }))} error={errors.department?.message} {...register('department')} />
          <Input label="Year" type="number" error={errors.year?.message} {...register('year')} />
          <Input label="GPA" type="number" step="0.01" error={errors.gpa?.message} {...register('gpa')} />
          <Select label="Status" options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} {...register('status')} />
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add'} Student</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Student">
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Are you sure you want to delete <strong>{deleteModal?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </motion.div>
  )
}
