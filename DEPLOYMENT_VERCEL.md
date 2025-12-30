# 🚀 Vercel Deployment Guide - zodiacly.online

## 📋 Pre-Deployment Checklist

- [ ] Production database ready (Neon PostgreSQL)
- [ ] Stripe account configured (TEST or LIVE mode)
- [ ] GitHub repository created
- [ ] Domain zodiacly.online ready
- [ ] All environment variables prepared

---

## KORAK 1: Kreiranje Production Database (Neon)

### A) Registracija na Neon
1. Idi na: https://neon.tech/
2. Sign up with GitHub/Email
3. Klikni **"Create a project"**

### B) Kreiranje Database
```
Project Name: zodiacly-production
Region: Europe (Frankfurt) - najbliže za EU
Database Name: zodiacly
```

### C) Kopiraj Connection String
Nakon kreiranja, videćeš connection string:
```
postgresql://username:password@ep-xxxx.eu-central-1.aws.neon.tech/zodiacly?sslmode=require
```

**SAČUVAJ OVO!** Trebaće ti za .env

### D) Setup Database Schema
Pokreni lokalno:
```bash
# Update .env sa production DATABASE_URL
DATABASE_URL="postgresql://..."

# Push schema to production
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

---

## KORAK 2: Push Code na GitHub

### A) Inicijalizuj Git (ako već nisi)
```bash
git init
git add .
git commit -m "Initial commit - Zodiacly v2.0.0"
```

### B) Kreiraj GitHub Repository
1. Idi na https://github.com/new
2. Repository name: `zodiacly`
3. Private/Public: **Private** (preporučeno)
4. Klikni "Create repository"

### C) Push Code
```bash
git remote add origin https://github.com/TVOJ-USERNAME/zodiacly.git
git branch -M main
git push -u origin main
```

---

## KORAK 3: Deploy na Vercel

### A) Registracija na Vercel
1. Idi na: https://vercel.com/signup
2. Sign up sa **GitHub account-om** (preporučeno)

### B) Import Project
1. Nakon login-a, klikni **"Add New"** → **"Project"**
2. Klikni **"Import"** pored tvog `zodiacly` repo-a
3. Vercel će automatski detect Next.js

### C) Configure Project
```
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: (leave default)
Install Command: npm install
```

### D) Environment Variables
Klikni **"Environment Variables"** i dodaj SVE iz .env:

**OBAVEZNO:**
```env
# Database
DATABASE_URL=postgresql://...  (Neon production string)

# App
NEXT_PUBLIC_APP_URL=https://zodiacly.online
JWT_SECRET=e37f8db60b387042b570beb1aa6d6efecfd9e32c80a9868474ea00cde8a27bf5

# Stripe (TEST MODE za početak)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (dobićeš nakon webhook setup-a)
STRIPE_PRICE_PRO_MONTHLY=price_test_...
STRIPE_PRICE_PRO_YEARLY=price_test_...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# AI Limits
FREE_PLAN_AI_CALLS_PER_MONTH=1
PRO_PLAN_AI_CALLS_PER_MONTH=100

# Cron Security
CRON_SECRET=cron_8f4a2b9d3e7c1f6a5b8d2e9c4a7f1b3e
```

### E) Deploy!
Klikni **"Deploy"** i čekaj ~2-3 minuta.

Vercel će ti dati URL: `https://zodiacly-xyz123.vercel.app`

---

## KORAK 4: Povezivanje Custom Domain-a (zodiacly.online)

### A) U Vercel Dashboard
1. Otvori svoj deployed project
2. Klikni **"Settings"** → **"Domains"**
3. U "Add Domain" polje unesi: `zodiacly.online`
4. Klikni **"Add"**

### B) Configure DNS
Vercel će ti reći koje DNS rekorde dodati:

**Za Root Domain (zodiacly.online):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Za WWW (www.zodiacly.online):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### C) Dodaj DNS Rekorde kod Registrar-a
1. Login kod svog domain registrar-a (gde si kupio domen)
2. Idi na DNS Management
3. Dodaj gore navedene rekorde
4. Save changes

### D) Čekaj Propagation
DNS propagacija traje **15min - 48h** (obično ~1h)

Proveri status: https://www.whatsmydns.net/#A/zodiacly.online

---

## KORAK 5: Setup Stripe Webhook za Production

### A) U Stripe Dashboard
1. Login: https://dashboard.stripe.com/
2. **Developers** → **Webhooks**
3. Klikni **"+ Add endpoint"**

