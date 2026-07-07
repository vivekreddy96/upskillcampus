import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Trash2, Sparkles, User, HelpCircle } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import {
  getChatHistory, sendMessage, clearChatHistory, getFAQItems,
} from '@/services/aiService'
import { formatDateTime } from '@/utils/cn'
import type { ChatMessage } from '@/types'

const suggestions = [
  'How do I check my attendance?',
  'When are the exams?',
  'How to borrow library books?',
  'What is my GPA?',
]

export default function AIAssistantPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>(getChatHistory())
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const faqItems = getFAQItems()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim()
    if (!content) return

    setInput('')
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setTyping(true)

    setTimeout(() => {
      sendMessage(content)
      setMessages(getChatHistory())
      setTyping(false)
    }, 600 + Math.random() * 400)
  }

  const handleClear = () => {
    clearChatHistory()
    setMessages([])
    toast('Chat history cleared', 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 h-[calc(100vh-8rem)] flex flex-col"
    >
      <div className="flex items-start justify-between gap-4 shrink-0">
        <PageHeader
          title="AI Assistant"
          description="Get instant answers about campus services and policies"
        />
        <Button variant="outline" size="sm" onClick={handleClear}>
          <Trash2 className="h-4 w-4" />
          Clear Chat
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <Card className="lg:col-span-3 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 p-1 min-h-0">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="h-16 w-16 rounded-2xl gradient-bg flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">How can I help you today?</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-md mb-6">
                  Ask me about attendance, grades, timetables, library, registration, and more.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="px-3 py-2 rounded-xl text-sm border border-[var(--border)] hover:border-indigo-500/30 hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="h-8 w-8 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  ) : (
                    <Avatar name={user?.name ?? 'User'} size="sm" />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'gradient-bg text-white'
                        : 'bg-[var(--bg-secondary)]'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                      {formatDateTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {typing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="h-8 w-8 rounded-xl gradient-bg flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-[var(--bg-secondary)] rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-indigo-500"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-[var(--border)] pt-4 mt-4 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend() }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about campus..."
                className="flex-1 h-11 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <Button type="submit" disabled={!input.trim() || typing}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        <div className="space-y-4 overflow-y-auto">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold text-sm">Quick Topics</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="w-full text-left text-xs p-2.5 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-5 w-5 text-indigo-500" />
              <h3 className="font-semibold text-sm">FAQ</h3>
            </div>
            <div className="space-y-3">
              {faqItems.slice(0, 4).map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(item.question)}
                  className="w-full text-left"
                >
                  <p className="text-xs font-medium capitalize">{item.question}</p>
                  <p className="text-[10px] text-[var(--text-muted)] line-clamp-2 mt-0.5">{item.answer}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="gradient-subtle">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-500" />
              <p className="text-xs text-[var(--text-muted)]">
                Chatting as <span className="font-medium text-[var(--text)]">{user?.name}</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
