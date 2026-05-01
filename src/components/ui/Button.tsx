import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-500 hover:to-indigo-500 shadow-[0_10px_25px_rgba(15,23,42,0.5)]',
    secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600 shadow-sm',
    outline: 'border border-slate-600 text-slate-200 hover:bg-slate-800/70 hover:border-slate-400',
    ghost: 'text-slate-300 hover:bg-slate-800/70 hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-950',
        'hover:shadow-[0_8px_18px_rgba(15,23,42,0.45)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      )}
      
      {children}
    </button>
  )
}
