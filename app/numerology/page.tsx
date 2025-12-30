import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import NumerologyCalculator from '@/components/numerology/NumerologyCalculator'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Free Numerology Calculator | Life Path Number & More | Zodiacly',
  description: 'Calculate your Life Path Number, Expression Number, Soul Urge, and more with our free AI-powered numerology calculator. Discover your life purpose and destiny through numbers.',
  keywords: 'numerology calculator, life path number, expression number, soul urge number, personality number, numerology reading, free numerology',
}

export default async function NumerologyPage() {
  const session = await getSession()

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-cosmic-dark to-cosmic-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cosmic-primary via-cosmic-secondary to-cosmic-accent bg-clip-text text-transparent">
            Numerology Calculator
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
            Discover your life purpose, talents, and destiny through the ancient wisdom of numbers
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Calculate your Life Path Number, Expression Number, Soul Urge Number, and more instantly
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <NumerologyCalculator user={session} />
        </div>
      </section>

      {/* What is Numerology Section */}
      <section className="py-16 bg-cosmic-surface/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">What is Numerology?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-lg bg-cosmic-dark border border-cosmic-primary/20">
              <div className="text-4xl mb-3">🔢</div>
              <h3 className="font-bold text-cosmic-primary mb-2">Ancient Wisdom</h3>
              <p className="text-gray-400 text-sm">
                Numerology is the study of numbers and their mystical significance. Dating back to ancient
                civilizations, it reveals patterns and meanings in your life through numbers.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-cosmic-dark border border-cosmic-primary/20">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-cosmic-secondary mb-2">Life Path Insights</h3>
              <p className="text-gray-400 text-sm">
                Your Life Path Number is the most important number in numerology, revealing your life's
                purpose, natural talents, and the challenges you'll face.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-cosmic-dark border border-cosmic-primary/20">
              <div className="text-4xl mb-3">💎</div>
              <h3 className="font-bold text-cosmic-accent mb-2">Master Numbers</h3>
              <p className="text-gray-400 text-sm">
                Numbers 11, 22, and 33 are Master Numbers with powerful spiritual significance and
                greater potential than other numbers.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-cosmic-dark border border-cosmic-primary/20">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-cosmic-gold mb-2">Personal Guidance</h3>
              <p className="text-gray-400 text-sm">
                Each number in your profile reveals different aspects: your outer personality, inner
                desires, natural talents, and yearly themes.
              </p>
            </div>
          </div>

          {/* Number Meanings Quick Reference */}
          <div className="bg-cosmic-dark rounded-lg p-6 border border-cosmic-primary/20">
            <h3 className="text-xl font-bold mb-4 text-center">Quick Number Meanings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
              {[
                { num: 1, meaning: 'Leader' },
                { num: 2, meaning: 'Peacemaker' },
                { num: 3, meaning: 'Creative' },
                { num: 4, meaning: 'Builder' },
                { num: 5, meaning: 'Freedom' },
                { num: 6, meaning: 'Nurturer' },
                { num: 7, meaning: 'Seeker' },
                { num: 8, meaning: 'Power' },
                { num: 9, meaning: 'Humanitarian' },
                { num: 11, meaning: 'Intuitive' },
                { num: 22, meaning: 'Master Builder' },
                { num: 33, meaning: 'Master Teacher' }
              ].map(({ num, meaning }) => (
                <div key={num} className="text-center">
                  <div className="text-2xl font-bold text-cosmic-primary mb-1">{num}</div>
                  <div className="text-xs text-gray-400">{meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cosmic-primary/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 Zodiacly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
