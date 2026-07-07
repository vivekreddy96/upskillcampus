import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, BookOpen, BookMarked } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { useToast } from '@/context/ToastContext'
import { useDebounce } from '@/hooks/useDebounce'
import { getBooks, searchBooks, borrowBook, returnBook, getCategories } from '@/services/libraryService'
import { getStudents } from '@/services/studentService'
import { formatDate } from '@/utils/cn'

export default function LibraryPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [books, setBooks] = useState(getBooks())
  const debouncedQuery = useDebounce(query)
  const { toast } = useToast()
  const categories = getCategories()
  const students = getStudents()

  const refresh = () => setBooks(getBooks())

  const filtered = (() => {
    let data = debouncedQuery ? searchBooks(debouncedQuery) : books
    if (category !== 'all') data = data.filter((b) => b.category === category)
    return data
  })()

  const handleBorrow = (bookId: string) => {
    const studentId = students[0]?.id
    if (!studentId) return
    const result = borrowBook(bookId, studentId)
    if (result.success) {
      toast('Book borrowed successfully', 'success')
      refresh()
    } else {
      toast(result.error || 'Failed', 'error')
    }
  }

  const handleReturn = (bookId: string) => {
    const result = returnBook(bookId)
    if (result.success) {
      toast('Book returned', 'success')
      refresh()
    }
  }

  const getBorrower = (id?: string) => students.find((s) => s.id === id)?.name

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader title="Library" description="Browse books, check availability, and manage borrowing" />

      <div className="glass rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, ISBN..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] text-sm"
            />
          </div>
          <Select
            options={[{ value: 'all', label: 'All Categories' }, ...categories.map((c) => ({ value: c, label: c }))]}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card padding className="text-center">
          <p className="text-2xl font-bold">{books.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Total Books</p>
        </Card>
        <Card padding className="text-center">
          <p className="text-2xl font-bold text-emerald-500">{books.filter((b) => b.available).length}</p>
          <p className="text-xs text-[var(--text-muted)]">Available</p>
        </Card>
        <Card padding className="text-center">
          <p className="text-2xl font-bold text-amber-500">{books.filter((b) => !b.available).length}</p>
          <p className="text-xs text-[var(--text-muted)]">Borrowed</p>
        </Card>
        <Card padding className="text-center">
          <p className="text-2xl font-bold">{categories.length}</p>
          <p className="text-xs text-[var(--text-muted)]">Categories</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.slice(0, 30).map((book, i) => (
          <motion.div key={book.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
            <Card hover className="h-full flex flex-col">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[var(--gradient-subtle)]">
                  {book.available ? <BookOpen className="h-5 w-5 text-indigo-500" /> : <BookMarked className="h-5 w-5 text-amber-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{book.author}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="info">{book.category}</Badge>
                    <Badge variant={book.available ? 'success' : 'warning'}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-3">ISBN: {book.isbn}</p>
              {!book.available && book.dueDate && (
                <p className="text-xs text-amber-500 mt-1">
                  Due: {formatDate(book.dueDate)} {book.borrowedBy && `· ${getBorrower(book.borrowedBy)}`}
                </p>
              )}
              <div className="mt-auto pt-3">
                {book.available ? (
                  <Button size="sm" className="w-full" onClick={() => handleBorrow(book.id)}>Borrow</Button>
                ) : (
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => handleReturn(book.id)}>Return</Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
