# Zodiacly - System Architecture

## Overview
Zodiacly is a production-ready AI-powered astrology SaaS platform built with Next.js 14 (App Router), TypeScript, PostgreSQL, Stripe, and OpenAI.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with httpOnly cookies
- **Payments**: Stripe Subscriptions
- **AI**: OpenAI GPT-4
- **Styling**: TailwindCSS with cosmic theme

## Project Structure

```
zodiacly/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── stripe/          # Stripe webhooks & checkout
│   │   ├── charts/          # Chart CRUD operations
│   │   └── admin/           # Admin endpoints
│   ├── auth/                # Auth pages (login, register)
│   ├── dashboard/           # User dashboard
│   ├── admin/               # Admin dashboard
│   ├── chart/               # Chart viewing pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
│
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── charts/              # Chart visualization components
│   └── auth/                # Auth-related components
│
├── lib/                     # Core business logic
│   ├── auth/                # Authentication utilities
│   │   ├── jwt.ts          # JWT token creation/verification
│   │   ├── session.ts      # Session management
│   │   └── password.ts     # Password hashing
│   ├── stripe/              # Stripe integration
│   │   ├── client.ts       # Stripe client initialization
│   │   ├── checkout.ts     # Checkout session creation
│   │   └── webhooks.ts     # Webhook handlers
│   ├── openai/              # OpenAI integration
│   │   ├── client.ts       # OpenAI client
│   │   └── interpretations.ts  # AI reading generation
│   ├── astrology/           # Natal chart calculations
│   │   └── calculator.ts   # Chart calculation engine
│   ├── usage/               # AI usage tracking
│   │   └── tracker.ts      # Usage limits & tracking
│   └── db/                  # Database
│       └── prisma.ts       # Prisma client singleton
│
├── types/                   # TypeScript type definitions
│   └── index.ts            # All type definitions
│
├── prisma/                  # Prisma schema & migrations
│   └── schema.prisma       # Database schema
│
├── .env.example            # Environment variables template
└── prd.md                  # Product Requirements Document
```

## Database Schema

### User
- **id**: Unique identifier (CUID)
- **email**: Unique email address
- **passwordHash**: Bcrypt hashed password
- **role**: USER | ADMIN
- **plan**: FREE | PRO
- **stripeCustomerId**: Stripe customer ID
- **stripeSubscriptionId**: Stripe subscription ID
- **subscriptionStatus**: ACTIVE | CANCELED | PAST_DUE | etc.
- **createdAt**: Account creation timestamp

### NatalChart
- **id**: Unique identifier
- **userId**: Reference to User
- **birthDate**: Date of birth
- **birthTime**: Time of birth (HH:MM)
- **latitude/longitude**: Birth location coordinates
- **timezone**: Birth timezone
- **location**: Location name
- **chartData**: JSON (planets, houses, aspects)
- **aiReading**: JSON (AI interpretation)
- **createdAt**: Chart creation timestamp

### Usage
- **id**: Unique identifier
- **userId**: Reference to User (1-to-1)
- **aiCallsThisMonth**: Current month's AI call count
- **lastResetAt**: Last monthly reset date

### WebhookEvent
- **id**: Unique identifier
- **type**: Webhook event type
- **payload**: Event payload (JSON)
- **processed**: Processing status
- **createdAt**: Event timestamp

## Business Logic

### Authentication Flow
1. User registers with email/password
2. Password is hashed with bcrypt (10 rounds)
3. JWT token created with user session data
4. Token stored in httpOnly cookie (7 day expiry)
5. Protected routes verify token via middleware

### Subscription Flow
1. FREE user clicks "Upgrade to PRO"
2. Backend creates Stripe Checkout Session
3. User completes payment on Stripe
4. Stripe sends `checkout.session.completed` webhook
5. Backend updates user plan to PRO
6. PRO features unlocked immediately

### Chart Creation Flow
1. User enters birth data (date, time, location)
2. Backend calculates natal chart positions
3. Chart stored in database
4. If AI reading requested:
   - Check usage limits (FREE: 1/month, PRO: 100/month)
   - Call OpenAI API for interpretation
   - Increment usage counter
   - Store AI reading with chart

### AI Usage Limiting
- **FREE Plan**: 1 AI call per month
- **PRO Plan**: 100 AI calls per month
- Usage resets on 1st of each month
- Soft limits with clear error messages
- Admin can adjust limits via env variables

## API Routes

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user session

### Charts
- `POST /api/charts/create` - Calculate & save natal chart
- `GET /api/charts` - List user's charts
- `GET /api/charts/[id]` - Get specific chart
- `DELETE /api/charts/[id]` - Delete chart
- `POST /api/charts/[id]/interpret` - Generate AI reading

### Stripe
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/portal` - Create billing portal session
- `POST /api/stripe/webhooks` - Handle Stripe webhooks

### Admin
- `GET /api/admin/users` - List all users
- `GET /api/admin/stats` - Get platform statistics (MRR, users)
- `POST /api/admin/users/[id]/plan` - Manually change user plan
- `GET /api/admin/usage` - View AI usage across all users

## Security Features

### Implemented
- Password hashing (bcrypt)
- JWT with httpOnly cookies
- Stripe webhook signature verification
- Server-side session validation
- Role-based access control (USER/ADMIN)
- Plan-based feature gating (FREE/PRO)

### To Implement
- API rate limiting (next-rate-limit)
- CORS configuration
- Input validation with Zod
- SQL injection prevention (Prisma handles this)
- XSS prevention (React handles this)
- CSRF protection
- GDPR compliance (data deletion endpoint)

## Environment Variables

See `.env.example` for required environment variables:
- Database connection
- JWT secret
- Stripe API keys & webhook secret
- OpenAI API key
- App URL
- Usage limits

## Deployment Checklist

1. **Database**
   - Set up PostgreSQL database
   - Run `npx prisma migrate deploy`
   - Run `npx prisma generate`

2. **Environment Variables**
   - Configure all production env vars
   - Use strong JWT_SECRET
   - Add production Stripe keys

3. **Stripe Configuration**
   - Create products & prices in Stripe
   - Configure webhook endpoint
   - Add webhook secret to env

4. **Security**
   - Enable HTTPS
   - Set secure cookie flags
   - Configure CORS
   - Add rate limiting

5. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor database performance
   - Track Stripe events
   - Monitor OpenAI usage/costs

## Next Steps

### Core Features (In Progress)
- [ ] Authentication API routes
- [ ] User registration/login UI
- [ ] Chart creation form with location search
- [ ] Chart visualization (2D SVG)
- [ ] User dashboard
- [ ] Admin dashboard
- [ ] Stripe checkout integration
- [ ] Webhook handlers

### Future Enhancements
- 3D chart visualization (Three.js)
- Chart export (PNG/PDF)
- Transit calculations
- Synastry (relationship) charts
- Progressed charts
- Email notifications
- Mobile app (React Native)
- Multi-language support

## Performance Considerations

- Database indexes on frequently queried fields
- Prisma connection pooling
- AI reading caching (prevent duplicate calls)
- Chart calculation caching
- Image optimization for chart exports
- CDN for static assets
- Rate limiting to prevent abuse

## Cost Management

- AI usage limits prevent runaway OpenAI costs
- Stripe handles payment processing securely
- Database query optimization
- Efficient API design
- Monitoring & alerting for unusual usage patterns
