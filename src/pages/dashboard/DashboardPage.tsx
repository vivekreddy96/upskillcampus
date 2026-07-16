import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { SuperAdminDashboard, AdminDashboard, FacultyDashboard, StudentDashboard } from './RoleDashboards'

export default function DashboardPage() {
  const { user } = useAuth()

  const dashboard = (() => {
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
  })()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={user?.role ?? 'guest'}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {dashboard}
      </motion.div>
    </AnimatePresence>
  )
}
