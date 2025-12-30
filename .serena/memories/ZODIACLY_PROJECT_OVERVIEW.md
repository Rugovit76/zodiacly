# ZODIACLY - AI Astrology SaaS Platform

## 🎯 PROJECT OVERVIEW

**Name:** Zodiacly – AI Natal Chart Intelligence Platform  
**Type:** Production-ready astrology SaaS with subscription model  
**Status:** Phase 1 (Viral Social Features) - 80% Complete  
**Last Updated:** December 26, 2025

## 💰 BUSINESS MODEL

### Freemium + PRO Subscription

**FREE Plan:**
- 1 natal chart only
- Basic 2D visualization
- Short AI summary
- No saving/export
- Watermarked charts
- 1 AI reading/day limit

**PRO Plan (€6.99/month or €69/year):**
- Unlimited natal charts
- Full AI interpretations (personality, planets, houses, aspects)
- Advanced visualization (zoom, animations, optional 3D)
- Save & manage chart history
- Export (PNG, PDF)
- Priority AI processing
- 100 AI readings/month (fair use)

### Competitive Advantage
- ✅ Instant guest access (only one without signup)
- ✅ Lowest price (€6.99 vs €9.99-14.99)
- ✅ AI-powered (GPT-4 - competitors don't have)
- ✅ Modern cosmic UI (younger audience 18-35)
- ✅ Multi-platform ready (Web + iOS + Android)

## 🛠️ TECH STACK

**Frontend:**
- Next.js 14 (App Router)
- React, TypeScript
- TailwindCSS (cosmic theme)
- SVG/Canvas for 2D charts
- Three.js for optional 3D

**Backend:**
- Next.js API Routes
- Stripe SDK (subscriptions)
- OpenAI API (GPT-4 interpretations)
- JWT authentication (httpOnly cookies)

**Database:**
- PostgreSQL
- Prisma ORM

**External Services:**
- OpenStreetMap (location search)
- Stripe (payments)
- OpenAI (AI interpretations)

## 📊 DATABASE SCHEMA

### User
- id, email, passwordHash
- role (USER | ADMIN)
- plan (FREE | PRO)
- stripeCustomerId, stripeSubscriptionId, subscriptionStatus
- createdAt

### NatalChart
- id, userId
- birthDate, birthTime, latitude, longitude, timezone, location
- chartData (JSON - planets, houses, aspects)
- aiReading (JSON - AI interpretation)
- **publicId** (for sharing - e.g., "abc123xyz")
- **isPublic** (boolean)
- **shareCount**, **viewCount** (for viral tracking)
- createdAt

### Usage
- userId (1-to-1 with User)
- aiCallsThisMonth (tracking for limits)
- lastResetAt (monthly reset)

### WebhookEvent
- id, type, payload, processed, createdAt

## ✅ IMPLEMENTED FEATURES

### 1. Complete Documentation (100%)
- README.md - Setup & overview
- ARCHITECTURE.md - Technical architecture
- API.md - Complete API reference (600+ lines)
- DEPLOYMENT.md - Production deployment guide
- DEVELOPMENT.md - Development workflow
- STRATEGY.md - Competitive strategy & growth
- QUICK_START.md - Quick setup guide (in Croatian)

### 2. Public Chart Sharing (100%)
- Short unique URLs: `zodiacly.com/chart/abc123xyz`
- Social share buttons (WhatsApp, Facebook, Twitter, Telegram)
- View counter & share counter
- Privacy controls (public/private toggle)
- Copy to clipboard
- 3x "Create Your Chart" CTAs per public page
- Social proof ("10,000+ charts created")

**API Endpoints:**
- `POST /api/charts/[id]/share` - Make chart public/private
- `GET /api/charts/public/[publicId]` - View public chart

**Components:**
- `ShareButton.tsx` - Reusable share component with modal
- `/chart/[publicId]/page.tsx` - Public chart viewing page

### 3. Compatibility Calculator Engine (80%)
- `/lib/astrology/compatibility.ts` - Synastry calculation
- Planet-to-planet aspects (conjunction, trine, square, etc.)
- Sign compatibility scoring
- Element balance analysis
- Overall compatibility score (0-100)
- Strengths & challenges identification
- `POST /api/compatibility` - API endpoint

**Missing:** Compatibility page UI

## 🚧 PENDING TASKS (Prioritized)

### HIGH PRIORITY (This Week)
1. **Finish Compatibility Page UI** (2-3 days)
   - Create `/app/compatibility/page.tsx`
   - Chart selector interface
   - Results visualization
   - Viral share buttons for compatibility results
   - "Invite friend to compare" feature

2. **Add to Dashboard** (1 day)
   - "Compare with friend" button on each chart
   - Redirect to compatibility page

3. **Test & Deploy Sharing** (1 day)
   - Test public chart links
   - Test social sharing
   - Deploy to production
   - Monitor sharing metrics

### MEDIUM PRIORITY (Next 2 Weeks)
4. **OG Image Generator** (2-3 days)
   - `/api/og` endpoint
   - Dynamic chart images for social media
   - Beautiful preview cards

5. **Blog Infrastructure** (3-4 days)
   - `/app/blog/` setup
   - MDX support
   - SEO optimization
   - Schema markup

6. **Initial SEO Content** (1 week)
   - 10 core articles (natal chart guides, sign meanings, compatibility)
   - Keyword optimization
   - Internal linking

### LOW PRIORITY (Month 2-3)
7. **Mobile App** (4-6 weeks) - React Native
8. **Daily Horoscope** (2 weeks) - Transit calculations + push notifications
9. **Additional Pricing Tiers** (1 week) - STARTER (€2.99), PREMIUM (€19.99)

## 📁 PROJECT STRUCTURE

```
zodiacly/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── stripe/       # Stripe webhooks & checkout
│   │   ├── charts/       # Chart CRUD operations
│   │   ├── compatibility/ # Compatibility API
│   │   └── admin/        # Admin endpoints
│   ├── auth/             # Auth pages (login, register)
│   ├── dashboard/        # User dashboard
│   ├── admin/            # Admin dashboard
│   ├── chart/[publicId]/ # Public chart viewing
│   ├── compatibility/    # Compatibility page (TO BUILD)
│   └── page.tsx          # Home page
│
├── components/
│   ├── ui/               # Reusable UI components
│   ├── charts/           # Chart visualization
│   └── sharing/          # ShareButton, social components
│
├── lib/
│   ├── auth/             # JWT, session, password hashing
│   ├── stripe/           # Stripe client, checkout, webhooks
│   ├── openai/           # OpenAI client, interpretations
│   ├── astrology/        # Calculator, compatibility engine
│   ├── usage/            # AI usage tracking
│   └── db/               # Prisma client
│
├── prisma/
│   └── schema.prisma     # Database schema
│
└── types/
    └── index.ts          # TypeScript definitions
```

## 🔑 KEY API ROUTES

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Charts
- `POST /api/charts/create` - Calculate & save natal chart
- `GET /api/charts` - List user's charts
- `GET /api/charts/[id]` - Get specific chart
- `DELETE /api/charts/[id]` - Delete chart
- `POST /api/charts/[id]/interpret` - Generate AI reading
- `POST /api/charts/[id]/share` - Make public/private
- `GET /api/charts/public/[publicId]` - View public chart

### Compatibility
- `POST /api/compatibility` - Calculate compatibility

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/portal` - Billing portal
- `POST /api/stripe/webhooks` - Handle Stripe events

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - Platform statistics (MRR, users)
- `POST /api/admin/users/[id]/plan` - Manually change user plan
- `GET /api/admin/usage` - View AI usage

## 📈 GROWTH STRATEGY

### Viral Features (Pattern-style growth)
- Public chart sharing → organic reach
- Compatibility calculator → "tag a friend" dynamics
- OG images → beautiful social previews
- Expected: 300-500% increase in signups

### SEO Strategy
- Target: "natal chart calculator" (22k searches/month)
- 50 blog posts → 10-50k monthly visitors
- WordPress plugin → massive distribution

### Expected Growth

**Conservative (with current features):**
- 50-100 daily signups
- €1,400 - €2,800 MRR

**With Compatibility Feature:**
- 150-250 daily signups
- €4,200 - €7,000 MRR

**Optimistic (Pattern-style):**
- 500-1,000 daily signups
- €14,000 - €28,000 MRR

*Note: Pattern got 10M users in 18 months with same strategy*

## 🚀 QUICK COMMANDS

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Build for production
npm start               # Start production server
```

### Database
```bash
npx prisma studio        # Visual database editor (localhost:5555)
npx prisma migrate dev   # Create new migration
npx prisma generate      # Regenerate Prisma Client
npx prisma db push       # Push schema without migration
```

### Setup (First Time)
```bash
# 1. Install dependencies
npm install

# 2. Setup .env file with:
# - DATABASE_URL (PostgreSQL connection)
# - JWT_SECRET
# - OPENAI_API_KEY
# - STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
# - STRIPE_PRICE_PRO_MONTHLY, STRIPE_PRICE_PRO_YEARLY

# 3. Run database migrations
npx prisma migrate dev --name init
npx prisma generate

# 4. Start dev server
npm run dev
```

### Creating Admin User
1. Register at `/auth/register`
2. Open Prisma Studio: `npx prisma studio`
3. Edit User → Change `role` from `USER` to `ADMIN`
4. Refresh page → Admin dashboard accessible

## 🎯 SUCCESS METRICS TO TRACK

### User Acquisition
- Daily signups
- Viral coefficient (K-factor)
- Share-to-signup conversion rate
- Public chart views

### Engagement
- Charts created per user
- Compatibility checks per day
- Share rate (% users who share)
- Return visit rate

### Monetization
- Free → PRO conversion rate
- MRR growth
- Churn rate
- LTV per user

## 💡 IMMEDIATE QUICK WINS

1. **Add "Share" button to dashboard** (30 min)
2. **Homepage CTA update** (15 min) - Add "See example chart" link
3. **Social proof** (30 min) - Display "Join 1,000+ users..."

## 🔐 SECURITY FEATURES

### Implemented
- Password hashing (bcrypt)
- JWT with httpOnly cookies
- Stripe webhook signature verification
- Server-side session validation
- Role-based access control (USER/ADMIN)
- Plan-based feature gating (FREE/PRO)

### To Implement
- API rate limiting
- Input validation with Zod
- CSRF protection
- GDPR compliance (data deletion endpoint)
- Abuse prevention for sharing

## 📦 INSTALLED PACKAGES

```json
{
  "next": "14.x",
  "react": "18.x",
  "typescript": "5.x",
  "@prisma/client": "latest",
  "prisma": "latest",
  "stripe": "latest",
  "openai": "latest",
  "bcryptjs": "latest",
  "jsonwebtoken": "latest",
  "nanoid": "^5.0.7"  // For short public IDs
}
```

## 🌍 LANGUAGES

- Code: English
- Documentation: Mixed (English + Croatian)
- User messages: Croatian (from user "Vale")

## 📍 CURRENT FOCUS

**Phase 1: Viral Social Features (80% Complete)**
- ✅ Public chart sharing
- ✅ Share buttons & social integration
- ✅ Compatibility calculation engine
- 🚧 Compatibility page UI (NEXT TASK)
- ❌ OG image generator

**Target:** 1,000 users, 50 paying (€350 MRR)
