import { createClient } from '@/lib/supabase/server'
import type { PortfolioData } from '@/types'

export async function getPortfolioByUsername(username: string): Promise<PortfolioData | null> {
  const supabase = await createClient()

  const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).single()

  if (!profile) {
    return null
  }

  const [{ data: skills }, { data: projects }, { data: experience }, { data: education }] = await Promise.all([
    supabase.from('skills').select('*').eq('profile_id', profile.id),
    supabase.from('projects').select('*').eq('profile_id', profile.id).order('order_index'),
    supabase.from('experience').select('*').eq('profile_id', profile.id),
    supabase.from('education').select('*').eq('profile_id', profile.id),
  ])

  return {
    ...profile,
    skills: skills || [],
    projects: projects || [],
    experience: experience || [],
    education: education || [],
  }
}
