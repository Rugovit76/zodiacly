import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { nanoid } from 'nanoid'

// POST /api/charts/[id]/share - Make chart public/private
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { isPublic } = await request.json()
    const chartId = params.id

    // Verify chart ownership
    const chart = await prisma.natalChart.findUnique({
      where: { id: chartId }
    })

    if (!chart) {
      return NextResponse.json(
        { success: false, error: 'Chart not found' },
        { status: 404 }
      )
    }

    if (chart.userId !== session.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized to modify this chart' },
        { status: 403 }
      )
    }

    // Generate publicId if making public and doesn't have one
    let publicId = chart.publicId
    if (isPublic && !publicId) {
      publicId = nanoid(10) // Generate short unique ID
    }

    // Update chart visibility
    const updatedChart = await prisma.natalChart.update({
      where: { id: chartId },
      data: {
        isPublic,
        publicId: isPublic ? publicId : chart.publicId, // Keep publicId even if making private
        shareCount: isPublic ? { increment: 1 } : chart.shareCount
      }
    })

    const shareUrl = isPublic
      ? `${process.env.NEXT_PUBLIC_APP_URL}/public/${publicId}`
      : null

    return NextResponse.json({
      success: true,
      data: {
        isPublic: updatedChart.isPublic,
        publicId: updatedChart.publicId,
        shareUrl
      }
    })
  } catch (error) {
    console.error('Failed to update chart sharing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update sharing settings' },
      { status: 500 }
    )
  }
}
