import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/session'
import { createPortalSession } from '@/lib/stripe/checkout'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse } from '@/types'

export async function POST() {
  try {
    const session = await requireAuth()

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No billing account found' },
        { status: 400 }
      )
    }

    // Create billing portal session
    const portalUrl = await createPortalSession(user.stripeCustomerId)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { url: portalUrl },
    })
  } catch (error: any) {
    console.error('Portal error:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
