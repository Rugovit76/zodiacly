'use client'

import { ChartData } from '@/types'

interface NatalChartVisualizationProps {
  chartData: ChartData
  size?: number
}

const ZODIAC_COLORS: { [key: string]: string } = {
  Aries: '#FF4444',
  Taurus: '#44AA44',
  Gemini: '#FFAA44',
  Cancer: '#8888FF',
  Leo: '#FFD700',
  Virgo: '#88AA88',
  Libra: '#FF88FF',
  Scorpio: '#AA4444',
  Sagittarius: '#AA44FF',
  Capricorn: '#448844',
  Aquarius: '#44FFFF',
  Pisces: '#8844FF',
}

const PLANET_SYMBOLS: { [key: string]: string } = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
}

export default function NatalChartVisualization({ chartData, size = 600 }: NatalChartVisualizationProps) {
  const center = size / 2
  const outerRadius = size * 0.45
  const innerRadius = size * 0.3
  const houseRadius = size * 0.35

  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180

  // Get position on circle
  const getPosition = (degree: number, radius: number) => {
    const angle = toRadians(degree - 90) // Start from top (Aries)
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }

  // Calculate absolute longitude for a planet
  const getAbsoluteLongitude = (planet: any) => {
    const signIndex = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(planet.sign)
    return signIndex * 30 + planet.degree
  }

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} className="drop-shadow-2xl">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="rgba(20, 27, 61, 0.9)"
          stroke="url(#cosmic-gradient)"
          strokeWidth="2"
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="cosmic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Zodiac wheel - 12 signs */}
        {Array.from({ length: 12 }, (_, i) => {
          const startDegree = i * 30
          const endDegree = (i + 1) * 30
          const midDegree = startDegree + 15

          const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
          const sign = signs[i]

          const start = getPosition(startDegree, outerRadius)
          const end = getPosition(endDegree, outerRadius)
          const innerStart = getPosition(startDegree, houseRadius)
          const innerEnd = getPosition(endDegree, houseRadius)

          // Label position
          const labelPos = getPosition(midDegree, outerRadius * 1.15)

          return (
            <g key={i}>
              {/* Zodiac sign sector */}
              <path
                d={`M ${center} ${center} L ${start.x} ${start.y} A ${outerRadius} ${outerRadius} 0 0 1 ${end.x} ${end.y} Z`}
                fill={ZODIAC_COLORS[sign]}
                opacity="0.1"
                stroke={ZODIAC_COLORS[sign]}
                strokeWidth="1"
                strokeOpacity="0.3"
              />

              {/* Sign label */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill={ZODIAC_COLORS[sign]}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {sign.slice(0, 3).toUpperCase()}
              </text>

              {/* Dividing line */}
              <line
                x1={innerStart.x}
                y1={innerStart.y}
                x2={start.x}
                y2={start.y}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
            </g>
          )
        })}

        {/* Houses - 12 houses */}
        {chartData.houses.map((house, i) => {
          const houseDegree = getAbsoluteLongitude({ sign: house.sign, degree: house.degree })
          const nextHouse = chartData.houses[(i + 1) % 12]
          const nextHouseDegree = getAbsoluteLongitude({ sign: nextHouse.sign, degree: nextHouse.degree })

          const pos = getPosition(houseDegree, houseRadius)
          const labelPos = getPosition(
            (houseDegree + (nextHouseDegree > houseDegree ? nextHouseDegree : nextHouseDegree + 360)) / 2,
            innerRadius * 0.7
          )

          return (
            <g key={i}>
              {/* House cusp line */}
              <line
                x1={center}
                y1={center}
                x2={pos.x}
                y2={pos.y}
                stroke="rgba(99, 102, 241, 0.5)"
                strokeWidth="2"
              />

              {/* House number */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill="rgba(255, 255, 255, 0.6)"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {house.number}
              </text>
            </g>
          )
        })}

        {/* Planets */}
        {chartData.planets.map((planet, i) => {
          const longitude = getAbsoluteLongitude(planet)
          const pos = getPosition(longitude, outerRadius * 0.85)

          return (
            <g key={i}>
              {/* Planet circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="16"
                fill="rgba(20, 27, 61, 0.95)"
                stroke={ZODIAC_COLORS[planet.sign]}
                strokeWidth="2"
              />

              {/* Planet symbol */}
              <text
                x={pos.x}
                y={pos.y}
                fill={ZODIAC_COLORS[planet.sign]}
                fontSize="18"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {PLANET_SYMBOLS[planet.name] || planet.name[0]}
              </text>

              {/* Retrograde indicator */}
              {planet.retrograde && (
                <circle
                  cx={pos.x + 12}
                  cy={pos.y - 12}
                  r="4"
                  fill="#ff4444"
                />
              )}
            </g>
          )
        })}

        {/* Center circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius * 0.5}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="url(#cosmic-gradient)"
          strokeWidth="2"
        />

        {/* Ascendant marker */}
        {chartData.ascendant && (
          <g>
            <text
              x={center}
              y={center}
              fill="white"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              ASC
            </text>
            <text
              x={center}
              y={center + 20}
              fill="rgba(255, 255, 255, 0.7)"
              fontSize="12"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {chartData.ascendant.sign}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
