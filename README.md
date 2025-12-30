# Zodiacly - AI-Powered Astrology & Numerology Platform

> Comprehensive astrology and numerology SaaS platform with natal charts, compatibility analysis, numerology calculator, daily horoscopes, and AI-powered insights

## Overview

Zodiacly is a modern astrology and numerology application that combines astronomical precision with AI-powered interpretations. Users can generate natal charts instantly without registration, calculate numerology numbers, check compatibility with others, read daily horoscopes, explore educational blog content, and unlock deep insights through GPT-4o-mini powered analysis.

## Features

### Core Features
- **Instant Chart Creation** - Generate natal charts without registration
- **Numerology Calculator** - Calculate 7 core numerology numbers instantly
- **Compatibility Analysis** - Synastry chart comparison for relationships
- **Daily/Weekly Horoscopes** - AI-generated horoscopes for all zodiac signs
- **Educational Blog** - Astrology guides, tutorials, and insights
- **Precise Calculations** - Accurate planetary positions, houses, and aspects
- **AI Interpretations** - GPT-4o-mini powered astrological and numerological insights
- **Beautiful Visualizations** - 2D natal chart wheels with color-coded elements
- **Social Sharing** - Share charts publicly with unique links
- **Freemium Model** - Free instant access, PRO for advanced features

### FREE Plan
- Instant chart creation (no registration)
- Free numerology calculator (instant results)
- Full chart visualization
- All planetary positions and aspects
- Daily horoscopes for all zodiac signs
- Blog access
- Register to save charts and unlock AI readings

### PRO Plan (€11.99/month or €119/year)
- **Natal Charts**
  - Unlimited natal charts
  - 100 AI interpretations per month
  - Full planet-by-planet analysis
  - House and aspect interpretations
  - Save and manage all charts
  - Export to PNG/PDF
- **Numerology**
  - AI-powered numerology interpretations
  - Life Path, Expression, Soul Urge analysis
  - Personal Year forecasts
- **Compatibility**
  - Synastry chart analysis
  - AI-powered relationship insights
  - Planet-to-planet aspect interpretations
- **Horoscopes**
  - Daily AI horoscopes
  - Weekly AI horoscopes
  - Personalized for your sign
- **Additional Benefits**
  - Priority support
  - Early access to new features

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL** - Primary database (Neon)
- **Prisma ORM** - Type-safe database client
- **JWT** - Authentication with httpOnly cookies

### External Services
- **Stripe** - Payment processing and subscriptions
- **OpenAI GPT-4o-mini** - AI-powered interpretations (astrology, numerology, horoscopes, compatibility)
- **OpenStreetMap Nominatim** - Location search and geocoding

### DevOps
- **Vercel** - Hosting and deployment
- **GitHub** - Version control
- **ESLint** - Code linting

## Project Structure

```
zodiacly/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard
│   ├── auth/                     # Authentication pages
│   ├── blog/                     # Blog pages
│   │   └── [slug]/               # Individual blog posts
│   ├── chart/                    # Chart pages
│   │   └── [publicId]/           # Public shared charts
│   ├── compatibility/            # Compatibility calculator
│   ├── contact/                  # Contact page
│   ├── create-chart/             # Guest chart creation
│   ├── dashboard/                # User dashboard
│   ├── horoscopes/               # Daily/weekly horoscopes
│   ├── numerology/               # Numerology calculator
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── api/                      # API routes
│   │   ├── auth/                 # Auth endpoints
│   │   ├── charts/               # Chart CRUD & interpretations
│   │   │   ├── [id]/             # Chart operations
│   │   │   │   ├── share/        # Social sharing
│   │   │   │   └── interpret/    # AI interpretations
│   │   │   └── public/           # Public chart access
│   │   ├── compatibility/        # Compatibility analysis
│   │   ├── horoscopes/           # Horoscope generation
│   │   │   ├── daily/            # Daily horoscopes
│   │   │   └── weekly/           # Weekly horoscopes
│   │   ├── numerology/           # Numerology interpretations
│   │   │   └── interpret/        # AI numerology readings
│   │   ├── stripe/               # Stripe integration
│   │   └── webhooks/             # Stripe webhooks
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/                   # React components
│   ├── blog/                     # Blog components
│   ├── compatibility/            # Compatibility calculator UI
│   ├── home/                     # Homepage sections
│   │   ├── NumerologyShowcase.tsx
│   │   ├── StatsCounter.tsx
│   │   └── TrustBadges.tsx
│   ├── horoscopes/               # Horoscope components
│   ├── numerology/               # Numerology calculator UI
│   ├── testimonials/             # Testimonials section
│   ├── ui/                       # UI components (Card, Button, etc.)
│   └── Navbar.tsx                # Navigation
├── lib/                          # Utility libraries
│   ├── astrology/                # Chart calculations
│   │   ├── calculations.ts       # Ephemeris & house calculations
│   │   ├── compatibility.ts      # Synastry analysis
│   │   └── interpretations.ts    # Aspect meanings
│   ├── auth/                     # Authentication (JWT, session)
│   ├── numerology/               # Numerology system
│   │   └── calculations.ts       # Pythagorean numerology
│   ├── openai/                   # OpenAI integration
│   │   ├── client.ts             # OpenAI client setup
│   │   ├── interpretations.ts    # Chart interpretations
│   │   ├── numerology.ts         # Numerology readings
│   │   ├── horoscopes.ts         # Horoscope generation
│   │   └── compatibility.ts      # Compatibility analysis
│   └── stripe/                   # Stripe integration
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Seed data
├── public/                       # Static assets
│   └── blog/                     # Blog post images
├── types/                        # TypeScript types
├── NUMEROLOGY_README.md          # Numerology documentation
└── tailwind.config.ts            # Tailwind configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Stripe account (test mode for development)
- OpenAI API key

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/zodiacly"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."  # €11.99/month
STRIPE_PRICE_PRO_YEARLY="price_..."   # €119/year

# OpenAI
OPENAI_API_KEY="sk-..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd zodiacly
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
# Push schema to database
npx prisma db push

# Seed with test users
npx tsx prisma/seed.ts
```

