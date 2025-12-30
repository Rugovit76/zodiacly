'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Alert from '@/components/ui/Alert'

interface Stats {
  totalUsers: number
  freeUsers: number
  proUsers: number
  totalCharts: number
  totalAICalls: number
  mrr: string
}

interface User {
  id: string
  email: string
  plan: 'FREE' | 'PRO'
  role: 'USER' | 'ADMIN'
  subscriptionStatus?: string | null
  createdAt: Date
  _count?: {
    natalCharts: number
  }
}

interface UsageData {
  userId: string
  aiCallsThisMonth: number
  user: {
    email: string
    plan: 'FREE' | 'PRO'
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [topUsage, setTopUsage] = useState<UsageData[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'overview' | 'users'>('overview')

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/users'),
        ])

        const statsData = await statsRes.json()
        const usersData = await usersRes.json()

        if (statsData.success) {
          setStats(statsData.data.stats)
          setRecentUsers(statsData.data.recentUsers)
          setTopUsage(statsData.data.topUsage)
        }

        if (usersData.success) {
          setAllUsers(usersData.data.users)
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Platform statistics and user management</p>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setView('overview')}
          className={`px-6 py-2 rounded-lg transition-all ${
            view === 'overview'
              ? 'bg-cosmic-primary text-white'
              : 'bg-cosmic-surface text-gray-400 hover:text-white'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setView('users')}
          className={`px-6 py-2 rounded-lg transition-all ${
            view === 'users'
              ? 'bg-cosmic-primary text-white'
              : 'bg-cosmic-surface text-gray-400 hover:text-white'
          }`}
        >
          All Users
        </button>
      </div>

      {view === 'overview' ? (
        <>
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card glow>
                <span className="text-gray-400 text-sm">Total Users</span>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                <div className="mt-3 flex gap-4 text-sm">
                  <span className="text-gray-500">
                    FREE: <span className="text-white">{stats.freeUsers}</span>
                  </span>
                  <span className="text-cosmic-primary">
                    PRO: <span className="text-white font-bold">{stats.proUsers}</span>
                  </span>
                </div>
              </Card>

              <Card glow>
                <span className="text-gray-400 text-sm">Monthly Revenue (MRR)</span>
                <p className="text-3xl font-bold mt-2 text-green-400">€{stats.mrr}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Based on {stats.proUsers} PRO subscribers
                </p>
              </Card>

              <Card glow>
                <span className="text-gray-400 text-sm">Total Charts Created</span>
                <p className="text-3xl font-bold mt-2">{stats.totalCharts}</p>
              </Card>

              <Card>
                <span className="text-gray-400 text-sm">AI Calls This Month</span>
                <p className="text-3xl font-bold mt-2">{stats.totalAICalls}</p>
              </Card>

              <Card>
                <span className="text-gray-400 text-sm">Conversion Rate</span>
                <p className="text-3xl font-bold mt-2">
                  {stats.totalUsers > 0
                    ? ((stats.proUsers / stats.totalUsers) * 100).toFixed(1)
                    : 0}%
                </p>
              </Card>

              <Card>
                <span className="text-gray-400 text-sm">Avg Charts per User</span>
                <p className="text-3xl font-bold mt-2">
                  {stats.totalUsers > 0 ? (stats.totalCharts / stats.totalUsers).toFixed(1) : 0}
                </p>
              </Card>
            </div>
          )}

          {/* Recent Users */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Recent Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cosmic-primary/20 text-left">
                    <th className="pb-3 text-gray-400 font-medium">Email</th>
                    <th className="pb-3 text-gray-400 font-medium">Plan</th>
                    <th className="pb-3 text-gray-400 font-medium">Status</th>
                    <th className="pb-3 text-gray-400 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-cosmic-primary/10">
                      <td className="py-3">{user.email}</td>
                      <td className="py-3">
                        <Badge variant={user.plan === 'PRO' ? 'pro' : 'free'}>
                          {user.plan}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {user.subscriptionStatus ? (
                          <Badge
                            variant={
                              user.subscriptionStatus === 'ACTIVE' ? 'success' : 'warning'
                            }
                          >
                            {user.subscriptionStatus}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Top AI Usage */}
          <Card>
            <h2 className="text-2xl font-bold mb-6">Top AI Usage This Month</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cosmic-primary/20 text-left">
                    <th className="pb-3 text-gray-400 font-medium">User</th>
                    <th className="pb-3 text-gray-400 font-medium">Plan</th>
                    <th className="pb-3 text-gray-400 font-medium">AI Calls</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsage.map((usage, idx) => (
                    <tr key={idx} className="border-b border-cosmic-primary/10">
                      <td className="py-3">{usage.user.email}</td>
                      <td className="py-3">
                        <Badge variant={usage.user.plan === 'PRO' ? 'pro' : 'free'}>
                          {usage.user.plan}
                        </Badge>
                      </td>
                      <td className="py-3 font-bold">{usage.aiCallsThisMonth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : (
        /* All Users View */
        <Card>
          <h2 className="text-2xl font-bold mb-6">
            All Users ({allUsers.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cosmic-primary/20 text-left">
                  <th className="pb-3 text-gray-400 font-medium">Email</th>
                  <th className="pb-3 text-gray-400 font-medium">Role</th>
                  <th className="pb-3 text-gray-400 font-medium">Plan</th>
                  <th className="pb-3 text-gray-400 font-medium">Charts</th>
                  <th className="pb-3 text-gray-400 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user.id} className="border-b border-cosmic-primary/10">
                    <td className="py-3">{user.email}</td>
                    <td className="py-3">
                      <Badge variant={user.role === 'ADMIN' ? 'admin' : 'free'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant={user.plan === 'PRO' ? 'pro' : 'free'}>
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-400">
                      {user._count?.natalCharts || 0}
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
