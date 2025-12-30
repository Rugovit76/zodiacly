# ⚡ QUICK DEPLOY CHECKLIST - 30 Minuta do Live!

## ✅ PRE-DEPLOYMENT

- [x] Projekat je completan i testiran lokalno
- [x] Database schema je finalizovana
- [x] `.env.example` postoji sa svim potrebnim vars
- [x] Git repository spreman

---

## 🚀 VERCEL DEPLOYMENT (30 min)

### □ KORAK 1: GitHub (5 min)

```bash
# U tvom ZODIACLY folderu:
git init
git add .
git commit -m "Ready for production deployment"

# Kreiraj repo na https://github.com/new
# Ime: zodiacly
# Private: Yes

# Connect i push:
git remote add origin https://github.com/TVOJ-USERNAME/zodiacly.git
git branch -M main
git push -u origin main
```

**✓ CHECK:** Code je na GitHub-u

---

### □ KORAK 2: Neon Database (5 min)

1. Idi na: https://neon.tech/
2. Sign up with GitHub
3. **Create Project:**
   - Name: `zodiacly-production`
   - Region: `Europe (Frankfurt)`
   - Database: `zodiacly`
4. **Copy Connection String:**
   ```
   postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/zodiacly?sslmode=require
   ```
5. **Sačuvaj za kasnije!**

**✓ CHECK:** Imaš connection string

---

### □ KORAK 3: Vercel Account (2 min)

1. Idi na: https://vercel.com/signup
2. **Sign up with GitHub** (recommended)
3. Authorize Vercel

**✓ CHECK:** Ulogovan na Vercel

---

### □ KORAK 4: Import Project (3 min)

1. Vercel Dashboard → **"Add New"** → **"Project"**
2. Find `zodiacly` repository
3. Klikni **"Import"**
4. Framework: **Next.js** (auto-detected)
5. **NEMOJ JOŠ DEPLOY-OVATI!**

**✓ CHECK:** Project imported, na env vars screen

---

### □ KORAK 5: Environment Variables (5 min)

Copy-paste iz tvog lokalnog `.env`, ali **UPDATE ove vrednosti:**

```env
# Database - PROMENITI SA NEON!
DATABASE_URL="postgresql://...[NEON CONNECTION STRING]..."

# App - PROMENITI NA PRODUCTION URL!
NEXT_PUBLIC_APP_URL="https://zodiacly.online"

# JWT - MOŽE OSTATI ISTO
JWT_SECRET="e37f8db60b387042b570beb1aa6d6efecfd9e32c80a9868474ea00cde8a27bf5"

# Stripe - KORISTI TEST MODE ZA POČETAK!
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."  (ostaviti dok ne setupuješ webhook)
STRIPE_PRICE_PRO_MONTHLY="price_test_..."
STRIPE_PRICE_PRO_YEARLY="price_test_..."  (može ostati placeholder)

# OpenAI - MOŽE OSTATI ISTO
OPENAI_API_KEY="sk-proj-..."

# AI Limits - MOŽE OSTATI ISTO
FREE_PLAN_AI_CALLS_PER_MONTH=1
PRO_PLAN_AI_CALLS_PER_MONTH=100

# Cron Secret - MOŽE OSTATI ISTO
CRON_SECRET="cron_8f4a2b9d3e7c1f6a5b8d2e9c4a7f1b3e"
```

**BITNO:**
- ✅ Database URL = Neon connection string
- ✅ APP_URL = `https://zodiacly.online`
- ✅ Stripe = TEST mode keys (za sigurnost na start)

**✓ CHECK:** Sve env vars dodane

---

### □ KORAK 6: Deploy! (2 min)

1. Klikni **"Deploy"** button
2. Čekaj ~2-3 minuta
3. Vercel će ti dati URL: `https://zodiacly-xxx.vercel.app`

**✓ CHECK:** Deployment successful, app je LIVE!

---

### □ KORAK 7: Setup Database Schema (3 min)

```bash
# Na svom računaru, u ZODIACLY folderu:

# Update local .env sa Neon database
DATABASE_URL="postgresql://...[NEON CONNECTION STRING]..."

# Push schema to production database
npx prisma db push

# Seed database sa blog posts
npm run db:seed
```

**✓ CHECK:** Database schema kreirana, blog posts dodani

---

### □ KORAK 8: Connect Custom Domain (10 min)

#### U Vercel:
1. Project Settings → **Domains**
2. Dodaj: `zodiacly.online`
3. Vercel će pokazati DNS rekorde

