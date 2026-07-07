import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { searchStudents } from '@/services/studentService'
import { getCourses } from '@/services/courseService'
import { getFaculty } from '@/services/facultyService'
import { searchBooks } from '@/services/libraryService'
import { getAnnouncements } from '@/services/announcementService'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 200)
  const navigate = useNavigate()

  const results = useMemo(() => {
    if (!debounced.trim()) return []
    const items: { label: string; sub: string; path: string; type: string }[] = []

    searchStudents(debounced).slice(0, 3).forEach((s) =>
      items.push({ label: s.name, sub: s.rollNo, path: '/students', type: 'Student' })
    )
    getCourses().filter((c) =>
      c.title.toLowerCase().includes(debounced.toLowerCase()) ||
      c.code.toLowerCase().includes(debounced.toLowerCase())
    ).slice(0, 3).forEach((c) =>
      items.push({ label: c.title, sub: c.code, path: '/courses', type: 'Course' })
    )
    getFaculty().filter((f) =>
      f.name.toLowerCase().includes(debounced.toLowerCase())
    ).slice(0, 2).forEach((f) =>
      items.push({ label: f.name, sub: f.department, path: '/faculty', type: 'Faculty' })
    )
    searchBooks(debounced).slice(0, 2).forEach((b) =>
      items.push({ label: b.title, sub: b.author, path: '/library', type: 'Book' })
    )
    getAnnouncements().filter((a) =>
      a.title.toLowerCase().includes(debounced.toLowerCase())
    ).slice(0, 2).forEach((a) =>
      items.push({ label: a.title, sub: a.type, path: '/announcements', type: 'Announcement' })
    )

    return items
  }, [debounced])

  const go = (path: string) => {
    navigate(path)
    onClose()
    setQuery('')
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg glass rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-3 px-4 border-b border-[var(--border)]">
            <Search className="h-5 w-5 text-[var(--text-muted)]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students, courses, faculty..."
              className="flex-1 h-14 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 && query && (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">No results found</p>
            )}
            {!query && (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">Type to search across the campus</p>
            )}
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => go(r.path)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[var(--bg-secondary)] text-left"
              >
                <div>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{r.sub}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">{r.type}</span>
                  <ArrowRight className="h-3 w-3 text-[var(--text-muted)]" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
