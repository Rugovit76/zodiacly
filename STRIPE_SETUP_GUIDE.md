# 🔧 Stripe Setup Guide - Kompletna Instrukcija

## 📊 Trenutni Status

### ✅ ŠTO JE GOTOVO:
- ✅ Stripe SDK instaliran (v14.25.0)
- ✅ API ključevi validni i funkcionalni
- ✅ Konekcija sa Stripe API radi
- ✅ **PRO Monthly Price** konfigurisano (€11.99/month)
- ✅ Product "Zodiacly Pro" kreiran
- ✅ Live mode aktivan

### ⚠️ ŠTO NEDOSTAJE:
- ❌ **PRO Yearly Price** (€119/year)
- ❌ **Webhook Secret** za automatski upgrade korisnika
- ⚠️ TEST mode setup za development

---

## 🎯 KORAK 1: Kreiranje PRO Yearly Price

### A) Login u Stripe Dashboard
1. Idi na: https://dashboard.stripe.com/
2. Login sa svojim account-om

### B) Navigacija do Products
1. U left sidebar, klikni **"Products"**
2. Pronaći postojeći product: **"Zodiacly Pro"**
3. Klikni na product name da otvoriš detalje

### C) Dodavanje Yearly Price
1. U product details, skroluj do **"Pricing"** sekcije
2. Klikni dugme **"+ Add another price"**

3. Popuni sledeće:
   ```
   Price: €119.00
   Billing period: Yearly
   Currency: EUR
   Payment type: Recurring
   ```

4. **Optional Settings** (klikni "Show more options"):
   ```
   Description: Annual subscription (save €24)
   Lookup key: zodiacly_pro_yearly
   ```

5. Klikni **"Add price"**

### D) Kopiraj Price ID
1. Nakon kreiranja, videćeš novu price entry
2. Price ID izgleda: `price_1Xxx...` (počinje sa "price_1")
3. Klikni na Price ID da ga kopiraš
4. **BITNO:** Sačuvaj ovaj ID!

### E) Update .env File
```env
# Zameni ovu liniju:
STRIPE_PRICE_PRO_YEARLY="price_..."

# Sa novim Price ID:
STRIPE_PRICE_PRO_YEARLY="price_1XxxxxxxxxxxxxXXXXX"
```

### F) Verifikacija
Restart dev server i ponovo pokreni test:
```bash
npm run dev
node test-stripe.js
```

---

## 🔔 KORAK 2: Setup Webhook Endpoint

### A) Šta su Webhooks?
Webhooks su notifikacije koje Stripe šalje tvojoj aplikaciji kada se desi payment event (npr. subscription completed, canceled, etc.).

**Bez webhook-a:**
- Korisnik plati na Stripe → ali tvoj backend ne zna!
- Account ostaje FREE umesto da postane PRO
- Moraš ručno upgrade-ovati

**Sa webhook-om:**
- Korisnik plati na Stripe → Stripe pošalje webhook
- Tvoj backend automatski upgradeuje account na PRO
- Sve radi automatski! 🎉

### B) Opcija 1: Setup za PRODUCTION (Deploy-ovana aplikacija)

#### 1. Login u Stripe Dashboard
https://dashboard.stripe.com/

#### 2. Navigate to Webhooks
- Left sidebar → **"Developers"**
- Klikni **"Webhooks"** tab

#### 3. Add Endpoint
- Klikni **"+ Add endpoint"**

#### 4. Configure Endpoint
```
Endpoint URL: https://TVOJ-DOMEN.com/api/stripe/webhooks

Primer: https://zodiacly.vercel.app/api/stripe/webhooks
```

#### 5. Select Events to Listen
Klikni **"Select events"** i odaberi sledeće:

**Customer Events:**
- ✅ `customer.subscription.created`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`

**Checkout Events:**
- ✅ `checkout.session.completed`

Klikni **"Add events"** → **"Add endpoint"**

#### 6. Copy Webhook Secret
- Nakon kreiranja endpoint-a, videćeš **"Signing secret"**
- Klikni **"Reveal"** da vidiš secret
- Secret počinje sa `whsec_...`
- **Kopiraj ovaj secret!**

#### 7. Update .env
```env
# Zameni:
STRIPE_WEBHOOK_SECRET="whsec_..."

# Sa pravim secret-om:
STRIPE_WEBHOOK_SECRET="whsec_ABCDEFGxxxxxxxxxxxxxxxxxx"
```

### C) Opcija 2: Setup za LOCAL DEVELOPMENT (Stripe CLI)

Za testiranje webhook-a lokalno (bez deploy-a):

#### 1. Install Stripe CLI
- Download: https://stripe.com/docs/stripe-cli
- Windows: Download .exe i instaliraj
- Mac: `brew install stripe/stripe-cli/stripe`

#### 2. Login to Stripe CLI
```bash
stripe login
```
Otvoriće browser za autentikaciju.

#### 3. Forward Webhooks to localhost
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

**Output će biti:**
```
> Ready! Your webhook signing secret is whsec_LOCAL_SECRET_HERE

> 🔔 Listening for events matching endpoint... (Ctrl+C to quit)
```

#### 4. Copy Local Secret
Kopiraj `whsec_...` secret iz output-a.

#### 5. Update .env (samo za LOCAL testing)
```env
STRIPE_WEBHOOK_SECRET="whsec_LOCAL_SECRET_FROM_CLI"
```

#### 6. Keep Stripe CLI Running
Ostavi terminal window otvoren dok razvijaš!

---

## 🧪 KORAK 3: Testiranje Checkout Flow-a

### A) Pokreni Development Server
```bash
npm run dev
```

### B) Login kao FREE User
1. Idi na http://localhost:3000/auth/login
2. Login ili register novi account

### C) Idi na Dashboard
http://localhost:3000/dashboard

### D) Klikni "Upgrade to PRO"
- Trebao bi da vidiš CTA karticu sa pricing opcijama
- Klikni **"€11.99/month"** ili **"€119/year"** (ako si kreirao yearly price)

### E) Stripe Checkout Page
Redirectovaće te na Stripe checkout page.

#### Test Mode Card Numbers:
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Auth Required: 4000 0025 0000 3155

Expiry: bilo koji budući datum (npr. 12/25)
CVC: bilo koja 3 broja (npr. 123)
ZIP: bilo koji 5 brojeva (npr. 12345)
```

