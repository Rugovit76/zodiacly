'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import Badge from '@/components/ui/Badge'
import NatalChartVisualization from '@/components/charts/NatalChartVisualization'
import { ChartData, AIReading, SessionUser } from '@/types'

interface ChartViewProps {
  chart: {
    id: string
    birthDate: Date
    birthTime: string
    location: string
    latitude: number
    longitude: number
    timezone: string
    chartData: any
    aiReading: any
    createdAt: Date
  }
  user: SessionUser
}

export default function ChartView({ chart, user }: ChartViewProps) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')
  const chartRef = useRef<HTMLDivElement>(null)

  const chartData = chart.chartData as unknown as ChartData
  const aiReading = chart.aiReading as unknown as AIReading | null

  async function generateReading() {
    setGenerating(true)
    setError('')

    try {
      const res = await fetch(`/api/charts/${chart.id}/interpret`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Failed to generate reading')
        setGenerating(false)
        return
      }

      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  async function exportToPNG() {
    if (!chartRef.current) return

    setExporting(true)
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#0a0a1f',
        scale: 2, // Higher quality
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `${chart.location.replace(/\s+/g, '-')}-natal-chart.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      setError('Failed to export PNG')
    } finally {
      setExporting(false)
    }
  }

  async function exportToPDF() {
    if (!chartRef.current) return

    setExporting(true)
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#0a0a1f',
        scale: 2,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${chart.location.replace(/\s+/g, '-')}-natal-chart.pdf`)
    } catch (err) {
      setError('Failed to export PDF')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">{chart.location}</h1>
          <p className="text-gray-400">
            {new Date(chart.birthDate).toLocaleDateString()} at {chart.birthTime}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Created {new Date(chart.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Export Buttons (PRO Only) */}
        {user.plan === 'PRO' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPNG}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : '📥 Export PNG'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : '📄 Export PDF'}
            </Button>
          </div>
        )}
      </div>

      {error && <Alert type="error" className="mb-6">{error}</Alert>}

      {/* Exportable Chart Content */}
      <div ref={chartRef}>
        {/* Chart Visualization */}
        <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Natal Chart</h2>
        <NatalChartVisualization chartData={chartData} />

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h3 className="font-bold mb-2 text-cosmic-primary">Planets</h3>
            <div className="space-y-1 text-gray-400">
              {chartData.planets.slice(0, 7).map((p) => (
                <div key={p.name}>
                  {p.name}: {p.sign} ({p.house}th)
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-cosmic-secondary">Houses</h3>
            <div className="space-y-1 text-gray-400">
              <div>1st: {chartData.houses[0].sign}</div>
              <div>10th: {chartData.houses[9].sign}</div>
              <div>Ascendant: {chartData.ascendant.sign}</div>
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-cosmic-accent">Aspects</h3>
            <div className="space-y-1 text-gray-400">
              {chartData.aspects.slice(0, 5).map((a, i) => (
                <div key={i} className="text-xs">
                  {a.planet1} {a.type} {a.planet2}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-cosmic-gold">Legend</h3>
            <div className="space-y-1 text-gray-400 text-xs">
              <div>☉ Sun ☽ Moon ☿ Mercury</div>
              <div>♀ Venus ♂ Mars ♃ Jupiter</div>
              <div>♄ Saturn</div>
              <div className="mt-2">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                Retrograde
              </div>
            </div>
          </div>
        </div>
      </Card>
      </div>

      {/* AI Reading Section */}
      {aiReading ? (
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">AI Interpretation</h2>
              <Badge variant="pro">
                {user.plan === 'PRO' ? 'Full Reading' : 'Summary'}
              </Badge>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {aiReading.overview}
            </p>
          </Card>

          {/* PRO Features */}
          {user.plan === 'PRO' && (
            <>
              {/* Planet Analysis */}
              {aiReading.planetAnalysis.length > 0 && (
                <Card>
                  <h2 className="text-2xl font-bold mb-6">Planet Analysis</h2>
                  <div className="space-y-6">
                    {aiReading.planetAnalysis.map((analysis, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-bold text-cosmic-primary mb-2">
                          {analysis.planet}
                        </h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {analysis.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* House Analysis */}
              {aiReading.houseAnalysis.length > 0 && (
                <Card>
                  <h2 className="text-2xl font-bold mb-6">House Analysis</h2>
                  <div className="space-y-6">
                    {aiReading.houseAnalysis.map((analysis, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-bold text-cosmic-secondary mb-2">
                          {analysis.house}th House
                        </h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {analysis.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Aspect Analysis */}
              {aiReading.aspectAnalysis.length > 0 && (
                <Card>
                  <h2 className="text-2xl font-bold mb-6">Major Aspects</h2>
                  <div className="space-y-6">
                    {aiReading.aspectAnalysis.map((analysis, i) => (
                      <div key={i}>
                        <h3 className="text-lg font-bold text-cosmic-accent mb-2">
                          {analysis.aspect}
                        </h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                          {analysis.interpretation}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Ascendant */}
              {aiReading.ascendantAnalysis && (
                <Card>
                  <h2 className="text-2xl font-bold mb-4">Ascendant</h2>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {aiReading.ascendantAnalysis}
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🔮</div>
          <h3 className="text-xl font-bold mb-2">No AI Reading Yet</h3>
          <p className="text-gray-400 mb-6">
            Generate an AI-powered interpretation of your natal chart
          </p>
          {user.plan === 'FREE' && (
            <Alert type="info" className="mb-6 text-left max-w-md mx-auto">
              <strong>FREE Plan:</strong> Get a brief summary (1 per month).
              <br />
              <strong>PRO Plan:</strong> Full detailed reading with planet, house, and aspect analysis.
            </Alert>
          )}
          <Button onClick={generateReading} loading={generating} size="lg">
            Generate AI Reading
          </Button>
        </Card>
      )}
    </div>
  )
}
