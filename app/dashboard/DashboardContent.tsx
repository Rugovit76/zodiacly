'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Alert from '@/components/ui/Alert'
import ShareButton from '@/components/charts/ShareButton'
import { SessionUser, UsageInfo } from '@/types'

interface Chart {
  id: string
  birthDate: Date
  location: string
  createdAt: Date
  aiReading: any
  isPublic?: boolean
  publicId?: string
}

interface DashboardContentProps {
  user: SessionUser
  charts: Chart[]
  usageInfo: UsageInfo
}

export default function DashboardContent({ user, charts, usageInfo }: DashboardContentProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [savingPendingChart, setSavingPendingChart] = useState(false)

  const canCreateChart = user.plan === 'PRO' || charts.length === 0

  // Save pending chart from sessionStorage on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('saveChart') === 'true') {
      savePendingChart()
    }
  }, [])

  async function savePendingChart() {
    const pendingChartData = sessionStorage.getItem('pendingChart')
    if (!pendingChartData) return

    setSavingPendingChart(true)

    try {
      const { birthInfo } = JSON.parse(pendingChartData)

      const res = await fetch('/api/charts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: birthInfo.date,
          birthTime: birthInfo.time,
          latitude: birthInfo.latitude,
          longitude: birthInfo.longitude,
          timezone: birthInfo.timezone,
          location: birthInfo.location,
        }),
      })

      if (res.ok) {
        sessionStorage.removeItem('pendingChart')
        router.refresh()
        alert('🎉 Your chart has been saved!')
      }
    } catch (error) {
      console.error('Failed to save pending chart:', error)
    } finally {
      setSavingPendingChart(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this chart?')) return

    setDeletingId(id)

    try {
      const res = await fetch(`/api/charts/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      alert('Failed to delete chart')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleUpgrade(priceType: 'monthly' | 'yearly') {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceType }),
      })

      const data = await res.json()

      if (data.success && data.data.url) {
        window.location.href = data.data.url
      }
    } catch (error) {
      alert('Failed to create checkout session')
    }
  }

  async function handleManageBilling() {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await res.json()

      if (data.success && data.data.url) {
        window.location.href = data.data.url
      }
    } catch (error) {
      alert('Failed to open billing portal')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Saving indicator */}
      {savingPendingChart && (
        <Alert type="info" className="mb-6">
          💾 Saving your chart...
        </Alert>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {user.email}</p>
      </div>

      {/* Upgrade CTA for FREE users */}
      {user.plan === 'FREE' && (
        <Card className="mb-8 bg-gradient-to-r from-cosmic-primary/10 to-cosmic-secondary/10 border-cosmic-primary">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cosmic-primary to-cosmic-secondary bg-clip-text text-transparent">
                Unlock Your Full Cosmic Potential
              </h2>
              <p className="text-gray-300 mb-4">
                Upgrade to PRO for unlimited charts, full AI readings, and advanced features
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span> Unlimited Charts
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span> 100 AI Readings/mo
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span> Compatibility Analysis
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span> Daily Horoscopes
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-green-400">✓</span> Export & Save
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 min-w-[200px]">
              <Button onClick={() => handleUpgrade('yearly')} size="lg">
                €119/year
                <span className="text-xs opacity-80 ml-2">(save €24)</span>
              </Button>
              <Button onClick={() => handleUpgrade('monthly')} variant="outline" size="sm">
                €11.99/month
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Plan */}
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Current Plan</span>
            <Badge variant={user.plan === 'PRO' ? 'pro' : 'free'}>
              {user.plan}
            </Badge>
          </div>
          <p className="text-2xl font-bold">
            {user.plan === 'PRO' ? 'PRO' : 'Free'}
          </p>
          {user.plan === 'PRO' && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleManageBilling}
            >
              Manage Subscription
            </Button>
          )}
        </Card>

        {/* Charts */}
        <Card>
          <span className="text-gray-400 text-sm">Natal Charts</span>
          <p className="text-2xl font-bold mt-2">
            {charts.length} {user.plan === 'FREE' && '/ 1'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {user.plan === 'FREE' ? 'FREE plan limit' : 'Unlimited'}
          </p>
        </Card>

        {/* AI Usage */}
        <Card>
          <span className="text-gray-400 text-sm">AI Readings This Month</span>
          <p className="text-2xl font-bold mt-2">
            {usageInfo.aiCallsThisMonth} / {usageInfo.limit}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Resets {new Date(usageInfo.resetsAt).toLocaleDateString()}
          </p>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Natal Charts</h2>
          {canCreateChart ? (
            <Link href="/chart/create">
              <Button>+ Create Chart</Button>
            </Link>
          ) : (
            <div className="text-sm text-gray-400">
              Upgrade to PRO to create more charts
            </div>
          )}
        </div>

        {charts.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-xl font-bold mb-2">No charts yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first natal chart to unlock cosmic insights
            </p>
            {canCreateChart && (
              <Link href="/chart/create">
                <Button>Create Your First Chart</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charts.map((chart) => (
              <Card key={chart.id} hover>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{chart.location}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(chart.birthDate).toLocaleDateString()}
                    </p>
                  </div>
                  {chart.aiReading && (
                    <Badge variant="success">AI Reading</Badge>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  Created {new Date(chart.createdAt).toLocaleDateString()}
                </p>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Link href={`/chart/${chart.id}`} className="flex-1">
                      <Button variant="primary" size="sm" fullWidth>
                        View
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(chart.id)}
                      disabled={deletingId === chart.id}
                    >
                      Delete
                    </Button>
                  </div>

                  {/* Viral Share Button */}
                  <ShareButton
                    chartId={chart.id}
                    isPublic={chart.isPublic}
                    publicId={chart.publicId}
                  />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
