import { cn } from '@/lib/utils'
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export default function Input({
  className,
  label,
  error,
  hint,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-slate-300">
          {label}
          {props.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 rounded-lg text-sm',
          'border border-slate-700 bg-slate-900/70 shadow-sm',
          'placeholder:text-slate-500 text-slate-100',
          'transition-all duration-200 hover:border-slate-500 hover:bg-slate-800/80 hover:shadow-md',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
          'focus:shadow-[0_0_0_1px_rgba(139,92,246,0.35),0_8px_24px_rgba(15,23,42,0.55)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-900/40',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}