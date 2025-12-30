# Zodiacly Development Guide

Complete guide for developing features, coding standards, and best practices.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Coding Standards](#coding-standards)
4. [Development Workflow](#development-workflow)
5. [Testing](#testing)
6. [Common Tasks](#common-tasks)
7. [Debugging](#debugging)
8. [Best Practices](#best-practices)

---

## Development Setup

### Initial Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd zodiacly
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Environment Variables**
```bash
cp .env.example .env
# Edit .env with your local values
```

4. **Set Up Database**
```bash
# Option 1: Local PostgreSQL
createdb zodiacly

# Option 2: Neon (recommended)
# Get connection string from Neon dashboard

# Push schema
npx prisma db push

# Seed database
npx tsx prisma/seed.ts
```

5. **Start Development Server**
```bash
npm run dev
```

6. **Open Application**
```
http://localhost:3000
```

### Required Tools

- **Node.js** 18+ ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([download](https://git-scm.com/))
- **VS Code** (recommended) ([download](https://code.visualstudio.com/))
- **Prisma Studio** (included with Prisma)

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## Project Structure

### Directory Overview

```
zodiacly/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth layout group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Dashboard layout group
│   │   ├── dashboard/
│   │   └── chart/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── charts/
│   │   ├── stripe/
│   │   └── webhooks/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
│
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── charts/              # Chart-specific components
│   │   ├── ChartWheel.tsx
│   │   └── ...
│   └── Navbar.tsx           # Navigation
│
├── lib/                     # Core utilities
│   ├── auth/                # Authentication
│   │   ├── jwt.ts
│   │   ├── session.ts
│   │   └── password.ts
│   ├── stripe/              # Stripe integration
│   ├── openai/              # OpenAI integration
│   ├── astrology/           # Chart calculations
│   ├── usage/               # Usage tracking
│   └── db/                  # Database client
│
├── types/                   # TypeScript definitions
│   └── index.ts
│
├── prisma/                  # Database
│   ├── schema.prisma
│   └── seed.ts
│
├── public/                  # Static assets
│   └── ...
│
└── docs/                    # Documentation
    ├── README.md
    ├── ARCHITECTURE.md
    ├── API.md
    ├── DEPLOYMENT.md
    └── DEVELOPMENT.md
```

### File Naming Conventions

**React Components:**
- PascalCase: `Button.tsx`, `ChartWheel.tsx`, `UserProfile.tsx`
- One component per file
- Co-locate styles if component-specific

**Utilities:**
- camelCase: `jwt.ts`, `calculator.ts`, `formatDate.ts`
- Descriptive names
- Group by functionality

**API Routes:**
- kebab-case folders: `app/api/auth/login/route.ts`
- Always named `route.ts`

**Types:**
- PascalCase: `User`, `NatalChart`, `ChartData`
- Interfaces for objects, Types for unions/primitives

---

## Coding Standards

### TypeScript

**Always use TypeScript:**
```typescript
// ✅ Good
export async function createChart(data: BirthData): Promise<ChartData> {
  // ...
}

// ❌ Bad
export async function createChart(data) {
  // ...
}
```

**Define types for all data:**
```typescript
// ✅ Good
interface User {
  id: string
  email: string
  plan: 'FREE' | 'PRO'
}

// ❌ Bad
const user: any = { ... }
```

**Use strict mode:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### React

**Functional components only:**
```tsx
// ✅ Good
export default function Button({ children, onClick }: ButtonProps) {
  return <button onClick={onClick}>{children}</button>
}

// ❌ Bad (no class components)
class Button extends React.Component { ... }
```

**Use TypeScript for props:**
```tsx
// ✅ Good
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'outline'
}

export default function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}
```

**Server vs Client components:**
```tsx
// Server component (default)
export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Client component (explicit)
'use client'

import { useState } from 'react'

export default function Interactive() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Database

**Use Prisma for all queries:**
```typescript
// ✅ Good
const user = await prisma.user.findUnique({
  where: { id: userId }
})

// ❌ Bad (no raw SQL)
const user = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${userId}`
```

**Always use try-catch:**
```typescript
// ✅ Good
try {
  const chart = await prisma.natalChart.create({ data })
  return { success: true, data: chart }
} catch (error) {
  console.error('Failed to create chart:', error)
  return { success: false, error: 'Failed to create chart' }
}
```

### API Routes

**Consistent response format:**
```typescript
// ✅ Good
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const result = await doSomething(data)

    return NextResponse.json({
      success: true,
      data: result
    }, { status: 200 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Something went wrong'
    }, { status: 500 })
  }
}
```

**Validate session:**
```typescript
import { getSession } from '@/lib/auth/session'

export async function GET(request: Request) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Continue with authenticated logic
}
```

### Styling

**Use Tailwind CSS:**
```tsx
// ✅ Good
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
  Click me
</button>

// ❌ Bad (no inline styles)
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Click me
</button>
```

**Use semantic class names:**
```tsx
// ✅ Good
<div className="max-w-4xl mx-auto px-4 py-12">

// ❌ Bad (arbitrary values)
<div style="width: 900px; margin: 0 auto; padding: 48px 16px">
```

**Use custom theme:**
```tsx
// ✅ Good (using cosmic theme)
<h1 className="text-cosmic-primary">Title</h1>

// Defined in tailwind.config.ts
colors: {
  cosmic: {
    primary: '#9333EA',
    secondary: '#EC4899',
    accent: '#8B5CF6',
  }
}
```

---

## Development Workflow

### Git Workflow

**Branch Naming:**
```bash
# Features
git checkout -b feature/user-authentication
git checkout -b feature/chart-visualization

# Bug fixes
git checkout -b fix/login-error
git checkout -b fix/chart-calculation

# Improvements
git checkout -b improve/performance
git checkout -b improve/ui-responsiveness
```

**Commit Messages:**
```bash
# ✅ Good
git commit -m "Add user authentication with JWT"
git commit -m "Fix chart calculation for southern hemisphere"
git commit -m "Improve chart visualization performance"

# ❌ Bad
git commit -m "stuff"
git commit -m "WIP"
git commit -m "fixed bug"
```

**Pull Request Process:**
1. Create feature branch
2. Implement changes
3. Test thoroughly
4. Create PR with description
5. Request review
6. Address feedback
7. Merge to main

### Development Process

**1. Pick a Task**
- Check project board
- Assign to yourself
- Move to "In Progress"

**2. Create Branch**
```bash
git checkout main
git pull
git checkout -b feature/your-feature
```

**3. Implement Feature**
- Write code following standards
- Test as you go
- Commit frequently

**4. Test**
```bash
# Run type check
npm run type-check

# Run linter
npm run lint

# Manual testing
npm run dev
```

**5. Commit**
```bash
git add .
git commit -m "Descriptive message"
git push origin feature/your-feature
```

**6. Create PR**
- Describe changes
- Link related issues
- Add screenshots if UI changes
- Request review

**7. Deploy**
- Merge to main
- Vercel auto-deploys
- Monitor for errors

---

## Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new account
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login

**Chart Creation:**
- [ ] Create chart with valid data
- [ ] Handle invalid birth date
- [ ] Handle invalid location
- [ ] Chart displays correctly
- [ ] Chart saves to database
- [ ] FREE user limited to 1 chart

**Subscription:**
- [ ] Upgrade flow works
- [ ] Stripe checkout redirects correctly
- [ ] Webhook updates user plan
- [ ] PRO features unlock
- [ ] Billing portal accessible

**AI Readings:**
- [ ] Generate AI reading
- [ ] Usage counter increments
- [ ] Limit enforced (FREE: 1, PRO: 100)
- [ ] Reading saves correctly
- [ ] Error handling for API failures

### Database Testing

```bash
# Open Prisma Studio
npx prisma studio

# Manual queries
npx prisma db execute --stdin < test.sql

# Reset database (development only!)
npx prisma db push --force-reset
```

### API Testing

**Using curl:**
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Create chart (authenticated)
curl -X POST http://localhost:3000/api/charts/create \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"birthDate":"1990-05-15","birthTime":"14:30",...}'
```

---

## Common Tasks

### Adding a New Page

1. **Create page file:**
```tsx
// app/new-page/page.tsx
import { getSession } from '@/lib/auth/session'
import Navbar from '@/components/Navbar'

export default async function NewPage() {
  const session = await getSession()

  return (
    <div>
      <Navbar user={session} />
      <main>
        {/* Your content */}
      </main>
    </div>
  )
}
```

2. **Add to navigation:**
```tsx
// components/Navbar.tsx
<Link href="/new-page">New Page</Link>
```

### Adding a New API Endpoint

1. **Create route file:**
```typescript
// app/api/example/route.ts
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import prisma from '@/lib/db/prisma'

export async function GET(request: Request) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const data = await prisma.user.findUnique({
      where: { id: session.id }
    })

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal error' },
      { status: 500 }
    )
  }
}
```

2. **Update API documentation:**
```markdown
// API.md
### Example Endpoint

**Endpoint:** `GET /api/example`
...
```

### Adding a Database Model

1. **Update Prisma schema:**
```prisma
// prisma/schema.prisma
model NewModel {
  id        String   @id @default(cuid())
  field     String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  createdAt DateTime @default(now())

  @@index([userId])
}

// Add relation to User model
model User {
  // ...
  newModels NewModel[]
}
```

2. **Push to database:**
```bash
npx prisma db push
```

3. **Generate Prisma Client:**
```bash
npx prisma generate
```

4. **Create types:**
```typescript
// types/index.ts
export interface NewModel {
  id: string
  field: string
  userId: string
  createdAt: Date
}
```

### Adding a UI Component

1. **Create component:**
```tsx
// components/ui/NewComponent.tsx
import React from 'react'

interface NewComponentProps {
  title: string
  children: React.ReactNode
}

export default function NewComponent({ title, children }: NewComponentProps) {
  return (
    <div className="p-4 rounded-lg bg-cosmic-surface">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  )
}
```

2. **Export from barrel:**
```typescript
// components/ui/index.ts
export { default as NewComponent } from './NewComponent'
```

3. **Use in pages:**
```tsx
import { NewComponent } from '@/components/ui'

<NewComponent title="Example">
  Content here
</NewComponent>
```

---

## Debugging

### Common Issues

**Issue: "Prisma Client not found"**
```bash
# Solution
npx prisma generate
```

**Issue: "Module not found"**
```bash
# Solution: Clear Next.js cache
rm -rf .next
npm run dev
```

**Issue: "Database connection error"**
```bash
# Solution: Check DATABASE_URL
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

**Issue: "Session not persisting"**
```typescript
// Check cookie settings
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7 // 7 days
}
```

### Debug Tools

**Console Logging:**
```typescript
console.log('Debug:', variable)
console.error('Error:', error)
console.table(arrayOfObjects)
```

**VS Code Debugger:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

**React DevTools:**
- Install browser extension
- Inspect component tree
- View props and state

**Prisma Studio:**
```bash
npx prisma studio
```

---

## Best Practices

### Security

**Never commit secrets:**
```bash
# Add to .gitignore
.env
.env.local
.env.production
```

**Hash passwords:**
```typescript
import bcrypt from 'bcryptjs'

const hash = await bcrypt.hash(password, 10)
```

**Validate input:**
```typescript
// Use Zod for validation
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const result = schema.safeParse(data)
```

**Sanitize output:**
```typescript
// React handles this automatically
<div>{userInput}</div> // Safe, auto-escaped
```

### Performance

**Minimize database queries:**
```typescript
// ✅ Good: Single query with include
const user = await prisma.user.findUnique({
  where: { id },
  include: { natalCharts: true }
})

// ❌ Bad: Multiple queries
const user = await prisma.user.findUnique({ where: { id } })
const charts = await prisma.natalChart.findMany({ where: { userId: id } })
```

**Use React Server Components:**
```tsx
// ✅ Good: Fetch on server
export default async function Page() {
  const data = await fetchData()
  return <Display data={data} />
}

// ❌ Bad: Fetch on client
'use client'
export default function Page() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch('/api/data').then(...)
  }, [])
}
```

**Optimize images:**
```tsx
import Image from 'next/image'

<Image
  src="/chart.png"
  alt="Natal Chart"
  width={500}
  height={500}
/>
```

### Code Quality

**Keep functions small:**
```typescript
// ✅ Good: Single responsibility
async function createUser(email: string, password: string) {
  const hash = await hashPassword(password)
  return await prisma.user.create({
    data: { email, passwordHash: hash }
  })
}

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}
```

**Use meaningful names:**
```typescript
// ✅ Good
const userNatalCharts = await prisma.natalChart.findMany({ ... })

// ❌ Bad
const data = await prisma.natalChart.findMany({ ... })
```

**Comment complex logic:**
```typescript
// Calculate house cusps using Placidus system
// Formula: cusp = RAMC + (houseNumber * 30) + obliquityAdjustment
const houseCusps = calculatePlacidusHouses(
  birthTime,
  latitude,
  longitude
)
```

### Error Handling

**Always handle errors:**
```typescript
// ✅ Good
try {
  await doSomething()
} catch (error) {
  console.error('Failed:', error)
  return { success: false, error: 'Operation failed' }
}

// ❌ Bad
await doSomething() // Unhandled promise rejection
```

**User-friendly messages:**
```typescript
// ✅ Good
return { error: 'Email already in use. Please try another.' }

// ❌ Bad
return { error: 'E11000 duplicate key error' }
```

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### Internal Docs
- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [API.md](./API.md) - API reference
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

### Support
For development questions:
- Check existing documentation
- Search GitHub issues
- Ask team lead
- Email: dev@zodiacly.com
