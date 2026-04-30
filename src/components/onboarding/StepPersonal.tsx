'use client'

import { useState } from 'react'
import { saveOnboardingData, getOnboardingData } from '@/lib/onboarding-store'
import { isOptionalHttpUrl, isValidEmail, isValidHttpUrl, isValidUsername } from '@/lib/validation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Props {
  onNext: () => void
}

export default function StepPersonal({ onNext }: Props) {
  const stored = getOnboardingData()
  const [form, setForm] = useState({
    username: stored.personal.username,
    full_name: stored.personal.full_name,
    bio: stored.personal.bio,
    location: stored.personal.location,
    email: stored.personal.email,
    website: stored.personal.website,
    github_url: stored.personal.github_url,
    linkedin_url: stored.personal.linkedin_url,
    twitter_url: stored.personal.twitter_url,
  })
  const [generating, setGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.full_name.trim()) newErrors.full_name = 'Name is required'
    if (!form.username.trim()) newErrors.username = 'Username is required'
    if (form.username.trim() && !isValidUsername(form.username)) {
      newErrors.username = 'Only lowercase letters, numbers, - and _ allowed'
    }
    if (!form.bio.trim()) newErrors.bio = 'Bio is required'
    if (!form.location.trim()) newErrors.location = 'Location is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (form.email.trim() && !isValidEmail(form.email)) newErrors.email = 'Enter a valid email'
    if (form.website.trim() && !isValidHttpUrl(form.website)) newErrors.website = 'Enter a valid URL'
    if (!isOptionalHttpUrl(form.github_url)) newErrors.github_url = 'Enter a valid URL or keep empty'
    if (!isOptionalHttpUrl(form.linkedin_url)) newErrors.linkedin_url = 'Enter a valid URL or keep empty'
    if (!isOptionalHttpUrl(form.twitter_url)) newErrors.twitter_url = 'Enter a valid URL or keep empty'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function generateBio() {
    if (!form.full_name) return
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: `${form.full_name}, ${form.location || 'developer'}`,
        }),
      })
      const data = await res.json()
      update('bio', data.bio)
    } catch (e) {
      console.error(e)
    }
    setGenerating(false)
  }

  function handleNext() {
    if (!validate()) return
    saveOnboardingData({ personal: form })
    onNext()
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-100 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-white">
        Tell us about yourself
      </h2>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="Ali Khan"
            value={form.full_name}
            onChange={(e) => update('full_name', e.target.value)}
            error={errors.full_name}
            required
          />
          <Input
            label="Username"
            placeholder="alikhan"
            value={form.username}
            onChange={(e) => update('username', e.target.value.toLowerCase())}
            error={errors.username}
            hint="Your portfolio URL: devfolio.vercel.app/u/username"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="ali@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
            required
          />
          <Input
            label="Location"
            placeholder="Lahore, Pakistan"
            value={form.location}
            onChange={(e) => update('location', e.target.value)}
          />
        </div>

        <div className="relative">
          <Textarea
            label="Bio"
            placeholder="Tell the world about yourself..."
            value={form.bio}
            onChange={(e) => update('bio', e.target.value)}
            rows={3}
            error={errors.bio}
            required
          />
          <button
            type="button"
            onClick={generateBio}
            disabled={generating || !form.full_name}
            className="absolute right-2 bottom-2 text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-md hover:bg-brand-100 disabled:opacity-50 transition-colors"
          >
            {generating ? 'Generating...' : '✨ AI Generate'}
          </button>
        </div>

        <Input
          label="Website"
          placeholder="https://yourwebsite.com"
          value={form.website}
          onChange={(e) => update('website', e.target.value)}
          error={errors.website}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="GitHub URL"
            placeholder="https://github.com/username"
            value={form.github_url}
            onChange={(e) => update('github_url', e.target.value)}
            error={errors.github_url}
          />
          <Input
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/username"
            value={form.linkedin_url}
            onChange={(e) => update('linkedin_url', e.target.value)}
            error={errors.linkedin_url}
          />
        </div>

        <Input
          label="Twitter / X URL"
          placeholder="https://twitter.com/username"
          value={form.twitter_url}
          onChange={(e) => update('twitter_url', e.target.value)}
          error={errors.twitter_url}
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button size="lg" onClick={handleNext}>
          Next →
        </Button>
      </div>
    </div>
  )
}