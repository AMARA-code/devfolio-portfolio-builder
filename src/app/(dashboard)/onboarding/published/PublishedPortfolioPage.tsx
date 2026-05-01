'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Copy, ExternalLink, LayoutDashboard } from 'lucide-react'

import Button from '@/components/ui/Button'

export default function PublishedPortfolioPage() {
  const searchParams = useSearchParams()
  const username = searchParams.get('username') || ''

  const publicPath = username ? `/u/${username}` : ''
  const liveUrl = useMemo(() => {
    if (!username || typeof window === 'undefined') return ''
    return `${window.location.origin}/u/${username}`
  }, [username])

  async function handleCopy() {
    if (!liveUrl) return
    await navigator.clipboard.writeText(liveUrl)
  }

  if (!username) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          Missing username. Please go back to onboarding and publish again.
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Published</h1>
        <p className="mt-1 text-sm text-gray-600">Here is your full live preview and public link.</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <code className="flex-1 text-xs text-gray-700 sm:text-sm">{liveUrl || publicPath}</code>
          <Button variant="outline" onClick={handleCopy}>
            <Copy size={16} />
            Copy Link
          </Button>
          <a href={publicPath} target="_blank" rel="noreferrer">
            <Button>
              <ExternalLink size={16} />
              Open Live
            </Button>
          </a>
          <Link href="/dashboard">
            <Button variant="secondary">
              <LayoutDashboard size={16} />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <iframe title="Portfolio live preview" src={publicPath} className="h-[75vh] w-full" />
      </div>
    </main>
  )
}