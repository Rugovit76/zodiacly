import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import Navbar from '@/components/Navbar'
import CompatibilityCalculator from './CompatibilityCalculator'

export default async function CompatibilityPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/login')
  }

  // Fetch user's charts for selection
  const charts = await prisma.natalChart.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      birthDate: true,
      location: true,
      chartData: true,
    },
  })

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cosmic-primary to-cosmic-secondary bg-clip-text text-transparent">
            💑 Cosmic Compatibility
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the cosmic chemistry between two charts through synastry analysis.
            Compare planetary aspects, element balance, and sign compatibility.
          </p>
        </div>

        {/* Main Content */}
        {charts.length < 2 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold mb-2">Need More Charts</h2>
            <p className="text-gray-400 mb-6">
              You need at least 2 natal charts to calculate compatibility.
            </p>
            <a
              href="/chart/create"
              className="inline-block px-6 py-3 bg-cosmic-primary hover:bg-cosmic-primary/80 rounded-lg font-semibold transition"
            >
              Create Another Chart
            </a>
          </div>
        ) : (
          <CompatibilityCalculator charts={charts} />
        )}
      </div>
    </div>
  )
}
