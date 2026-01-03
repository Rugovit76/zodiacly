'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { SessionUser } from '@/types'

interface ContactFormProps {
  user: SessionUser | null
}

export default function ContactForm({ user }: ContactFormProps) {
  const [name, setName] = useState(user?.email.split('@')[0] || '')
  const [email, setEmail] = useState(user?.email || '')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission (in production, send to backend)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)

    // Reset form
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')

    // Hide success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-gray-400">We'd love to hear from you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Contact Information */}
        <Card>
          <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-cosmic-primary mb-2">📧 Email Support</h3>
              <p className="text-gray-400">For general inquiries:</p>
              <a href="mailto:support@zodiacly.online" className="text-white hover:text-cosmic-primary transition-colors">
                support@zodiacly.online
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-cosmic-secondary mb-2">🔒 Privacy & Legal</h3>
              <p className="text-gray-400">For privacy concerns:</p>
              <a href="mailto:privacy@zodiacly.online" className="text-white hover:text-cosmic-primary transition-colors">
                privacy@zodiacly.online
              </a>
              <p className="text-gray-400 mt-2">For legal matters:</p>
              <a href="mailto:legal@zodiacly.online" className="text-white hover:text-cosmic-primary transition-colors">
                legal@zodiacly.online
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-cosmic-accent mb-2">💳 Billing Support</h3>
              <p className="text-gray-400">For subscription & payment issues:</p>
              <a href="mailto:billing@zodiacly.online" className="text-white hover:text-cosmic-primary transition-colors">
                billing@zodiacly.online
              </a>
            </div>

            <div>
              <h3 className="font-semibold text-cosmic-gold mb-2">⏱️ Response Time</h3>
              <p className="text-gray-400">
                We typically respond within 24-48 hours during business days.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact Form */}
        <Card glow>
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

          {submitted && (
            <Alert type="success" className="mb-6">
              ✅ Message sent successfully! We'll get back to you soon.
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              label="Name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-cosmic-surface border-2 border-cosmic-primary/30 focus:border-cosmic-primary text-white focus:outline-none focus:ring-2 focus:ring-cosmic-primary/50 transition-all"
                required
              >
                <option value="">Select a subject...</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="privacy">Privacy Concern</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-cosmic-surface border-2 border-cosmic-primary/30 focus:border-cosmic-primary text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cosmic-primary/50 transition-all"
                placeholder="Tell us how we can help..."
                required
              />
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Send Message
            </Button>
          </form>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By submitting this form, you agree to our{' '}
            <Link href="/privacy" className="text-cosmic-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-cosmic-primary mb-2">
              How do I cancel my PRO subscription?
            </h3>
            <p className="text-gray-400">
              You can cancel anytime through your Dashboard → Manage Subscription, or via the
              Stripe billing portal. Your access continues until the end of your billing period.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cosmic-primary mb-2">
              Can I get a refund?
            </h3>
            <p className="text-gray-400">
              We offer a 14-day money-back guarantee for new PRO subscriptions. Contact us at{' '}
              <a href="mailto:billing@zodiacly.online" className="text-cosmic-primary hover:underline">
                billing@zodiacly.online
              </a>{' '}
              to request a refund.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cosmic-primary mb-2">
              How accurate are the natal charts?
            </h3>
            <p className="text-gray-400">
              Our calculations use precise astronomical algorithms. For maximum accuracy, ensure
              you enter your exact birth time and location. AI interpretations are generated
              based on traditional astrological principles.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cosmic-primary mb-2">
              Is my birth data private and secure?
            </h3>
            <p className="text-gray-400">
              Yes! Your birth data is encrypted and stored securely. We never share your personal
              information with third parties except as required to provide our services. See our{' '}
              <Link href="/privacy" className="text-cosmic-primary hover:underline">
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-cosmic-primary mb-2">
              Can I delete my account and data?
            </h3>
            <p className="text-gray-400">
              Yes, you can request account deletion at any time. Contact us at{' '}
              <a href="mailto:privacy@zodiacly.online" className="text-cosmic-primary hover:underline">
                privacy@zodiacly.online
              </a>
              . All your data will be permanently deleted within 30 days.
            </p>
          </div>
        </div>
      </Card>

      <div className="text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
