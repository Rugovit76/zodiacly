import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function GET() {
  try {
    const session = await requireAuth()

    const charts = await prisma.natalChart.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        birthDate: true,
        location: true,
        createdAt: true,
        aiReading: true, // Include to show which have interpretations
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { charts },
    })
  } catch (error: any) {
    console.error('List charts error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to list charts' },
      { status: 500 }
    )
  }
}
