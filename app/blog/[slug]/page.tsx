import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { getSession } from '@/lib/auth/session'
import { getBlogPost, getAllBlogPosts } from '@/lib/blog/posts'

interface BlogPostPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found - Zodiacly'
    }
  }

  return {
    title: `${post.title} | Zodiacly`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['Zodiacly'],
      tags: post.tags,
      images: post.image ? [{ url: post.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug)
  const session = await getSession()

  if (!post) {
    notFound()
  }

  const relatedPosts = getAllBlogPosts()
    .filter(p => p.slug !== post.slug && p.tags.some(tag => post.tags.includes(tag)))
    .slice(0, 3)

  return (
    <div className="min-h-screen">
      <Navbar user={session} />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="mb-8 text-sm text-gray-400">
          <Link href="/" className="hover:text-cosmic-primary">Home</Link>
          {' '}/{' '}
          <Link href="/blog" className="hover:text-cosmic-primary">Blog</Link>
          {' '}/{' '}
          <span className="text-white">{post.title}</span>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-cosmic-primary/20 text-cosmic-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cosmic-primary to-cosmic-secondary bg-clip-text text-transparent">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-400 text-sm">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="aspect-video bg-cosmic-surface rounded-lg mb-8 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* CTA */}
        <Card className="bg-gradient-to-r from-cosmic-primary/10 to-cosmic-secondary/10 border-cosmic-primary mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">
              Ready to Explore Your Birth Chart?
            </h2>
            <p className="text-gray-300 mb-6">
              Create your free natal chart and get personalized AI insights in 30 seconds.
            </p>
            <Link href="/chart/create">
              <Button size="lg">Create Free Chart ✨</Button>
            </Link>
          </div>
        </Card>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`}>
                  <Card hover className="h-full">
                    <h3 className="font-bold text-lg mb-2 hover:text-cosmic-primary transition">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
