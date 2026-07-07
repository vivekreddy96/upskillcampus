import { getStorage, setStorage } from './storage'
import type { Book } from '@/types'

export function getBooks(): Book[] {
  return getStorage<Book[]>('library', [])
}

export function getBook(id: string): Book | undefined {
  return getBooks().find((b) => b.id === id)
}

export function searchBooks(query: string): Book[] {
  const q = query.toLowerCase()
  return getBooks().filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q) ||
      b.category.toLowerCase().includes(q)
  )
}

export function borrowBook(bookId: string, studentId: string): { success: boolean; error?: string } {
  const books = getBooks()
  const index = books.findIndex((b) => b.id === bookId)
  if (index === -1) return { success: false, error: 'Book not found' }
  if (!books[index].available) return { success: false, error: 'Book is not available' }
  books[index] = {
    ...books[index],
    available: false,
    borrowedBy: studentId,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
  }
  setStorage('library', books)
  return { success: true }
}

export function returnBook(bookId: string): { success: boolean; error?: string } {
  const books = getBooks()
  const index = books.findIndex((b) => b.id === bookId)
  if (index === -1) return { success: false, error: 'Book not found' }
  books[index] = {
    ...books[index],
    available: true,
    borrowedBy: undefined,
    dueDate: undefined,
  }
  setStorage('library', books)
  return { success: true }
}

export function getCategories(): string[] {
  return [...new Set(getBooks().map((b) => b.category))].sort()
}
