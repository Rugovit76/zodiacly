'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { testimonials, getAverageRating, getTotalReviews } from '@/lib/testimonials/data'

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const averageRating = getAverageRating()
  const totalReviews = getTotalReviews()

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-cosmic-dark to-cosmic-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by Thousands ✨
          </h2>
          <p className="text-xl text-gray-400 mb-6">
            See what our users are saying about their cosmic journey
          </p>

          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-2xl text-cosmic-gold">⭐</span>
                ))}
              </div>
              <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
            </div>
            <div className="text-gray-400">
              <span className="font-bold text-white">{totalReviews}</span> reviews
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {visibleTestimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className={`transition-all duration-500 ${
                index === 1 ? 'md:scale-105 border-cosmic-primary' : 'opacity-90'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {testimonial.name}
                      {testimonial.verified && (
                        <span className="text-sm" title="Verified User">✓</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-400">{testimonial.location}</div>
                  </div>
                </div>
                <Badge variant={testimonial.plan === 'PRO' ? 'pro' : 'free'}>
                  {testimonial.plan}
                </Badge>
              </div>

              {/* Rating */}
              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-cosmic-gold">⭐</span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-300 leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              {/* Date */}
              <div className="text-xs text-gray-500">
                {new Date(testimonial.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </Card>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-cosmic-primary w-8'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-4xl mb-2">🔒</div>
            <div className="font-bold text-cosmic-primary">Secure</div>
            <div className="text-sm text-gray-400">256-bit Encryption</div>
          </div>
          <div>
            <div className="text-4xl mb-2">⚡</div>
            <div className="font-bold text-cosmic-primary">Fast</div>
            <div className="text-sm text-gray-400">Instant Results</div>
          </div>
          <div>
            <div className="text-4xl mb-2">🎯</div>
            <div className="font-bold text-cosmic-primary">Accurate</div>
            <div className="text-sm text-gray-400">Swiss Ephemeris</div>
          </div>
          <div>
            <div className="text-4xl mb-2">💎</div>
            <div className="font-bold text-cosmic-primary">Premium</div>
            <div className="text-sm text-gray-400">AI-Powered</div>
          </div>
        </div>
      </div>
    </section>
  )
}
