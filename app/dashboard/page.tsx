import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { getUsageInfo } from '@/lib/usage/tracker'
import Navbar from '@/components/Navbar'
import DashboardContent from './DashboardContent'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch user's charts
  const chartsData = await prisma.natalChart.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      birthDate: true,
      location: true,
      createdAt: true,
      aiReading: true,
      isPublic: true,
      publicId: true,
    },
  })

  // Map null to undefined for TypeScript compatibility
  const charts = chartsData.map(chart => ({
    ...chart,
    publicId: chart.publicId ?? undefined,
  }))

  // Get usage info
  const usageInfo = await getUsageInfo(session.id, session.plan)

  return (
    <div className="min-h-screen">
      <Navbar user={session} />
      <DashboardContent
        user={session}
        charts={charts}
        usageInfo={usageInfo}
      />
    </div>
  )
}
