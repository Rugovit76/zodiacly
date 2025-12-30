import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { generateDailyHoroscope, ZodiacSign } from '@/lib/openai/horoscopes'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sign = searchParams.get('sign') as ZodiacSign | null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (sign) {
      // Get horoscope for specific sign
      let horoscope = await prisma.horoscope.findFirst({
        where: {
          sign,
          type: 'DAILY',
          date: today
        }
      })

      // If doesn't exist, generate it
      if (!horoscope) {
        const content = await generateDailyHoroscope(sign)
        horoscope = await prisma.horoscope.create({
          data: {
            sign,
            type: 'DAILY',
            date: today,
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
      // Get all daily horoscopes
      const horoscopes = await prisma.horoscope.findMany({
        where: {
          type: 'DAILY',
          date: today
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
            const content = await generateDailyHoroscope(sign)
            return prisma.horoscope.create({
              data: {
                sign,
                type: 'DAILY',
                date: today,
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
    console.error('Error fetching daily horoscopes:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch daily horoscopes'
      },
      { status: 500 }
    )
  }
}
