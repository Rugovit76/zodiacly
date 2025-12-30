// Numerology calculation functions

// Letter to number mapping (Pythagorean system)
const letterValues: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
}

const vowels = new Set(['A', 'E', 'I', 'O', 'U'])

/**
 * Reduce a number to single digit (unless it's a master number 11, 22, 33)
 */
function reduceToSingleDigit(num: number): number {
  // Master numbers - don't reduce
  if (num === 11 || num === 22 || num === 33) {
    return num
  }

  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0)
  }

  return num
}

/**
 * Calculate Life Path Number from birth date
 * Most important number in numerology
 */
export function calculateLifePathNumber(birthDate: Date): number {
  const year = birthDate.getFullYear()
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()

  // Reduce each component separately
  const reducedMonth = reduceToSingleDigit(month)
  const reducedDay = reduceToSingleDigit(day)
  const reducedYear = reduceToSingleDigit(year)

  // Sum and reduce
  const total = reducedMonth + reducedDay + reducedYear
  return reduceToSingleDigit(total)
}

/**
 * Calculate Expression/Destiny Number from full name
 * Reveals talents and life purpose
 */
export function calculateExpressionNumber(fullName: string): number {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '')

  const total = cleanName
    .split('')
    .reduce((sum, letter) => sum + (letterValues[letter] || 0), 0)

  return reduceToSingleDigit(total)
}

/**
 * Calculate Soul Urge Number from vowels in name
 * Reveals inner desires and motivations
 */
export function calculateSoulUrgeNumber(fullName: string): number {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '')

  const total = cleanName
    .split('')
    .filter(letter => vowels.has(letter))
    .reduce((sum, letter) => sum + (letterValues[letter] || 0), 0)

  return reduceToSingleDigit(total)
}

/**
 * Calculate Personality Number from consonants in name
 * Reveals how others see you
 */
export function calculatePersonalityNumber(fullName: string): number {
  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '')

  const total = cleanName
    .split('')
    .filter(letter => !vowels.has(letter))
    .reduce((sum, letter) => sum + (letterValues[letter] || 0), 0)

  return reduceToSingleDigit(total)
}

/**
 * Calculate Birthday Number from day of birth
 * Reveals special talents
 */
export function calculateBirthdayNumber(birthDate: Date): number {
  const day = birthDate.getDate()
  return reduceToSingleDigit(day)
}

/**
 * Calculate Maturity Number (Life Path + Expression)
 * Reveals goals for later life
 */
export function calculateMaturityNumber(birthDate: Date, fullName: string): number {
  const lifePath = calculateLifePathNumber(birthDate)
  const expression = calculateExpressionNumber(fullName)
  return reduceToSingleDigit(lifePath + expression)
}

/**
 * Calculate Personal Year Number for current year
 * Reveals themes for the current year
 */
export function calculatePersonalYearNumber(birthDate: Date): number {
  const currentYear = new Date().getFullYear()
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()

  const reducedMonth = reduceToSingleDigit(month)
  const reducedDay = reduceToSingleDigit(day)
  const reducedYear = reduceToSingleDigit(currentYear)

  const total = reducedMonth + reducedDay + reducedYear
  return reduceToSingleDigit(total)
}

/**
 * Get all numerology numbers for a person
 */
export interface NumerologyProfile {
  lifePathNumber: number
  expressionNumber: number
  soulUrgeNumber: number
  personalityNumber: number
  birthdayNumber: number
  maturityNumber: number
  personalYearNumber: number
}

export function calculateNumerologyProfile(
  birthDate: Date,
  fullName: string
): NumerologyProfile {
  return {
    lifePathNumber: calculateLifePathNumber(birthDate),
    expressionNumber: calculateExpressionNumber(fullName),
    soulUrgeNumber: calculateSoulUrgeNumber(fullName),
    personalityNumber: calculatePersonalityNumber(fullName),
    birthdayNumber: calculateBirthdayNumber(birthDate),
    maturityNumber: calculateMaturityNumber(birthDate, fullName),
    personalYearNumber: calculatePersonalYearNumber(birthDate)
  }
}

/**
 * Get number meaning (basic interpretation)
 */
export function getNumberMeaning(number: number): { title: string; keywords: string[] } {
  const meanings: Record<number, { title: string; keywords: string[] }> = {
    1: {
      title: 'The Leader',
      keywords: ['Independence', 'Leadership', 'Ambition', 'Innovation', 'Courage']
    },
    2: {
      title: 'The Peacemaker',
      keywords: ['Harmony', 'Cooperation', 'Sensitivity', 'Balance', 'Partnership']
    },
    3: {
      title: 'The Creative',
      keywords: ['Creativity', 'Expression', 'Joy', 'Communication', 'Optimism']
    },
    4: {
      title: 'The Builder',
      keywords: ['Stability', 'Hard work', 'Practicality', 'Organization', 'Discipline']
    },
    5: {
      title: 'The Freedom Seeker',
      keywords: ['Freedom', 'Adventure', 'Change', 'Versatility', 'Experience']
    },
    6: {
      title: 'The Nurturer',
      keywords: ['Responsibility', 'Love', 'Family', 'Service', 'Compassion']
    },
    7: {
      title: 'The Seeker',
      keywords: ['Spirituality', 'Analysis', 'Wisdom', 'Introspection', 'Mysticism']
    },
    8: {
      title: 'The Powerhouse',
      keywords: ['Success', 'Power', 'Material wealth', 'Achievement', 'Authority']
    },
    9: {
      title: 'The Humanitarian',
      keywords: ['Compassion', 'Completion', 'Wisdom', 'Universal love', 'Selflessness']
    },
    11: {
      title: 'The Master Intuitive',
      keywords: ['Intuition', 'Spiritual insight', 'Enlightenment', 'Idealism', 'Vision']
    },
    22: {
      title: 'The Master Builder',
      keywords: ['Master builder', 'Large endeavors', 'Leadership', 'Transformation', 'Vision']
    },
    33: {
      title: 'The Master Teacher',
      keywords: ['Master teacher', 'Compassion', 'Healing', 'Spiritual uplifting', 'Guidance']
    }
  }

  return meanings[number] || meanings[1]
}
