import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const variants = {
      primary: 'gradient-bg text-white shadow-[0_10px_40px_rgba(99,102,241,0.35)] hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_16px_50px_rgba(99,102,241,0.45)]',
      secondary: 'bg-[var(--surface-solid)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg-secondary)] hover:border-indigo-400/40',
      ghost: 'text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]',
      danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-[0_10px_30px_rgba(239,68,68,0.25)]',
      outline: 'border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)]',
    }
    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-lg',
      md: 'h-10 px-4 text-sm rounded-xl',
      lg: 'h-12 px-6 text-base rounded-xl',
      icon: 'h-10 w-10 rounded-xl',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 will-change-transform',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
