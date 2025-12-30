'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import NatalChartVisualization from '@/components/charts/NatalChartVisualization'
import { ChartData, BirthData } from '@/types'

export default function GuestChartCreator() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'chart'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form data
  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [timezone, setTimezone] = useState('Europe/Belgrade')

  // Chart data
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [birthInfo, setBirthInfo] = useState<BirthData | null>(null)

  // Location search
  const [locationSearch, setLocationSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  async function searchLocation() {
    if (!locationSearch) return

    setSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}&limit=5`
      )
      const results = await response.json()
      setSearchResults(results)
    } catch (err) {
      console.error('Location search failed:', err)
    } finally {
      setSearching(false)
    }
  }

  function selectLocation(result: any) {
    setLocation(result.display_name)
    setLatitude(result.lat)
    setLongitude(result.lon)
    setSearchResults([])
    setLocationSearch('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Calculate chart using client-side calculation
      const birthData: BirthData = {
        date: new Date(birthDate),
        time: birthTime,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timezone,
        location,
      }

      // Import calculator dynamically
      const { calculateNatalChart } = await import('@/lib/astrology/calculator')
      const chart = await calculateNatalChart(birthData)

      setChartData(chart)
      setBirthInfo(birthData)
      setStep('chart')
    } catch (err) {
      setError('Failed to calculate chart. Please check your input.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegisterAndSave() {
    // Store chart data in sessionStorage for after registration
    if (chartData && birthInfo) {
      sessionStorage.setItem('pendingChart', JSON.stringify({
        chartData,
        birthInfo,
      }))
    }
    router.push('/auth/register?returnTo=save-chart')
  }

  if (step === 'chart' && chartData && birthInfo) {
    return (
      <div className="min-h-screen">
        {/* Starfield background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="star absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cosmic-primary via-cosmic-secondary to-cosmic-accent bg-clip-text text-transparent">
              Your Natal Chart
            </h1>
            <p className="text-gray-400">
              {birthInfo.location} • {new Date(birthInfo.date).toLocaleDateString()} at {birthInfo.time}
            </p>
          </div>

          {/* Save CTA Banner */}
          <Card className="mb-8 bg-gradient-to-r from-cosmic-primary/20 to-cosmic-secondary/20 border-cosmic-primary">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">💾 Want to save your chart?</h3>
                <p className="text-gray-300">
                  Register for free to save this chart, get AI-powered interpretations, and create unlimited charts!
                </p>
              </div>
              <div className="flex flex-col gap-2 min-w-[200px]">
                <Button onClick={handleRegisterAndSave} size="lg">
                  Register & Save Chart
                </Button>
                <Link href="/">
                  <Button variant="outline" size="sm" fullWidth>
                    Create Another
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Chart Visualization */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Cosmic Blueprint</h2>
            <NatalChartVisualization chartData={chartData} />

            {/* Legend */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <h3 className="font-bold mb-2 text-cosmic-primary">Planets</h3>
                <div className="space-y-1 text-gray-400">
                  {chartData.planets.slice(0, 7).map((p) => (
                    <div key={p.name}>
                      {p.name}: {p.sign} ({p.house}th)
                      {p.retrograde && <span className="text-red-400 ml-1">Rx</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-cosmic-secondary">Houses</h3>
                <div className="space-y-1 text-gray-400">
                  <div>1st: {chartData.houses[0].sign}</div>
                  <div>4th: {chartData.houses[3].sign}</div>
                  <div>7th: {chartData.houses[6].sign}</div>
                  <div>10th: {chartData.houses[9].sign}</div>
                  <div className="mt-2 text-cosmic-gold">
                    ASC: {chartData.ascendant.sign}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-cosmic-accent">Major Aspects</h3>
                <div className="space-y-1 text-gray-400">
                  {chartData.aspects.slice(0, 6).map((a, i) => (
                    <div key={i} className="text-xs">
                      {a.planet1} {a.type} {a.planet2}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-cosmic-gold">Symbols</h3>
                <div className="space-y-1 text-gray-400 text-xs">
                  <div>☉ Sun ☽ Moon ☿ Mercury</div>
                  <div>♀ Venus ♂ Mars ♃ Jupiter</div>
                  <div>♄ Saturn</div>
                  <div className="mt-2">
                    <span className="text-red-400">Rx</span> = Retrograde
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Reading Teaser */}
          <Card className="bg-gradient-to-br from-cosmic-surface to-cosmic-primary/5 border-cosmic-primary/30">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔮</div>
              <h3 className="text-2xl font-bold mb-3">Unlock AI-Powered Insights</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Get a comprehensive AI interpretation of your natal chart. Discover your personality traits,
                strengths, challenges, and life path based on planetary positions and aspects.
              </p>

              <div className="bg-cosmic-surface/50 rounded-lg p-6 mb-6 max-w-xl mx-auto">
                <h4 className="font-bold mb-3 text-cosmic-primary">What you'll get:</h4>
                <ul className="text-left space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Personality overview based on Sun, Moon & Ascendant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Planet-by-planet analysis (PRO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>House interpretations (PRO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>Aspect analysis (PRO)</span>
                  </li>
                </ul>
              </div>

              <Button onClick={handleRegisterAndSave} size="lg">
                Register Free to Get AI Reading
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                1 free AI reading per month • Upgrade to PRO for unlimited readings
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Starfield background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="star absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cosmic-primary via-cosmic-secondary to-cosmic-accent bg-clip-text text-transparent">
            Create Your Free Natal Chart
          </h1>
          <p className="text-gray-400">
            No registration required • Instant results
          </p>
        </div>

        <Card glow>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error">{error}</Alert>}

            <Alert type="info">
              ✨ <strong>100% Free!</strong> Create your chart instantly. Register later to save and get AI readings.
            </Alert>

            {/* Birth Date */}
            <Input
              type="date"
              label="Birth Date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />

            {/* Birth Time */}
            <Input
              type="time"
              label="Birth Time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              required
              helperText="Use 24-hour format (e.g., 14:30 for 2:30 PM)"
            />

            {/* Location Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Birth Location
              </label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search city or address..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), searchLocation())}
                />
                <Button
                  type="button"
                  onClick={searchLocation}
                  disabled={searching || !locationSearch}
                  className="whitespace-nowrap"
                >
                  {searching ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-cosmic-surface border border-cosmic-primary/30 rounded-lg overflow-hidden">
                  {searchResults.map((result, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectLocation(result)}
                      className="w-full text-left px-4 py-3 hover:bg-cosmic-primary/10 transition-colors border-b border-cosmic-primary/20 last:border-b-0"
                    >
                      <div className="text-sm font-medium">{result.display_name}</div>
                      <div className="text-xs text-gray-500">
                        Lat: {parseFloat(result.lat).toFixed(4)}, Lon: {parseFloat(result.lon).toFixed(4)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Location Display */}
            {location && (
              <Alert type="success">
                <strong>Selected:</strong> {location}
              </Alert>
            )}

            {/* Manual Coordinates (Advanced) */}
            <details className="cursor-pointer">
              <summary className="text-sm text-gray-400 hover:text-cosmic-primary transition-colors">
                Advanced: Enter coordinates manually
              </summary>
              <div className="mt-4 space-y-4">
                <Input
                  type="text"
                  label="Location Name"
                  placeholder="e.g., Belgrade, Serbia"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    step="any"
                    label="Latitude"
                    placeholder="44.8154"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                  <Input
                    type="number"
                    step="any"
                    label="Longitude"
                    placeholder="20.4570"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </div>
            </details>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-cosmic-surface border-2 border-cosmic-primary/30 focus:border-cosmic-primary text-white focus:outline-none focus:ring-2 focus:ring-cosmic-primary/50 transition-all"
                required
              >
                <option value="Europe/Belgrade">Europe/Belgrade (CET)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Europe/Paris">Europe/Paris (CET)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
              </select>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={!birthDate || !birthTime || !location || !latitude || !longitude}
            >
              Calculate My Natal Chart
            </Button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-cosmic-primary hover:text-cosmic-secondary">
                Login
              </Link>
            </p>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
