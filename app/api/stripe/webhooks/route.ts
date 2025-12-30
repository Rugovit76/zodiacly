import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import {
  verifyWebhookSignature,
  handleCheckoutSessionCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from '@/lib/stripe/webhooks'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const event = await verifyWebhookSignature(body, signature)

    // Log webhook event
    await prisma.webhookEvent.create({
      data: {
        type: event.type,
        payload: event as any,
        processed: false,
      },
    })

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as any)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as any)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as any)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark as processed
    await prisma.webhookEvent.updateMany({
      where: {
        type: event.type,
        processed: false,
      },
      data: {
        processed: true,
      },
    })

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
