'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Code2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

import { clearOnboardingData, getOnboardingData } from '@/lib/onboarding-store'
import { isOptionalHttpUrl, isValidEmail, isValidHttpUrl, isValidUsername } from '@/lib/validation'
import type { OnboardingData } from '@/types'

const steps = ['Personal', 'Skills', 'Projects', 'Experience', 'Template']

/* ─── Ambient orb background ─── */
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep base */}
      <div className="absolute inset-0 bg-[#0a0a0f]" />

      {/* Violet orb — top left */}
      <div
        className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #7c3aed 0%, #4f46e5 40%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'orbFloat1 12s ease-in-out infinite',
        }}
      />

      {/* Indigo orb — bottom right */}
      <div
        className="absolute -bottom-60 -right-40 h-[700px] w-[700px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #6366f1 0%, #7c3aed 40%, transparent 70%)',
          filter: 'blur(100px)',
          animation: 'orbFloat2 15s ease-in-out infinite',
        }}
      />

      {/* Subtle center pulse */}
      <div
        className="absolute left-1/2 top-1/2 h-[400px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5"
        style={{
          background: 'radial-gradient(ellipse, #818cf8 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'centerPulse 8s ease-in-out infinite',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#818cf8 1px, transparent 1px), linear-gradient(90deg, #818cf8 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <style>{`
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(40px, 60px) scale(1.08); }
          66%       { transform: translate(-20px, 30px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40%       { transform: translate(-50px, -40px) scale(1.1); }
          70%       { transform: translate(20px, -20px) scale(0.92); }
        }
        @keyframes centerPulse {
          0%, 100% { opacity: 0.05; }
          50%       { opacity: 0.12; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerSlide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}

/* ─── Skeleton loader ─── */
function StepLoadingSkeleton() {
  return (
    <div
      className="rounded-2xl p-8 shadow-2xl"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        animation: 'fadeSlideUp 0.4s ease both',
      }}
    >
      <div className="h-7 w-52 animate-pulse rounded-md" style={{ background: 'rgba(129,140,248,0.12)' }} />
      <div className="mt-3 h-4 w-72 animate-pulse rounded-md" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-11 animate-pulse rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }} />
        ))}
      </div>
      <div className="mt-4 h-28 animate-pulse rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="mt-8 flex justify-end gap-3">
        <div className="h-10 w-24 animate-pulse rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-10 w-28 animate-pulse rounded-lg" style={{ background: 'rgba(99,102,241,0.18)' }} />
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

/* ─── Step pill component ─── */
function StepPill({
  label,
  index,
  currentStep,
  onClick,
}: {
  label: string
  index: number
  currentStep: number
  onClick?: () => void
}) {
  const isActive = index === currentStep
  const isDone = index < currentStep

  return (
    <button
      onClick={onClick}
      disabled={index > currentStep}
      className="group relative flex items-center gap-2 overflow-hidden rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300"
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(99,102,241,0.3) 100%)'
          : isDone
            ? 'rgba(99,102,241,0.1)'
            : 'rgba(255,255,255,0.03)',
        border: isActive
          ? '1px solid rgba(139,92,246,0.45)'
          : isDone
            ? '1px solid rgba(99,102,241,0.2)'
            : '1px solid rgba(255,255,255,0.06)',
        color: isActive ? '#c4b5fd' : isDone ? '#818cf8' : 'rgba(255,255,255,0.3)',
        boxShadow: isActive ? '0 0 16px rgba(124,58,237,0.22), inset 0 1px 0 rgba(255,255,255,0.07)' : 'none',
        cursor: index > currentStep ? 'default' : 'pointer',
      }}
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, #7c3aed, #6366f1)'
            : isDone
              ? 'rgba(99,102,241,0.35)'
              : 'rgba(255,255,255,0.07)',
          color: isActive ? '#fff' : isDone ? '#a5b4fc' : 'rgba(255,255,255,0.25)',
        }}
      >
        {isDone ? '✓' : index + 1}
      </span>
      {label}

      {/* Active shimmer sweep */}
      {isActive && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
            animation: 'shimmerSlide 2.8s ease-in-out infinite',
          }}
        />
      )}
    </button>
  )
}

/* ─── Progress bar ─── */
function ProgressBar({ step }: { step: number }) {
  const pct = (step / (steps.length - 1)) * 100

  return (
    <div
      className="relative mt-5 h-[2px] w-full overflow-hidden rounded-full"
      style={{ background: 'rgba(255,255,255,0.05)' }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #7c3aed, #818cf8, #a78bfa)',
          boxShadow: '0 0 10px rgba(124,58,237,0.7)',
        }}
      />
      {/* Traveling glow dot */}
      {pct > 0 && (
        <div
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all duration-700"
          style={{
            left: `calc(${pct}% - 4px)`,
            background: '#a78bfa',
            boxShadow: '0 0 8px 3px rgba(167,139,250,0.7)',
          }}
        />
      )}
    </div>
  )
}

