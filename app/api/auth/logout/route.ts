import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth/session'
import { ApiResponse } from '@/types'

export async function POST() {
  try {
    await clearSession()

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: 'Logged out successfully' },
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}