### B) Configure Webhook
```
Endpoint URL: https://zodiacly.online/api/stripe/webhooks

Description: Zodiacly Production Webhooks

Events to send:
✅ checkout.session.completed
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
```

Klikni **"Add endpoint"**

### C) Copy Webhook Secret
1. Klikni na kreirani webhook
2. U "Signing secret" sekciji klikni **"Reveal"**
3. Copy secret (počinje sa `whsec_...`)

### D) Update Vercel Environment Variable
1. Vercel Dashboard → Project Settings → Environment Variables
2. Pronađi `STRIPE_WEBHOOK_SECRET`
3. Update value sa novim secret-om
4. Klikni **"Save"**
5. **IMPORTANT:** Redeploy aplikaciju (Settings → Redeploy)

---

## KORAK 6: Seed Database sa Blog Posts

```bash
# Update local .env sa production DATABASE_URL
DATABASE_URL="postgresql://..."

# Run seed
npm run db:seed
```

Ili ručno dodaj blog posts kroz Prisma Studio:
```bash
npx prisma studio
```

---

## KORAK 7: Testing na Production

### A) Visit Site
Idi na: https://zodiacly.online

### B) Test Features
- ✅ Homepage loads
- ✅ Register/Login radi
- ✅ Create chart radi
- ✅ Numerology radi
- ✅ Horoscopes rade
- ✅ Blog radi

### C) Test Stripe Checkout
1. Login kao FREE user
2. Klikni "Upgrade to PRO"
3. Use TEST card: `4242 4242 4242 4242`
4. Verifikuj da account postane PRO

### D) Check Webhook
Stripe Dashboard → Webhooks → tvoj endpoint → Events
Trebao bi da vidiš `checkout.session.completed` event

---

## KORAK 8: Monitoring & Maintenance

### A) Vercel Analytics
Vercel Dashboard → Analytics
- Page views
- Performance
- Errors

### B) Database Monitoring
Neon Dashboard:
- Connection pooling
- Query performance
- Storage usage

### C) Stripe Dashboard
- Revenue (MRR)
- Subscriptions
- Failed payments

---

## 🔄 CONTINUOUS DEPLOYMENT

Vercel je povezan sa GitHub-om:

```bash
# Napravi promenu
git add .
git commit -m "Update feature X"
git push

# Vercel automatski:
# 1. Detektuje push
# 2. Runnuje build
# 3. Deploy-uje novu verziju
# 4. Live za ~2 min!
```

---

## 🔐 SECURITY CHECKLIST

- [ ] HTTPS enabled (automatic na Vercel)
- [ ] Environment variables secure
- [ ] Database password strong
- [ ] Stripe webhook signature verified
- [ ] JWT_SECRET complex
- [ ] CORS configured
- [ ] Rate limiting implemented (TODO)

---

## 📊 POST-LAUNCH CHECKLIST

- [ ] Test svi flow-ovi na production
- [ ] Setup Google Analytics (TODO)
- [ ] Setup error tracking - Sentry (TODO)
- [ ] Monitor first real signups
- [ ] Test email notifications (ako dodaš)
- [ ] Backup strategy (Neon automatic backups)
- [ ] Marketing launch plan

---

## 🆘 TROUBLESHOOTING

### Build Fails
```bash
# Check build logs u Vercel
# Common issues:
- Missing env vars
- Prisma not generated (add postinstall script)
- TypeScript errors
```

### Database Connection Issues
```bash
# Check:
- DATABASE_URL correct
- Neon database is running
- Connection pooling limits
- SSL mode required
```

### Webhooks Not Working
```bash
# Check:
- Webhook URL correct (https://zodiacly.online/api/stripe/webhooks)
- Webhook secret matches
- Stripe events are being sent
- Check Vercel function logs
```

---

## 💰 COSTS ESTIMATE

### Vercel
- **Free Tier:** Unlimited sites
- **Pro ($20/mo):** Needed for:
  - Custom domain
  - More bandwidth
  - Team features

### Neon Database
- **Free Tier:** 0.5GB storage
- **Pro ($19/mo):** 10GB storage + backups

### Total Minimum:
- **Free:** Može za start! (Vercel Free + Neon Free)
- **Paid:** ~$40/mo (kad prelazi free limits)

### Kada upgrade-ovati?
- 1,000+ monthly users
- 10GB+ database
- Heavy traffic (100k+ page views)

---

**Deployment na Vercel je NAJLAKŠI način! ✅**
