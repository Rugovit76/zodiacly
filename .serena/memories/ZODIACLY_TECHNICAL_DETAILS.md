# ZODIACLY - Technical Implementation Details

## 🗂️ FILE LOCATIONS & IMPLEMENTATION STATUS

### Authentication System
**Location:** `/lib/auth/`
- `jwt.ts` - JWT token creation & verification
- `session.ts` - Session management (httpOnly cookies)
- `password.ts` - Bcrypt password hashing (10 rounds)

**API Routes:** `/app/api/auth/`
- `register/route.ts` - User registration
- `login/route.ts` - User login
- `logout/route.ts` - Session termination
- `me/route.ts` - Get current user session

**Pages:** `/app/auth/`
- `register/page.tsx` - Registration form
- `login/page.tsx` - Login form

### Chart System
**Location:** `/lib/astrology/`
- `calculator.ts` - Natal chart calculation engine
  - Planetary positions
  - House calculations
  - Aspect calculations
  - Timezone handling
- `compatibility.ts` - Synastry/compatibility engine ✅
  - Sun/Moon/Venus/Mars compatibility
  - Aspect analysis (harmonious vs challenging)
  - Element balance
  - Overall score (0-100)

**API Routes:** `/app/api/charts/`
- `create/route.ts` - Calculate & save natal chart
- `route.ts` - GET (list user's charts)
- `[id]/route.ts` - GET (specific chart), DELETE
- `[id]/interpret/route.ts` - Generate AI reading
- `[id]/share/route.ts` - Make chart public/private ✅
- `public/[publicId]/route.ts` - View public chart ✅

**Pages:**
- `/app/dashboard/page.tsx` - User chart dashboard
- `/app/chart/[publicId]/page.tsx` - Public chart viewing ✅
- `/app/compatibility/page.tsx` - ❌ **NOT YET CREATED** (HIGH PRIORITY)

### Sharing System (IMPLEMENTED ✅)
**Components:** `/components/sharing/`
- `ShareButton.tsx` - Complete sharing UI ✅
  - Social share buttons (WhatsApp, FB, Twitter, Telegram)
  - Copy to clipboard
  - Share/view counters
  - Public/private toggle
  - Modal with preview

**Database Fields Added:**
```prisma
model NatalChart {
  publicId   String?  @unique  // e.g., "abc123xyz"
  isPublic   Boolean  @default(false)
  shareCount Int      @default(0)
  viewCount  Int      @default(0)
}
```

**Package Used:**
- `nanoid` v5.0.7 - For generating short unique IDs

### Compatibility System (80% COMPLETE)
**Implemented:**
- ✅ `/lib/astrology/compatibility.ts` - Full calculation engine
- ✅ `POST /api/compatibility` - API endpoint

**Missing:**
- ❌ `/app/compatibility/page.tsx` - UI for compatibility page
- ❌ Chart selector component
- ❌ Results visualization
- ❌ Share compatibility results (viral feature!)
- ❌ "Invite friend" functionality

### OpenAI Integration
**Location:** `/lib/openai/`
- `client.ts` - OpenAI client initialization
- `interpretations.ts` - AI reading generation
  - Personality overview
  - Planet-by-planet analysis
  - Houses interpretation
  - Aspect analysis
  - Ascendant explanation

**Usage Tracking:** `/lib/usage/`
- `tracker.ts` - AI usage limits & tracking
  - FREE: 1 AI call/month
  - PRO: 100 AI calls/month
  - Monthly reset on 1st of each month

### Stripe Integration
**Location:** `/lib/stripe/`
- `client.ts` - Stripe client initialization
- `checkout.ts` - Checkout session creation
- `webhooks.ts` - Webhook handlers
  - `checkout.session.completed`
  - `customer.subscription.*`

**API Routes:** `/app/api/stripe/`
- `checkout/route.ts` - Create checkout session
- `portal/route.ts` - Create billing portal session
- `webhooks/route.ts` - Handle Stripe webhooks

**Stripe Products:**
- PRO Monthly: €6.99/month (price_pro_monthly_699)
- PRO Yearly: €69/year (price_pro_yearly_6900)

### Admin System
**API Routes:** `/app/api/admin/`
- `users/route.ts` - List all users
- `stats/route.ts` - Platform statistics (MRR, users)
- `users/[id]/plan/route.ts` - Manually change user plan
- `usage/route.ts` - View AI usage across all users

**Pages:**
- `/app/admin/page.tsx` - Admin dashboard
- Access: Only users with `role: ADMIN`

### Database (PostgreSQL + Prisma)
**Location:** `/prisma/schema.prisma`

**Models:**
1. `User`
   - Authentication fields (email, passwordHash)
   - Role-based access (role: USER | ADMIN)
   - Plan status (plan: FREE | PRO)
   - Stripe integration (stripeCustomerId, stripeSubscriptionId, subscriptionStatus)

2. `NatalChart`
   - Birth data (birthDate, birthTime, latitude, longitude, timezone, location)
   - Chart data (chartData JSON - planets, houses, aspects)
   - AI reading (aiReading JSON)
   - **Sharing fields** (publicId, isPublic, shareCount, viewCount) ✅

3. `Usage`
   - AI usage tracking (aiCallsThisMonth, lastResetAt)
   - 1-to-1 relationship with User

4. `WebhookEvent`
   - Stripe webhook logging (type, payload, processed, createdAt)

**Prisma Client:** `/lib/db/prisma.ts`
- Singleton pattern for production
- Connection pooling

### UI Components
**Location:** `/components/`

**UI Components:** `/components/ui/`
- Button, Card, Modal, Input, etc.
- TailwindCSS + cosmic theme

**Chart Components:** `/components/charts/`
- Chart visualization components
- 2D SVG rendering
- Optional 3D with Three.js (future)

**Sharing Components:** `/components/sharing/`
- `ShareButton.tsx` ✅ - Complete sharing UI

### Styling
**Global Styles:** `/app/globals.css`
- Cosmic/space theme
- Dark background with purple/blue gradients
- Professional feel

**Config:**
- `tailwind.config.ts` - TailwindCSS configuration
- `postcss.config.mjs` - PostCSS setup

### TypeScript
**Types:** `/types/index.ts`
- All TypeScript type definitions
- User, NatalChart, ChartData, Subscription types
- API response types

**Config:** `tsconfig.json`
- Strict mode enabled
- Path aliases configured

### Environment Variables
**Required in `.env`:**

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
JWT_SECRET="your-secure-secret"

# OpenAI
OPENAI_API_KEY="sk-..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_PRO_MONTHLY="price_..."
STRIPE_PRICE_PRO_YEARLY="price_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Usage Limits
MAX_AI_CALLS_FREE=1
MAX_AI_CALLS_PRO=100
```

## 🔄 AUTHENTICATION FLOW

1. User registers → Password hashed (bcrypt)
2. JWT created with user data (id, email, plan, role)
3. Token stored in httpOnly cookie (`zodiacly_session`)
4. Cookie expires in 7 days
5. Protected routes check cookie via middleware
6. Token verified on each request

## 💳 SUBSCRIPTION FLOW

1. User clicks "Upgrade to PRO"
2. `POST /api/stripe/checkout` creates Checkout Session
3. User redirected to Stripe
4. User completes payment
5. Stripe sends `checkout.session.completed` webhook
6. `/api/stripe/webhooks` receives event
7. Webhook handler:
   - Verifies signature
   - Updates user.plan = "PRO"
   - Stores stripeCustomerId & stripeSubscriptionId
   - Updates subscriptionStatus
8. PRO features unlocked immediately

## 📊 CHART CREATION FLOW

1. User enters birth data (date, time, location)
2. Frontend geocodes location → lat/lon
3. `POST /api/charts/create` called
4. Backend calculates:
   - Planetary positions
   - House cusps
   - Aspects
5. Chart saved to database
6. If AI reading requested:
   - Check usage limits (FREE: 1/month, PRO: 100/month)
   - Call OpenAI API
   - Increment usage counter
   - Store AI reading with chart
7. Return chart with/without AI reading

## 🔗 SHARING FLOW (IMPLEMENTED ✅)

1. User clicks "Share" on chart
2. `POST /api/charts/[id]/share` called
3. If first time sharing:
   - Generate unique publicId (nanoid, 12 chars)
   - Set isPublic = true
4. Return publicId
5. Frontend shows share modal with:
   - Short URL: `zodiacly.com/chart/{publicId}`
   - Social share buttons
   - Copy to clipboard button
6. When public link accessed:
   - `GET /api/charts/public/[publicId]` called
   - Increment viewCount
   - Return chart data (anonymized if user not owner)
7. Public page shows:
   - Chart visualization
   - Limited info (no birth time/location if privacy enabled)
   - 3x "Create Your Chart" CTAs
   - Social proof

## 🧮 COMPATIBILITY FLOW (80% DONE)

**Implemented:**
1. User selects 2 charts to compare
2. `POST /api/compatibility` called with chart IDs
3. Backend calculates:
   - Sun sign compatibility
   - Moon sign emotional compatibility
   - Venus-Mars romantic compatibility
   - Synastry aspects (harmonious vs challenging)
   - Element balance
   - Overall score (0-100)
4. Returns compatibility report

**Missing UI:**
- ❌ Compatibility page at `/app/compatibility/page.tsx`
- ❌ Chart selection interface
- ❌ Results visualization
- ❌ Share compatibility results
- ❌ "Invite friend to compare" (viral feature!)

## 📈 USAGE TRACKING

**Table:** `Usage`
- `userId` - 1-to-1 with User
- `aiCallsThisMonth` - Current month's count
- `lastResetAt` - Last reset date

**Reset Logic:**
- Runs on first AI call of the month
- If current month > lastResetAt month:
  - Reset aiCallsThisMonth = 0
  - Update lastResetAt = now

**Limits:**
- FREE: 1 AI call/month (MAX_AI_CALLS_FREE)
- PRO: 100 AI calls/month (MAX_AI_CALLS_PRO)
- Admin can adjust via env variables

## 🔐 SECURITY IMPLEMENTATION

### Password Security
- Bcrypt hashing with 10 rounds
- Minimum 8 characters
- No plaintext storage

### Session Security
- JWT with httpOnly cookies (XSS prevention)
- 7-day expiration
- Secure flag in production
- SameSite=Strict

### API Security
- Server-side session validation
- Role-based access control
- Plan-based feature gating
- Stripe webhook signature verification

### Data Privacy
- Birth data protected
- Public charts: optional anonymization
- Privacy controls on sharing

## 🚀 DEPLOYMENT CONFIGURATION

**Vercel Config:** `vercel.json`
```json
{
  "buildCommand": "prisma generate && next build",
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
    // ... other secrets
  }
}
```

**Next.js Config:** `next.config.js`
- Production optimizations
- Image optimization
- Webpack configuration

## 🐛 KNOWN TECHNICAL DEBT

### High Priority
- ❌ Compatibility page UI (blocks viral growth)
- ❌ OG image generator (social sharing optimization)
- ❌ API rate limiting (prevent abuse)
- ❌ Input validation with Zod (security)

### Medium Priority
- ❌ Chart calculation caching (performance)
- ❌ AI reading caching (prevent duplicate calls)
- ❌ Database indexes optimization
- ❌ CSRF protection

### Low Priority
- ❌ Error tracking (Sentry)
- ❌ Analytics dashboard
- ❌ Email notifications
- ❌ GDPR data deletion endpoint

## 📝 CODE CONVENTIONS

### File Naming
- Components: PascalCase (e.g., `ShareButton.tsx`)
- Utils/libs: camelCase (e.g., `calculator.ts`)
- API routes: `route.ts` (Next.js 14 convention)
- Pages: `page.tsx` (Next.js 14 convention)

### Import Structure
```typescript
// 1. External dependencies
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'

