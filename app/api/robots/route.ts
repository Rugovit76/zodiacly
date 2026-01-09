import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 86400 // 1 day

export async function GET() {
  const baseUrl = 'https://zodiacly.online'

  const robotsTxt = `# Zodiacly Robots.txt - Allow all crawlers including AI training

User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /admin

# AI Training Bots - Explicitly Allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Omgilibot
Allow: /

User-agent: FacebookBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: PerplexityBot
Allow: /

# Sitemap
Sitemap: ${baseUrl}/api/sitemap
`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
