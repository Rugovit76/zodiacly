# Zodiacly Deployment Guide

Complete guide for deploying Zodiacly to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (Neon)](#database-setup-neon)
3. [Stripe Configuration](#stripe-configuration)
4. [OpenAI Setup](#openai-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment](#post-deployment)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:

- [x] GitHub repository with Zodiacly code
- [x] Vercel account (free tier works)
- [x] Neon PostgreSQL account (free tier works)
- [x] Stripe account (production mode)
- [x] OpenAI API account with billing enabled
- [x] Domain name (optional)

---

## Database Setup (Neon)

### 1. Create Neon Project

1. Go to [Neon Console](https://console.neon.tech/)
2. Click "Create Project"
3. Choose a name: `zodiacly-production`
4. Select region: Choose closest to your users
5. Click "Create Project"

### 2. Get Connection String

1. In Neon dashboard, click "Connection Details"
2. Copy the connection string:
```
postgresql://username:password@ep-xxx.region.neon.tech/neondb?sslmode=require
```
3. Save this for environment variables

### 3. Configure Database

**Option A: Using Prisma Studio (Recommended)**
```bash
# Set DATABASE_URL in .env
DATABASE_URL="postgresql://..."

# Push schema to Neon database
npx prisma db push

# Verify schema
npx prisma studio
```

**Option B: Using Migrations**
```bash
# Generate migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy
```

### 4. Seed Production Data (Optional)

```bash
# Create admin account
npx tsx prisma/seed.ts
```

---

## Stripe Configuration

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Complete account verification
3. Enable production mode

### 2. Create Products

**PRO Monthly:**
1. Products → Create Product
2. Name: "Zodiacly PRO - Monthly"
3. Description: "Unlimited charts, 100 AI readings/month"
4. Pricing: €6.99/month
5. Billing period: Monthly
6. Copy Price ID: `price_...`

**PRO Yearly:**
1. Products → Create Product
2. Name: "Zodiacly PRO - Yearly"
3. Description: "Unlimited charts, 100 AI readings/month (save 2 months)"
4. Pricing: €69/year
5. Billing period: Yearly
6. Copy Price ID: `price_...`

### 3. Get API Keys

1. Developers → API Keys
2. Copy:
   - **Publishable key**: `pk_live_...`
   - **Secret key**: `sk_live_...`

### 4. Configure Webhook

1. Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Listen to events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Reveal webhook signing secret: `whsec_...`

### 5. Test Webhook (Important!)

```bash
# Install Stripe CLI
brew install stripe/stripe-brew/stripe  # macOS
# OR download from https://stripe.com/docs/stripe-cli

# Login
stripe login

# Test webhook
stripe trigger checkout.session.completed
```

---

## OpenAI Setup

### 1. Create API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Click "Create new secret key"
3. Name: "Zodiacly Production"
4. Copy key: `sk-proj-...`
5. **IMPORTANT**: Save immediately (won't be shown again)

### 2. Set Billing Limits

1. Go to Settings → Billing → Usage limits
2. Set monthly budget: €50 (recommended starting point)
3. Enable email alerts at 75% and 90%

### 3. Monitor Usage

1. Dashboard → Usage
2. Track costs daily
3. Adjust limits as needed

**Estimated Costs:**
- GPT-4 API: ~$0.03 per AI reading
- 100 readings = ~$3
- FREE plan (1/user/month): Low cost
- PRO plan (100/user/month): Manage with usage limits

---

## Vercel Deployment

### 1. Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/)
2. Click "Add New Project"
3. Import GitHub repository
4. Select `zodiacly` repository

### 2. Configure Build Settings

**Framework Preset:** Next.js

**Build Command:**
```bash
npx prisma generate && next build
```

**Output Directory:** `.next`

**Install Command:**
```bash
npm install
```

**Root Directory:** `./`

### 3. Environment Variables

Add these in Vercel project settings:

```env
# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long-production

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# App
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide preview URL: `zodiacly.vercel.app`

### 5. Add Custom Domain (Optional)

1. Project Settings → Domains
2. Add domain: `zodiacly.com`
3. Configure DNS:
   - Type: A
   - Name: @
   - Value: 76.76.21.21

   - Type: CNAME
   - Name: www
   - Value: cname.vercel-dns.com

4. Wait for DNS propagation (5-30 minutes)
5. SSL certificate auto-provisioned by Vercel

---

## Environment Variables

### Production .env Template

Create `.env` in root directory:

```env
# ============================================
# DATABASE
# ============================================
DATABASE_URL="postgresql://username:password@host.neon.tech/neondb?sslmode=require"

# ============================================
# AUTHENTICATION
# ============================================
# Generate with: openssl rand -base64 32
JWT_SECRET="your-super-secret-jwt-key-min-32-chars-long-production"

# ============================================
# STRIPE
# ============================================
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_PRICE_ID_MONTHLY="price_..."
STRIPE_PRICE_ID_YEARLY="price_..."

# ============================================
# OPENAI
# ============================================
OPENAI_API_KEY="sk-proj-..."

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_URL="https://zodiacly.com"
NODE_ENV="production"

# ============================================
# OPTIONAL: USAGE LIMITS
# ============================================
FREE_AI_LIMIT=1
PRO_AI_LIMIT=100
```

### Generating Secrets

**JWT_SECRET:**
```bash
# Generate secure random string
openssl rand -base64 32
```

**Verification:**
```bash
# Check length (should be 32+ chars)
echo -n "your-jwt-secret" | wc -c
```

---

## Post-Deployment

### 1. Verify Deployment

**Check Homepage:**
```bash
curl https://your-domain.com
```

**Check API Health:**
```bash
curl https://your-domain.com/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-26T10:00:00.000Z"
}
```

### 2. Test Critical Flows

**Registration:**
1. Go to `/auth/register`
2. Create test account
3. Verify email stored in database
4. Check JWT cookie set

**Chart Creation:**
1. Login with test account
2. Go to `/create-chart`
3. Enter birth data
4. Verify chart displays
5. Check database for saved chart

**Stripe Checkout:**
1. Login as FREE user
2. Click "Upgrade to PRO"
3. Complete test payment (use Stripe test cards in test mode)
4. Verify redirect to dashboard
5. Verify plan updated to PRO

**AI Reading:**
1. View saved chart
2. Click "Generate AI Reading"
3. Verify OpenAI API called
4. Check reading saved to database
5. Verify usage counter incremented

### 3. Configure Stripe Webhooks

**Test Webhook Delivery:**
1. Stripe Dashboard → Webhooks
2. Click your webhook endpoint
3. Send test event: `checkout.session.completed`
4. Verify 200 response
5. Check database `WebhookEvent` table

**Troubleshooting Failed Webhooks:**
```bash
# View webhook logs in Stripe Dashboard
# Check Vercel function logs
vercel logs --follow
```

### 4. Create Admin Account

```bash
# SSH into database or use Prisma Studio
# Update user role
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@zodiacly.com';
```

---

## Monitoring

### 1. Vercel Analytics

**Enable:**
1. Vercel Project → Analytics
2. Enable Web Analytics
3. View real-time traffic

**Metrics:**
- Page views
- User sessions
- Performance scores
- Error rates

### 2. Database Monitoring

**Neon Dashboard:**
- Connection count
- Query performance
- Storage usage
- Backup status

**Prisma Studio:**
```bash
npx prisma studio
```

### 3. Stripe Monitoring

**Dashboard Alerts:**
- Failed payments
- Dispute notifications
- Subscription changes

**Set Up Email Alerts:**
1. Settings → Notifications
2. Enable:
   - Failed payments
   - Disputes
   - Suspicious activity

### 4. OpenAI Cost Tracking

**Usage Dashboard:**
- Daily costs
- Token usage
- API errors

**Budget Alerts:**
1. Set monthly budget limit
2. Enable email alerts

### 5. Error Tracking (Recommended)

**Sentry Integration:**
```bash
npm install @sentry/nextjs

# Follow setup wizard
npx @sentry/wizard -i nextjs
```

**Configure:**
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

---

## Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

**Solution:**
1. Check DATABASE_URL in Vercel env vars
2. Verify Neon database is running
3. Check IP allowlist (if configured)
4. Test connection:
```bash
psql "postgresql://..."
```

### Stripe Webhook Failures

**Error:** `Webhook signature verification failed`

**Solution:**
1. Verify STRIPE_WEBHOOK_SECRET matches Stripe dashboard
2. Check endpoint URL is correct
3. Ensure raw body parsing enabled
4. Test with Stripe CLI:
```bash
stripe trigger checkout.session.completed
```

### OpenAI API Errors

**Error:** `Insufficient quota`

**Solution:**
1. Check OpenAI billing page
2. Add payment method
3. Increase spending limits

**Error:** `Rate limit exceeded`

**Solution:**
1. Implement caching for AI readings
2. Add retry logic with exponential backoff
3. Consider upgrading OpenAI tier

### Build Failures

**Error:** `Prisma Client not found`

**Solution:**
1. Update build command to include:
```bash
npx prisma generate && next build
```

**Error:** `Environment variable not found`

**Solution:**
1. Check all required env vars in Vercel
2. Ensure no typos in variable names
3. Redeploy after adding vars

### Session/Cookie Issues

**Error:** `Session not persisting`

**Solution:**
1. Check cookie settings (Secure, HttpOnly, SameSite)
2. Verify NEXT_PUBLIC_APP_URL matches domain
3. Check browser console for cookie errors
4. Ensure HTTPS in production

---

## Rollback Procedure

If deployment fails:

### 1. Vercel Rollback

1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

### 2. Database Rollback

```bash
# Revert last migration
npx prisma migrate rollback

# Or restore from backup
# (Configure automatic backups in Neon)
```

### 3. Environment Variables

1. Vercel Settings → Environment Variables
2. Revert to previous values
3. Redeploy

---

## Security Checklist

- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Secure JWT_SECRET (32+ chars, random)
- [ ] httpOnly cookies configured
- [ ] Stripe webhook signature verification enabled
- [ ] OpenAI API key kept secret
- [ ] Database connection SSL enabled
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive data
- [ ] Production env vars never committed to Git

---

## Performance Optimization

### 1. Database Indexes

```prisma
// Already in schema.prisma
@@index([email])
@@index([stripeCustomerId])
@@index([userId])
```

### 2. Vercel Edge Functions

Consider moving these to edge:
- `/api/auth/*` endpoints
- Session validation
- Static content delivery

### 3. Caching

Implement caching for:
- AI readings (prevent duplicate calls)
- Chart calculations
- Static pages

### 4. Image Optimization

Use Next.js Image component:
```tsx
import Image from 'next/image'
```

---

## Backup Strategy

### Database Backups

**Neon Automatic Backups:**
- Enabled by default
- 7-day retention
- Point-in-time recovery

**Manual Backup:**
```bash
pg_dump "postgresql://..." > backup.sql
```

### Code Backups

- Git version control
- GitHub repository
- Tag releases:
```bash
git tag v1.0.0
git push --tags
```

---

## Scaling Considerations

### When to Scale

**Indicators:**
- \>1000 active users
- \>100 concurrent requests
- Database connection pool exhausted
- OpenAI rate limits hit

### Horizontal Scaling

**Vercel:**
- Auto-scales serverless functions
- No action required

**Database:**
- Upgrade Neon plan
- Enable connection pooling
- Add read replicas

### Cost Optimization

**Monitor:**
- Vercel function duration
- Database queries
- OpenAI token usage
- Stripe transaction fees

**Optimize:**
- Cache frequently accessed data
- Batch database operations
- Limit AI reading length
- Use Stripe webhooks (not polling)

---

## Support & Resources

**Documentation:**
- README.md
- ARCHITECTURE.md
- API.md

**External Docs:**
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Stripe Docs](https://stripe.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)

**Support:**
- Email: support@zodiacly.com

---

## Post-Launch Checklist

- [ ] Domain configured with SSL
- [ ] Database schema deployed
- [ ] Test accounts created
- [ ] Stripe products created
- [ ] Stripe webhook configured and tested
- [ ] OpenAI API working
- [ ] All critical flows tested
- [ ] Error tracking enabled
- [ ] Monitoring dashboards configured
- [ ] Backup strategy in place
- [ ] Security checklist completed
- [ ] Performance optimizations applied

---

## Maintenance Schedule

**Daily:**
- Check error logs
- Monitor OpenAI costs
- Review Stripe transactions

**Weekly:**
- Database performance review
- User feedback review
- Feature usage analytics

**Monthly:**
- Security updates
- Dependency updates
- Cost analysis
- Backup verification

---

## Emergency Contacts

**Critical Issues:**
- Vercel Status: [status.vercel.com](https://status.vercel.com)
- Stripe Status: [status.stripe.com](https://status.stripe.com)
- OpenAI Status: [status.openai.com](https://status.openai.com)
- Neon Status: [status.neon.tech](https://status.neon.tech)

**Support:**
- Vercel: support@vercel.com
- Stripe: support@stripe.com
- OpenAI: help@openai.com
