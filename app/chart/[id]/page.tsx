import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import Navbar from '@/components/Navbar'
import ChartView from './ChartView'

export default async function ChartPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  const { id } = await params

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch chart
  const chart = await prisma.natalChart.findFirst({
    where: {
      id,
      userId: session.id,
    },
  })

  if (!chart) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <ChartView chart={chart} user={session} />
    </div>
  )
}
