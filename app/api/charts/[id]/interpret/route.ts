import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { generateChartInterpretation } from '@/lib/openai/interpretations'
import { canMakeAICall, incrementUsage, getUsageInfo } from '@/lib/usage/tracker'
import { ChartData, ApiResponse } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth()
    const { id } = await params

    // Get chart
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

    // Check if already has interpretation
    if (chart.aiReading) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          reading: chart.aiReading,
          message: 'Using existing interpretation',
        },
      })
    }

    // Check AI usage limits
    const canUse = await canMakeAICall(session.id, session.plan)

    if (!canUse) {
      const usageInfo = await getUsageInfo(session.id, session.plan)

      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `AI usage limit reached (${usageInfo.aiCallsThisMonth}/${usageInfo.limit} this month). ${
            session.plan === 'FREE'
              ? 'Upgrade to PRO for more AI readings.'
              : `Resets on ${usageInfo.resetsAt.toLocaleDateString()}.`
          }`,
        },
        { status: 429 }
      )
    }

    // Generate AI interpretation
    const chartData = chart.chartData as unknown as ChartData
    const reading = await generateChartInterpretation(chartData, session.plan === 'PRO')

    // Increment usage
    await incrementUsage(session.id)

    // Save interpretation
    const updatedChart = await prisma.natalChart.update({
      where: { id },
      data: {
        aiReading: reading as any,
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { reading: updatedChart.aiReading },
    })
  } catch (error: any) {
    console.error('Interpretation error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to generate interpretation' },
      { status: 500 }
    )
  }
}