#### Live Mode - PRAVA KARTICA!
⚠️ **Ako koristiš LIVE mode, moraš uneti PRAVU karticu!**
- Real charges will be made!
- Ne koristi test card numbers!

### F) Complete Payment
1. Unesi payment info
2. Klikni **"Subscribe"**
3. Trebao bi da te vrati na dashboard

### G) Verify Upgrade
Proveri:
- ✅ Dashboard prikazuje **"PRO"** badge
- ✅ "Create Chart" ne bi trebao da ima limit
- ✅ "AI Readings" quota bi trebao da kaže `/100`

### H) Check Webhook (ako koristiš Stripe CLI)
U terminal window gde stripe CLI radi, trebalo bi da vidiš:
```
✓ checkout.session.completed [evt_xxx...] POST /api/stripe/webhooks
```

---

## 🔄 KORAK 4: TEST MODE vs LIVE MODE

### Trenutno Stanje:
- **LIVE MODE** (sk_live_... keys)
- Real charges
- Requires real cards

### Preporuka za Development:
Koristi **TEST MODE** dok razvijaš!

### Kako Switchovati na TEST Mode:

#### 1. U Stripe Dashboard
- Gore desno, videćeš toggle: **"Test mode"**
- Klikni da switchuješ na Test mode

#### 2. Get Test API Keys
- Idi na **Developers → API Keys**
- Kopiraj:
  - `Publishable key` (pk_test_...)
  - `Secret key` (sk_test_...)

#### 3. Create Test Prices
U TEST mode, moraš ponovo kreirati prices:
- Idi na **Products**
- Create "Zodiacly Pro" product
- Add monthly price (€11.99)
- Add yearly price (€119)
- Copy test price IDs

#### 4. Update .env for TEST mode
```env
# TEST MODE KEYS
STRIPE_SECRET_KEY="sk_test_YOUR_TEST_SECRET_KEY"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_TEST_PUBLIC_KEY"
STRIPE_PRICE_PRO_MONTHLY="price_test_MONTHLY_PRICE_ID"
STRIPE_PRICE_PRO_YEARLY="price_test_YEARLY_PRICE_ID"
```

#### 5. Setup Test Webhook
- Same process kao production
- Ali URL može biti localhost (sa Stripe CLI forward)

### Prednosti TEST Mode:
- ✅ Safe testing
- ✅ Test card numbers work
- ✅ No real charges
- ✅ Unlimited testing
- ✅ Can reset data anytime

### Kada Koristiti LIVE Mode:
- ✅ Production deployment
- ✅ Real user testing
- ✅ Beta launch
- ✅ Go-live

---

## ✅ FINALNA VERIFIKACIJA

Nakon što završiš sve korake, pokreni test ponovo:

```bash
node test-stripe.js
```

**Expected Output:**
```
✅ Stripe Connection: WORKING
✅ API Keys: VALID
✅ Monthly Price: Configured
✅ Yearly Price: Configured  ← Should be ✅ now!
✅ Webhook Secret: Configured  ← Should be ✅ now!
```

---

## 📋 CHECKLIST

- [ ] **Kreiran PRO Yearly Price** (€119/year)
- [ ] **Kopiran Yearly Price ID u .env**
- [ ] **Setup Webhook Endpoint** (production ili local)
- [ ] **Kopiran Webhook Secret u .env**
- [ ] **Testiran checkout flow** (sa test/real karticom)
- [ ] **Verifikovano automatski upgrade** (FREE → PRO)
- [ ] **Testiran billing portal** (manage subscription)
- [ ] **Razmotreno prebacivanje na TEST mode** (za development)

---

## 🆘 TROUBLESHOOTING

### Problem: Webhook ne stiže
**Rešenje:**
1. Proveri da li Stripe CLI radi (`stripe listen`)
2. Proveri webhook URL (mora biti `/api/stripe/webhooks`)
3. Proveri da li webhook secret u .env je copy-paste correctly

### Problem: Checkout ne radi
**Rešenje:**
1. Proveri da li price IDs su validni
2. Proveri da li user je ulogovan (requireAuth)
3. Check browser console za errors

### Problem: Account ne upgradeuje se na PRO
**Rešenje:**
1. Check da li webhook stigao (Stripe Dashboard → Webhooks → Events)
2. Check database (User tabela) - da li `plan` = PRO?
3. Check webhook handler logs (backend console)

### Problem: "Invalid API Key" error
**Rešenje:**
1. Proveri da li koristiš isti mode (test vs live)
2. Proveri da li key počinje sa `sk_` (secret key)
3. Copy-paste key ponovo (možda ima space ili typo)

---

## 📞 DODATNA POMOĆ

- **Stripe Docs:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com/
- **Webhooks Guide:** https://stripe.com/docs/webhooks

---

## 🎉 ZAVRŠETAK

Kada zavrsis sve korake:
1. ✅ Stripe će biti potpuno funkcionalan
2. ✅ Korisnici će moći da subscribe na PRO
3. ✅ Automatski upgrade nakon payment-a
4. ✅ Billing portal za upravljanje subscription-om
5. ✅ Svi payment flows će raditi!

**Good luck! 🚀**
