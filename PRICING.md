# Zodiacly Pricing Guide

## Current Pricing (Updated December 2025)

### 💚 FREE Plan - €0/forever

**Perfect for exploring astrology!**

#### What's Included:
✅ **Natal Charts**
- Create instant natal charts (no signup required!)
- Full chart visualization with all planets
- View all planetary positions and aspects
- Beautiful 2D chart wheel
- Must register to save charts

✅ **Numerology**
- Calculate all 7 core numbers instantly
- Life Path, Expression, Soul Urge, Personality, Birthday, Maturity, Personal Year
- Master Numbers detection (11, 22, 33)
- Number meanings and keywords
- No signup required for calculations

✅ **Horoscopes**
- Daily horoscopes for all 12 zodiac signs
- Weekly horoscopes
- AI-generated fresh content
- Free access forever

✅ **Blog & Learning**
- Access to all blog articles
- Astrology guides and tutorials
- Numerology explanations
- Compatibility tips

✅ **Basic Tools**
- Location search with geocoding
- Birth time calculator (coming soon)
- Public chart viewing

#### Limitations:
❌ No AI interpretations for natal charts
❌ No AI numerology readings
❌ No AI compatibility analysis
❌ Can only save 1 natal chart (must register)
❌ No chart export (PNG/PDF)
❌ No priority support

---

### 💎 PRO Plan - €11.99/month or €119/year

**For serious astrology enthusiasts!**

#### Monthly: €11.99/month
- Billed monthly
- Cancel anytime
- No commitment

#### Yearly: €119/year
- **Save €24** compared to monthly!
- Best value
- 2 months free

---

## PRO Features Breakdown

### 🔮 Unlimited Natal Charts
- Create as many charts as you want
- Save all your family and friends
- No limits, ever
- Organized dashboard

### 🤖 100 AI Interpretations/Month
**Includes:**
- Natal chart readings
- Numerology interpretations
- Compatibility analyses
- All powered by GPT-4o-mini

**Usage resets monthly**
- Generous 100 call limit
- Covers ~25-30 full chart readings
- Or ~50 numerology readings
- Or any combination

