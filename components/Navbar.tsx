'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Badge from './ui/Badge'
import Button from './ui/Button'

interface NavbarProps {
  user?: {
    email: string
    plan: 'FREE' | 'PRO'
    role: 'USER' | 'ADMIN'
  } | null
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-cosmic-primary/20 bg-cosmic-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cosmic-primary to-cosmic-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">✨</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cosmic-primary via-cosmic-secondary to-cosmic-accent bg-clip-text text-transparent">
              Zodiacly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`hover:text-cosmic-primary transition-colors ${
                    pathname === '/dashboard' ? 'text-cosmic-primary' : 'text-gray-300'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/compatibility"
                  className={`hover:text-cosmic-secondary transition-colors ${
                    pathname === '/compatibility' ? 'text-cosmic-secondary' : 'text-gray-300'
                  }`}
                >
                  💑 Compatibility
                </Link>
                <Link
                  href="/horoscopes"
                  className={`hover:text-cosmic-gold transition-colors ${
                    pathname === '/horoscopes' ? 'text-cosmic-gold' : 'text-gray-300'
                  }`}
                >
                  🔮 Horoscopes
                </Link>
                <Link
                  href="/numerology"
                  className={`hover:text-cosmic-secondary transition-colors ${
                    pathname === '/numerology' ? 'text-cosmic-secondary' : 'text-gray-300'
                  }`}
                >
                  🔢 Numerology
                </Link>
                <Link
                  href="/blog"
                  className={`hover:text-cosmic-accent transition-colors ${
                    pathname?.startsWith('/blog') ? 'text-cosmic-accent' : 'text-gray-300'
                  }`}
                >
                  📚 Blog
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={`hover:text-cosmic-accent transition-colors ${
                      pathname === '/admin' ? 'text-cosmic-accent' : 'text-gray-300'
                    }`}
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <Badge variant={user.plan === 'PRO' ? 'pro' : 'free'}>
                    {user.plan}
                  </Badge>
                  <span className="text-sm text-gray-400">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-300 hover:text-cosmic-primary transition-colors"
                >
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            {user ? (
              <>
                <Link href="/dashboard" className="block text-gray-300 hover:text-cosmic-primary">
                  Dashboard
                </Link>
                <Link href="/compatibility" className="block text-gray-300 hover:text-cosmic-secondary">
                  💑 Compatibility
                </Link>
                <Link href="/horoscopes" className="block text-gray-300 hover:text-cosmic-gold">
                  🔮 Horoscopes
                </Link>
                <Link href="/numerology" className="block text-gray-300 hover:text-cosmic-secondary">
                  🔢 Numerology
                </Link>
                <Link href="/blog" className="block text-gray-300 hover:text-cosmic-accent">
                  📚 Blog
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="block text-gray-300 hover:text-cosmic-accent">
                    Admin
                  </Link>
                )}
                <div className="pt-2 border-t border-cosmic-primary/20">
                  <p className="text-sm text-gray-400 mb-2">{user.email}</p>
                  <Badge variant={user.plan === 'PRO' ? 'pro' : 'free'} className="mb-3">
                    {user.plan}
                  </Badge>
                  <Button variant="outline" size="sm" fullWidth onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-300 hover:text-cosmic-primary">
                  Login
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" fullWidth>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
