import { cn } from '@/utils/cn'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  padding?: boolean
}

export function Card({ children, className, hover, glass = true, padding = true }: CardProps) {
  const Comp = hover ? motion.div : 'div'
  const props = hover
    ? { whileHover: { y: -2, transition: { duration: 0.2 } } }
    : {}

  return (
    <Comp
      {...props}
      className={cn(
        'rounded-[24px] border border-[var(--border)]/70',
        glass && 'glass',
        !glass && 'bg-[var(--surface-solid)]',
        padding && 'p-6',
        hover && 'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(15,23,42,0.12)]',
        className
      )}
    >
      {children}
    </Comp>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-[var(--text)]', className)}>{children}</h3>
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-sm text-[var(--text-muted)] mt-1', className)}>{children}</p>
}
