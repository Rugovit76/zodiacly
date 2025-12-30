'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Badge from '@/components/ui/Badge'
import {
  calculateNumerologyProfile,
  getNumberMeaning,
  type NumerologyProfile
} from '@/lib/numerology/calculations'

interface NumerologyResult {
  profile: NumerologyProfile
  fullName: string
  birthDate: Date
  interpretation?: any
}

interface NumerologyCalculatorProps {
  user?: {
    plan: 'FREE' | 'PRO'
  } | null
}

export default function NumerologyCalculator({ user }: NumerologyCalculatorProps) {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<NumerologyResult | null>(null)
  const [error, setError] = useState('')
  const [calculating, setCalculating] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('Please enter your full name')
      return
    }

    if (!birthDate) {
      setError('Please enter your birth date')
      return
    }

    setCalculating(true)

    try {
      const birth = new Date(birthDate)
      const profile = calculateNumerologyProfile(birth, fullName.trim())

      setResult({
        profile,
        fullName: fullName.trim(),
        birthDate: birth
      })
    } catch (err) {
      setError('Invalid birth date. Please try again.')
    } finally {
      setCalculating(false)
    }
  }

  function handleReset() {
    setFullName('')
    setBirthDate('')
    setResult(null)
    setError('')
  }

  async function handleGetAIReading() {
    if (!user) {
      router.push('/auth/register')
      return
    }

    if (user.plan === 'FREE') {
      router.push('/auth/register') // Redirect to upgrade
      return
    }

    if (!result) return

    setGeneratingAI(true)
    setError('')

    try {
      const res = await fetch('/api/numerology/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: result.profile,
          fullName: result.fullName,
        })
      })

      const data = await res.json()

      if (data.success) {
        setResult({
          ...result,
          interpretation: data.interpretation
        })
      } else {
        setError(data.error || 'Failed to generate AI reading')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setGeneratingAI(false)
    }
  }

  const NumberCard = ({
    number,
    title,
    description,
    color
  }: {
    number: number
    title: string
    description: string
    color: string
  }) => {
    const meaning = getNumberMeaning(number)
    const isMasterNumber = number === 11 || number === 22 || number === 33

    return (
      <Card className={`border-${color}/30 hover:border-${color} transition-colors`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className={`text-lg font-bold text-${color} mb-1`}>{title}</h3>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
          {isMasterNumber && (
            <Badge variant="pro" className="ml-2">Master</Badge>
          )}
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className={`text-5xl font-bold text-${color}`}>{number}</div>
          <div>
            <div className="font-semibold text-white">{meaning.title}</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {meaning.keywords.slice(0, 3).map((keyword, i) => (
                <span key={i} className="text-xs text-gray-400 bg-cosmic-surface px-2 py-1 rounded">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Calculator Form */}
      {!result ? (
        <Card>
          <h2 className="text-2xl font-bold mb-6 text-center">
            Calculate Your Numerology Numbers
          </h2>

          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name (as on birth certificate)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Michael Smith"
                className="w-full px-4 py-3 bg-cosmic-surface border border-cosmic-primary/20 rounded-lg focus:border-cosmic-primary focus:outline-none transition-colors"
                disabled={calculating}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use your birth name for most accurate results
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 bg-cosmic-surface border border-cosmic-primary/20 rounded-lg focus:border-cosmic-primary focus:outline-none transition-colors"
                disabled={calculating}
              />
            </div>

            {error && (
              <Alert type="error">{error}</Alert>
            )}

            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={calculating}
            >
              {calculating ? 'Calculating...' : 'Calculate My Numbers'}
            </Button>

            <p className="text-xs text-center text-gray-500">
              Free instant calculation • No signup required
            </p>
          </form>
        </Card>
      ) : (
        <>
          {/* Results Header */}
          <Card className="bg-gradient-to-r from-cosmic-primary/20 to-cosmic-secondary/20 border-cosmic-primary">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">{result.fullName}</h2>
              <p className="text-gray-400">
                {result.birthDate.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="mt-4"
              >
                Calculate for Someone Else
              </Button>
            </div>
          </Card>

          {/* Core Numbers */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Your Core Numbers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NumberCard
                number={result.profile.lifePathNumber}
                title="Life Path Number"
                description="Your life's purpose and direction"
                color="cosmic-primary"
              />
              <NumberCard
                number={result.profile.expressionNumber}
                title="Expression Number"
                description="Your talents and destiny"
                color="cosmic-secondary"
              />
              <NumberCard
                number={result.profile.soulUrgeNumber}
                title="Soul Urge Number"
                description="Your inner desires and motivations"
                color="cosmic-accent"
              />
              <NumberCard
                number={result.profile.personalityNumber}
                title="Personality Number"
                description="How others see you"
                color="cosmic-gold"
              />
            </div>
          </div>

          {/* Additional Numbers */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Additional Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NumberCard
                number={result.profile.birthdayNumber}
                title="Birthday Number"
                description="Special talents"
                color="cosmic-primary"
              />
              <NumberCard
                number={result.profile.maturityNumber}
                title="Maturity Number"
                description="Goals for later life"
                color="cosmic-secondary"
              />
              <NumberCard
                number={result.profile.personalYearNumber}
                title={`Personal Year ${new Date().getFullYear()}`}
                description="Theme for this year"
                color="cosmic-accent"
              />
            </div>
          </div>

          {/* AI Reading Section */}
          {!result.interpretation ? (
            <Card className="text-center bg-gradient-to-r from-cosmic-primary/10 to-cosmic-secondary/10">
              <div className="text-5xl mb-4">🔮</div>
              <h3 className="text-2xl font-bold mb-2">Want Deeper Insights?</h3>
              <p className="text-gray-400 mb-6">
                Get AI-powered interpretations of all your numbers with detailed explanations of what they mean for your life
              </p>
              <Button
                size="lg"
                onClick={handleGetAIReading}
                loading={generatingAI}
              >
                {generatingAI ? 'Generating...' : user?.plan === 'PRO' ? 'Generate AI Reading' : 'Get Full AI Reading (PRO)'}
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                {user?.plan === 'PRO' ? 'Click to generate your personalized reading' : 'Unlock detailed interpretations with PRO plan'}
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card>
                <h2 className="text-2xl font-bold mb-4">AI Overview</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {result.interpretation.overview}
                </p>
              </Card>

              {user?.plan === 'PRO' && (
                <>
                  <Card>
                    <h3 className="text-xl font-bold mb-3 text-cosmic-primary">Life Path Interpretation</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.interpretation.lifePathInterpretation}
                    </p>
                  </Card>

                  <Card>
                    <h3 className="text-xl font-bold mb-3 text-cosmic-secondary">Expression Number Interpretation</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.interpretation.expressionInterpretation}
                    </p>
                  </Card>

                  <Card>
                    <h3 className="text-xl font-bold mb-3 text-cosmic-accent">Soul Urge Interpretation</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.interpretation.soulUrgeInterpretation}
                    </p>
                  </Card>

                  <Card>
                    <h3 className="text-xl font-bold mb-3 text-cosmic-gold">Personality Interpretation</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.interpretation.personalityInterpretation}
                    </p>
                  </Card>

                  <Card>
                    <h3 className="text-xl font-bold mb-3 text-cosmic-primary">Personal Year {new Date().getFullYear()}</h3>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.interpretation.personalYearInterpretation}
                    </p>
                  </Card>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
