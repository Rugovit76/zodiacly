'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Alert from '@/components/ui/Alert'

interface ShareButtonProps {
  chartId: string
  isPublic?: boolean
  publicId?: string
}

export default function ShareButton({ chartId, isPublic = false, publicId }: ShareButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareData, setShareData] = useState<{
    isPublic: boolean
    publicId?: string
    shareUrl?: string
  }>({ isPublic, publicId })
  const [copied, setCopied] = useState(false)

  async function togglePublic() {
    setLoading(true)

    try {
      const res = await fetch(`/api/charts/${chartId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !shareData.isPublic })
      })

      const data = await res.json()

      if (data.success) {
        setShareData({
          isPublic: data.data.isPublic,
          publicId: data.data.publicId,
          shareUrl: data.data.shareUrl
        })

        if (data.data.isPublic) {
          setShowShareModal(true)
        }
      }
    } catch (error) {
      console.error('Failed to toggle sharing:', error)
      alert('Failed to update sharing settings')
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    if (shareData.shareUrl) {
      navigator.clipboard.writeText(shareData.shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const socialShares = shareData.shareUrl
    ? {
        whatsapp: `https://wa.me/?text=Check out my natal chart! ${shareData.shareUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.shareUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=Check out my cosmic blueprint! ✨&url=${shareData.shareUrl}`,
        telegram: `https://t.me/share/url?url=${shareData.shareUrl}&text=Check out my natal chart!`
      }
    : null

  return (
    <>
      {/* Share Button */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePublic}
            loading={loading}
            variant={shareData.isPublic ? 'primary' : 'outline'}
            fullWidth
          >
            {shareData.isPublic ? '🔗 Chart is Public' : '🔒 Make Chart Public'}
          </Button>
        </div>

        {shareData.isPublic && shareData.shareUrl && (
          <Card className="border-cosmic-primary/50">
            <p className="text-sm text-gray-400 mb-3">
              Your chart is now public! Share it with friends:
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={shareData.shareUrl}
                readOnly
                className="flex-1 px-3 py-2 rounded bg-cosmic-surface border border-cosmic-primary/30 text-sm"
              />
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? '✓ Copied' : '📋 Copy'}
              </Button>
            </div>

            <Button
              onClick={() => setShowShareModal(true)}
              variant="outline"
              size="sm"
              fullWidth
            >
              📱 Share on Social Media
            </Button>
          </Card>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && socialShares && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <Card
            className="max-w-md w-full"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Share Your Chart</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <Alert type="success" className="mb-6">
              🎉 Your chart is now public! Share it to see what your friends discover!
            </Alert>

            <div className="space-y-3 mb-6">
              <a
                href={socialShares.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                onClick={() => {
                  // Track share event
                  console.log('Shared via WhatsApp')
                }}
              >
                <Button variant="outline" fullWidth>
                  📱 Share on WhatsApp
                </Button>
              </a>

              <a
                href={socialShares.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" fullWidth>
                  📘 Share on Facebook
                </Button>
              </a>

              <a
                href={socialShares.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" fullWidth>
                  🐦 Share on Twitter
                </Button>
              </a>

              <a
                href={socialShares.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="outline" fullWidth>
                  ✈️ Share on Telegram
                </Button>
              </a>
            </div>

            <div className="p-4 bg-cosmic-surface rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Direct Link:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareData.shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 rounded bg-black/30 border border-cosmic-primary/30 text-sm"
                />
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  {copied ? '✓' : '📋'}
                </Button>
              </div>
            </div>

            {/* Viral CTA */}
            <div className="mt-6 p-4 bg-gradient-to-r from-cosmic-primary/10 to-cosmic-secondary/10 rounded-lg border border-cosmic-primary/30">
              <p className="text-sm text-center text-gray-300">
                💡 <strong>Pro Tip:</strong> Ask your friends to create their charts and
                compare compatibility!
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
