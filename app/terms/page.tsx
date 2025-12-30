import Link from 'next/link'
import { getSession } from '@/lib/auth/session'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'

export default async function TermsOfServicePage() {
  const session = await getSession()

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-gray-400">Last updated: December 26, 2025</p>
        </div>

        <Card className="prose prose-invert max-w-none">
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Zodiacly ("Service," "we," "our," or "us"), you accept and agree
                to be bound by these Terms of Service. If you do not agree to these terms, please do not
                use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p>
                Zodiacly provides AI-powered natal chart calculations and astrological interpretations.
                Our Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Natal chart calculation based on birth data</li>
                <li>2D chart visualization</li>
                <li>AI-generated astrological interpretations</li>
                <li>Chart storage and management (for registered users)</li>
                <li>Premium features (PRO subscription)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-white mb-3">3.1 Registration</h3>
              <p>
                To access certain features, you may need to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Be responsible for all activities under your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2 Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account if you violate these Terms
                or engage in fraudulent, abusive, or illegal activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Subscription Plans</h2>

              <h3 className="text-xl font-semibold text-white mb-3">4.1 Free Plan</h3>
              <p>The Free plan includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Instant chart creation (no registration required)</li>
                <li>Basic 2D visualization</li>
                <li>1 saved chart (with registration)</li>
                <li>1 AI interpretation per month (with registration)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2 PRO Plan</h3>
              <p>The PRO plan includes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unlimited natal charts</li>
                <li>100 AI interpretations per month</li>
                <li>Full planet, house, and aspect analysis</li>
                <li>Chart export features</li>
                <li>Priority support</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3 Pricing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>PRO Monthly: €11.99/month</li>
                <li>PRO Yearly: €119/year</li>
              </ul>
              <p className="mt-4">
                Prices are subject to change with 30 days' notice to existing subscribers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Payment Terms</h2>

              <h3 className="text-xl font-semibold text-white mb-3">5.1 Billing</h3>
              <p>
                Subscriptions are billed in advance on a monthly or yearly basis. All payments are
                processed securely through Stripe.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2 Auto-Renewal</h3>
              <p>
                Your subscription will automatically renew unless you cancel before the renewal date.
                You can cancel anytime through your account settings or the Stripe billing portal.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3 Refunds</h3>
              <p>
                We offer a 14-day money-back guarantee for new PRO subscriptions. Refunds for subsequent
                billing periods are handled on a case-by-case basis. Contact support for refund requests.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.4 Failed Payments</h3>
              <p>
                If a payment fails, we will attempt to charge your payment method again. If payment
                continues to fail, your account may be downgraded to the Free plan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Fair Use Policy</h2>
              <p>
                PRO plan AI interpretations are subject to fair use limits (100 per month). Excessive
                or abusive use may result in temporary restrictions or account suspension.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-white mb-3">7.1 Our Content</h3>
              <p>
                All content, features, and functionality of the Service are owned by Zodiacly and
                are protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.2 Your Data</h3>
              <p>
                You retain all rights to your birth data and personal information. By using our Service,
                you grant us a license to use this data to provide our services.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.3 AI-Generated Content</h3>
              <p>
                AI-generated interpretations are provided for personal use only. You may not redistribute,
                sell, or commercially exploit the interpretations without our permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer</h2>
              <p className="font-semibold">
                ASTROLOGICAL INTERPRETATIONS ARE FOR ENTERTAINMENT PURPOSES ONLY.
              </p>
              <p className="mt-4">
                The Service provides astrological information and interpretations that should not be
                considered as professional advice (medical, legal, financial, or otherwise). You should:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Not rely solely on astrological interpretations for important decisions</li>
                <li>Consult qualified professionals for specific advice</li>
                <li>Use the Service at your own discretion and risk</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZODIACLY SHALL NOT BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
              <p className="mt-4">
                Our total liability shall not exceed the amount you paid us in the 12 months preceding
                the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Prohibited Uses</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use automated tools to access the Service (bots, scrapers, etc.)</li>
                <li>Reverse engineer or copy our software</li>
                <li>Share your account with others</li>
                <li>Resell or redistribute our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Data Privacy</h2>
              <p>
                Your privacy is important to us. Please review our{' '}
                <Link href="/privacy" className="text-cosmic-primary hover:underline">
                  Privacy Policy
                </Link>{' '}
                to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of
                significant changes via email or through the Service. Continued use after changes
                constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the
                European Union and the country where Zodiacly is registered, without regard to conflict
                of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
              <p>For questions about these Terms, please contact us:</p>
              <ul className="list-none space-y-2 mt-4">
                <li>Email: <a href="mailto:legal@zodiacly.com" className="text-cosmic-primary hover:underline">legal@zodiacly.com</a></li>
                <li>Support: <a href="mailto:support@zodiacly.com" className="text-cosmic-primary hover:underline">support@zodiacly.com</a></li>
                <li>Contact Form: <Link href="/contact" className="text-cosmic-primary hover:underline">zodiacly.com/contact</Link></li>
              </ul>
            </section>

            <section className="border-t border-cosmic-primary/20 pt-6">
              <p className="text-sm text-gray-500">
                By using Zodiacly, you acknowledge that you have read, understood, and agree to be
                bound by these Terms of Service.
              </p>
            </section>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
