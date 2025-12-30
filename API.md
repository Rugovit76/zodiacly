# Zodiacly API Documentation

Complete API reference for all Zodiacly endpoints.

## Base URL

```
Development: http://localhost:3000
Production: https://zodiacly.com
```

## Authentication

Most endpoints require authentication via JWT token stored in httpOnly cookie.

### Cookie Name
```
zodiacly_session
```

### Authentication Header
Not required - authentication handled via httpOnly cookies automatically.

---

## Authentication Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Validation:**
- Email: Valid email format
- Password: Minimum 8 characters

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "plan": "FREE",
      "role": "USER"
    }
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### Login User

Authenticate user and create session.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "clx1234567890",
      "email": "user@example.com",
      "plan": "PRO",
      "role": "USER"
    }
  }
}
```

**Sets Cookie:**
```
zodiacly_session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

**Error (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

### Logout User

Clear session and logout user.

**Endpoint:** `POST /api/auth/logout`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Clears Cookie:** `zodiacly_session`

---

## Chart Endpoints

### Create Natal Chart

Calculate and save a new natal chart.

**Endpoint:** `POST /api/charts/create`

**Authentication:** Required

**Request Body:**
```json
{
  "birthDate": "1990-05-15",
  "birthTime": "14:30",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timezone": "America/New_York",
  "location": "New York, NY, USA"
}
```

**Validation:**
- birthDate: ISO 8601 date format
- birthTime: HH:MM format
- latitude: -90 to 90
- longitude: -180 to 180
- timezone: Valid IANA timezone
- location: Non-empty string

**Response (201):**
```json
{
  "success": true,
  "data": {
    "chart": {
      "id": "clx9876543210",
      "birthDate": "1990-05-15T00:00:00.000Z",
      "location": "New York, NY, USA",
      "chartData": {
        "planets": [
          {
            "name": "Sun",
            "sign": "Taurus",
            "degree": 24.5,
            "house": 10
          },
          {
            "name": "Moon",
            "sign": "Cancer",
            "degree": 12.3,
            "house": 12
          }
        ],
        "houses": [
          {
            "number": 1,
            "sign": "Leo",
            "degree": 15.7
          }
        ],
        "ascendant": {
          "sign": "Leo",
          "degree": 15.7
        },
        "aspects": [
          {
            "planet1": "Sun",
            "planet2": "Moon",
            "aspect": "Sextile",
            "angle": 60,
            "orb": 2.1
          }
        ]
      },
      "aiReading": null,
      "createdAt": "2025-12-26T10:00:00.000Z"
    }
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Invalid birth data"
}
```

**Error (403) - FREE user with chart limit:**
```json
{
  "success": false,
  "error": "Upgrade to PRO to create more charts"
}
```

---

### List User Charts

Get all charts belonging to authenticated user.

**Endpoint:** `GET /api/charts`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "charts": [
      {
        "id": "clx9876543210",
        "birthDate": "1990-05-15T00:00:00.000Z",
        "location": "New York, NY, USA",
        "createdAt": "2025-12-26T10:00:00.000Z",
        "aiReading": null
      },
      {
        "id": "clx1111111111",
        "birthDate": "1985-08-22T00:00:00.000Z",
        "location": "Los Angeles, CA, USA",
        "createdAt": "2025-12-25T15:30:00.000Z",
        "aiReading": {
          "overview": "Your chart shows..."
        }
      }
    ]
  }
}
```

---

### Get Chart by ID

Get detailed chart information.

**Endpoint:** `GET /api/charts/[id]`

**Authentication:** Required

**URL Parameters:**
- `id`: Chart ID (CUID)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "chart": {
      "id": "clx9876543210",
      "birthDate": "1990-05-15T00:00:00.000Z",
      "birthTime": "14:30",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "timezone": "America/New_York",
      "location": "New York, NY, USA",
      "chartData": { },
      "aiReading": null,
      "createdAt": "2025-12-26T10:00:00.000Z",
      "userId": "clx1234567890"
    }
  }
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Chart not found"
}
```

**Error (403):**
```json
{
  "success": false,
  "error": "Unauthorized to view this chart"
}
```

---

### Delete Chart

Delete a chart owned by authenticated user.

**Endpoint:** `DELETE /api/charts/[id]`

**Authentication:** Required

**URL Parameters:**
- `id`: Chart ID (CUID)

**Response (200):**
```json
{
  "success": true,
  "message": "Chart deleted successfully"
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Chart not found"
}
```

**Error (403):**
```json
{
  "success": false,
  "error": "Unauthorized to delete this chart"
}
```

---

### Generate AI Interpretation

Generate AI-powered astrological interpretation for a chart.

**Endpoint:** `POST /api/charts/[id]/interpret`

**Authentication:** Required

