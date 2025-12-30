import { cookies } from 'next/headers'
import { verifyToken } from './jwt'
import { SessionUser } from '@/types'

const SESSION_COOKIE_NAME = 'zodiacly_session'

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  return await verifyToken(token)
}

export async function setSession(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth()
  if (session.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required')
  }
  return session
}

export async function requirePro(): Promise<SessionUser> {
  const session = await requireAuth()
  if (session.plan !== 'PRO') {
    throw new Error('Forbidden: PRO plan required')
  }
  return session
}
