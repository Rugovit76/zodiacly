// Synastry (Compatibility) Calculator
// Calculates relationship compatibility between two natal charts

interface Planet {
  name: string
  sign: string
  degree: number
  house: number
}

interface ChartData {
  planets: Planet[]
  ascendant: {
    sign: string
    degree: number
  }
}

interface CompatibilityResult {
  overallScore: number // 0-100
  compatibility: 'Low' | 'Medium' | 'High' | 'Excellent'
  strengths: string[]
  challenges: string[]
  synastryAspects: SynastryAspect[]
  elementBalance: ElementBalance
  signCompatibility: SignCompatibility
}

interface SynastryAspect {
  person1Planet: string
  person2Planet: string
  aspect: string
  angle: number
  isHarmonious: boolean
  description: string
}

interface ElementBalance {
  fire: number
  earth: number
  air: number
  water: number
}

interface SignCompatibility {
  sunSignMatch: number
  moonSignMatch: number
  venusSignMatch: number
  marsSignMatch: number
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

const SIGN_ELEMENTS = {
  Aries: 'fire',
  Leo: 'fire',
  Sagittarius: 'fire',
  Taurus: 'earth',
  Virgo: 'earth',
  Capricorn: 'earth',
  Gemini: 'air',
  Libra: 'air',
  Aquarius: 'air',
  Cancer: 'water',
  Scorpio: 'water',
  Pisces: 'water'
}

// Calculate angle between two planets
function calculateAngle(deg1: number, deg2: number): number {
  const diff = Math.abs(deg1 - deg2)
  return diff > 180 ? 360 - diff : diff
}

// Determine aspect type based on angle
function getAspectType(angle: number): { name: string; harmonious: boolean } | null {
  const orb = 8 // Degree of tolerance

  if (Math.abs(angle - 0) <= orb) return { name: 'Conjunction', harmonious: true }
  if (Math.abs(angle - 60) <= orb) return { name: 'Sextile', harmonious: true }
  if (Math.abs(angle - 90) <= orb) return { name: 'Square', harmonious: false }
  if (Math.abs(angle - 120) <= orb) return { name: 'Trine', harmonious: true }
  if (Math.abs(angle - 180) <= orb) return { name: 'Opposition', harmonious: false }

  return null
}

// Get aspect description
function getAspectDescription(
  planet1: string,
  planet2: string,
  aspect: string,
  harmonious: boolean
): string {
  const descriptions: Record<string, Record<string, string>> = {
    'Sun-Moon': {
      Conjunction: 'Strong emotional connection, you feel seen and understood',
      Trine: 'Natural harmony between your identities and emotional needs',
      Square: 'Different approaches to life can cause tension',
      Opposition: 'Attraction of opposites, balancing act required'
    },
    'Venus-Mars': {
      Conjunction: 'Intense romantic and physical attraction',
      Trine: 'Passionate connection flows naturally',
      Square: 'Different love languages may clash',
      Sextile: 'Playful romantic chemistry'
    },
    'Moon-Moon': {
      Conjunction: 'Deep emotional understanding',
      Trine: 'Emotional support comes naturally',
      Square: 'Different emotional needs'
    }
  }

  const key = `${planet1}-${planet2}`
  const reverseKey = `${planet2}-${planet1}`

  return descriptions[key]?.[aspect] ||
         descriptions[reverseKey]?.[aspect] ||
         (harmonious ? 'Harmonious energy flow' : 'Growth through challenge')
}

// Calculate sign compatibility score
function calculateSignCompatibility(sign1: string, sign2: string): number {
  const element1 = SIGN_ELEMENTS[sign1 as keyof typeof SIGN_ELEMENTS]
  const element2 = SIGN_ELEMENTS[sign2 as keyof typeof SIGN_ELEMENTS]

  // Same element: high compatibility
  if (element1 === element2) return 90

  // Compatible elements
  if (
    (element1 === 'fire' && element2 === 'air') ||
    (element1 === 'air' && element2 === 'fire') ||
    (element1 === 'earth' && element2 === 'water') ||
    (element1 === 'water' && element2 === 'earth')
  ) return 75

  // Opposite elements (challenging but magnetic)
  if (
    (element1 === 'fire' && element2 === 'water') ||
    (element1 === 'water' && element2 === 'fire') ||
    (element1 === 'earth' && element2 === 'air') ||
    (element1 === 'air' && element2 === 'earth')
  ) return 50

  return 60
}

// Main compatibility calculation
export function calculateCompatibility(
  chart1: ChartData,
  chart2: ChartData
): CompatibilityResult {
  const synastryAspects: SynastryAspect[] = []
  let totalScore = 0
  let aspectCount = 0

  // Important planets for relationship compatibility
  const importantPlanets = ['Sun', 'Moon', 'Venus', 'Mars', 'Mercury']

  // Calculate synastry aspects
  chart1.planets.forEach((planet1) => {
    if (!importantPlanets.includes(planet1.name)) return

    chart2.planets.forEach((planet2) => {
      if (!importantPlanets.includes(planet2.name)) return

      // Convert sign + degree to absolute degree
      const sign1Index = ZODIAC_SIGNS.indexOf(planet1.sign)
      const sign2Index = ZODIAC_SIGNS.indexOf(planet2.sign)
      const deg1 = sign1Index * 30 + planet1.degree
      const deg2 = sign2Index * 30 + planet2.degree

      const angle = calculateAngle(deg1, deg2)
      const aspectType = getAspectType(angle)

      if (aspectType) {
        // Weight important aspects more heavily
        let weight = 1
        if (planet1.name === 'Sun' && planet2.name === 'Moon') weight = 3
        if (planet1.name === 'Venus' && planet2.name === 'Mars') weight = 2.5
        if (planet1.name === 'Moon' && planet2.name === 'Moon') weight = 2

        const score = aspectType.harmonious ? 80 : 40
        totalScore += score * weight
        aspectCount += weight

        synastryAspects.push({
          person1Planet: planet1.name,
          person2Planet: planet2.name,
          aspect: aspectType.name,
          angle,
          isHarmonious: aspectType.harmonious,
          description: getAspectDescription(
            planet1.name,
            planet2.name,
            aspectType.name,
            aspectType.harmonious
          )
        })
      }
    })
  })

  // Calculate sign compatibility scores
  const sunPlanet1 = chart1.planets.find(p => p.name === 'Sun')
  const sunPlanet2 = chart2.planets.find(p => p.name === 'Sun')
  const moonPlanet1 = chart1.planets.find(p => p.name === 'Moon')
  const moonPlanet2 = chart2.planets.find(p => p.name === 'Moon')
  const venusPlanet1 = chart1.planets.find(p => p.name === 'Venus')
  const venusPlanet2 = chart2.planets.find(p => p.name === 'Venus')
  const marsPlanet1 = chart1.planets.find(p => p.name === 'Mars')
  const marsPlanet2 = chart2.planets.find(p => p.name === 'Mars')

  const signCompatibility: SignCompatibility = {
    sunSignMatch: sunPlanet1 && sunPlanet2
      ? calculateSignCompatibility(sunPlanet1.sign, sunPlanet2.sign)
      : 50,
    moonSignMatch: moonPlanet1 && moonPlanet2
      ? calculateSignCompatibility(moonPlanet1.sign, moonPlanet2.sign)
      : 50,
    venusSignMatch: venusPlanet1 && venusPlanet2
      ? calculateSignCompatibility(venusPlanet1.sign, venusPlanet2.sign)
      : 50,
    marsSignMatch: marsPlanet1 && marsPlanet2
      ? calculateSignCompatibility(marsPlanet1.sign, marsPlanet2.sign)
      : 50
  }

  // Calculate element balance
  const elementBalance: ElementBalance = { fire: 0, earth: 0, air: 0, water: 0 }

  ;[...chart1.planets, ...chart2.planets].forEach((planet) => {
    const element = SIGN_ELEMENTS[planet.sign as keyof typeof SIGN_ELEMENTS]
    if (element) {
      elementBalance[element as keyof ElementBalance]++
    }
  })

  // Calculate overall score
  const aspectScore = aspectCount > 0 ? totalScore / aspectCount : 50
  const signScore = (
    signCompatibility.sunSignMatch +
    signCompatibility.moonSignMatch +
    signCompatibility.venusSignMatch +
    signCompatibility.marsSignMatch
  ) / 4

  const overallScore = Math.round((aspectScore * 0.6 + signScore * 0.4))

  // Determine compatibility level
  let compatibility: 'Low' | 'Medium' | 'High' | 'Excellent'
  if (overallScore >= 80) compatibility = 'Excellent'
  else if (overallScore >= 65) compatibility = 'High'
  else if (overallScore >= 50) compatibility = 'Medium'
  else compatibility = 'Low'

  // Generate strengths and challenges
  const strengths: string[] = []
  const challenges: string[] = []

  synastryAspects
    .filter(a => a.isHarmonious)
    .slice(0, 5)
    .forEach(a => {
      strengths.push(`${a.person1Planet}-${a.person2Planet} ${a.aspect}: ${a.description}`)
    })

  synastryAspects
    .filter(a => !a.isHarmonious)
    .slice(0, 3)
    .forEach(a => {
      challenges.push(`${a.person1Planet}-${a.person2Planet} ${a.aspect}: ${a.description}`)
    })

  // Add sign compatibility insights
  if (signCompatibility.sunSignMatch >= 75) {
    strengths.push('Your Sun signs are highly compatible - similar life approaches')
  }
  if (signCompatibility.moonSignMatch >= 75) {
    strengths.push('Emotional compatibility is strong - you understand each other\'s needs')
  }
  if (signCompatibility.venusSignMatch >= 75) {
    strengths.push('Love languages align well - romantic harmony')
  }

  return {
    overallScore,
    compatibility,
    strengths,
    challenges,
    synastryAspects,
    elementBalance,
    signCompatibility
  }
}

// Export types
export type {
  CompatibilityResult,
  SynastryAspect,
  ElementBalance,
  SignCompatibility
}
