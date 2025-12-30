# Daily & Weekly Horoscopes Feature

AI-powered daily and weekly horoscopes for all 12 zodiac signs.

## Features

### ✨ What's Included

- **Daily Horoscopes**: AI-generated daily guidance covering:
  - General overview
  - Love & relationships
  - Career & work
  - Health & wellness
  - Lucky number & color

- **Weekly Horoscopes**: Detailed weekly forecasts including:
  - Extended overview
  - Love guidance
  - Career insights
  - Health tips
  - Money & finances
  - Lucky number & color

- **12 Zodiac Signs**: Full support for all signs
  - ♈ Aries
  - ♉ Taurus
  - ♊ Gemini
  - ♋ Cancer
  - ♌ Leo
  - ♍ Virgo
  - ♎ Libra
  - ♏ Scorpio
  - ♐ Sagittarius
  - ♑ Capricorn
  - ♒ Aquarius
  - ♓ Pisces

## Architecture

### Database Schema

```prisma
model Horoscope {
  id          String        @id @default(cuid())
  sign        ZodiacSign    // ARIES, TAURUS, etc.
  type        HoroscopeType // DAILY or WEEKLY
  date        DateTime      @db.Date
  content     Json          // {general, love, career, health, money, luckyNumber, luckyColor}
  generatedAt DateTime      @default(now())

  @@unique([sign, type, date])
}
```

### API Endpoints

1. **GET /api/horoscopes/daily**
   - Get daily horoscope(s)
   - Query params: `?sign=ARIES` (optional)
   - Auto-generates if not in database

2. **GET /api/horoscopes/weekly**
   - Get weekly horoscope(s)
   - Query params: `?sign=LEO` (optional)
   - Auto-generates if not in database

3. **POST /api/cron/generate-horoscopes**
   - Cron endpoint for automated generation
   - Query params: `?type=daily|weekly|both`
   - Requires Bearer token authentication
   - Called automatically by Vercel Cron

### Cron Jobs

Configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-horoscopes?type=daily",
      "schedule": "0 2 * * *"  // Every day at 2 AM UTC
    },
    {
      "path": "/api/cron/generate-horoscopes?type=weekly",
      "schedule": "0 3 * * 1"  // Every Monday at 3 AM UTC
    }
  ]
}
```

## Setup Instructions

### 1. Environment Variables

Add to your `.env` file:

```bash
CRON_SECRET="your-random-secret-here"
```

**Important**: Also add this to your Vercel Environment Variables if deploying to Vercel.

### 2. Database Migration

The schema has already been pushed. If starting fresh:

```bash
npx prisma db push
```

### 3. Manual Testing

Generate horoscopes manually (for testing):

```bash
# Daily horoscopes
curl -X POST http://localhost:3000/api/cron/generate-horoscopes?type=daily \
  -H "Authorization: Bearer your-cron-secret"

# Weekly horoscopes
curl -X POST http://localhost:3000/api/cron/generate-horoscopes?type=weekly \
  -H "Authorization: Bearer your-cron-secret"

# Force weekly even if not Monday
curl -X POST "http://localhost:3000/api/cron/generate-horoscopes?type=weekly&force=true" \
  -H "Authorization: Bearer your-cron-secret"
```

### 4. Vercel Deployment

When deploying to Vercel:

1. Add `CRON_SECRET` to Vercel Environment Variables
2. Vercel will automatically set up cron jobs from `vercel.json`
3. Cron jobs will run on schedule (2 AM daily, 3 AM Mondays)

## Usage

### Homepage Section

The horoscope section is already integrated into the homepage (`/`).

### Dedicated Page

Visit `/horoscopes` for the full horoscope experience with:
- Daily/Weekly toggle
- Zodiac sign selector
- Detailed horoscope view
- SEO-optimized metadata

### Component Usage

```tsx
import HoroscopeSection from '@/components/horoscopes/HoroscopeSection'

export default function MyPage() {
  return <HoroscopeSection />
}
```

## AI Generation

Horoscopes are generated using OpenAI's GPT-4o-mini model with:
- Structured JSON responses
- Astrological knowledge prompting
- Sign-specific customization
- Date-aware generation

### Cost Optimization

- Horoscopes are cached in database
- Only generated once per day/week per sign
- Auto-generated on-demand if missing
- Parallel generation for efficiency

## Navigation

The horoscopes feature is accessible via:
- Navbar link: "🔮 Horoscopes"
- Direct URL: `/horoscopes`
- Homepage section (scroll down)

## Future Enhancements

Potential improvements:
- [ ] Monthly horoscopes
- [ ] Personalized horoscopes based on user's natal chart
- [ ] Horoscope notifications (email/push)
- [ ] Historical horoscope archive
- [ ] Horoscope sharing on social media
- [ ] Transit-based horoscope refinement

## Troubleshooting

### Horoscopes not generating?

1. Check OpenAI API key is valid
2. Verify CRON_SECRET is set correctly
3. Check database connection
4. Review API logs for errors

### Cron jobs not running?

1. Verify `vercel.json` is in root directory
2. Check Vercel dashboard for cron job logs
3. Ensure CRON_SECRET is set in Vercel env vars
4. Test endpoint manually first

## Support

For issues or questions about the horoscope feature, check:
- Database logs: `npx prisma studio`
- API logs: Vercel Dashboard or local console
- Cron logs: Vercel Dashboard → Settings → Cron Jobs
