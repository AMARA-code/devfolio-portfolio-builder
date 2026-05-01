import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: May 1, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By using Devfolio, you agree to these terms and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. Account Responsibility</h2>
            <p>
              You are responsible for maintaining account security and for all activity under your
              account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Content Ownership</h2>
            <p>
              You retain ownership of the portfolio content you create. You grant us permission to
              host and display it as part of the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Prohibited Use</h2>
            <p>
              You may not use the platform for unlawful, abusive, or malicious activity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Service Changes</h2>
            <p>
              We may update or improve the service over time, including feature or policy changes.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/login" className="text-violet-300 hover:text-violet-200">
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
