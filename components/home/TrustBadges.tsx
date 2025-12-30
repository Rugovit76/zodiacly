export default function TrustBadges() {
  const badges = [
    {
      icon: '🔒',
      title: 'Secure & Encrypted',
      description: '256-bit SSL encryption'
    },
    {
      icon: '🛡️',
      title: 'GDPR Compliant',
      description: 'Your data, your control'
    },
    {
      icon: '✉️',
      title: 'No Spam',
      description: 'We respect your inbox'
    },
    {
      icon: '💎',
      title: 'Premium Quality',
      description: 'Professional-grade astrology'
    },
    {
      icon: '🤖',
      title: 'AI-Powered',
      description: 'Advanced GPT-4 technology'
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'No waiting, just insights'
    }
  ]

  return (
    <section className="py-12 border-y border-cosmic-primary/10 bg-cosmic-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-cosmic-primary/5 transition-colors"
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="text-sm font-bold text-cosmic-primary mb-1">
                {badge.title}
              </div>
              <div className="text-xs text-gray-500">
                {badge.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