#### U Domain Registrar (gde si kupio domen):
1. Login u account
2. DNS Management za `zodiacly.online`
3. **Dodaj A Record:**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   TTL: 3600 (ili automatic)
   ```
4. **Dodaj CNAME Record (za www):**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   TTL: 3600
   ```
5. **Save Changes**

#### Wait for Propagation:
- Obično: 15-60 minuta
- Max: 48 sati
- Check: https://www.whatsmydns.net/#A/zodiacly.online

**✓ CHECK:** Domain pročitan na whatsmydns, zeleni checkmarks

---

### □ KORAK 9: Setup Stripe Webhook (5 min)

1. **Stripe Dashboard** → Developers → **Webhooks**
2. **Add Endpoint:**
   ```
   URL: https://zodiacly.online/api/stripe/webhooks

   Events:
   ✅ checkout.session.completed
   ✅ customer.subscription.created
   ✅ customer.subscription.updated
   ✅ customer.subscription.deleted
   ```
3. **Reveal** webhook secret (počinje sa `whsec_...`)
4. **Copy** secret

5. **U Vercel:**
   - Settings → Environment Variables
   - Pronađi `STRIPE_WEBHOOK_SECRET`
   - Paste novi secret
   - **Save**
   - **REDEPLOY** aplikaciju (Settings → Deployments → najnoviji → kebab menu → Redeploy)

**✓ CHECK:** Webhook aktivan, secret updated

---

### □ KORAK 10: FINAL TEST! (5 min)

Idi na: **https://zodiacly.online**

**Test checklist:**
- [ ] Homepage loads ✅
- [ ] Register novi user ✅
- [ ] Login radi ✅
- [ ] Create chart (guest) ✅
- [ ] Create chart (registered) ✅
- [ ] Numerology calculator ✅
- [ ] Horoscopes ✅
- [ ] Blog članci ✅
- [ ] Upgrade to PRO button ✅
- [ ] Stripe checkout (TEST card: 4242 4242 4242 4242) ✅
- [ ] Account upgraded na PRO ✅
- [ ] Dashboard prikazuje PRO status ✅

**✓ CHECK:** SVE RADI! 🎉

---

## 🎊 ČESTITAM! LIVE SI!

### 📊 Šta sad?

1. **Marketing:**
   - Podeli na social media
   - Email prijateljima/familiji
   - Reddit/Facebook grupe za astrologiju

2. **Monitor:**
   - Vercel Analytics (built-in)
   - Stripe Dashboard (subscriptions)
   - Neon Dashboard (database usage)

3. **Optimize:**
   - Dodaj Google Analytics (kasnije)
   - Setup Sentry error tracking (kasnije)
   - Create more blog content (SEO)

---

## 🔄 Kada Switch-ovati na LIVE Stripe Mode?

**PREPORUKA:** Nakon prvih **10 real users** (ne test!)

Kada si spreman:

1. **U Stripe Dashboard:**
   - Toggle **Test Mode OFF** (gore desno)
   - Kreiraj LIVE prices (monthly + yearly)
   - Setup LIVE webhook (isti URL)

2. **U Vercel:**
   - Update env vars sa LIVE keys
   - Redeploy

3. **Test:**
   - Koristi PRAVU karticu
   - Real charge se dešava!

**⚠️ Nemoj switch-ovati prerano!** TEST mode je siguran za testiranje.

---

## 🆘 Problem?

### Build Fails
- Check build logs u Vercel
- Common: Missing env variable

### Database Connection Error
- Check DATABASE_URL je correct
- Test connection: `npx prisma studio`

### Webhook Ne Radi
- Check webhook URL: `https://zodiacly.online/api/stripe/webhooks`
- Check webhook secret je updated
- Redeploy nakon env var change!

### Domain Ne Radi
- Check DNS propagation
- Wait 1-2 hours
- Clear browser cache

---

## 📁 Reference Documents

Detaljnije info:
- `DEPLOYMENT_VERCEL.md` - Full guide
- `DEPLOYMENT_DECISION.md` - Why Vercel?
- `STRIPE_SETUP_GUIDE.md` - Stripe details

---

## 🎯 SUCCESS METRICS

Nakon launch-a, prati:
- Daily signups
- FREE → PRO conversion rate
- Chart creations
- AI usage
- MRR (Monthly Recurring Revenue)

**Goal:** 100 users u prvi mesec! 🚀

---

**GO LIVE! 🎉**
