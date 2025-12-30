import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import {
  generateAllDailyHoroscopes,
  generateAllWeeklyHoroscopes,
  ZodiacSign
} from '@/lib/openai/horoscopes'

export const dynamic = 'force-dynamic'

// This endpoint can be called by:
// 1. Vercel Cron Jobs (if deployed on Vercel)
// 2. External cron services (cron-job.org, etc.)
// 3. Manually for testing

// For security, check for CRON_SECRET in headers
// Set CRON_SECRET in your .env file

export async function POST(request: NextRequest) {
  try {
    // Security: Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'both' // 'daily', 'weekly', or 'both'

    const results = {
      daily: null as any,
      weekly: null as any
    }

    // Generate daily horoscopes
    if (type === 'daily' || type === 'both') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      console.log('Generating daily horoscopes for', today.toDateString())

      const dailyHoroscopes = await generateAllDailyHoroscopes()

      const allSigns: ZodiacSign[] = [
        'ARIES', 'TAURUS', 'GEMINI', 'CANCER',
        'LEO', 'VIRGO', 'LIBRA', 'SCORPIO',
        'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'
      ]

      // Save to database (upsert to avoid duplicates)
      const savedDaily = await Promise.all(
        allSigns.map(sign =>
          prisma.horoscope.upsert({
            where: {
              sign_type_date: {
                sign,
                type: 'DAILY',
                date: today
              }
            },
            update: {
              content: dailyHoroscopes[sign] as any
            },
            create: {
              sign,
              type: 'DAILY',
              date: today,
              content: dailyHoroscopes[sign] as any
            }
          })
        )
      )

      results.daily = {
        count: savedDaily.length,
        date: today.toISOString()
      }
    }

    // Generate weekly horoscopes (only on Mondays or if forced)
    if (type === 'weekly' || type === 'both') {
      const now = new Date()
      const isMonday = now.getDay() === 1
      const force = searchParams.get('force') === 'true'

      if (isMonday || force || type === 'weekly') {
        const weekStart = getStartOfWeek()

        console.log('Generating weekly horoscopes for week of', weekStart.toDateString())

        const weeklyHoroscopes = await generateAllWeeklyHoroscopes()

        const allSigns: ZodiacSign[] = [
          'ARIES', 'TAURUS', 'GEMINI', 'CANCER',
          'LEO', 'VIRGO', 'LIBRA', 'SCORPIO',
          'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'
        ]

        // Save to database
        const savedWeekly = await Promise.all(
          allSigns.map(sign =>
            prisma.horoscope.upsert({
              where: {
                sign_type_date: {
                  sign,
                  type: 'WEEKLY',
                  date: weekStart
                }
              },
              update: {
                content: weeklyHoroscopes[sign] as any
              },
              create: {
                sign,
                type: 'WEEKLY',
                date: weekStart,
                content: weeklyHoroscopes[sign] as any
              }
            })
          )
        )

        results.weekly = {
          count: savedWeekly.length,
          weekStart: weekStart.toISOString()
        }
      } else {
        results.weekly = {
          skipped: true,
          reason: 'Not Monday (use ?force=true to generate anyway)'
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Horoscopes generated successfully',
      results
    })
  } catch (error) {
    console.error('Error generating horoscopes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate horoscopes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also allow GET for easier manual testing (but require auth)
export async function GET(request: NextRequest) {
  return POST(request)
}

function getStartOfWeek(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Monday
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}
