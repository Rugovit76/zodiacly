import Stripe from 'stripe'
import { prisma } from '@/lib/db/prisma'
import { stripe } from './client'

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.userId
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  if (!userId) {
    throw new Error('No userId in session metadata')
  }

  // Update user to PRO plan
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: 'PRO',
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: 'ACTIVE',
    },
  })

  console.log(`User ${userId} upgraded to PRO`)
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const user = await prisma.user.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!user) {
    console.warn(`No user found for subscription ${subscription.id}`)
    return
  }

  const status = subscription.status

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: status.toUpperCase() as any,
      plan: status === 'active' ? 'PRO' : 'FREE',
    },
  })

  console.log(`Subscription ${subscription.id} updated to ${status}`)
}

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  const user = await prisma.user.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  })

  if (!user) {
    console.warn(`No user found for subscription ${subscription.id}`)
    return
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      plan: 'FREE',
      subscriptionStatus: 'CANCELED',
    },
  })

  console.log(`User ${user.id} downgraded to FREE`)
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
}
