import { Suspense } from 'react'
import PublishedPortfolioPage from './PublishedPortfolioPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading...</div>}>
      <PublishedPortfolioPage />
    </Suspense>
  )
}

