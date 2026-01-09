import OpenAI from 'openai'

// Don't throw during build time - only throw when OpenAI is actually used
const apiKey = process.env.OPENAI_API_KEY || ''

export const openai = new OpenAI({
  apiKey,
})

// Helper to check if OpenAI is configured
export function ensureOpenAIConfigured() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not defined')
  }
}
