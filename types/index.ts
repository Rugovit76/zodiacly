import { User, NatalChart, Usage, Plan, Role, SubscriptionStatus } from '@prisma/client'

// Re-export Prisma types
export type { User, NatalChart, Usage, Plan, Role, SubscriptionStatus }

// Session user type (without sensitive data)
export type SessionUser = {
  id: string
  email: string
  role: Role
  plan: Plan
  subscriptionStatus?: SubscriptionStatus | null
}

// Chart calculation types
export interface BirthData {
  date: Date
  time: string // HH:MM format
  latitude: number
  longitude: number
  timezone: string
  location: string
}

export interface PlanetPosition {
  name: string
  sign: string
  degree: number
  house: number
  retrograde: boolean
}

export interface House {
  number: number
  sign: string
  degree: number
}

export interface Aspect {
  planet1: string
  planet2: string
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile'
  orb: number
}

export interface ChartData {
  planets: PlanetPosition[]
  houses: House[]
  aspects: Aspect[]
  ascendant: {
    sign: string
    degree: number
  }
}

// AI Reading types
export interface AIReading {
  overview: string
  planetAnalysis: {
    planet: string
    interpretation: string
  }[]
  houseAnalysis: {
    house: number
    interpretation: string
  }[]
  aspectAnalysis: {
    aspect: string
    interpretation: string
  }[]
  ascendantAnalysis: string
  generatedAt: Date
}

// Usage tracking
export interface UsageInfo {
  aiCallsThisMonth: number
  limit: number
  canMakeCall: boolean
  resetsAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}
