import { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
  type?: 'info' | 'success' | 'warning' | 'error'
  className?: string
}

export default function Alert({ children, type = 'info', className = '' }: AlertProps) {
  const types = {
    info: 'bg-blue-900/30 border-blue-500 text-blue-300',
    success: 'bg-green-900/30 border-green-500 text-green-300',
    warning: 'bg-yellow-900/30 border-yellow-500 text-yellow-300',
    error: 'bg-red-900/30 border-red-500 text-red-300',
  }

  return (
    <div className={`border-l-4 p-4 rounded ${types[type]} ${className}`}>
      {children}
    </div>
  )
}
