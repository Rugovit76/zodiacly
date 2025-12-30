import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { createCheckoutSession } from '@/lib/stripe/checkout'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth()

    // Check if already PRO
    if (session.plan === 'PRO') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Already subscribed to PRO plan' },
        { status: 400 }
      )
    }

    const { priceType } = await request.json()

    if (!priceType || !['monthly', 'yearly'].includes(priceType)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid price type. Must be "monthly" or "yearly"' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const checkoutUrl = await createCheckoutSession(
      session.id,
      session.email,
      priceType
    )

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { url: checkoutUrl },
    })
  } catch (error: any) {
    console.error('Checkout error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
