// User testimonials and reviews

export interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  text: string
  plan: 'FREE' | 'PRO'
  date: string
  verified: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    location: 'Los Angeles, CA',
    avatar: '👩🏽',
    rating: 5,
    text: 'The AI interpretation blew my mind! It explained aspects of my personality I never understood. The compatibility feature helped me understand my relationship dynamics better.',
    plan: 'PRO',
    date: '2025-01-20',
    verified: true
  },
  {
    id: '2',
    name: 'James Chen',
    location: 'New York, NY',
    avatar: '👨🏻',
    rating: 5,
    text: 'Best natal chart app I\'ve used. The chart visualization is beautiful and the export to PDF feature is perfect for keeping records. Worth every penny of the PRO plan!',
    plan: 'PRO',
    date: '2025-01-18',
    verified: true
  },
  {
    id: '3',
    name: 'Emma Thompson',
    location: 'London, UK',
    avatar: '👩🏼',
    rating: 5,
    text: 'Finally, an astrology app that doesn\'t require 20 taps to get to the good stuff. Created my chart in literally 30 seconds. The AI reading was surprisingly accurate!',
    plan: 'FREE',
    date: '2025-01-15',
    verified: true
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    location: 'Miami, FL',
    avatar: '👨🏽',
    rating: 5,
    text: 'The synastry compatibility feature is incredible. Helped me understand why my partner and I clash in certain areas and where we naturally harmonize. Game changer!',
    plan: 'PRO',
    date: '2025-01-12',
    verified: true
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    location: 'Toronto, Canada',
    avatar: '👩🏻',
    rating: 5,
    text: 'I\'ve been studying astrology for 5 years and this is the most accurate natal chart calculator I\'ve found. The house system is spot on and the aspects are clearly explained.',
    plan: 'PRO',
    date: '2025-01-10',
    verified: true
  },
  {
    id: '6',
    name: 'David Kim',
    location: 'Seoul, South Korea',
    avatar: '👨🏻',
    rating: 5,
    text: 'Love that I could create a chart without signing up first. The free version gave me enough to get hooked, and the PRO upgrade was a no-brainer. Great pricing!',
    plan: 'PRO',
    date: '2025-01-08',
    verified: true
  },
  {
    id: '7',
    name: 'Sophie Dubois',
    location: 'Paris, France',
    avatar: '👩🏼',
    rating: 5,
    text: 'The public sharing feature is genius! I shared my chart with friends and 3 of them signed up. We\'re all comparing our charts now. So much fun!',
    plan: 'FREE',
    date: '2025-01-05',
    verified: true
  },
  {
    id: '8',
    name: 'Marcus Johnson',
    location: 'Chicago, IL',
    avatar: '👨🏿',
    rating: 5,
    text: 'The AI interpretations are next-level. It\'s like having a personal astrologer. The planet analysis section helped me understand my Mars in 10th house placement perfectly.',
    plan: 'PRO',
    date: '2025-01-03',
    verified: true
  },
  {
    id: '9',
    name: 'Anna Kowalski',
    location: 'Warsaw, Poland',
    avatar: '👩🏼',
    rating: 5,
    text: 'Clean, modern interface that actually works. No ads, no annoying popups. Just pure astrology goodness. The blog articles are super helpful for beginners too!',
    plan: 'FREE',
    date: '2024-12-28',
    verified: true
  }
]

export function getRandomTestimonials(count: number = 3): Testimonial[] {
  const shuffled = [...testimonials].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export function getProTestimonials(): Testimonial[] {
  return testimonials.filter(t => t.plan === 'PRO')
}

export function getAverageRating(): number {
  const sum = testimonials.reduce((acc, t) => acc + t.rating, 0)
  return sum / testimonials.length
}

export function getTotalReviews(): number {
  return testimonials.length
}
