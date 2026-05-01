import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] px-4 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-2 text-sm text-slate-400">Last updated: May 1, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-white">1. Information We Collect</h2>
            <p>
              We collect information you provide during signup and onboarding, such as your name,
              email, profile details, projects, skills, and links.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">2. How We Use Information</h2>
            <p>
              Your data is used to provide portfolio features, publish your public profile, and
              improve product functionality.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">3. Public Data</h2>
            <p>
              Content you mark or publish as portfolio information may be visible publicly at your
              profile URL.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">4. Data Security</h2>
            <p>
              We use standard security controls and trusted providers to protect account and
              portfolio data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">5. Contact</h2>
            <p>
              For privacy-related requests, contact your support email or project administrator.
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
