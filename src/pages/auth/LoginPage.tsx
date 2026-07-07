import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: false },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const result = await login(data.email, data.password, data.rememberMe ?? false)
    setLoading(false)
    if (result.success) {
      toast('Welcome back!', 'success')
      navigate('/')
    } else {
      toast(result.error || 'Login failed', 'error')
    }
  }

  return (
    <div>
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold">SC</div>
        <span className="text-xl font-bold gradient-text">Smart Campus</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
      <p className="text-[var(--text-muted)] mb-8">Sign in to your account to continue</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="admin@campus.edu"
          icon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[34px] text-[var(--text-muted)]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('rememberMe')} className="rounded" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-indigo-500 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--text-muted)] mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-500 font-medium hover:underline">Sign up</Link>
      </p>

      <div className="mt-6 p-4 rounded-xl bg-[var(--gradient-subtle)] text-xs text-[var(--text-muted)]">
        <p className="font-medium mb-1">Demo credentials:</p>
        <p>admin@campus.edu / password123</p>
      </div>
    </div>
  )
}
