import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getTimetable, DAYS } from '@/services/timetableService'
import { getCourses } from '@/services/courseService'

export default function TimetablePage() {
  const [view, setView] = useState<'weekly' | 'daily'>('weekly')
  const [selectedDay, setSelectedDay] = useState<string>(
    DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] || 'Monday'
  )
  const slots = getTimetable()
  const courses = getCourses()

  const getCourse = (id: string) => courses.find((c) => c.id === id)

  const timeSlots = [...new Set(slots.map((s) => s.startTime))].sort()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <PageHeader
        title="Timetable"
        description="View weekly and daily class schedules"
        actions={
          <div className="flex gap-2">
            <Button variant={view === 'weekly' ? 'primary' : 'secondary'} size="sm" onClick={() => setView('weekly')}>Weekly</Button>
            <Button variant={view === 'daily' ? 'primary' : 'secondary'} size="sm" onClick={() => setView('daily')}>Daily</Button>
          </div>
        }
      />

      {view === 'weekly' ? (
        <Card padding={false} className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)] w-24">Time</th>
                {DAYS.slice(0, 6).map((day) => (
                  <th key={day} className="px-4 py-3 text-left text-xs font-medium text-[var(--text-muted)]">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time} className="border-b border-[var(--border)]">
                  <td className="px-4 py-3 text-sm font-medium text-[var(--text-muted)]">{time}</td>
                  {DAYS.slice(0, 6).map((day) => {
                    const slot = slots.find((s) => s.day === day && s.startTime === time)
                    const course = slot ? getCourse(slot.courseId) : null
                    return (
                      <td key={day} className="px-2 py-2">
                        {slot && course ? (
                          <div className="p-3 rounded-xl bg-[var(--gradient-subtle)] border border-indigo-500/20">
                            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{course.code}</p>
                            <p className="text-xs mt-1 truncate">{course.title}</p>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-[var(--text-muted)]">
                              <MapPin className="h-3 w-3" /> {slot.room}
                            </div>
                          </div>
                        ) : null}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        <div>
          <div className="flex gap-2 mb-6 flex-wrap">
            {DAYS.slice(0, 6).map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </Button>
            ))}
          </div>
          <div className="space-y-3">
            {slots
              .filter((s) => s.day === selectedDay)
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((slot) => {
                const course = getCourse(slot.courseId)
                if (!course) return null
                return (
                  <Card key={slot.id} hover>
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[80px]">
                        <Clock className="h-5 w-5 text-indigo-500 mx-auto mb-1" />
                        <p className="text-sm font-semibold">{slot.startTime}</p>
                        <p className="text-xs text-[var(--text-muted)]">{slot.endTime}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="info">{course.code}</Badge>
                          <h3 className="font-semibold">{course.title}</h3>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] mt-1">{course.department}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
                        <MapPin className="h-4 w-4" /> {slot.room}
                      </div>
                    </div>
                  </Card>
                )
              })}
            {slots.filter((s) => s.day === selectedDay).length === 0 && (
              <Card className="text-center py-12">
                <Calendar className="h-10 w-10 text-[var(--text-muted)] mx-auto mb-3" />
                <p className="text-[var(--text-muted)]">No classes scheduled for {selectedDay}</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
