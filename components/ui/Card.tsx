import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div
      className={`
        bg-cosmic-surface rounded-xl p-6 border border-cosmic-primary/20
        ${hover ? 'hover:border-cosmic-primary/50 hover:shadow-lg hover:shadow-cosmic-primary/20 transition-all cursor-pointer' : ''}
        ${glow ? 'shadow-lg shadow-cosmic-primary/30' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
