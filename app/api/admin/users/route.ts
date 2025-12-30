import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function GET() {
  try {
    await requireAdmin()

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        plan: true,
        role: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        createdAt: true,
        _count: {
          select: {
            natalCharts: true,
          },
        },
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { users },
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to get users' },
      { status: 500 }
    )
  }
}
