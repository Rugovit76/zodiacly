# 🚀 Zodiacly Quick Start Guide

## ✅ Već urađeno:
- ✅ Next.js projekat setup
- ✅ Dependencies instalirani
- ✅ `.env` fajl kreiran
- ✅ JWT_SECRET generisan
- ✅ OpenAI API key konfigurisan

## 📋 Preostaje (5-10 minuta):

### **Korak 1: Izaberi Database Opciju**

Pročitaj `DATABASE_SETUP.md` i izaberi jednu od 3 opcije:

#### **🌟 PREPORUČENO: Neon (Besplatno)**
1. Idi na https://neon.tech
2. Sign up (besplatno)
3. New Project → "zodiacly"
4. Kopiraj **Connection String**
5. Otvori `.env` fajl
6. Zameni `DATABASE_URL` sa tvojim connection string-om:
   ```
   DATABASE_URL="postgresql://username:password@ep-xyz.neon.tech/zodiacly?sslmode=require"
   ```

#### Alternativa: Docker
```bash
docker run --name zodiacly-postgres \
  -e POSTGRES_PASSWORD=zodiacly123 \
  -e POSTGRES_DB=zodiacly \
  -p 5432:5432 \
  -d postgres:16

# Onda u .env:
# DATABASE_URL="postgresql://postgres:zodiacly123@localhost:5432/zodiacly"
```

---

### **Korak 2: Setup Database**

Nakon što imaš `DATABASE_URL` u `.env`:

**Windows:**
```cmd
setup-db.bat
```

**Linux/Mac:**
```bash
chmod +x setup-db.sh
./setup-db.sh
```

**Ili ručno:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### **Korak 3: Pokreni Development Server**

```bash
npm run dev
```

Otvori: http://localhost:3000 🎉

---

### **Korak 4: Kreiraj ADMIN Nalog**

1. Registruj se na http://localhost:3000/auth/register
2. Otvori Prisma Studio:
   ```bash
   npx prisma studio
   ```
3. U browseru (http://localhost:5555):
   - Klikni na **User** model
   - Pronadji svoj nalog
   - Klikni **Edit**
   - Promeni `role` sa `USER` na `ADMIN`
   - Klikni **Save**

4. Refresh stranicu - sada imaš pristup Admin Dashboard-u!

---

## 🎯 Test Complete Flow:

1. **Login** → http://localhost:3000/auth/login
2. **Create Chart** → Dashboard → Create Chart
3. **View Chart** → Vidi 2D visualization
4. **Generate AI Reading** → Klikni "Generate AI Reading"
5. **Admin Dashboard** → `/admin` (samo ako si ADMIN)

---

## 🔧 Stripe Setup (Opcionalno - za testing plaćanja)

1. Idi na https://dashboard.stripe.com/register
2. Aktiviraj Test Mode (toggle u gornjem desnom uglu)
3. Idi na **Products** → Create Product
   - Name: "Zodiacly Pro Monthly"
   - Price: €6.99 recurring monthly
   - Kopiraj **Price ID** (počinje sa `price_...`)
4. Ponovi za Yearly (€69/year)
5. Idi na **Developers** → **Webhooks** → Add Endpoint
   - URL: `http://localhost:3000/api/stripe/webhooks`
   - Events: `checkout.session.completed`, `customer.subscription.*`
   - Kopiraj **Signing Secret** (počinje sa `whsec_...`)
6. Update `.env`:
   ```env
   STRIPE_SECRET_KEY="sk_test_..." # Iz Developers > API Keys
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   STRIPE_PRICE_PRO_MONTHLY="price_..."
   STRIPE_PRICE_PRO_YEARLY="price_..."
   ```

**Test Stripe Checkout:**
- Card: `4242 4242 4242 4242`
- Expiry: bilo koji budući datum
- CVC: bilo koji 3-digit broj

---

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start               # Start production server

# Database
npx prisma studio        # Visual database editor
npx prisma migrate dev   # Create new migration
npx prisma generate      # Regenerate Prisma Client
npx prisma db push       # Push schema without migration

# Code Quality
npm run lint            # Run ESLint
```

---

## 🐛 Troubleshooting

### Database Connection Error
- Proveri `DATABASE_URL` u `.env`
- Ako koristiš Neon, dodaj `?sslmode=require` na kraj URL-a
- Test connection: `npx prisma db push`

### OpenAI API Error
- API key je već konfigurisan u `.env`
- Proveri da imaš credits na OpenAI account-u
- Free tier ima rate limits

### Stripe Webhook Not Working
- Za local development koristi Stripe CLI:
  ```bash
  stripe listen --forward-to localhost:3000/api/stripe/webhooks
  ```

---

## 🎉 Ready to Launch!

Sada imaš:
- ✅ Full-stack Next.js app
- ✅ PostgreSQL database
- ✅ Authentication system
- ✅ Stripe billing (ready to configure)
- ✅ OpenAI integration
- ✅ Admin dashboard

**Sve radi lokalno! Deploy to production kada budeš spreman.**

---

## 📞 Need Help?

Ako nešto ne radi, proveri:
1. `.env` fajl - svi potrebni keys
2. Database connection - `npx prisma studio`
3. Dependencies - `npm install`
4. Console errors - Developer Tools u browseru

**Sreća sa lanciranjem! 🚀✨**
