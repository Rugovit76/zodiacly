import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const chart = await prisma.natalChart.findFirst({
      where: {
        id,
        userId: session.id,
      },
    })

    if (!chart) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Chart not found' },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { chart },
    })
  } catch (error: any) {
    console.error('Get chart error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to get chart' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params

    const chart = await prisma.natalChart.findFirst({
      where: {
        id,
        userId: session.id,
      },
    })

    if (!chart) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Chart not found' },
        { status: 404 }
      )
    }

    await prisma.natalChart.delete({
      where: { id },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'Chart deleted successfully' },
    })
  } catch (error: any) {
    console.error('Delete chart error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete chart' },
      { status: 500 }
    )
  }
}
