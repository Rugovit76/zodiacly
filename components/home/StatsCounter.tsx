'use client'

import { useState, useEffect } from 'react'

interface Stat {
  label: string
  value: number
  suffix: string
  icon: string
}

const stats: Stat[] = [
  {
    label: 'Charts Created',
    value: 12847,
    suffix: '+',
    icon: '📊'
  },
  {
    label: 'Active Users',
    value: 8234,
    suffix: '+',
    icon: '👥'
  },
  {
    label: 'AI Readings',
    value: 6521,
    suffix: '+',
    icon: '🤖'
  },
  {
    label: 'Average Rating',
    value: 4.9,
    suffix: '/5',
    icon: '⭐'
  }
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const isDecimal = target % 1 !== 0
  const duration = 2000 // 2 seconds
  const steps = 60

  useEffect(() => {
    let current = 0
    const increment = target / steps
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(current)
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  )
}

export default function StatsCounter() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger animation on mount
    setIsVisible(true)
  }, [])

  return (
    <section className="py-16 bg-cosmic-dark/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Join Our Growing Community
          </h2>
          <p className="text-gray-400">
            Thousands trust Zodiacly for their astrological insights
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center"
              style={{
                animation: isVisible ? `fadeInUp 0.6s ease-out ${index * 0.1}s both` : 'none'
              }}
            >
              <div className="text-5xl mb-3">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-cosmic-primary mb-2">
                {isVisible ? (
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                ) : (
                  <span>0{stat.suffix}</span>
                )}
              </div>
              <div className="text-sm md:text-base text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
