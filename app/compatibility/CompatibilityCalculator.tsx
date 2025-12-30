'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Chart {
  id: string
  birthDate: Date
  location: string
  chartData: any
}

interface CompatibilityCalculatorProps {
  charts: Chart[]
}

interface CompatibilityResult {
  overallScore: number
  compatibility: string
  strengths: string[]
  challenges: string[]
  synastryAspects: any[]
  elementBalance: any
  signCompatibility: any[]
}

export default function CompatibilityCalculator({ charts }: CompatibilityCalculatorProps) {
  const [chart1Id, setChart1Id] = useState<string>('')
  const [chart2Id, setChart2Id] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompatibilityResult | null>(null)

  async function calculateCompatibility() {
    if (!chart1Id || !chart2Id) {
      alert('Please select both charts')
      return
    }

    if (chart1Id === chart2Id) {
      alert('Please select two different charts')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chart1Id, chart2Id }),
      })

      const data = await res.json()

      if (data.success) {
        setResult(data.data.compatibility)
      } else {
        alert(data.error || 'Failed to calculate compatibility')
      }
    } catch (error) {
      console.error('Compatibility calculation error:', error)
      alert('Failed to calculate compatibility')
    } finally {
      setLoading(false)
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'text-green-400'
    if (score >= 65) return 'text-blue-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  function getScoreEmoji(score: number) {
    if (score >= 80) return '💚'
    if (score >= 65) return '💙'
    if (score >= 50) return '💛'
    return '🧡'
  }

  return (
    <div className="space-y-8">
      {/* Chart Selection */}
      <Card>
        <h2 className="text-2xl font-bold mb-6">Select Two Charts to Compare</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Chart 1 Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              First Chart
            </label>
            <select
              value={chart1Id}
              onChange={(e) => setChart1Id(e.target.value)}
              className="w-full px-4 py-3 bg-cosmic-surface border border-cosmic-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-primary"
            >
              <option value="">Select a chart...</option>
              {charts.map((chart) => (
                <option key={chart.id} value={chart.id}>
                  {chart.location} - {new Date(chart.birthDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Chart 2 Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2">
              Second Chart
            </label>
            <select
              value={chart2Id}
              onChange={(e) => setChart2Id(e.target.value)}
              className="w-full px-4 py-3 bg-cosmic-surface border border-cosmic-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cosmic-primary"
            >
              <option value="">Select a chart...</option>
              {charts.map((chart) => (
                <option key={chart.id} value={chart.id}>
                  {chart.location} - {new Date(chart.birthDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={calculateCompatibility}
          disabled={loading || !chart1Id || !chart2Id}
          size="lg"
          fullWidth
        >
          {loading ? '🔮 Calculating Cosmic Chemistry...' : '✨ Calculate Compatibility'}
        </Button>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Overall Score */}
          <Card className="bg-gradient-to-br from-cosmic-primary/10 to-cosmic-secondary/10 border-cosmic-primary">
            <div className="text-center">
              <div className="text-8xl mb-4">{getScoreEmoji(result.overallScore)}</div>
              <h2 className="text-4xl font-bold mb-2">
                <span className={getScoreColor(result.overallScore)}>
                  {result.overallScore}%
                </span>
              </h2>
              <p className="text-2xl font-semibold text-gray-300 mb-2">
                {result.compatibility} Compatibility
              </p>
              <p className="text-gray-400">
                Based on planetary aspects, sign compatibility, and element balance
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <Card>
              <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center gap-2">
                <span>💚</span> Strengths
              </h3>
              <ul className="space-y-3">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Challenges */}
            <Card>
              <h3 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
                <span>⚠️</span> Growth Areas
              </h3>
              <ul className="space-y-3">
                {result.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">→</span>
                    <span className="text-gray-300">{challenge}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Element Balance */}
          <Card>
            <h3 className="text-2xl font-bold mb-6">Element Balance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(result.elementBalance).map(([element, count]: [string, any]) => {
                const elementEmojis: Record<string, string> = {
                  fire: '🔥',
                  earth: '🌍',
                  air: '💨',
                  water: '💧'
                }

                const totalPlanets = Object.values(result.elementBalance).reduce((a: number, b: number) => a + b, 0)
                const percentage = totalPlanets > 0 ? Math.round((count / totalPlanets) * 100) : 0

                return (
                  <div
                    key={element}
                    className="p-4 rounded-lg bg-cosmic-surface border border-cosmic-primary/20 text-center"
                  >
                    <div className="text-3xl mb-2">{elementEmojis[element]}</div>
                    <div className="font-semibold text-cosmic-primary capitalize">
                      {element}
                    </div>
                    <div className="text-2xl font-bold mt-2">{count}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {percentage}%
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Major Aspects */}
          <Card>
            <h3 className="text-2xl font-bold mb-6">Key Planetary Aspects</h3>
            <div className="space-y-3">
              {result.synastryAspects.length > 0 ? (
                result.synastryAspects
                  .slice(0, 10)
                  .map((aspect, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        aspect.isHarmonious
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-yellow-500/10 border-yellow-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {aspect.isHarmonious ? '💚' : '⚡'}
                          </span>
                          <div>
                            <div className="font-semibold">
                              {aspect.person1Planet} {aspect.aspect} {aspect.person2Planet}
                            </div>
                            <div className="text-sm text-gray-400">
                              {aspect.description}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            aspect.isHarmonious ? 'text-green-400' : 'text-yellow-400'
                          }`}
                        >
                          {aspect.angle.toFixed(1)}°
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-400 py-8">
                  No significant aspects found
                </div>
              )}
            </div>
          </Card>

          {/* Share Results CTA */}
          <Card className="bg-gradient-to-r from-cosmic-accent/20 to-cosmic-gold/20 border-cosmic-gold">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-3">
                Share Your Compatibility Results! 💫
              </h3>
              <p className="text-gray-300 mb-6">
                Create public links for both charts and share your cosmic connection with the world!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/dashboard">
                  <Button variant="primary" size="lg">
                    Go to Dashboard
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.reload()}
                >
                  Compare Other Charts
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
