import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden gradient-bg items-center justify-center p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_30%)]" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-white max-w-xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur mb-6">
            <GraduationCap className="h-4 w-4" />
            AI-native campus OS
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Smart Campus</span>
          </div>
          <h1 className="text-4xl font-semibold mb-4 leading-tight">
            Built for modern campuses that move at startup speed.
          </h1>
          <p className="text-white/80 text-lg leading-8">
            From student onboarding to faculty operations and analytics, run your institution with a premium, intelligent experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">⚡ Instant insights</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">🔐 Role-based security</span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">📈 Growth-ready workflows</span>
          </div>
        </motion.div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-[var(--bg)]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
