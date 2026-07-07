import { cn } from '@/utils/cn'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)]',
          'px-3 text-sm text-[var(--text)]',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50',
          error && 'border-red-500/50',
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
