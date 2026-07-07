import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldX, ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'

export default function UnauthorizedPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mx-auto h-20 w-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
          <ShieldX className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-6xl font-bold gradient-text mb-2">403</h1>
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-[var(--text-muted)] mb-8">
          {user
            ? `Your role (${user.role.replace('_', ' ')}) does not have permission to access this page.`
            : 'You need to sign in to access this page.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button><Home className="h-4 w-4" /> Go to Dashboard</Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