/* ─── Step descriptions ─── */
const stepHints = [
  'Tell us who you are — name, location, and a short bio.',
  'Add the technologies and tools you work with.',
  'Showcase your best work with project links and screenshots.',
  'Share your work history and education background.',
  'Pick a portfolio template that fits your style.',
]

/* ─── Main page ─── */
export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [mounted, setMounted] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Small delay so the page fades in smoothly
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  function validateFinalPayload(data: OnboardingData): string | null {
    const p = data.personal
    if (!p.full_name.trim()) return 'Full name is required.'
    if (!p.username.trim() || !isValidUsername(p.username)) return 'Valid username is required.'
    if (!p.bio.trim()) return 'Bio is required.'
    if (!p.location.trim()) return 'Location is required.'
    if (!p.email.trim() || !isValidEmail(p.email)) return 'Valid email is required.'
    if (p.website.trim() && !isValidHttpUrl(p.website)) return 'Website URL is invalid.'
    if (!isOptionalHttpUrl(p.github_url)) return 'GitHub URL is invalid.'
    if (!isOptionalHttpUrl(p.linkedin_url)) return 'LinkedIn URL is invalid.'
    if (!isOptionalHttpUrl(p.twitter_url)) return 'Twitter URL is invalid.'
    if (data.skills.length === 0) return 'At least one skill is required.'
    if (data.projects.length === 0) return 'At least one project is required.'
    if (data.projects.some((x) => !x.title.trim() || !x.description.trim()))
      return 'Each project must include a title and description.'
    if (data.projects.some((x) => !x.live_url.trim() || !isValidHttpUrl(x.live_url)))
      return 'Each project must include a valid live URL.'
    if (data.projects.some((x) => !x.thumbnail_url.trim()))
      return 'Screenshot upload is required for each project.'
    if (data.experience.length === 0) return 'At least one experience entry is required.'
    if (data.education.length === 0) return 'At least one education entry is required.'
    return null
  }

  async function submitOnboarding() {
    const data: OnboardingData = getOnboardingData()
    const err = validateFinalPayload(data)
    if (err) { setSubmitError(err); return }
    setSubmitting(true)
    setSubmitError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const profilePayload = { user_id: user.id, ...data.personal, template: data.template, is_published: true }
      let profileId = ''

      const { data: existing, error: eErr } = await supabase
        .from('profiles').select('id').eq('user_id', user.id).maybeSingle()
      if (eErr) throw new Error(eErr.message)

      if (existing) {
        const { data: upd, error: uErr } = await supabase
          .from('profiles').update(profilePayload).eq('id', existing.id).select('id').single()
        if (uErr || !upd) throw new Error(uErr?.message || 'Could not update profile.')
        profileId = upd.id
      } else {
        const { data: ins, error: iErr } = await supabase
          .from('profiles').insert(profilePayload).select('id').single()
        if (iErr || !ins) throw new Error(iErr?.message || 'Could not create profile.')
        profileId = ins.id
      }

      await Promise.all([
        supabase.from('skills').delete().eq('profile_id', profileId),
        supabase.from('projects').delete().eq('profile_id', profileId),
        supabase.from('experience').delete().eq('profile_id', profileId),
        supabase.from('education').delete().eq('profile_id', profileId),
      ])

      const insertBatch = async (table: string, rows: Record<string, unknown>[]) => {
        if (!rows.length) return
        const { error } = await supabase.from(table).insert(rows)
        if (error) throw new Error(error.message)
      }

      await insertBatch('skills', data.skills.map((x) => ({ profile_id: profileId, ...x })))
      await insertBatch('projects', data.projects.map((x, i) => ({ profile_id: profileId, ...x, order_index: i })))
      await insertBatch('experience', data.experience.map((x) => ({ profile_id: profileId, ...x })))
      await insertBatch('education', data.education.map((x) => ({ profile_id: profileId, ...x })))

      clearOnboardingData()
      router.push('/dashboard?published=1')
      router.refresh()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong while publishing your portfolio.')
    } finally {
      setSubmitting(false)
    }
  }

  /* Animated step transition */
  function handleStepChange(next: number) {
    const el = contentRef.current
    if (el) {
      el.style.opacity = '0'
      el.style.transform = 'translateY(10px)'
      setTimeout(() => {
        setStep(next)
        el.style.transition = 'opacity 0.28s ease, transform 0.28s ease'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, 200)
    } else {
      setStep(next)
    }
  }

  return (
    <>
      <AmbientBackground />

      <style>{`
        /* ── Global keyframes ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerSlide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        /* ── Child step input theming ── */
        input[type="text"],
        input[type="email"],
        input[type="url"],
        input[type="password"],
        textarea,
        select {
          background: rgba(15,23,42,0.72) !important;
          border: 1px solid rgba(71,85,105,0.65) !important;
          color: rgba(248,250,252,0.9) !important;
          border-radius: 10px !important;
          box-shadow: 0 1px 2px rgba(2,6,23,0.35) !important;
          transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
        }
        input[type="text"]:hover,
        input[type="email"]:hover,
        input[type="url"]:hover,
        input[type="password"]:hover,
        textarea:hover,
        select:hover {
          background: rgba(30,41,59,0.82) !important;
          border-color: rgba(100,116,139,0.9) !important;
          box-shadow: 0 6px 18px rgba(2,6,23,0.35) !important;
        }
        input[type="text"]:focus,
        input[type="email"]:focus,
        input[type="url"]:focus,
        input[type="password"]:focus,
        textarea:focus,
        select:focus {
          border-color: rgba(124,58,237,0.55) !important;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.12), 0 0 16px rgba(124,58,237,0.08), 0 10px 24px rgba(2,6,23,0.45) !important;
          outline: none !important;
        }
        ::placeholder {
          color: rgba(148,163,184,0.9) !important;
        }
      `}</style>

      <main
        className="relative z-10 min-h-screen px-4 py-10 sm:px-6"
        style={{
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.45s ease',
        }}
      >
        <div className="mx-auto max-w-4xl">

          {/* ── Header card ── */}
          <div
            className="mb-6 rounded-2xl p-6"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.025), 0 32px 80px rgba(0,0,0,0.55)',
              animation: 'fadeSlideUp 0.55s ease both',
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  {/* Logo mark */}
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/40">
                    <Code2 size={16} className="text-white" />
                  </div>
                  <h1
                    className="text-2xl font-black tracking-tight text-white"
                    style={{ letterSpacing: '-0.035em' }}
                  >
                    <span className="mr-1 lowercase">devfolio</span>{' '}
                    <span className="text-slate-300">|</span>{' '}
                    <span
                      style={{
                        background: 'linear-gradient(130deg, #a78bfa 0%, #818cf8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      onboarding
                    </span>
                  </h1>
                </div>
                <p className="mt-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  Complete your profile in{' '}
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>5 quick steps</span>{' '}
                  and go live instantly.
                </p>
              </div>

              {/* Step counter */}
              <div
                className="flex-shrink-0 rounded-xl px-3 py-2 text-center"
                style={{
                  background: 'rgba(124,58,237,0.1)',
                  border: '1px solid rgba(124,58,237,0.18)',
                }}
              >
                <div
                  className="text-xl font-black"
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {step + 1}
                </div>
                <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  of {steps.length}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {submitError && (
              <div
                className="mt-4 flex items-start gap-3 rounded-xl px-4 py-3"
                style={{
                  background: 'rgba(239,68,68,0.07)',
                  border: '1px solid rgba(239,68,68,0.18)',
                  animation: 'errorShake 0.38s ease',
                }}
              >
                <span className="mt-0.5 flex-shrink-0 text-red-400">⚠</span>
                <p className="text-sm text-red-300/90">{submitError}</p>
              </div>
            )}

            {/* Step pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {steps.map((label, index) => (
                <StepPill
                  key={label}
                  label={label}
                  index={index}
                  currentStep={step}
                  onClick={() => index < step ? handleStepChange(index) : undefined}
                />
              ))}
            </div>

            {/* Progress bar */}
            <ProgressBar step={step} />

            {/* Current step hint */}
            <p
              className="mt-3 text-xs"
              style={{ color: 'rgba(255,255,255,0.22)', fontWeight: 500 }}
            >
              {stepHints[step]}
            </p>
          </div>

          {/* ── Step content wrapper ── */}
          <div
            ref={contentRef}
            style={{
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            {step === 0 && <StepPersonal onNext={() => handleStepChange(1)} />}
            {step === 1 && <StepSkills onBack={() => handleStepChange(0)} onNext={() => handleStepChange(2)} />}
            {step === 2 && <StepProjects onBack={() => handleStepChange(1)} onNext={() => handleStepChange(3)} />}
            {step === 3 && <StepExperience onBack={() => handleStepChange(2)} onNext={() => handleStepChange(4)} />}
            {step === 4 && (
              <StepTemplate
                onBack={() => handleStepChange(3)}
                onSubmit={submitOnboarding}
                submitting={submitting}
              />
            )}
          </div>

          {/* ── Footer hint ── */}
          <div
            className="mx-auto mt-6 w-fit rounded-full px-4 py-2 text-xs"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
              letterSpacing: '0.02em',
            }}
          >
            ✦ Progress saved automatically
          </div>
        </div>
      </main>
    </>
  )
}
