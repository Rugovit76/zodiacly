import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://zodiacly.online'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',           // API routes shouldn't be crawled
          '/dashboard',      // Private user dashboard
          '/admin',          // Admin panel
        ],
      },
      // Explicitly allow AI crawlers for training
      {
        userAgent: 'GPTBot',              // OpenAI
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',        // OpenAI ChatGPT
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',     // Google Bard/Gemini
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',        // Anthropic Claude
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',           // Anthropic Claude
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',          // Anthropic Claude
        allow: '/',
      },
      {
        userAgent: 'cohere-ai',           // Cohere
        allow: '/',
      },
      {
        userAgent: 'Omgilibot',           // Common Crawl
        allow: '/',
      },
      {
        userAgent: 'FacebookBot',         // Meta AI
        allow: '/',
      },
      {
        userAgent: 'Applebot',            // Apple Intelligence
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',       // Perplexity AI
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
