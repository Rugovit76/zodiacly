import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import Navbar from '@/components/Navbar'
import ChartCreateForm from './ChartCreateForm'

export default async function CreateChartPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <ChartCreateForm user={session} />
    </div>
  )
}
