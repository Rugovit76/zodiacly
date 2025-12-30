import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function GET() {
  try {
    await requireAdmin()

    // Get statistics
    const [totalUsers, freeUsers, proUsers, totalCharts, totalUsage] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { plan: 'FREE' } }),
      prisma.user.count({ where: { plan: 'PRO' } }),
      prisma.natalChart.count(),
      prisma.usage.aggregate({
        _sum: {
          aiCallsThisMonth: true,
        },
      }),
    ])

    // Calculate MRR (Monthly Recurring Revenue)
    // Assuming €6.99/month for monthly subs and €69/year = €5.75/month for yearly
    const monthlySubRevenue = proUsers * 6.99 // Simplified - in production, track actual subscription types
    const mrr = monthlySubRevenue

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        plan: true,
        role: true,
        createdAt: true,
        subscriptionStatus: true,
      },
    })

    // Get usage by user
    const topUsage = await prisma.usage.findMany({
      take: 10,
      orderBy: { aiCallsThisMonth: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            plan: true,
          },
        },
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        stats: {
          totalUsers,
          freeUsers,
          proUsers,
          totalCharts,
          totalAICalls: totalUsage._sum.aiCallsThisMonth || 0,
          mrr: mrr.toFixed(2),
        },
        recentUsers,
        topUsage,
      },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to get stats' },
      { status: 500 }
    )
  }
}
