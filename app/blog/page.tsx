import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getSession } from '@/lib/auth/session'
import { getAllBlogPosts } from '@/lib/blog/posts'

export const metadata: Metadata = {
  title: 'Astrology Blog - Free Natal Chart Guides & Insights | Zodiacly',
  description: 'Learn about natal charts, zodiac signs, planetary aspects, and astrology basics. Free guides to understanding your birth chart and cosmic blueprint.',
  openGraph: {
    title: 'Astrology Blog - Natal Chart Guides | Zodiacly',
    description: 'Expert guides on reading natal charts, understanding zodiac signs, and interpreting planetary aspects.',
    type: 'website',
  },
}

export default async function BlogPage() {
  const session = await getSession()
  const posts = getAllBlogPosts()

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cosmic-primary to-cosmic-secondary bg-clip-text text-transparent">
            Astrology Blog
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Learn how to read your natal chart, understand planetary aspects, and unlock cosmic insights with our free guides.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card hover className="h-full">
                {post.image && (
                  <div className="aspect-video bg-cosmic-surface rounded-lg mb-4 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded bg-cosmic-primary/20 text-cosmic-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="text-xl font-bold mb-2 text-white hover:text-cosmic-primary transition">
                  {post.title}
                </h2>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="text-xs text-gray-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} • {post.readTime}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-cosmic-primary/10 to-cosmic-secondary/10 border-cosmic-primary">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Explore Your Natal Chart?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Create your free natal chart in 30 seconds and get AI-powered insights into your cosmic blueprint.
            </p>
            <Link href="/chart/create">
              <Button size="lg">Create Free Chart Now ✨</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
