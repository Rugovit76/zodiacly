import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getSession } from '@/lib/auth/session'

interface PublicChartPageProps {
  params: { publicId: string }
}

async function getPublicChart(publicId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/charts/public/${publicId}`,
    { cache: 'no-store' }
  )

  if (!res.ok) return null

  const data = await res.json()
  return data.success ? data.data : null
}

export async function generateMetadata({
  params
}: PublicChartPageProps): Promise<Metadata> {
  const chart = await getPublicChart(params.publicId)

  if (!chart) {
    return {
      title: 'Chart Not Found - Zodiacly'
    }
  }

  const title = `${chart.location} Natal Chart - Zodiacly`
  const description = `Explore this cosmic blueprint from ${chart.location}. Create your own free natal chart with AI-powered insights!`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/public/${params.publicId}`,
      type: 'website',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/api/og?publicId=${params.publicId}`,
          width: 1200,
          height: 630,
          alt: `${chart.location} Natal Chart`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${process.env.NEXT_PUBLIC_APP_URL}/api/og?publicId=${params.publicId}`]
    }
  }
}

export default async function PublicChartPage({ params }: PublicChartPageProps) {
  const chart = await getPublicChart(params.publicId)
  const session = await getSession()

  if (!chart) {
    notFound()
  }

  const chartData = chart.chartData as any
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/public/${params.publicId}`

  // Social share functions (client-side via onClick)
  const socialShares = {
    whatsapp: `https://wa.me/?text=Check out my natal chart! ${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=Check out this cosmic blueprint!&url=${shareUrl}`,
    telegram: `https://t.me/share/url?url=${shareUrl}&text=Check out this natal chart!`
  }

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      {/* Starfield background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Viral CTA Banner */}
        <Card className="mb-8 bg-gradient-to-r from-cosmic-primary/10 to-cosmic-secondary/10 border-cosmic-primary">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">
              Want Your Own Cosmic Blueprint? ✨
            </h2>
            <p className="text-gray-400 mb-4">
              Create your free natal chart in 30 seconds - no registration required!
            </p>
            <Link href="/create-chart">
              <Button size="lg">Create My Free Chart</Button>
            </Link>
          </div>
        </Card>

        {/* Chart Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{chart.location} Natal Chart</h1>
          <p className="text-gray-400">
            Shared by {chart.ownerEmail} • {chart.viewCount} views • {chart.shareCount} shares
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Display */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Chart Visualization</h2>

              {/* Chart Wheel Placeholder */}
              <div className="aspect-square bg-cosmic-surface rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌟</div>
                  <p className="text-gray-400">
                    Chart visualization coming soon
                  </p>
                </div>
              </div>

              {/* Planet Positions */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Planetary Positions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {chartData.planets?.map((planet: any) => (
                    <div
                      key={planet.name}
                      className="p-3 rounded-lg bg-cosmic-surface border border-cosmic-primary/20"
                    >
                      <div className="font-semibold text-cosmic-primary">
                        {planet.name}
                      </div>
                      <div className="text-sm text-gray-400">
                        {planet.sign} {planet.degree.toFixed(1)}°
                      </div>
                      <div className="text-xs text-gray-500">
                        House {planet.house}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Houses */}
              <div>
                <h3 className="text-xl font-semibold mb-4">House Cusps</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {chartData.houses?.map((house: any) => (
                    <div
                      key={house.number}
                      className="p-2 rounded bg-cosmic-surface/50 text-sm"
                    >
                      <span className="font-semibold text-cosmic-secondary">
                        House {house.number}:
                      </span>{' '}
                      {house.sign} {house.degree.toFixed(1)}°
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Sharing */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Share This Chart</h3>

              <div className="space-y-3">
                <a
                  href={socialShares.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" fullWidth>
                    📱 Share on WhatsApp
                  </Button>
                </a>

                <a
                  href={socialShares.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" fullWidth>
                    📘 Share on Facebook
                  </Button>
                </a>

                <a
                  href={socialShares.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" fullWidth>
                    🐦 Share on Twitter
                  </Button>
                </a>

                <a
                  href={socialShares.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" fullWidth>
                    ✈️ Share on Telegram
                  </Button>
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                    alert('Link copied to clipboard!')
                  }}
                  className="w-full"
                >
                  <Button variant="outline" fullWidth>
                    🔗 Copy Link
                  </Button>
                </button>
              </div>
            </Card>

            {/* Chart Info */}
            <Card>
              <h3 className="text-xl font-semibold mb-4">Chart Details</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Location:</span>
                  <div className="font-semibold">{chart.location}</div>
                </div>

                <div>
                  <span className="text-gray-400">Birth Date:</span>
                  <div className="font-semibold">
                    {new Date(chart.birthDate).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400">Ascendant:</span>
                  <div className="font-semibold text-cosmic-primary">
                    {chartData.ascendant?.sign} {chartData.ascendant?.degree.toFixed(1)}°
                  </div>
                </div>
              </div>
            </Card>

            {/* Viral CTA */}
            <Card className="bg-gradient-to-br from-cosmic-primary/20 to-cosmic-secondary/20 border-cosmic-primary">
              <h3 className="text-xl font-semibold mb-3">
                Want Your Own Analysis?
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Get AI-powered personalized interpretations of your planets, houses, and aspects!
              </p>
              <Link href="/create-chart">
                <Button fullWidth size="lg">
                  Create Free Chart
                </Button>
              </Link>
            </Card>

            {/* Compare with Friend (VIRAL) */}
            <Card className="bg-gradient-to-br from-cosmic-accent/20 to-cosmic-gold/20 border-cosmic-gold">
              <h3 className="text-xl font-semibold mb-3">
                💑 Compatibility Check
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Create your chart and compare with this one to see your cosmic compatibility!
              </p>
              <Link href={`/create-chart?compare=${params.publicId}`}>
                <Button variant="outline" fullWidth>
                  Check Compatibility
                </Button>
              </Link>
            </Card>
          </div>
        </div>

        {/* AI Reading (if available) */}
        {chart.aiReading && (
          <Card className="mt-8">
            <h2 className="text-2xl font-bold mb-6">AI-Powered Interpretation</h2>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">
                {typeof chart.aiReading === 'string'
                  ? chart.aiReading
                  : JSON.stringify(chart.aiReading, null, 2)}
              </p>
            </div>

            <div className="mt-6 p-4 bg-cosmic-surface rounded-lg border border-cosmic-primary/30">
              <p className="text-sm text-gray-400 text-center">
                Want personalized AI insights for your own chart?{' '}
                <Link href="/auth/register" className="text-cosmic-primary hover:underline">
                  Sign up free
                </Link>{' '}
                to unlock 1 monthly AI reading!
              </p>
            </div>
          </Card>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-cosmic-primary/10 to-cosmic-secondary/10">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Discover Your Cosmic Blueprint?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands exploring their astrological identity with AI-powered insights.
              Create your chart in 30 seconds - completely free, no email required!
            </p>
            <Link href="/create-chart">
              <Button size="lg">
                Create My Free Chart Now ✨
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
