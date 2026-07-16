import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, ShieldCheck, BarChart3, Bot, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const features = [
  { title: 'AI-native workflows', description: 'Automate academic operations with a one-stop command center.', icon: Bot },
  { title: 'Secure RBAC', description: 'Role-aware access keeps every workflow protected and transparent.', icon: ShieldCheck },
  { title: 'Live insights', description: 'Track engagement, attendance, and performance in real time.', icon: BarChart3 },
]

const stats = [
  { label: 'Active users', value: '12k+' },
  { label: 'Campus modules', value: '18' },
  { label: 'Uptime', value: '99.9%' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(236,72,153,0.12),_transparent_25%),var(--bg)] text-[var(--text)]">
      <div className="mx-auto flex max-w-7xl flex-col px-6 py-6 lg:px-8">
        <header className="mb-10 flex items-center justify-between rounded-full border border-[var(--border)]/70 bg-[var(--surface)]/70 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-sm font-bold text-white">SC</div>
            <div>
              <div className="font-semibold">Smart Campus</div>
              <div className="text-xs text-[var(--text-muted)]">Startup-grade operations OS</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button>Get started</Button>
            </Link>
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-4 w-4" />
              AI-native campus platform
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                Build a campus experience that feels like a startup product.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
                Run student engagement, faculty operations, attendance, and analytics from one elegant, secure platform built for ambitious institutions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">Start free <ArrowRight className="h-4 w-4" /></Button>
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-5 py-3 text-sm font-medium text-[var(--text)] shadow-sm">
                <Play className="h-4 w-4" />
                See platform tour
              </a>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)]/80 p-4 backdrop-blur">
                  <div className="text-2xl font-semibold">{item.value}</div>
                  <div className="text-sm text-[var(--text-muted)]">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="relative">
            <div className="rounded-[32px] border border-[var(--border)]/70 bg-[var(--surface)]/70 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
              <div className="rounded-[24px] border border-[var(--border)] bg-[var(--surface-solid)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">Command center</div>
                    <div className="text-sm text-[var(--text-muted)]">Live campus operations</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-600">Live</div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">
                      <BarChart3 className="h-4 w-4" />
                      Engagement
                    </div>
                    <div className="h-24 rounded-xl bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 p-3">
                      <div className="flex h-full items-end gap-2">
                        {[38, 62, 46, 70, 82].map((height, index) => (
                          <div key={index} className="flex-1 rounded-t-full bg-gradient-to-t from-indigo-500 to-fuchsia-500" style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-300">
                      <Users className="h-4 w-4" />
                      Team access
                    </div>
                    <div className="space-y-2">
                      {['Admin', 'Faculty', 'Student'].map((role) => (
                        <div key={role} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] px-3 py-2 text-sm">
                          <span>{role}</span>
                          <span className="text-[var(--text-muted)]">RBAC enabled</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </main>
      </div>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-300">
            <Zap className="h-4 w-4" />
            Designed for ambitious teams
          </div>
          <h2 className="text-3xl font-semibold sm:text-4xl">Everything your campus needs to scale with confidence.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-[24px] border border-[var(--border)]/70 bg-[var(--surface)]/70 p-6 backdrop-blur"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl gradient-bg text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm leading-7 text-[var(--text-muted)]">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
