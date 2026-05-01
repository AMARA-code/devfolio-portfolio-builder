'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { buildPublicAppUrl } from '@/lib/public-app-url'

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const redirectTo = buildPublicAppUrl('/auth/callback?next=/reset-password')
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSuccess('Password reset email sent. Check your inbox and spam folder.')
    setLoading(false)
  }

  return (
    <main className="relative min-h-screen bg-[#0a0a0f] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-2xl">
          <h1 className="text-2xl font-bold text-white">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-400">
            Enter your account email and we will send you a reset link.
          </p>

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
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200 hover:border-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Sending reset link...' : 'Send reset link'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-400">
            Back to{' '}
            <Link href="/login" className="font-medium text-violet-300 hover:text-violet-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
