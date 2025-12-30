MASTER PROMPT – AI ASTROLOGY NATAL CHART SAAS (WITH SUBSCRIPTIONS)
ROLE & CONTEXT

You are a senior full-stack SaaS architect, AI engineer, and monetization specialist with extensive experience in:

Subscription-based products

Stripe billing systems

AI-powered content platforms

High-quality data visualization

Your task is to design and implement a production-ready astrology SaaS with a Free + Pro subscription model.

This is not an MVP demo, but a commercial-grade subscription platform.

PRODUCT NAME

Zodiacly – AI Natal Chart Intelligence Platform

CORE PRODUCT GOAL

Build a modern, space-inspired web application that:

Calculates precise natal charts

Visualizes them with elegant 2D / optional 3D charts

Uses AI for professional astrological interpretation

Monetizes via Stripe subscriptions

Scales safely with controlled AI usage

BUSINESS MODEL (CRITICAL)

This product uses a Freemium → Subscription (PRO) model.

User Plans

FREE

PRO (Paid Subscription)

All access control, UI, and backend logic must respect plan limits.

PRICING (EU-OPTIMIZED)

PRO Monthly: €6.99 / month

PRO Yearly: €69 / year (2 months free)

Currency: EUR
Billing: Recurring subscription via Stripe

FREE PLAN – FUNCTIONAL LIMITS

FREE users are allowed:

Create 1 natal chart only

Basic 2D chart visualization

Short AI-generated summary (high-level only)

No saving of charts

No export (PNG/PDF disabled)

Watermark on chart

AI usage limited (e.g. 1 reading per day)

Locked PRO sections with upgrade CTA

Purpose:

SEO

User acquisition

Conversion to PRO

PRO PLAN – UNLOCKED FEATURES

PRO users receive:

Unlimited natal charts

Full AI interpretation:

Personality overview

Planet-by-planet analysis

Houses interpretation

Aspect analysis

Ascendant explanation

Advanced visualization:

Zoom

Smooth animations

Optional 3D chart rotation

Save & manage chart history

Export charts (PNG, PDF-ready)

Priority AI processing

Higher monthly AI usage quota (fair use)

Access to future features

FAIR USE & COST CONTROL (MANDATORY)

PRO is not unlimited AI usage.

Implement:

Monthly AI usage quota (e.g. 100 full readings/month)

Usage tracking per user

Soft limit warnings

Admin override capability

This is required to control OpenAI API costs.

PAYMENT SYSTEM (STRIPE REQUIRED)

Use Stripe Subscriptions API.

Stripe Configuration

Product: Zodiacly Pro

Prices:

price_pro_monthly_699

price_pro_yearly_6900

Mode: subscription

Currency: EUR

Webhooks enabled

Stripe Flow

User clicks Upgrade to Pro

Backend creates Stripe Checkout Session

User completes payment on Stripe

Stripe webhook (checkout.session.completed)

Backend:

Activates PRO plan

Stores stripeCustomerId

Stores stripeSubscriptionId

PRO features unlocked instantly

Handle:

Subscription cancellation

Failed payments

Plan downgrade

Webhook verification

DATABASE REQUIREMENTS (SUBSCRIPTION AWARE)

Minimum entities:

User

id

email

passwordHash

role (USER | ADMIN)

plan (FREE | PRO)

stripeCustomerId

stripeSubscriptionId

subscriptionStatus

createdAt

NatalChart

id

userId

birthDate

birthTime

latitude

longitude

timezone

chartData (JSON)

createdAt

Usage

userId

aiCallsThisMonth

lastResetAt

ADMIN DASHBOARD – BILLING & CONTROL

Admin must be able to:

View free vs pro users

Monitor MRR

Monitor AI usage per user

View Stripe webhook events

Enable/disable AI features

Manually upgrade/downgrade users

Adjust usage limits

UI / UX – CONVERSION OPTIMIZED

Locked PRO sections visibly blurred

Upgrade CTA after chart render

“Unlock full cosmic insight” messaging

Yearly plan highlighted

Space / cosmic dark theme

Premium feel throughout

TECH STACK (MANDATORY)

Frontend:

Next.js (App Router)

TypeScript

TailwindCSS

SVG / Canvas rendering

Optional Three.js for 3D

Backend:

Next.js API routes

Stripe SDK

OpenAI API

Secure env variables

Database:

PostgreSQL

Prisma ORM

Maps:

OpenStreetMap

Lat/Lon auto resolution

Auth:

Email + password

Role-based access

Admin flag

SECURITY & COMPLIANCE

Stripe webhook verification

API rate limiting

Birth data protection

GDPR-ready delete user data

No sensitive data logging

OUTPUT EXPECTATIONS

You must:

Architect the system

Implement subscription logic

Enforce FREE/PRO limits everywhere

Implement Stripe Checkout + Webhooks

Track AI usage per user

Provide production-ready code

Explain each subsystem clearly

No placeholders.
No skipped logic.
No simplifications.

FINAL EXECUTION ORDER

Proceed strictly in this order:

System architecture

Database schema

Subscription & Stripe logic

AI usage limiting

Natal chart calculations

Visualization engine

User dashboard

Admin dashboard

Security & scaling notes

Begin now.