import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { generateWeeklyHoroscope, ZodiacSign } from '@/lib/openai/horoscopes'

export const dynamic = 'force-dynamic'

function getStartOfWeek(): Date {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Monday as start
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sign = searchParams.get('sign') as ZodiacSign | null

    const weekStart = getStartOfWeek()

    if (sign) {
      // Get horoscope for specific sign
      let horoscope = await prisma.horoscope.findFirst({
        where: {
          sign,
          type: 'WEEKLY',
          date: weekStart
        }
      })

      // If doesn't exist, generate it
      if (!horoscope) {
        const content = await generateWeeklyHoroscope(sign)
        horoscope = await prisma.horoscope.create({
          data: {
            sign,
            type: 'WEEKLY',
            date: weekStart,
            content: content as any
          }
        })
      }

      return NextResponse.json({
        success: true,
        horoscope: {
          sign: horoscope.sign,
          content: horoscope.content,
          date: horoscope.date
        }
      })
    } else {
      // Get all weekly horoscopes
      const horoscopes = await prisma.horoscope.findMany({
        where: {
          type: 'WEEKLY',
          date: weekStart
        },
        orderBy: {
          sign: 'asc'
        }
      })

      // If we don't have all 12, generate missing ones
      const allSigns: ZodiacSign[] = [
        'ARIES', 'TAURUS', 'GEMINI', 'CANCER',
        'LEO', 'VIRGO', 'LIBRA', 'SCORPIO',
        'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES'
      ]

      const existingSigns = new Set(horoscopes.map(h => h.sign))
      const missingSigns = allSigns.filter(s => !existingSigns.has(s))

      if (missingSigns.length > 0) {
        const newHoroscopes = await Promise.all(
          missingSigns.map(async (sign) => {
            const content = await generateWeeklyHoroscope(sign)
            return prisma.horoscope.create({
              data: {
                sign,
                type: 'WEEKLY',
                date: weekStart,
                content: content as any
              }
            })
          })
        )

        horoscopes.push(...newHoroscopes)
      }

      return NextResponse.json({
        success: true,
        horoscopes: horoscopes.map(h => ({
          sign: h.sign,
          content: h.content,
          date: h.date
        }))
      })
    }
  } catch (error) {
    console.error('Error fetching weekly horoscopes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch weekly horoscopes'
      },
      { status: 500 }
    )
  }
}