4. **Run development server**
```bash
npm run dev
```

5. **Open the app**
```
http://localhost:3000
```

### Test Accounts

After running the seed script:

- **Admin**: admin@zodiacly.com / admin123
- **User**: user@zodiacly.com / user123

## Development

### Running Locally

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database operations
npx prisma studio          # Open Prisma Studio
npx prisma db push         # Sync schema
npx prisma generate        # Generate Prisma Client
```

### Database Management

```bash
# Open Prisma Studio (GUI)
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# View database schema
npx prisma db pull
```

### Stripe Webhook Testing

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret to .env
# STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Key Workflows

### Guest Chart Flow (No Registration)
1. User visits homepage
2. Clicks "Create Free Chart Now"
3. Enters birth data (date, time, location)
4. Sees instant chart visualization
5. Option to register and save chart

### Numerology Flow (No Registration)
1. User visits /numerology or clicks from homepage
2. Enters full name and birth date
3. Sees instant calculation of 7 core numbers
4. Can register for AI interpretation (PRO feature)

### Compatibility Flow
1. User navigates to /compatibility
2. Enters birth data for Person 1 and Person 2
3. Free users: See synastry chart visualization
4. PRO users: Click "Generate AI Reading" for full compatibility analysis
5. AI analyzes planet-to-planet aspects and relationship dynamics

### Horoscope Flow
1. User visits /horoscopes
2. Selects Daily or Weekly tab
3. Clicks their zodiac sign
4. Free users: Read AI-generated horoscope
5. PRO users: Get personalized horoscopes based on their chart

### Blog Flow
1. User browses blog from navigation or homepage
2. Clicks article of interest
3. Reads educational astrology content
4. Can navigate to related tools (charts, numerology, etc.)

### Registration Flow
1. User registers with email/password
2. Pending chart (if any) auto-saves to account
3. Redirected to dashboard
4. Can create 1 chart (FREE) or unlimited (PRO)

### Upgrade Flow
1. User clicks "Upgrade to PRO"
2. Redirected to Stripe Checkout
3. Completes payment (€11.99/month or €119/year)
4. Webhook upgrades account to PRO
5. Redirected back to dashboard

### AI Reading Flow (Charts)
1. User views saved chart
2. Clicks "Generate AI Reading"
3. System checks usage limits (100/month for PRO)
4. GPT-4o-mini generates interpretation
5. Reading saved to database
6. Usage counter incremented

### Social Sharing Flow
1. User creates and saves a chart
2. Clicks "Share" button on chart page
3. System generates unique public link
4. User shares link on social media
5. Anyone with link can view chart (no login required)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Charts
- `GET /api/charts` - List user's charts
- `POST /api/charts/create` - Create new chart
- `GET /api/charts/[id]` - Get chart details
- `DELETE /api/charts/[id]` - Delete chart
- `POST /api/charts/[id]/interpret` - Generate AI reading
- `POST /api/charts/[id]/share` - Generate public share link
- `GET /api/charts/public/[publicId]` - Get public chart (no auth)

### Compatibility
- `POST /api/compatibility/analyze` - Generate compatibility analysis (PRO)

### Numerology
- `POST /api/numerology/interpret` - Generate AI numerology reading (PRO)

### Horoscopes
- `GET /api/horoscopes/daily?sign=aries` - Get daily horoscope for sign
- `GET /api/horoscopes/weekly?sign=aries` - Get weekly horoscope for sign

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/portal` - Create billing portal session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - List all users

## Database Schema

### User
- Authentication (email, password)
- Plan (FREE/PRO)
- Stripe data (customer ID, subscription ID)
- Role (USER/ADMIN)
- Timestamps

### NatalChart
- Birth data (date, time, location, coordinates)
- Chart data (planets, houses, aspects)
- AI reading (optional)
- Public sharing (publicId for social sharing)
- User relationship
- Timestamps

### Horoscope
- Sign (aries, taurus, etc.)
- Type (daily, weekly)
- Content (AI-generated horoscope text)
- Date range (validFrom, validUntil)
- Timestamps

