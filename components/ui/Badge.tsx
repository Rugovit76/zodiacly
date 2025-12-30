import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'free' | 'pro' | 'admin' | 'success' | 'warning' | 'error'
  className?: string
}

export default function Badge({ children, variant = 'free', className = '' }: BadgeProps) {
  const variants = {
    free: 'bg-gray-700 text-gray-300',
    pro: 'bg-gradient-to-r from-cosmic-primary to-cosmic-secondary text-white shadow-lg shadow-cosmic-primary/50',
    admin: 'bg-cosmic-accent text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
  }

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
