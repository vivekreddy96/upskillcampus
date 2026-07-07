import { useAuth } from '@/context/AuthContext'
import { SuperAdminDashboard, AdminDashboard, FacultyDashboard, StudentDashboard } from './RoleDashboards'

export default function DashboardPage() {
  const { user } = useAuth()

  switch (user?.role) {
    case 'super_admin':
      return <SuperAdminDashboard />
    case 'admin':
      return <AdminDashboard />
    case 'faculty':
      return <FacultyDashboard />
    case 'student':
      return <StudentDashboard />
    default:
      return <AdminDashboard />
  }
}
