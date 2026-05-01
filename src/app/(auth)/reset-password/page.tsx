'use client'

import { FormEvent, Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClient(), [])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyingLink, setVerifyingLink] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [linkReady, setLinkReady] = useState(false)

  useEffect(() => {
    let mounted = true

    async function initRecoverySession() {
      const code = searchParams.get('code')
      if (code) {
        const { error: codeError } = await supabase.auth.exchangeCodeForSession(code)
        if (codeError && mounted) {
          setError('This reset link is invalid or expired. Please request a new one.')
        }
      }

      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setLinkReady(Boolean(data.session))
      setVerifyingLink(false)
      if (!data.session) {
        setError('This reset link is invalid or expired. Please request a new one.')
      }
    }

    void initRecoverySession()
    return () => {
      mounted = false
    }
  }, [searchParams, supabase])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!linkReady) {
      setError('Reset session not found. Open the latest reset link from your email.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess('Password updated successfully. Redirecting to sign in...')
    setLoading(false)
    setTimeout(() => {
      router.push('/login')
      router.refresh()
    }, 1200)
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl">
          <h1 className="text-2xl font-bold text-white">Set a new password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Choose a new password for your Devfolio account.
          </p>

          {verifyingLink && (
            <p className="mt-4 rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-sm text-violet-200">
              Verifying reset link...
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-violet-300/70">
                New password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 hover:border-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-violet-300/70">
                Confirm password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your new password"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 hover:border-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading || verifyingLink || !linkReady}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Updating password...' : 'Update password'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Remembered it?{' '}
            <Link href="/login" className="font-medium text-violet-300 hover:text-violet-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="relative min-h-screen bg-[#0a0a0f] text-slate-100">
          <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl">
              <h1 className="text-2xl font-bold text-white">Set a new password</h1>
              <p className="mt-2 text-sm text-slate-400">Loading reset session...</p>
            </div>
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