### BlogPost
- Title, slug, excerpt
- Content (markdown)
- Author, category, tags
- Featured image
- Published status
- SEO metadata
- Timestamps

### Usage
- Monthly AI call tracking
- Limit enforcement (100/month for PRO)
- Reset date
- User relationship

### WebhookEvent
- Stripe webhook logging
- Idempotency handling
- Event type and data

## Deployment

### Vercel Deployment

1. **Connect GitHub repository**
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Automatic on push to main branch

### Database Setup

Use Neon PostgreSQL for production:
1. Create Neon project
2. Copy connection string
3. Add to Vercel environment variables
4. Run `npx prisma db push` from local

### Stripe Configuration

1. Set up production Stripe account
2. Create products and prices:
   - PRO Monthly: €11.99/month
   - PRO Yearly: €119/year (save €24)
3. Update environment variables with price IDs
4. Configure webhook endpoint in Stripe dashboard
5. Test checkout and subscription flows

## Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - httpOnly cookies, short expiration
- **CSRF Protection** - SameSite cookie attribute
- **SQL Injection** - Prisma parameterized queries
- **XSS Protection** - React automatic escaping
- **Rate Limiting** - Usage tracking per user
- **HTTPS Only** - Production SSL enforcement

## Privacy & Compliance

- **GDPR Compliant** - User data rights, deletion, export
- **Data Encryption** - SSL/TLS, encrypted passwords
- **Privacy Policy** - Comprehensive privacy documentation
- **Terms of Service** - Clear legal terms
- **Cookie Policy** - Essential cookies only

## Performance

- **Server-Side Rendering** - Fast initial page loads
- **Static Generation** - Pre-rendered pages where possible
- **API Routes** - Serverless edge functions
- **Database Indexing** - Optimized queries
- **Code Splitting** - Automatic by Next.js

## Monitoring & Analytics

- **Error Logging** - Console error tracking
- **Webhook Events** - Database logging
- **Usage Tracking** - Per-user AI call monitoring
- **Performance** - Vercel Analytics

## Support & Contact

- **Email**: support@zodiacly.com
- **Privacy**: privacy@zodiacly.com
- **Legal**: legal@zodiacly.com
- **Billing**: billing@zodiacly.com

## License

All rights reserved © 2025 Zodiacly

## Feature Highlights

### 🔮 Natal Chart System
- Instant chart creation without registration
- Precise astronomical calculations using Swiss Ephemeris
- Beautiful 2D chart visualizations
- AI-powered interpretations for planets, houses, and aspects
- Social sharing with public links
- Unlimited charts for PRO users

### 🔢 Numerology Calculator
- 7 core numbers: Life Path, Expression, Soul Urge, Personality, Birthday, Maturity, Personal Year
- Pythagorean numerology system
- Master Numbers detection (11, 22, 33)
- AI-powered detailed readings (PRO)
- Free instant calculations for everyone

### 💑 Compatibility Analysis
- Synastry chart comparison
- Planet-to-planet aspect analysis
- AI-generated relationship insights (PRO)
- Visual compatibility chart
- Save and compare multiple relationships

### 📅 Daily & Weekly Horoscopes
- AI-generated horoscopes for all 12 zodiac signs
- Daily and weekly predictions
- Free access for all users
- Personalized readings for PRO users
- Cached for performance

### 📚 Educational Blog
- Astrology guides and tutorials
- Numerology explanations
- Chart interpretation tips
- SEO-optimized content
- Beautiful markdown formatting

### 💎 PRO Features
- Unlimited natal charts
- 100 AI interpretations per month
- Full compatibility analysis
- Detailed numerology readings
- Personalized horoscopes
- Export to PNG/PDF
- Priority support

## Contributing

This is a private project. For issues or feature requests, please contact the development team.

## Changelog

### v2.0.0 (2025-12-28)
- **Major Feature Additions**
  - Numerology Calculator with 7 core numbers
  - Compatibility/Synastry Analysis
  - Daily & Weekly AI Horoscopes
  - Educational Blog System
  - Social Sharing with Public Chart Links
  - Homepage Numerology Showcase
- **UI/UX Enhancements**
  - Trust Badges section
  - Stats Counter
  - Testimonials section
  - Improved navigation with more features
- **Pricing Update**
  - Updated PRO plan: €11.99/month (was €6.99)
  - Updated PRO yearly: €119/year (was €69)
- **AI Features**
  - GPT-4o-mini for all interpretations
  - Parallel AI generation for faster responses
  - Numerology interpretations (PRO)
  - Compatibility readings (PRO)
  - Daily/Weekly horoscope generation
- **Database Updates**
  - Horoscope table for caching
  - BlogPost table for content
  - NatalChart publicId for sharing
- **Developer Experience**
  - Comprehensive documentation (NUMEROLOGY_README.md)
  - Improved project structure
  - Better code organization

### v1.0.0 (2025-12-26)
- Initial release
- Guest chart creation
- User authentication
- PRO subscriptions
- AI interpretations
- Admin dashboard
- Legal pages
