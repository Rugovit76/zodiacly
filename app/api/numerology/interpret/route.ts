import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { generateNumerologyInterpretation } from '@/lib/openai/numerology'
import type { NumerologyProfile } from '@/lib/numerology/calculations'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { profile, fullName } = await request.json()

    if (!profile || !fullName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const isPro = session.plan === 'PRO'

    // Generate AI interpretation
    const interpretation = await generateNumerologyInterpretation(
      profile as NumerologyProfile,
      fullName,
      isPro
    )

    return NextResponse.json({
      success: true,
      interpretation
    })
  } catch (error) {
    console.error('Error generating numerology interpretation:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate interpretation'
      },
      { status: 500 }
    )
  }
}