// 2. Internal modules
import { verifyToken } from '@/lib/auth/jwt'

// 3. Types
import type { User } from '@/types'
```

### API Response Format
```typescript
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 TESTING COMMANDS

### Stripe Testing
**Test Card:** 4242 4242 4242 4242
**Expiry:** Any future date
**CVC:** Any 3 digits

### Database Testing
```bash
npx prisma studio  # Visual editor at localhost:5555
```

### Local Development
```bash
npm run dev  # http://localhost:3000
```

## 📞 TROUBLESHOOTING

### Database Connection Error
- Check DATABASE_URL in .env
- Add `?sslmode=require` for Neon
- Test: `npx prisma db push`

### OpenAI API Error
- Verify OPENAI_API_KEY in .env
- Check account credits
- Free tier has rate limits

### Stripe Webhook Not Working
- Use Stripe CLI for local testing:
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhooks
  ```
- Verify webhook secret matches STRIPE_WEBHOOK_SECRET

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## 🎯 NEXT IMMEDIATE TASK

**Create Compatibility Page UI**

1. Create `/app/compatibility/page.tsx`
2. Build chart selector component
3. Display compatibility results
4. Add share buttons for results
5. Add "Invite friend" viral feature
6. Test complete flow
7. Deploy to production

**Estimated Time:** 2-3 days
**Priority:** HIGH (blocks viral growth loop)
