import { prisma } from '@/lib/db/prisma'
import { Plan } from '@prisma/client'
import { UsageInfo } from '@/types'

const FREE_LIMIT = parseInt(process.env.FREE_PLAN_AI_CALLS_PER_MONTH || '1')
const PRO_LIMIT = parseInt(process.env.PRO_PLAN_AI_CALLS_PER_MONTH || '100')

export async function getUsageInfo(userId: string, plan: Plan): Promise<UsageInfo> {
  let usage = await prisma.usage.findUnique({
    where: { userId },
  })

  // Create usage record if it doesn't exist
  if (!usage) {
    usage = await prisma.usage.create({
      data: {
        userId,
        aiCallsThisMonth: 0,
        lastResetAt: new Date(),
      },
    })
  }

  // Reset monthly usage if needed
  const now = new Date()
  const lastReset = new Date(usage.lastResetAt)
  const shouldReset =
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()

  if (shouldReset) {
    usage = await prisma.usage.update({
      where: { userId },
      data: {
        aiCallsThisMonth: 0,
        lastResetAt: now,
      },
    })
  }

  const limit = plan === 'PRO' ? PRO_LIMIT : FREE_LIMIT
  const resetsAt = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  return {
    aiCallsThisMonth: usage.aiCallsThisMonth,
    limit,
    canMakeCall: usage.aiCallsThisMonth < limit,
    resetsAt,
  }
}

export async function incrementUsage(userId: string): Promise<void> {
  await prisma.usage.update({
    where: { userId },
    data: {
      aiCallsThisMonth: {
        increment: 1,
      },
    },
  })
}

export async function canMakeAICall(userId: string, plan: Plan): Promise<boolean> {
  const usageInfo = await getUsageInfo(userId, plan)
  return usageInfo.canMakeCall
}
