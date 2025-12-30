import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { ApiResponse } from '@/types'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { user: session },
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to get session' },
      { status: 500 }
    )
  }
}
