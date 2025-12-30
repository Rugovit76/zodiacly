'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { SessionUser } from '@/types'

interface ChartCreateFormProps {
  user: SessionUser
}

export default function ChartCreateForm({ user }: ChartCreateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [birthDate, setBirthDate] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [timezone, setTimezone] = useState('Europe/Belgrade')

  // Simple location search (in production, use OpenStreetMap Nominatim API)
  const [locationSearch, setLocationSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  async function searchLocation() {
    if (!locationSearch) return

    setSearching(true)
    try {
      // Using OpenStreetMap Nominatim API
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
      const res = await fetch('/api/charts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate,
          birthTime,
          location,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timezone,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Failed to create chart')
        setLoading(false)
        return
      }

      // Redirect to the chart view
      router.push(`/chart/${data.data.chart.id}`)
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create Natal Chart</h1>
        <p className="text-gray-400">
          Enter your birth information to calculate your cosmic blueprint
        </p>
      </div>

      <Card glow>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <Alert type="error">{error}</Alert>}

          {user.plan === 'FREE' && (
            <Alert type="warning">
              <strong>FREE Plan:</strong> You can create 1 natal chart. Upgrade to PRO for unlimited charts.
            </Alert>
          )}

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
            Calculate Natal Chart
          </Button>
        </form>
      </Card>
    </div>
  )
}
