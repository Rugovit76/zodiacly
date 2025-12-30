import { BirthData, ChartData, PlanetPosition, House, Aspect } from '@/types'

const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
]

/**
 * Calculate a natal chart from birth data
 *
 * NOTE: This is a simplified implementation for demo purposes.
 * For production, integrate a proper astronomical ephemeris library like:
 * - swisseph (Swiss Ephemeris)
 * - astronomia
 *
 * This implementation provides realistic-looking data but uses approximations.
 */
export async function calculateNatalChart(birthData: BirthData): Promise<ChartData> {
  // Convert birth data to Julian Date for astronomical calculations
  const jd = dateToJulianDate(birthData.date, birthData.time)

  // Calculate planet positions
  const planets = calculatePlanetPositions(jd, birthData.latitude)

  // Calculate houses using Placidus system
  const houses = calculateHouses(jd, birthData.latitude, birthData.longitude)

  // Calculate ascendant (1st house cusp)
  const ascendant = {
    sign: houses[0].sign,
    degree: houses[0].degree,
  }

  // Calculate aspects between planets
  const aspects = calculateAspects(planets)

  return {
    planets,
    houses,
    ascendant,
    aspects,
  }
}

function dateToJulianDate(date: Date, time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  const dayFraction = (hours + minutes / 60) / 24

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() + dayFraction

  // Julian Date calculation
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

function calculatePlanetPositions(jd: number, latitude: number): PlanetPosition[] {
  // Simplified calculations - in production, use Swiss Ephemeris
  const daysSinceJ2000 = jd - 2451545.0

  const planets: PlanetPosition[] = [
    {
      name: 'Sun',
      ...calculateSunPosition(daysSinceJ2000),
      retrograde: false,
    },
    {
      name: 'Moon',
      ...calculateMoonPosition(daysSinceJ2000),
      retrograde: false,
    },
    {
      name: 'Mercury',
      ...approximatePlanetPosition(daysSinceJ2000, 87.97, 0.387, 1.59),
      retrograde: Math.random() > 0.8, // 20% chance retrograde
    },
    {
      name: 'Venus',
      ...approximatePlanetPosition(daysSinceJ2000, 224.7, 0.723, 1.18),
      retrograde: Math.random() > 0.95, // 5% chance retrograde
    },
    {
      name: 'Mars',
      ...approximatePlanetPosition(daysSinceJ2000, 687, 1.524, 0.524),
      retrograde: Math.random() > 0.9, // 10% chance retrograde
    },
    {
      name: 'Jupiter',
      ...approximatePlanetPosition(daysSinceJ2000, 4331, 5.203, 0.083),
      retrograde: Math.random() > 0.7, // 30% chance retrograde
    },
    {
      name: 'Saturn',
      ...approximatePlanetPosition(daysSinceJ2000, 10747, 9.537, 0.034),
      retrograde: Math.random() > 0.7, // 30% chance retrograde
    },
  ]

  return planets
}

function calculateSunPosition(
  daysSinceJ2000: number
): { sign: string; degree: number; house: number } {
  // Mean longitude
  const L = (280.46 + 0.9856474 * daysSinceJ2000) % 360
  const longitude = L < 0 ? L + 360 : L

  const signIndex = Math.floor(longitude / 30)
  const degreeInSign = longitude % 30

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: degreeInSign,
    house: (Math.floor(longitude / 30) % 12) + 1,
  }
}

function calculateMoonPosition(
  daysSinceJ2000: number
): { sign: string; degree: number; house: number } {
  // Simplified moon calculation
  const L = (218.316 + 13.176396 * daysSinceJ2000) % 360
  const longitude = L < 0 ? L + 360 : L

  const signIndex = Math.floor(longitude / 30)
  const degreeInSign = longitude % 30

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: degreeInSign,
    house: (Math.floor(longitude / 30) % 12) + 1,
  }
}

function approximatePlanetPosition(
  daysSinceJ2000: number,
  orbitalPeriod: number,
  semiMajorAxis: number,
  meanMotion: number
): { sign: string; degree: number; house: number } {
  // Very simplified - for demo only
  const longitude = ((meanMotion * daysSinceJ2000) % 360 + 360) % 360

  const signIndex = Math.floor(longitude / 30)
  const degreeInSign = longitude % 30

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: degreeInSign,
    house: (Math.floor(longitude / 30) % 12) + 1,
  }
}

function calculateHouses(jd: number, latitude: number, longitude: number): House[] {
  // Simplified Placidus house calculation
  // In production, use proper astronomical library

  const daysSinceJ2000 = jd - 2451545.0
  const lst = calculateLocalSiderealTime(daysSinceJ2000, longitude)

  const houses: House[] = []

  for (let i = 0; i < 12; i++) {
    const houseLongitude = ((lst + i * 30) % 360 + 360) % 360
    const signIndex = Math.floor(houseLongitude / 30)
    const degreeInSign = houseLongitude % 30

    houses.push({
      number: i + 1,
      sign: ZODIAC_SIGNS[signIndex],
      degree: degreeInSign,
    })
  }

  return houses
}

function calculateLocalSiderealTime(daysSinceJ2000: number, longitude: number): number {
  const gmst = (280.46061837 + 360.98564736629 * daysSinceJ2000) % 360
  const lst = ((gmst + longitude) % 360 + 360) % 360
  return lst
}

function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = []

  // Major aspects and their orbs
  const aspectTypes: {
    [key: number]: { type: Aspect['type']; maxOrb: number }
  } = {
    0: { type: 'conjunction', maxOrb: 8 },
    60: { type: 'sextile', maxOrb: 6 },
    90: { type: 'square', maxOrb: 8 },
    120: { type: 'trine', maxOrb: 8 },
    180: { type: 'opposition', maxOrb: 8 },
  }

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i]
      const planet2 = planets[j]

      // Calculate absolute longitude for each planet
      const long1 = ZODIAC_SIGNS.indexOf(planet1.sign) * 30 + planet1.degree
      const long2 = ZODIAC_SIGNS.indexOf(planet2.sign) * 30 + planet2.degree

      // Calculate angular separation
      let separation = Math.abs(long1 - long2)
      if (separation > 180) separation = 360 - separation

      // Check each aspect type
      for (const [angle, { type, maxOrb }] of Object.entries(aspectTypes)) {
        const orb = Math.abs(separation - parseInt(angle))

        if (orb <= maxOrb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type,
            orb,
          })
        }
      }
    }
  }

  // Sort by orb strength
  return aspects.sort((a, b) => a.orb - b.orb)
}
