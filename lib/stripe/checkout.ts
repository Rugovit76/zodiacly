import { stripe, PRICE_IDS } from './client'
import { prisma } from '@/lib/db/prisma'

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceType: 'monthly' | 'yearly'
): Promise<string> {
  const priceId = priceType === 'monthly' ? PRICE_IDS.PRO_MONTHLY : PRICE_IDS.PRO_YEARLY

  console.log('[Checkout] Starting checkout session creation', { userId, email, priceType, priceId })

  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  let customerId = user?.stripeCustomerId

  console.log('[Checkout] Existing customer ID from DB:', customerId)

  // Create a new customer if one doesn't exist OR if the existing customer is invalid
  // (e.g., test mode customer when using live keys)
  if (customerId) {
    try {
      console.log('[Checkout] Verifying customer exists in Stripe...')
      // Verify the customer exists in current Stripe environment
      await stripe.customers.retrieve(customerId)
      console.log('[Checkout] Customer verified successfully')
    } catch (error: any) {
      // Customer doesn't exist (likely test mode customer with live keys)
      // Reset customer ID to create a new one
      console.error('[Checkout] Customer verification failed:', {
        customerId,
        error: error.message,
        type: error.type,
        code: error.code
      })
      customerId = null
      
      // Clear the invalid customer ID from database
      console.log('[Checkout] Clearing invalid customer data from DB...')
      await prisma.user.update({
        where: { id: userId },
        data: { 
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          subscriptionStatus: null
        },
      })
      console.log('[Checkout] Invalid customer data cleared')
    }
  }

  if (!customerId) {
    try {
      console.log('[Checkout] Creating new Stripe customer...')
      const customer = await stripe.customers.create({
        email,
        metadata: {
          userId,
        },
      })
      customerId = customer.id
      console.log('[Checkout] New customer created:', customerId)

      console.log('[Checkout] Saving customer ID to DB...')
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      })
      console.log('[Checkout] Customer ID saved to DB')
    } catch (error: any) {
      console.error('[Checkout] Failed to create customer:', {
        error: error.message,
        type: error.type,
        code: error.code,
        rawError: error
      })
      throw error
    }
  }

  // Create checkout session
  try {
    console.log('[Checkout] Creating checkout session...', {
      customerId,
      priceId,
      mode: 'subscription'
    })

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        userId,
      },
    })

    console.log('[Checkout] Checkout session created successfully:', session.id)
    return session.url!
  } catch (error: any) {
    console.error('[Checkout] Failed to create checkout session:', {
      error: error.message,
      type: error.type,
      code: error.code,
      customerId,
      priceId,
      rawError: error
    })
    throw error
  }
}

export async function createPortalSession(customerId: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return session.url
}
