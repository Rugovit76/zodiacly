import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return new Response('Missing publicId', { status: 400 })
    }

    // Fetch the chart
    const chart = await prisma.natalChart.findUnique({
      where: { publicId }
    })

    if (!chart || !chart.isPublic) {
      return new Response('Chart not found', { status: 404 })
    }

    const chartData = chart.chartData as any
    const sunSign = chartData.planets?.find((p: any) => p.name === 'Sun')?.sign || 'Unknown'
    const moonSign = chartData.planets?.find((p: any) => p.name === 'Moon')?.sign || 'Unknown'
    const risingSign = chartData.ascendant?.sign || 'Unknown'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b4e 100%)',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Background stars */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              opacity: 0.1,
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '60px',
              position: 'relative',
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                }}
              >
                ✨
              </div>
              <div
                style={{
                  fontSize: '40px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(90deg, #9b87f5 0%, #7e69ab 50%, #d4b4fe 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Zodiacly
              </div>
            </div>

            {/* Chart Title */}
            <div
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              {chart.location}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '28px',
                color: '#9b87f5',
                marginBottom: '50px',
                textAlign: 'center',
              }}
            >
              Natal Chart • {new Date(chart.birthDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>

            {/* Big Three */}
            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '40px',
              }}
            >
              {/* Sun */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '30px 40px',
                  background: 'rgba(155, 135, 245, 0.1)',
                  border: '2px solid rgba(155, 135, 245, 0.3)',
                  borderRadius: '16px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>☀️</div>
                <div style={{ fontSize: '20px', color: '#9b87f5', marginBottom: '5px' }}>Sun</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{sunSign}</div>
              </div>

              {/* Moon */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '30px 40px',
                  background: 'rgba(126, 105, 171, 0.1)',
                  border: '2px solid rgba(126, 105, 171, 0.3)',
                  borderRadius: '16px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌙</div>
                <div style={{ fontSize: '20px', color: '#7e69ab', marginBottom: '5px' }}>Moon</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{moonSign}</div>
              </div>

              {/* Rising */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '30px 40px',
                  background: 'rgba(212, 180, 254, 0.1)',
                  border: '2px solid rgba(212, 180, 254, 0.3)',
                  borderRadius: '16px',
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⬆️</div>
                <div style={{ fontSize: '20px', color: '#d4b4fe', marginBottom: '5px' }}>Rising</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>{risingSign}</div>
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '20px 40px',
                background: 'rgba(155, 135, 245, 0.2)',
                border: '2px solid rgba(155, 135, 245, 0.4)',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '24px', color: '#d4b4fe' }}>
                🔮 Create your free natal chart
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Failed to generate OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
