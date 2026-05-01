'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

/* ─── Floating orb component ─────────────────────────────────────────────── */
function Orb({
  cx, cy, r, color, delay = 0,
}: { cx: string; cy: string; r: string; color: string; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: cx, top: cy,
        width: r, height: r,
        background: color,
        filter: 'blur(80px)',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.85, 0.55] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

/* ─── Animated grid lines ─────────────────────────────────────────────────── */
function GridLines() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  )
}

/* ─── Particle spark ──────────────────────────────────────────────────────── */
type Spark = { id: number; x: number; y: number; size: number; duration: number; delay: number; dx: number }

function Sparks() {
  const [sparks, setSparks] = useState<Spark[]>([])

  useEffect(() => {
    setSparks(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 8 + 5,
        delay: Math.random() * 6,
        dx: (Math.random() - 0.5) * 30,
      }))
    )
  }, [])

  if (sparks.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {sparks.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-violet-300"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          animate={{ opacity: [0, 1, 0], y: [-10, -40, -80], x: [0, s.dx] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

/* ─── Tilt card wrapper ───────────────────────────────────────────────────── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springConfig = { stiffness: 280, damping: 22, mass: 0.6 }
  const springX = useSpring(rawX, springConfig)
  const springY = useSpring(rawY, springConfig)
  const rotateX = useTransform(springY, [-0.5, 0.5], [16, -16])
  const rotateY = useTransform(springX, [-0.5, 0.5], [-16, 16])

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onLeave() { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 600 }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

/* ─── Glowing divider ────────────────────────────────────────────────────── */
function GlowDivider() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.4))' }} />
      <span className="text-xs font-medium tracking-widest text-violet-400/60 uppercase">or</span>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(139,92,246,0.4))' }} />
    </div>
  )
}

/* ─── Field with glow on focus ───────────────────────────────────────────── */
function GlowInput({
  label, type, placeholder, value, onChange, required,
}: {
  label: string; type: string; placeholder: string;
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean
}) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="relative flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-violet-300/70">
        {label}
      </label>
      <div className="relative">
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={focused
            ? { boxShadow: '0 0 0 1.5px rgba(139,92,246,0.7), 0 0 20px rgba(139,92,246,0.25)' }
            : { boxShadow: '0 0 0 1px rgba(255,255,255,0.06)' }}
          transition={{ duration: 0.2 }}
        />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/20
            bg-white/[0.03] outline-none transition-colors duration-200
            font-light tracking-wide"
        />
      </div>
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0) // for staggered reveal tracking

  useEffect(() => { setStep(1) }, [])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    await supabase.auth.signOut()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
    if (loginError) { setError(loginError.message); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  async function handleGithubLogin() {
    setGithubLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setGithubLoading(false) }
  }

  return (
    <div
      className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden"
      style={{ background: '#0a0a0f', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Google font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Syne:wght@700;800&display=swap');
        .syne { font-family: 'Syne', sans-serif; }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 2px; }

        /* GitHub button shimmer */
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .github-btn:hover::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          background-size: 200% 100%;
          animation: shimmer 1.2s ease infinite;
        }

        /* Submit button pulse */
        @keyframes pulse-violet {
          0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(139,92,246,0); }
        }
        .submit-btn:not(:disabled):hover {
          animation: pulse-violet 1.8s ease infinite;
        }
      `}</style>

      {/* ── Background atmosphere ── */}
      <GridLines />
      <Sparks />

      {/* Orbs */}
      <Orb cx="15%" cy="20%" r="500px" color="radial-gradient(circle, rgba(99,60,200,0.35), transparent 70%)" delay={0} />
      <Orb cx="85%" cy="10%" r="400px" color="radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)" delay={2} />
      <Orb cx="50%" cy="95%" r="450px" color="radial-gradient(circle, rgba(67,56,202,0.25), transparent 70%)" delay={4} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-block group">
            <div className="relative inline-block">
              {/* Logo glow */}
              <div className="absolute inset-0 blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }} />
              <h1 className="syne relative text-4xl font-extrabold tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #818cf8 50%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>
                Devfolio
              </h1>
            </div>
            {/* Underline bar */}
            <motion.div
              className="mx-auto mt-2 h-px rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)' }}
            />
          </Link>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-3 text-sm text-white/30 tracking-widest uppercase font-medium"
          >
            Create your portfolio
          </motion.p>
        </motion.div>

        {/* ── Card ── */}
        <TiltCard>
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl p-8 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Inner top glow stripe */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), transparent)' }} />

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
              style={{ background: 'radial-gradient(circle at top right, rgba(139,92,246,0.12), transparent 70%)' }} />

            {/* ── GitHub button ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={handleGithubLogin}
                disabled={githubLoading}
                className="github-btn relative w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4
                  text-sm font-medium text-white/80 transition-all duration-300
                  hover:text-white hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 1px 20px rgba(0,0,0,0.3)',
                }}
              >
                {githubLoading ? (
                  <svg className="animate-spin w-4 h-4 text-violet-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                )}
                Continue with GitHub
              </button>
            </motion.div>

            <GlowDivider />

            {/* ── Error ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-4 rounded-xl px-4 py-3 text-sm text-red-300 font-light"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}
                >
                  <span className="text-red-400 font-semibold mr-2">✕</span>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ── */}
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {[
                { label: 'Email', type: 'email', placeholder: 'ali@example.com', value: email, set: setEmail },
                { label: 'Password', type: 'password', placeholder: '••••••••', value: password, set: setPassword },
                { label: 'Confirm Password', type: 'password', placeholder: '••••••••', value: confirmPassword, set: setConfirmPassword },
              ].map((field, i) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.08 }}
                >
                  <GlowInput
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    required
                  />
                </motion.div>
              ))}

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72 }}
                className="mt-2"
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="submit-btn relative w-full rounded-xl py-3.5 text-sm font-semibold
                    tracking-wide text-white transition-all duration-300 overflow-hidden
                    hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    boxShadow: '0 4px 32px rgba(124,58,237,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
                  }}
                >
                  {/* Button sheen */}
                  <div className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />

                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Creating account…
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center gap-2">
                      Create Account
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        →
                      </motion.span>
                    </span>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Bottom link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mt-7 text-center text-xs text-white/25 tracking-wide"
            >
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-violet-400 hover:text-violet-300 transition-colors duration-200 relative group"
              >
                Sign in
                <span className="absolute -bottom-0.5 left-0 h-px w-0 group-hover:w-full transition-all duration-300 bg-violet-400" />
              </Link>
            </motion.p>

            {/* Bottom card glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(99,60,200,0.4), transparent)' }} />
          </motion.div>
        </TiltCard>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center text-xs text-white/15 tracking-wide"
        >
          By signing up you agree to our{' '}
          <Link href="/terms" className="hover:text-white/40 transition-colors duration-200 underline underline-offset-2">Terms</Link>
          {' & '}
          <Link href="/privacy" className="hover:text-white/40 transition-colors duration-200 underline underline-offset-2">Privacy</Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