**URL Parameters:**
- `id`: Chart ID (CUID)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "aiReading": {
      "overview": "Your natal chart reveals a dynamic personality with strong creative potential...",
      "planets": [
        {
          "planet": "Sun",
          "interpretation": "Sun in Taurus in the 10th house suggests..."
        },
        {
          "planet": "Moon",
          "interpretation": "Moon in Cancer in the 12th house indicates..."
        }
      ],
      "houses": [
        {
          "house": 1,
          "interpretation": "With Leo rising, you project..."
        }
      ],
      "aspects": [
        {
          "aspect": "Sun Sextile Moon",
          "interpretation": "This harmonious aspect between your Sun and Moon..."
        }
      ]
    },
    "usageRemaining": 99
  }
}
```

**Error (403) - Usage limit exceeded:**
```json
{
  "success": false,
  "error": "Monthly AI reading limit reached. Upgrade to PRO or wait until next month."
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Chart not found"
}
```

---

## Stripe Endpoints

### Create Checkout Session

Create Stripe checkout session for PRO subscription.

**Endpoint:** `POST /api/stripe/checkout`

**Authentication:** Required

**Request Body:**
```json
{
  "priceType": "monthly"
}
```

**Valid priceType values:**
- `"monthly"` - €6.99/month
- `"yearly"` - €69/year

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Invalid price type"
}
```

---

### Create Billing Portal Session

Create Stripe billing portal session for subscription management.

**Endpoint:** `POST /api/stripe/portal`

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/p/session/..."
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "No Stripe customer found"
}
```

---

### Stripe Webhooks

Handle Stripe webhook events.

**Endpoint:** `POST /api/webhooks/stripe`

**Authentication:** Stripe signature verification

**Headers:**
```
stripe-signature: t=1234567890,v1=abc123...,v0=def456...
```

**Events Handled:**
- `checkout.session.completed` - Upgrade user to PRO
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Downgrade user to FREE

**Response (200):**
```json
{
  "received": true
}
```

**Error (400):**
```json
{
  "error": "Invalid signature"
}
```

---

## Admin Endpoints

### Get Platform Statistics

Get platform-wide statistics.

**Endpoint:** `GET /api/admin/stats`

**Authentication:** Required (ADMIN role)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1543,
    "proUsers": 234,
    "freeUsers": 1309,
    "totalCharts": 4521,
    "totalAiReadings": 1832,
    "monthlyRecurringRevenue": 1634.66,
    "aiCallsThisMonth": 2341,
    "averageChartsPerUser": 2.93
  }
}
```

**Error (403):**
```json
{
  "success": false,
  "error": "Admin access required"
}
```

---

### List All Users

Get list of all users with pagination.

**Endpoint:** `GET /api/admin/users`

**Authentication:** Required (ADMIN role)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50, max: 100)
- `plan` (optional): Filter by plan ("FREE" | "PRO")

**Example:**
```
GET /api/admin/users?page=2&limit=25&plan=PRO
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "clx1234567890",
        "email": "user@example.com",
        "plan": "PRO",
        "role": "USER",
        "createdAt": "2025-12-20T10:00:00.000Z",
        "stripeCustomerId": "cus_...",
        "subscriptionStatus": "ACTIVE"
      }
    ],
    "pagination": {
      "page": 2,
      "limit": 25,
      "total": 234,
      "pages": 10
    }
  }
}
```

---

## Error Codes

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

---

## Rate Limiting

### Current Implementation
- AI interpretations limited by plan (FREE: 1/month, PRO: 100/month)
- Chart creation limited by plan (FREE: 1 total, PRO: unlimited)

### Future Implementation
- General API rate limiting: 100 requests/minute per IP
- Webhook rate limiting: 50 requests/minute per endpoint

---

## Usage Tracking

### AI Reading Limits

**FREE Plan:**
- 1 AI interpretation per month
- Resets on 1st of each month

**PRO Plan:**
- 100 AI interpretations per month
- Resets on 1st of each month

**Tracking:**
- Counter in `Usage` table
- Incremented on successful AI reading generation
- Checked before each AI reading request

---

## Testing

### Test Mode (Stripe)

Use Stripe test cards:

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Exp: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

**Declined Payment:**
```
Card: 4000 0000 0000 0002
```

### Test Users

See database seed file:
- `admin@zodiacly.com` / `admin123` (ADMIN, PRO)
- `user@zodiacly.com` / `user123` (USER, FREE)

---

## Webhooks

### Stripe Webhook Configuration

**Endpoint:**
```
https://your-domain.com/api/webhooks/stripe
```

**Events to Listen:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `invoice.payment_failed`

**Testing Webhooks Locally:**
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Data Models

### Planet Object
```typescript
{
  name: string          // e.g., "Sun", "Moon", "Mercury"
  sign: string          // e.g., "Aries", "Taurus"
  degree: number        // 0-29.99
  house: number         // 1-12
  retrograde?: boolean  // Optional
}
```

### House Object
```typescript
{
  number: number        // 1-12
  sign: string          // Zodiac sign
  degree: number        // 0-29.99
}
```

### Aspect Object
```typescript
{
  planet1: string       // First planet name
  planet2: string       // Second planet name
  aspect: string        // "Conjunction", "Sextile", "Square", "Trine", "Opposition"
  angle: number         // Exact angle (0, 60, 90, 120, 180)
  orb: number           // Orb/deviation from exact
}
```

---

## Best Practices

### Authentication
- Always check session before accessing protected resources
- Use `getSession()` helper from `lib/auth/session.ts`
- Never expose JWT_SECRET

### Error Handling
- Return consistent error format
- Log errors server-side
- Don't expose sensitive info in error messages

### Database
- Use Prisma for all database operations
- Always use parameterized queries
- Handle connection errors gracefully

### Stripe
- Always verify webhook signatures
- Handle idempotency for webhooks
- Log all webhook events to database

---

## Support

For API support, contact:
- **Email**: support@zodiacly.com
- **Documentation**: See README.md and ARCHITECTURE.md
