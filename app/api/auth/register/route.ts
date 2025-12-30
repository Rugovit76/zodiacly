import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { hashPassword } from '@/lib/auth/password'
import { createToken } from '@/lib/auth/jwt'
import { setSession } from '@/lib/auth/session'
import { ApiResponse } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'User already exists' },
        { status: 409 }
      )
    }

    // Create user
    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        role: 'USER',
        plan: 'FREE',
      },
    })

    // Create session
    const sessionUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
    }

    const token = await createToken(sessionUser)
    await setSession(token)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { user: sessionUser },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    )
  }
}
