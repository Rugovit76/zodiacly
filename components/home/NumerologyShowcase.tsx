'use client'

import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function NumerologyShowcase() {
  const numbers = [
    { num: 1, title: 'Leader', color: 'cosmic-primary' },
    { num: 7, title: 'Seeker', color: 'cosmic-secondary' },
    { num: 3, title: 'Creative', color: 'cosmic-accent' },
    { num: 11, title: 'Intuitive', color: 'cosmic-gold', master: true }
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-cosmic-surface to-cosmic-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🔢</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Life Path Through Numbers
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Unlock the ancient wisdom of numerology. Calculate your Life Path Number,
            Expression Number, and discover what the universe reveals through your birth date and name.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Left: Number Examples */}
          <div>
            <h3 className="text-2xl font-bold mb-6">What Your Numbers Reveal</h3>
            <div className="grid grid-cols-2 gap-4">
              {numbers.map(({ num, title, color, master }) => (
                <Card key={num} className={`text-center border-${color}/30 hover:border-${color} transition-colors`}>
                  {master && (
                    <div className="text-xs font-bold text-cosmic-gold mb-2">MASTER NUMBER</div>
                  )}
                  <div className={`text-5xl font-bold text-${color} mb-2`}>{num}</div>
                  <div className="font-semibold text-white mb-1">{title}</div>
                  <div className="text-xs text-gray-500">
                    {num === 1 && 'Independence, Leadership'}
                    {num === 7 && 'Spirituality, Wisdom'}
                    {num === 3 && 'Expression, Joy'}
                    {num === 11 && 'Intuition, Enlightenment'}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-cosmic-dark/50 rounded-lg border border-cosmic-primary/20">
              <h4 className="font-bold text-cosmic-primary mb-2">7 Core Numbers Calculated:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>✓ Life Path Number - Your life's purpose</li>
                <li>✓ Expression Number - Your talents & destiny</li>
                <li>✓ Soul Urge Number - Your inner desires</li>
                <li>✓ Personality Number - How others see you</li>
                <li>✓ + 3 more powerful insights</li>
              </ul>
            </div>
          </div>

          {/* Right: Benefits & CTA */}
          <div>
            <Card className="bg-gradient-to-br from-cosmic-primary/10 to-cosmic-secondary/10 border-cosmic-primary">
              <div className="space-y-6">
                <div>
                  <div className="text-4xl mb-3">✨</div>
                  <h3 className="text-2xl font-bold mb-2">Free Instant Calculation</h3>
                  <p className="text-gray-400">
                    No signup required. Calculate all your numerology numbers in seconds.
                  </p>
                </div>

                <div>
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="text-2xl font-bold mb-2">AI-Powered Interpretations</h3>
                  <p className="text-gray-400">
                    Get personalized insights about your life purpose, talents, and destiny.
                  </p>
                </div>

                <div>
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="text-2xl font-bold mb-2">Master Numbers Detected</h3>
                  <p className="text-gray-400">
                    Automatically identifies powerful Master Numbers (11, 22, 33) with special significance.
                  </p>
                </div>

                <div className="pt-4">
                  <Link href="/numerology">
                    <Button size="lg" fullWidth className="mb-3">
                      Calculate Your Numbers Now
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-gray-500">
                    Free forever • Instant results • No email required
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-cosmic-primary mb-1">12</div>
            <div className="text-sm text-gray-400">Number Meanings</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-cosmic-secondary mb-1">7</div>
            <div className="text-sm text-gray-400">Core Numbers</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-cosmic-accent mb-1">3</div>
            <div className="text-sm text-gray-400">Master Numbers</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-cosmic-gold mb-1">∞</div>
            <div className="text-sm text-gray-400">Ancient Wisdom</div>
          </div>
        </div>
      </div>
    </section>
  )
}
