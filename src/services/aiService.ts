import { getStorage, setStorage } from './storage'
import type { Activity, ChatMessage } from '@/types'
import { generateId } from '@/utils/cn'

export function getActivities(): Activity[] {
  return getStorage<Activity[]>('activities', [])
}

const FAQ_RESPONSES: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['attendance', 'present', 'absent'],
    answer: 'You can view and mark attendance from the Attendance module. Navigate to Attendance > Mark Attendance, select a course and date, then mark each student as present, absent, or late.',
  },
  {
    keywords: ['gpa', 'grade', 'result'],
    answer: 'Your GPA is calculated based on your course grades and credits. Visit the Results module to view your marks, grades, and use the built-in GPA calculator.',
  },
  {
    keywords: ['timetable', 'schedule', 'class'],
    answer: 'Your weekly class schedule is available in the Timetable module. You can switch between weekly and daily views to see your classes, rooms, and timings.',
  },
  {
    keywords: ['library', 'book', 'borrow'],
    answer: 'Browse the Library module to search for books. Available books can be borrowed for 14 days. Check the Borrow Status column for due dates.',
  },
  {
    keywords: ['register', 'registration', 'course'],
    answer: 'Course registration opens at the start of each semester. Check Announcements for registration dates and visit the Course Management module to view available courses.',
  },
  {
    keywords: ['password', 'login', 'account'],
    answer: 'To reset your password, use the Forgot Password link on the login page. For account issues, contact the IT helpdesk at help@campus.edu.',
  },
  {
    keywords: ['fee', 'payment'],
    answer: 'Semester fee payments can be made through the student portal. Check Announcements for payment deadlines. Late fees apply after the deadline.',
  },
  {
    keywords: ['exam', 'examination'],
    answer: 'Exam schedules are published in Announcements and the Timetable module. Mid-semester and end-semester exam dates are announced at least two weeks in advance.',
  },
]

export function getChatHistory(): ChatMessage[] {
  return getStorage<ChatMessage[]>('chatHistory', [])
}

export function sendMessage(content: string): ChatMessage {
  const history = getChatHistory()
  const userMsg: ChatMessage = {
    id: generateId(),
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
  }

  const lower = content.toLowerCase()
  let answer =
    "I'm your Smart Campus assistant! I can help with attendance, grades, timetables, library, registration, and more. What would you like to know?"

  for (const faq of FAQ_RESPONSES) {
    if (faq.keywords.some((k) => lower.includes(k))) {
      answer = faq.answer
      break
    }
  }

  const assistantMsg: ChatMessage = {
    id: generateId(),
    role: 'assistant',
    content: answer,
    timestamp: new Date().toISOString(),
  }

  const updated = [...history, userMsg, assistantMsg]
  setStorage('chatHistory', updated)
  return assistantMsg
}

export function clearChatHistory(): void {
  setStorage('chatHistory', [])
}

export function getFAQItems() {
  return FAQ_RESPONSES.map((f) => ({
    question: f.keywords[0].charAt(0).toUpperCase() + f.keywords[0].slice(1) + ' help',
    answer: f.answer,
  }))
}
