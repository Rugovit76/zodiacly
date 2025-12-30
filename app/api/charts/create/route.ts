import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { prisma } from '@/lib/db/prisma'
import { calculateNatalChart } from '@/lib/astrology/calculator'
import { BirthData, ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()

    const body = await request.json()
    const { birthDate, birthTime, latitude, longitude, timezone, location } = body

    // Validation
    if (!birthDate || !birthTime || !latitude || !longitude || !timezone || !location) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check FREE plan limit (only 1 chart allowed)
    if (session.plan === 'FREE') {
      const existingCharts = await prisma.natalChart.count({
        where: { userId: session.id },
      })

      if (existingCharts >= 1) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: 'FREE plan allows only 1 natal chart. Upgrade to PRO for unlimited charts.',
          },
          { status: 403 }
        )
      }
    }

    // Calculate natal chart
    const birthData: BirthData = {
      date: new Date(birthDate),
      time: birthTime,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timezone,
      location,
    }

    const chartData = await calculateNatalChart(birthData)

    // Save to database
    const chart = await prisma.natalChart.create({
      data: {
        userId: session.id,
        birthDate: birthData.date,
        birthTime: birthData.time,
        latitude: birthData.latitude,
        longitude: birthData.longitude,
        timezone: birthData.timezone,
        location: birthData.location,
        chartData: chartData as any,
      },
    })

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { chart },
    })
  } catch (error: any) {
    console.error('Chart creation error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create chart' },
      { status: 500 }
    )
  }
}
