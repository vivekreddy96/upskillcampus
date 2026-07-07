import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { resetPassword } from '@/services/authService'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { toast } = useToast()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    const result = resetPassword(data.email)
    setLoading(false)
    setSent(true)
    toast(result.message, 'success')
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="inline-flex p-4 rounded-full bg-emerald-500/10 mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-[var(--text-muted)] mb-8">
          If an account exists with that email, we've sent password reset instructions.
        </p>
        <Link to="/login">
          <Button variant="secondary"><ArrowLeft className="h-4 w-4" /> Back to login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/login" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to login
      </Link>
      <h2 className="text-2xl font-bold mb-2">Forgot password?</h2>
      <p className="text-[var(--text-muted)] mb-8">Enter your email and we'll send reset instructions</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="you@campus.edu" icon={<Mail className="h-4 w-4" />} error={errors.email?.message} {...register('email')} />
        <Button type="submit" className="w-full" size="lg" loading={loading}>Send reset link</Button>
      </form>
    </div>
  )
}