### 📊 Full Natal Chart Analysis
**AI-Powered Interpretations:**
- ✨ Planet-by-planet analysis (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
- 🏠 All 12 houses interpreted
- 🔗 Major aspects explained (conjunction, opposition, trine, square, sextile)
- 📝 Overall chart synthesis
- 💡 Life purpose insights
- 🎯 Strengths & challenges

### 🔢 AI Numerology Readings
**Detailed Interpretations For:**
- Life Path Number - Your life's purpose and journey
- Expression Number - Your talents and destiny
- Soul Urge Number - Your inner desires and motivations
- Personality Number - How others perceive you
- Personal Year Number - This year's themes and opportunities

**Each reading includes:**
- Detailed multi-paragraph explanation
- Specific guidance and advice
- How to leverage your numbers
- What to watch out for

### 💑 Synastry Compatibility Analysis
**AI-Powered Relationship Insights:**
- Overall compatibility score and summary
- Strengths in the relationship
- Challenges to work on
- Planet-to-planet aspect interpretations
- Specific advice for harmony
- Love, communication, and values compatibility

### 📥 Export Features
- **PNG Export** - High-quality chart images
- **PDF Export** - Print-ready documents
- Share charts professionally
- Print for clients or personal use

### 🎯 Additional PRO Benefits
- ⚡ Priority customer support
- 🚀 Early access to new features
- 💾 Unlimited chart storage
- 🔄 Chart comparison tools
- 📱 Mobile app access (coming soon)

---

## Pricing History

### Previous Pricing (v1.0.0)
- PRO Monthly: €6.99/month
- PRO Yearly: €69/year

### Current Pricing (v2.0.0)
- PRO Monthly: **€11.99/month** (+€5)
- PRO Yearly: **€119/year** (+€50)

**Reason for Increase:**
The platform has grown significantly with major new features:
- Complete numerology system
- Compatibility analysis
- Daily/weekly horoscopes
- Educational blog
- Social sharing
- Enhanced AI features

The new pricing reflects the expanded value and positions us competitively in the market.

---

## Market Comparison

| Platform | Monthly Price | Features |
|----------|--------------|----------|
| **Zodiacly** | **€11.99** | Natal charts + Numerology + Compatibility + Horoscopes + AI |
| Co-Star | $14.99 | Natal chart + Daily insights |
| The Pattern | $11.99 | Personality patterns + Timing |
| Sanctuary | $19.99 | Live astrologer access |
| TimePassages | $29.99/year | Charts + Transits |
| Astro.com Extended | $69/year | Charts + Forecasts |

**Zodiacly Advantage:**
✅ Most comprehensive feature set
✅ AI-powered (instant results)
✅ Numerology included
✅ Competitive pricing
✅ No app required (web-based)

---

## Upgrade Benefits

### Why Upgrade to PRO?

1. **Unlimited Creation**
   - Create charts for everyone you know
   - No more "you can only save 1 chart" limits
   - Build your cosmic library

2. **Deep Insights**
   - AI reveals what your chart truly means
   - Not just data, but understanding
   - Personalized to YOUR unique chart

3. **Relationship Clarity**
   - Understand compatibility with partners
   - Navigate challenging relationships
   - Find your ideal matches

4. **Life Guidance**
   - Numerology + Astrology combined
   - Know your life path and purpose
   - Make decisions with cosmic wisdom

5. **Professional Quality**
   - Export for clients or personal use
   - Share professional-looking charts
   - Print and keep forever

---

## Stripe Integration

### Payment Methods Accepted
- 💳 Credit Cards (Visa, Mastercard, Amex)
- 💳 Debit Cards
- 🏦 SEPA Direct Debit (Europe)
- 💰 Link
- 🍎 Apple Pay
- 🤖 Google Pay

### Security
- 🔒 Stripe's industry-leading security
- 🔐 PCI DSS compliant
- 🛡️ 3D Secure authentication
- 🔑 No card details stored on our servers

### Billing
- Automatic monthly/yearly billing
- Email receipts for all payments
- Customer portal for self-service
- Easy cancellation anytime

---

## Refund Policy

### 30-Day Money-Back Guarantee
- Not satisfied? Full refund within 30 days
- No questions asked
- Email support@zodiacly.com
- Refund processed in 5-7 business days

### Cancellation
- Cancel anytime from customer portal
- No cancellation fees
- Access continues until period ends
- No partial refunds after 30 days

---

## Stripe Price IDs (For Developers)

### Test Mode
```env
STRIPE_PRICE_PRO_MONTHLY="price_test_monthly_1199"
STRIPE_PRICE_PRO_YEARLY="price_test_yearly_119"
```

### Production Mode
```env
STRIPE_PRICE_PRO_MONTHLY="price_live_monthly_1199"
STRIPE_PRICE_PRO_YEARLY="price_live_yearly_119"
```

**Important:** Update these in Stripe Dashboard after creating the new price points!

---

## Setting Up New Prices in Stripe

### Step 1: Create Products
1. Go to Stripe Dashboard → Products
2. Find "Zodiacly PRO" product (or create it)

### Step 2: Add New Prices
1. Click "Add another price"
2. **For Monthly:**
   - Amount: €11.99
   - Billing period: Monthly
   - Currency: EUR
   - Save and copy Price ID
3. **For Yearly:**
   - Amount: €119
   - Billing period: Yearly
   - Currency: EUR
   - Save and copy Price ID

### Step 3: Update Environment Variables
```bash
# In .env file
STRIPE_PRICE_PRO_MONTHLY="price_xxxxxxxxxxxxx"
STRIPE_PRICE_PRO_YEARLY="price_yyyyyyyyyyyyyyy"
```

### Step 4: Update Checkout Code
The code in `lib/stripe/checkout.ts` already references:
```typescript
const priceId = billingPeriod === 'monthly'
  ? process.env.STRIPE_PRICE_PRO_MONTHLY
  : process.env.STRIPE_PRICE_PRO_YEARLY
```

### Step 5: Archive Old Prices (Optional)
- Keep old prices for existing subscribers
- Archive them so new users can't select them
- Existing subscriptions continue at old price until they cancel

---

## Grandfathering Policy

### Existing Subscribers (€6.99 plan)
- Will keep €6.99/month pricing forever
- No forced upgrade to new price
- Same features as €11.99 plan
- Thank you for being an early supporter! 💚

### New Subscribers (After Update)
- Pay €11.99/month or €119/year
- All the same features
- Fair pricing for expanded platform

---

## Customer Portal

Users can manage their subscription at:
`/api/stripe/portal` → Redirects to Stripe Customer Portal

**Features:**
- Update payment method
- View invoices and receipts
- Cancel subscription
- Update billing email
- Download invoice PDFs

---

## Revenue Projections

### Conservative Estimate
- 100 FREE users
- 10 PRO users (10% conversion)
- **Monthly Recurring Revenue (MRR):** €119.90
- **Annual Recurring Revenue (ARR):** €1,438.80

### Moderate Estimate
- 500 FREE users
- 50 PRO users (10% conversion)
- **MRR:** €599.50
- **ARR:** €7,194

### Optimistic Estimate
- 1,000 FREE users
- 200 PRO users (20% conversion)
- **MRR:** €2,398
- **ARR:** €28,776

### With Yearly Plans (50% yearly)
If 50% choose yearly (€119):
- Lower MRR initially
- Higher LTV (Lifetime Value)
- Lower churn rates
- Better cash flow

---

## Upgrade CTA Copy

### Dashboard CTA (FREE Users)
```
🌟 Upgrade to PRO

Unlock unlimited charts, AI-powered readings, and deep cosmic insights!

€11.99/month or €119/year (save €24)

[Upgrade Now]
```

### After Chart Creation (FREE Users)
```
🔮 Want to know what this means?

Upgrade to PRO for AI-powered interpretations that reveal:
• Your life purpose and soul mission
• Hidden strengths and challenges
• Relationship compatibility secrets
• Personalized guidance and advice

[Get Full Reading - Upgrade to PRO]
```

### Numerology Page (FREE Users)
```
✨ Get Deeper Insights

You've calculated your numbers. Now discover what they truly mean!

PRO includes:
✓ Detailed Life Path interpretation
✓ Expression Number analysis
✓ Soul Urge & Personality readings
✓ Personal Year forecast

[Unlock AI Reading - €11.99/month]
```

---

**Last Updated:** December 28, 2025
**Version:** 2.0.0
**Contact:** billing@zodiacly.com
