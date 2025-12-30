import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import HoroscopeSection from '@/components/horoscopes/HoroscopeSection'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Daily & Weekly Horoscopes | Zodiacly',
  description: 'Get your free daily and weekly horoscope powered by AI. Accurate astrological guidance for all 12 zodiac signs including love, career, health and money predictions.',
  keywords: 'horoscope, daily horoscope, weekly horoscope, zodiac, astrology, AI horoscope, free horoscope',
}

export default async function HoroscopesPage() {
  const session = await getSession()

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      <HoroscopeSection />

      {/* Additional Info Section */}
      <section className="py-16 bg-cosmic-surface/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">About Our Horoscopes</h2>
            <p className="text-gray-400 leading-relaxed">
              Our horoscopes are generated daily and weekly using advanced AI trained on traditional astrological wisdom.
              Each reading considers current planetary transits and cosmic energies to provide you with relevant,
              personalized guidance for your zodiac sign.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-6 rounded-lg bg-cosmic-dark border border-cosmic-primary/20">
              <h3 className="font-bold text-cosmic-primary mb-2">🌟 Daily Horoscopes</h3>
              <p className="text-gray-400">
                Updated every day with fresh insights covering love, career, health, and general guidance.
                Perfect for quick daily cosmic check-ins.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-cosmic-dark border border-cosmic-primary/20">
              <h3 className="font-bold text-cosmic-secondary mb-2">📅 Weekly Horoscopes</h3>
              <p className="text-gray-400">
                Updated every Monday with detailed forecasts for the week ahead.
                Includes extended guidance on money and finances.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-cosmic-dark border border-cosmic-primary/20">
              <h3 className="font-bold text-cosmic-accent mb-2">🤖 AI-Powered</h3>
              <p className="text-gray-400">
                Our horoscopes combine traditional astrological knowledge with modern AI technology
                for accurate, relevant predictions.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-cosmic-dark border border-cosmic-primary/20">
              <h3 className="font-bold text-cosmic-gold mb-2">✨ Free Forever</h3>
              <p className="text-gray-400">
                All horoscopes are completely free. No signup required.
                Want deeper insights? Create your full natal chart!
              </p>
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
