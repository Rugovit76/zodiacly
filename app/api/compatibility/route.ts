import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { calculateCompatibility } from '@/lib/astrology/compatibility'

// POST /api/compatibility - Calculate compatibility between two charts
export async function POST(request: Request) {
  try {
    const { chart1Id, chart2Id } = await request.json()

    if (!chart1Id || !chart2Id) {
      return NextResponse.json(
        { success: false, error: 'Both chart IDs are required' },
        { status: 400 }
      )
    }

    // Fetch both charts
    const [chart1, chart2] = await Promise.all([
      prisma.natalChart.findUnique({ where: { id: chart1Id } }),
      prisma.natalChart.findUnique({ where: { id: chart2Id } })
    ])

    if (!chart1 || !chart2) {
      return NextResponse.json(
        { success: false, error: 'One or both charts not found' },
        { status: 404 }
      )
    }

    // Calculate compatibility
    const compatibility = calculateCompatibility(
      chart1.chartData as any,
      chart2.chartData as any
    )

    return NextResponse.json({
      success: true,
      data: {
        compatibility,
        chart1: {
          id: chart1.id,
          location: chart1.location,
          birthDate: chart1.birthDate
        },
        chart2: {
          id: chart2.id,
          location: chart2.location,
          birthDate: chart2.birthDate
        }
      }
    })
  } catch (error) {
    console.error('Failed to calculate compatibility:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate compatibility' },
      { status: 500 }
    )
  }
}
