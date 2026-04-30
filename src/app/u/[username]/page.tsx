
import { createClient } from '@/lib/supabase/server'
import { getPortfolioByUsername } from '@/lib/portfolio'
import { notFound } from 'next/navigation'
import MinimalTemplate from '@/components/templates/MinimalTemplate'
import DarkTemplate from '@/components/templates/DarkTemplate'
import CreativeTemplate from '@/components/templates/CreativeTemplate'

interface Props {
  params: Promise<{ username: string }>
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params
  const portfolioData = await getPortfolioByUsername(username)

  if (!portfolioData) return notFound()

  const supabase = await createClient()
  await supabase.from('portfolio_views').insert({ profile_id: portfolioData.id })

  if (portfolioData.template === 'dark') {
    return <DarkTemplate data={portfolioData} />
  }

  if (portfolioData.template === 'creative') {
    return <CreativeTemplate data={portfolioData} />
  }

  return <MinimalTemplate data={portfolioData} />
}