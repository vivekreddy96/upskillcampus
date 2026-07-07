import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Building2, Shield, Key, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { changePassword } from '@/services/authService'
import { formatDate } from '@/utils/cn'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  department: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      department: user?.department ?? '',
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileForm) => {
    setSaving(true)
    updateProfile(data)
    setSaving(false)
    toast('Profile updated successfully', 'success')
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (!user) return
    setChangingPassword(true)
    const result = changePassword(user.id, data.currentPassword, data.newPassword)
    setChangingPassword(false)
    if (result.success) {
      toast('Password changed successfully', 'success')
      passwordForm.reset()
    } else {
      toast(result.error || 'Failed to change password', 'error')
    }
  }

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl"
    >
      <PageHeader
        title="Profile"
        description="Manage your personal information and account security"
      />

      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 gradient-bg opacity-20" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
          <Avatar name={user.name} src={user.avatar} size="lg" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-[var(--text-muted)]">{user.email}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="purple" className="capitalize">{user.role}</Badge>
              {user.department && (
                <Badge variant="default">{user.department}</Badge>
              )}
            </div>
          </div>
          <div className="text-sm text-[var(--text-muted)] flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Joined {formatDate(user.createdAt)}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4 mt-6">
            <Input
              label="Full Name"
              icon={<User className="h-4 w-4" />}
              error={profileForm.formState.errors.name?.message}
              {...profileForm.register('name')}
            />
            <Input
              label="Email"
              type="email"
              icon={<Mail className="h-4 w-4" />}
              error={profileForm.formState.errors.email?.message}
              {...profileForm.register('email')}
            />
            <Input
              label="Phone"
              icon={<Phone className="h-4 w-4" />}
              error={profileForm.formState.errors.phone?.message}
              {...profileForm.register('phone')}
            />
            <Input
              label="Department"
              icon={<Building2 className="h-4 w-4" />}
              error={profileForm.formState.errors.department?.message}
              {...profileForm.register('department')}
            />
            <Button type="submit" loading={saving}>Save Changes</Button>
          </form>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-indigo-500" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>Ensure your account stays secure</CardDescription>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 mt-6">
            <Input
              label="Current Password"
              type="password"
              icon={<Key className="h-4 w-4" />}
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')}
            />
            <Input
              label="New Password"
              type="password"
              icon={<Key className="h-4 w-4" />}
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword')}
            />
            <Input
              label="Confirm Password"
              type="password"
              icon={<Key className="h-4 w-4" />}
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword')}
            />
            <Button type="submit" variant="outline" loading={changingPassword}>
              Update Password
            </Button>
          </form>
        </Card>
      </div>
    </motion.div>
  )
}
