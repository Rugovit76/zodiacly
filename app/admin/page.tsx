import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import Navbar from '@/components/Navbar'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  if (session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <AdminDashboard />
    </div>
  )
}
