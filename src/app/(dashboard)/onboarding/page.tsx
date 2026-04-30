'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'

import { clearOnboardingData, getOnboardingData } from '@/lib/onboarding-store'
import { isOptionalHttpUrl, isValidEmail, isValidHttpUrl, isValidUsername } from '@/lib/validation'
import type { OnboardingData } from '@/types'

const steps = ['Personal', 'Skills', 'Projects', 'Experience', 'Template']

function StepLoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-sm">
      <div className="h-7 w-52 animate-pulse rounded-md bg-slate-700" />
      <div className="mt-3 h-4 w-72 animate-pulse rounded-md bg-slate-800" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="h-11 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-11 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-11 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-11 animate-pulse rounded-lg bg-slate-800" />
      </div>

      <div className="mt-4 h-28 animate-pulse rounded-lg bg-slate-800" />

      <div className="mt-8 flex justify-end gap-3">
        <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-800" />
        <div className="h-10 w-28 animate-pulse rounded-lg bg-cyan-500/30" />
      </div>
    </div>
  )
}

const StepPersonal = dynamic(() => import('@/components/onboarding/StepPersonal'), {
  ssr: false,
  loading: () => <StepLoadingSkeleton />,
})
const StepSkills = dynamic(() => import('@/components/onboarding/StepSkills'), {
  ssr: false,
  loading: () => <StepLoadingSkeleton />,
})
const StepProjects = dynamic(() => import('@/components/onboarding/StepProjects'), {
  ssr: false,
  loading: () => <StepLoadingSkeleton />,
})
const StepExperience = dynamic(() => import('@/components/onboarding/StepExperience'), {
  ssr: false,
  loading: () => <StepLoadingSkeleton />,
})
const StepTemplate = dynamic(() => import('@/components/onboarding/StepTemplate'), {
  ssr: false,
  loading: () => <StepLoadingSkeleton />,
})

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function validateFinalPayload(data: OnboardingData): string | null {
    const personal = data.personal
    if (!personal.full_name.trim()) return 'Full name is required.'
    if (!personal.username.trim() || !isValidUsername(personal.username)) return 'Valid username is required.'
    if (!personal.bio.trim()) return 'Bio is required.'
    if (!personal.location.trim()) return 'Location is required.'
    if (!personal.email.trim() || !isValidEmail(personal.email)) return 'Valid email is required.'
    if (personal.website.trim() && !isValidHttpUrl(personal.website)) return 'Website URL is invalid.'
    if (!isOptionalHttpUrl(personal.github_url)) return 'GitHub URL is invalid.'
    if (!isOptionalHttpUrl(personal.linkedin_url)) return 'LinkedIn URL is invalid.'
    if (!isOptionalHttpUrl(personal.twitter_url)) return 'Twitter URL is invalid.'
    if (data.skills.length === 0) return 'At least one skill is required.'
    if (data.projects.length === 0) return 'At least one project is required.'
    if (data.projects.some((project) => !project.title.trim() || !project.description.trim())) {
      return 'Each project must include a title and description.'
    }
    if (data.projects.some((project) => !project.live_url.trim() || !isValidHttpUrl(project.live_url))) {
      return 'Each project must include a valid live URL.'
    }
    if (data.projects.some((project) => !project.thumbnail_url.trim())) {
      return 'Screenshot upload is required for each project.'
    }
    if (data.experience.length === 0) return 'At least one experience entry is required.'
    if (data.education.length === 0) return 'At least one education entry is required.'
    return null
  }

  async function submitOnboarding() {
    const data: OnboardingData = getOnboardingData()
    const validationError = validateFinalPayload(data)
    if (validationError) {
      setSubmitError(validationError)
      return
    }
    setSubmitting(true)
    setSubmitError('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const profilePayload = {
        user_id: user.id,
        ...data.personal,
        template: data.template,
        is_published: true,
      }

      let profileId = ''

      // More reliable than upsert(onConflict) when DB constraints differ.
      const { data: existingProfile, error: existingProfileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingProfileError) {
        throw new Error(existingProfileError.message)
      }

      if (existingProfile) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', existingProfile.id)
          .select('id')
          .single()

        if (updateError || !updatedProfile) {
          throw new Error(updateError?.message || 'Could not update profile.')
        }

        profileId = updatedProfile.id
      } else {
        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(profilePayload)
          .select('id')
          .single()

        if (insertError || !insertedProfile) {
          throw new Error(insertError?.message || 'Could not create profile.')
        }

        profileId = insertedProfile.id
      }

      await Promise.all([
        supabase.from('skills').delete().eq('profile_id', profileId),
        supabase.from('projects').delete().eq('profile_id', profileId),
        supabase.from('experience').delete().eq('profile_id', profileId),
        supabase.from('education').delete().eq('profile_id', profileId),
      ])

      if (data.skills.length > 0) {
        const { error } = await supabase.from('skills').insert(
          data.skills.map((item) => ({
            profile_id: profileId,
            ...item,
          }))
        )
        if (error) throw new Error(error.message)
      }

      if (data.projects.length > 0) {
        const { error } = await supabase.from('projects').insert(
          data.projects.map((item, index) => ({
            profile_id: profileId,
            ...item,
            order_index: index,
          }))
        )
        if (error) throw new Error(error.message)
      }

      if (data.experience.length > 0) {
        const { error } = await supabase.from('experience').insert(
          data.experience.map((item) => ({
            profile_id: profileId,
            ...item,
          }))
        )
        if (error) throw new Error(error.message)
      }

      if (data.education.length > 0) {
        const { error } = await supabase.from('education').insert(
          data.education.map((item) => ({
            profile_id: profileId,
            ...item,
          }))
        )
        if (error) throw new Error(error.message)
      }

      clearOnboardingData()
      router.push('/dashboard?published=1')
      router.refresh()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong while publishing your portfolio.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
      <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Create your Devfolio</h1>
        <p className="mt-1 text-sm text-slate-400">Complete your profile in 5 quick steps.</p>
        {submitError && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200">{submitError}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                index <= step ? 'bg-cyan-500/20 text-cyan-200' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {index + 1}. {label}
            </div>
          ))}
        </div>
      </div>

      {step === 0 && <StepPersonal onNext={() => setStep(1)} />}
      {step === 1 && <StepSkills onBack={() => setStep(0)} onNext={() => setStep(2)} />}
      {step === 2 && <StepProjects onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <StepExperience onBack={() => setStep(2)} onNext={() => setStep(4)} />}
      {step === 4 && <StepTemplate onBack={() => setStep(3)} onSubmit={submitOnboarding} submitting={submitting} />}
      </div>
    </main>
  )
}
