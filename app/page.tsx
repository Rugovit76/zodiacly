import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import Navbar from '@/components/Navbar'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import TestimonialsSection from '@/components/testimonials/TestimonialsSection'
import StatsCounter from '@/components/home/StatsCounter'
import TrustBadges from '@/components/home/TrustBadges'
import HoroscopeSection from '@/components/horoscopes/HoroscopeSection'
import NumerologyShowcase from '@/components/home/NumerologyShowcase'

export default async function Home() {
  const session = await getSession()

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cosmic-primary via-cosmic-secondary to-cosmic-accent bg-clip-text text-transparent">
              Unlock Your Cosmic Blueprint
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              AI-powered natal chart analysis that reveals your personality,
              strengths, and life path through the wisdom of astrology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={session ? '/dashboard' : '/create-chart'}>
                <Button size="lg">
                  {session ? 'Go to Dashboard' : 'Create Free Chart Now'}
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No registration required • Instant results • 100% Free
            </p>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Features Section */}
      <section id="features" className="py-20 bg-cosmic-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400">Everything you need to explore your cosmic potential</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover>
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-bold mb-2">Precise Calculations</h3>
              <p className="text-gray-400">
                Accurate planetary positions, houses, and aspects based on your exact birth time and location
              </p>
            </Card>

            <Card hover>
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI Interpretations</h3>
              <p className="text-gray-400">
                Professional-grade astrological insights powered by advanced AI trained on astrological wisdom
              </p>
            </Card>

            <Card hover>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Beautiful Visualizations</h3>
              <p className="text-gray-400">
                Stunning 2D natal chart wheels with color-coded signs, planets, and aspects
              </p>
            </Card>

            <Card hover>
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-xl font-bold mb-2">Save & Manage</h3>
              <p className="text-gray-400">
                Create unlimited charts (PRO), save interpretations, and track your cosmic journey
              </p>
            </Card>

            <Card hover>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-gray-400">
                Your birth data is encrypted and protected. GDPR compliant with full data control
              </p>
            </Card>

            <Card hover>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-400">
                Instant chart calculations and AI readings. No waiting, just cosmic insights
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Horoscope Section */}
      <HoroscopeSection />

      {/* Numerology Section */}
      <NumerologyShowcase />

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400">Choose the plan that's right for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">Free</h3>
                <span className="px-3 py-1 bg-green-600 rounded-full text-xs font-bold">
                  NO SIGNUP
                </span>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold">€0</span>
                <span className="text-gray-400">/forever</span>
              </div>
              <p className="text-sm text-green-400 mb-6">
                Create charts instantly - no registration!
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="font-semibold">Instant chart creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Beautiful 2D visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>All planetary positions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cosmic-primary mt-1">→</span>
                  <span className="text-gray-400">Register to save & get AI readings</span>
                </li>
              </ul>
              <Link href="/create-chart">
                <Button variant="outline" fullWidth size="lg">
                  Create Chart Now
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-3 text-center">
                No email required • See results in seconds
              </p>
            </Card>

            {/* PRO Plan */}
            <Card glow className="border-2 border-cosmic-primary">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">PRO</h3>
                <span className="px-3 py-1 bg-cosmic-primary rounded-full text-xs font-bold">
                  POPULAR
                </span>
              </div>
              <div className="mb-2">
                <span className="text-4xl font-bold">€11.99</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-sm text-cosmic-accent mb-6">
                or €119/year (save €24!)
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="font-semibold">Unlimited natal charts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="font-semibold">100 AI readings/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Full planet-by-planet analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>House & aspect interpretations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Save & manage all charts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Export to PNG/PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="font-semibold">Synastry compatibility analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span className="font-semibold">Daily & weekly AI horoscopes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <Link href="/auth/register">
                <Button fullWidth size="lg">
                  Upgrade to PRO
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cosmic-primary/10 to-cosmic-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Discover Your Cosmic Path?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands exploring their astrological blueprint with AI-powered insights
          </p>
          <Link href="/create-chart">
            <Button size="lg">
              Create Your Free Chart Now
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            No registration required • See results instantly
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cosmic-primary/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2025 Zodiacly. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-6">
              <Link href="/privacy" className="hover:text-cosmic-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-cosmic-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-cosmic-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
