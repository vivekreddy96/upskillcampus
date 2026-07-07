import { useAuth } from '@/context/AuthContext'
import DashboardPage from './DashboardPage'
import StudentDashboardPage from './StudentDashboardPage'

export default function DashboardRouter() {
  const { user } = useAuth()

  if (user?.role === 'student') {
    return <StudentDashboardPage />
  }

  return <DashboardPage />
}
