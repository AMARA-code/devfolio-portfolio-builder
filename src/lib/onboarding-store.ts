import { OnboardingData } from '@/types'

const defaultData: OnboardingData = {
  personal: {
    username: '',
    full_name: '',
    bio: '',
    location: '',
    email: '',
    website: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
  },
  skills: [],
  projects: [],
  experience: [],
  education: [],
  template: 'minimal',
}

export function getOnboardingData(): OnboardingData {
  if (typeof window === 'undefined') return defaultData
  const stored = localStorage.getItem('onboarding_data')
  return stored ? JSON.parse(stored) : defaultData
}

export function saveOnboardingData(data: Partial<OnboardingData>) {
  const current = getOnboardingData()
  const updated = { ...current, ...data }
  localStorage.setItem('onboarding_data', JSON.stringify(updated))
  return updated
}

export function clearOnboardingData() {
  localStorage.removeItem('onboarding_data')
}