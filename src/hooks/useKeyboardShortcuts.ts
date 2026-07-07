import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      for (const s of shortcuts) {
        const ctrlMatch = s.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey
        const shiftMatch = s.shift ? e.shiftKey : !e.shiftKey
        if (e.key.toLowerCase() === s.key.toLowerCase() && ctrlMatch && shiftMatch) {
          e.preventDefault()
          s.action()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shortcuts])
}

export function useGlobalShortcuts(onSearch: () => void) {
  const navigate = useNavigate()

  useKeyboardShortcuts([
    { key: 'k', ctrl: true, action: onSearch, description: 'Open search' },
    { key: 'd', ctrl: true, shift: true, action: () => navigate('/'), description: 'Go to dashboard' },
    { key: 's', ctrl: true, shift: true, action: () => navigate('/students'), description: 'Go to students' },
    { key: 'a', ctrl: true, shift: true, action: () => navigate('/attendance'), description: 'Go to attendance' },
  ])
}
