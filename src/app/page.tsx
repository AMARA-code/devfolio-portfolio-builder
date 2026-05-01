import Link from 'next/link'
import {
  ArrowRight, BarChart3, LayoutDashboard, Sparkles, Wand2,
  CheckCircle2, Globe, Zap, Star, Users, Code2, Layers,
  ChevronRight, Eye, GitBranch
} from 'lucide-react'

import Button from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'DM Sans', sans-serif; }
        .font-mono-custom { font-family: 'DM Mono', monospace; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes border-spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float 6s ease-in-out infinite 2s; }
        .animate-float-slow { animation: float 8s ease-in-out infinite 1s; }
        .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }

        .reveal-1 { animation: slide-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both; }
        .reveal-2 { animation: slide-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.22s both; }
        .reveal-3 { animation: slide-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.36s both; }
        .reveal-4 { animation: slide-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both; }
        .reveal-5 { animation: slide-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.65s both; }
        .reveal-card { animation: slide-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.5s both; }

        .shimmer-text {
          background: linear-gradient(90deg, #a78bfa 0%, #e0c3fc 30%, #818cf8 50%, #e0c3fc 70%, #a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .glass-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
        }

        .glow-violet { box-shadow: 0 0 60px rgba(139,92,246,0.15), 0 0 120px rgba(99,102,241,0.08); }
        .glow-btn { box-shadow: 0 4px 24px rgba(139,92,246,0.35), 0 2px 8px rgba(99,102,241,0.2); }
        .glow-btn:hover { box-shadow: 0 6px 32px rgba(139,92,246,0.5), 0 2px 8px rgba(99,102,241,0.3); }

        .noise {
          position: relative;
        }
        .noise::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        .feature-card:hover { border-color: rgba(139,92,246,0.3); background: rgba(139,92,246,0.05); transform: translateY(-2px); }
        .feature-card { transition: all 0.3s cubic-bezier(0.22,1,0.36,1); }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
        }

        .marquee-track { animation: marquee 22s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        .tag-pill {
          background: rgba(139,92,246,0.1);
          border: 1px solid rgba(139,92,246,0.2);
          color: #c4b5fd;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 99px;
        }

        .hero-dash-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 16px;
        }

        .live-dot::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          margin-right: 6px;
          animation: pulse-glow 2s ease-in-out infinite;
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 99px; }
      `}</style>

      <main
        className="noise min-h-screen bg-[#080810] font-body text-zinc-100 overflow-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Background atmosphere ─────────────────────────────────── */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-1/3 -right-20 h-[400px] w-[400px] rounded-full bg-indigo-600/8 blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-0 left-10 h-[300px] w-[300px] rounded-full bg-violet-800/8 blur-[80px]" />
        </div>

        {/* ── Navbar ───────────────────────────────────────────────── */}
        <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/40">
              <Code2 size={15} className="text-white" />
            </div>
            <span className="font-display text-lg font-700 tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
              devfolio
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <button className="hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:block">
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button className="glow-btn rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-indigo-500">
                Get started free
              </button>
            </Link>
            
          </div>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-8 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr,480px] xl:grid-cols-[1fr,520px]">

            {/* Left — copy */}
            <div className="relative">
              <div className="reveal-1 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/8 px-3.5 py-1.5 text-xs font-medium text-violet-300">
                <Sparkles size={12} className="text-violet-400" />
                Portfolio builder for developers
              </div>

              <h1 className="reveal-2 mt-6 font-display text-5xl font-800 leading-[1.05] tracking-tight text-white sm:text-6xl xl:text-7xl"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, lineHeight: 1.05 }}>
                Your portfolio,{' '}
                <span className="shimmer-text">built to impress.</span>
              </h1>

              <p className="reveal-3 mt-6 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
                Ship a stunning developer portfolio in minutes — not days. Add projects, skills, and experience. Pick a theme. Go live instantly.
              </p>

              <div className="reveal-4 mt-8 flex flex-wrap items-center gap-3">
                <Link href="/signup">
                  <button className="glow-btn group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-indigo-500">
                    Dashboard 
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
                <Link href="/login">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/8 hover:text-white">
                    Sign in
                  </button>
                </Link>
                {user && (
                  <Link href="/dashboard">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-6 py-3 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20">
                      Open Dashboard <ChevronRight size={14} />
                    </button>
                  </Link>
                )}
              </div>

              <div className="reveal-5 mt-10 flex flex-wrap items-center gap-5">
                {[
                  { icon: CheckCircle2, text: 'No credit card required' },
                  { icon: CheckCircle2, text: 'Live in under 5 minutes' },
                  { icon: CheckCircle2, text: 'Custom portfolio URL' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <Icon size={12} className="text-violet-400" /> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — dashboard mockup */}
            <div className="reveal-card relative">
              {/* Glow behind card */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-600/20 to-indigo-600/15 blur-2xl" />

              <div className="glow-violet relative rounded-3xl border border-white/8 bg-[#0d0d18] p-5 shadow-2xl animate-float">
                {/* Fake browser bar */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-rose-500/70" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/70" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-white/4 px-3 py-1.5">
                    <Globe size={10} className="text-zinc-600" />
                    <span className="font-mono-custom text-[10px] text-zinc-500">devfolio.app/u/janedoe</span>
                  </div>
                </div>

                {/* Dashboard header */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-violet-400">Workspace</p>
                    <p className="mt-0.5 text-sm font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>Dashboard</p>
                  </div>
                  <span className="live-dot rounded-full border border-emerald-500/25 bg-emerald-500/10 py-1 pl-4 pr-3 text-[10px] font-medium text-emerald-300">
                    Live
                  </span>
                </div>

                {/* Stats row */}
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {[
                    { label: 'Total Views', value: '2.4k', color: 'text-violet-300' },
                    { label: 'Projects', value: '8', color: 'text-indigo-300' },
                    { label: 'Skills', value: '14', color: 'text-sky-300' },
                  ].map(s => (
                    <div key={s.label} className="hero-dash-card">
                      <p className="text-[9px] uppercase tracking-wider text-zinc-600">{s.label}</p>
                      <p className={`stat-num mt-1.5 text-xl ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Analytics chart placeholder */}
                <div className="hero-dash-card mb-3">
                  <div className="mb-2.5 flex items-center justify-between">
                    <p className="text-[10px] font-medium text-zinc-400">Views — Last 7 Days</p>
                    <p className="text-[9px] text-zinc-600">Apr 24 – Apr 30</p>
                  </div>
                  <div className="flex h-16 items-end gap-1">
                    {[28, 42, 35, 60, 48, 72, 55].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-violet-600/70 to-violet-400/30 transition-all"
                        style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
                    ))}
                  </div>
                </div>

                {/* URL bar */}
                <div className="hero-dash-card flex items-center gap-2">
                  <Globe size={11} className="shrink-0 text-violet-400" />
                  <span className="font-mono-custom flex-1 truncate text-[10px] text-zinc-400">devfolio.app/u/janedoe</span>
                  <span className="rounded-md bg-violet-500/15 px-2 py-0.5 text-[9px] font-medium text-violet-300">Copy</span>
                </div>
              </div>

              {/* Floating skill chips */}
              <div className="absolute -left-8 top-12 animate-float-delay hidden xl:block">
                <div className="glass-card rounded-xl px-3 py-2 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-sky-500/20 flex items-center justify-center">
                      <Zap size={11} className="text-sky-300" />
                    </div>
                    <div>
                      <p className="text-[9px] text-zinc-500">New skill added</p>
                      <p className="text-[11px] font-medium text-zinc-200">TypeScript · Expert</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 bottom-20 animate-float-slow hidden xl:block">
                <div className="glass-card rounded-xl px-3 py-2 shadow-xl">
                  <div className="flex items-center gap-2">
                    <Eye size={12} className="text-emerald-400" />
                    <p className="text-[11px] text-zinc-300"><span className="font-semibold text-emerald-300">+12</span> views today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Marquee tech strip ──────────────────────────────────────── */}
        <div className="relative overflow-hidden border-y border-white/5 bg-white/[0.015] py-4">
          <div className="marquee-track flex w-max gap-4">
            {[
              'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL',
              'Supabase', 'GraphQL', 'Docker', 'Vercel', 'Figma', 'Python', 'Go', 'Rust',
              'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL',
              'Supabase', 'GraphQL', 'Docker', 'Vercel', 'Figma', 'Python', 'Go', 'Rust',
            ].map((tech, i) => (
              <span key={i} className="tag-pill shrink-0">{tech}</span>
            ))}
          </div>
        </div>

        {/* ── Stats row ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: '10k+', label: 'Developers', icon: Users },
              { value: '85k+', label: 'Portfolio Views', icon: Eye },
              { value: '3', label: 'Premium Templates', icon: Layers },
              { value: '< 5min', label: 'Time to launch', icon: Zap },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="group text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/6 bg-white/3 text-violet-400 transition group-hover:border-violet-500/30 group-hover:bg-violet-500/8">
                  <Icon size={18} />
                </div>
                <p className="stat-num text-3xl text-white sm:text-4xl">{value}</p>
                <p className="mt-1 text-sm text-zinc-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
          <div className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-violet-400">Everything you need</p>
            <h2 className="mt-3 font-display text-3xl font-800 text-white sm:text-4xl"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
              Built for serious developers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-zinc-500">
              Every feature is designed to help you land your next opportunity, not just look good.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Wand2,
                label: 'Guided Onboarding',
                desc: 'Step-by-step setup with validation at every stage. Your portfolio is always publish-ready, never half-finished.',
                accent: 'from-violet-500/20 to-violet-600/5',
                iconBg: 'bg-violet-500/15 text-violet-300',
              },
              {
                icon: LayoutDashboard,
                label: 'Pro Dashboard',
                desc: 'Manage your entire online presence from one place — profile, projects, skills, templates, and analytics.',
                accent: 'from-indigo-500/20 to-indigo-600/5',
                iconBg: 'bg-indigo-500/15 text-indigo-300',
              },
              {
                icon: BarChart3,
                label: 'Live Analytics',
                desc: 'See who visits your portfolio and when. Real visitor data with 7-day chart and total view counts.',
                accent: 'from-sky-500/20 to-sky-600/5',
                iconBg: 'bg-sky-500/15 text-sky-300',
              },
              {
                icon: Globe,
                label: 'Instant Public URL',
                desc: 'Get your own devfolio.app/u/username URL the moment you publish. Copy and share anywhere.',
                accent: 'from-emerald-500/20 to-emerald-600/5',
                iconBg: 'bg-emerald-500/15 text-emerald-300',
              },
              {
                icon: Layers,
                label: 'Premium Templates',
                desc: 'Switch between Minimal, Dark, and Creative themes with one click. Every template is production-grade.',
                accent: 'from-amber-500/20 to-amber-600/5',
                iconBg: 'bg-amber-500/15 text-amber-300',
              },
              {
                icon: GitBranch,
                label: 'Project Showcase',
                desc: 'Highlight your best work with live URLs, GitHub links, tech stack tags, and rich project descriptions.',
                accent: 'from-rose-500/20 to-rose-600/5',
                iconBg: 'bg-rose-500/15 text-rose-300',
              },
            ].map(({ icon: Icon, label, desc, accent, iconBg }) => (
              <article key={label} className={`feature-card glass-card group relative overflow-hidden rounded-2xl p-6`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                <div className="relative">
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="mb-2 font-display text-base font-700 text-white"
                    style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                    {label}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/6 bg-white/[0.02] px-8 py-14 sm:px-14">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-600/8 blur-3xl" />

            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.2em] text-violet-400">How it works</p>
              <h2 className="mt-3 font-display text-3xl font-800 text-white sm:text-4xl"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                Three steps to live.
              </h2>

              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {[
                  { step: '01', title: 'Create your account', desc: 'Sign up free and complete the guided onboarding. Add your bio, skills, projects, and experience.' },
                  { step: '02', title: 'Pick your template', desc: 'Choose from Minimal, Dark, or Creative. Switch anytime from your dashboard with a single click.' },
                  { step: '03', title: 'Publish and share', desc: 'Hit publish and get your personal URL instantly. Share it in job applications, LinkedIn, and GitHub.' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="group">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="font-mono-custom text-4xl font-500 leading-none text-violet-500/30 transition group-hover:text-violet-500/60"
                        style={{ fontFamily: "'DM Mono', monospace" }}>
                        {step}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-violet-500/20 to-transparent" />
                    </div>
                    <h3 className="mb-2 font-display text-base font-700 text-white"
                      style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-14">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-transparent" />
            <div className="absolute inset-0 rounded-3xl border border-violet-500/20" />
            <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

            <div className="relative">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-2xl shadow-violet-500/40">
                <Sparkles size={24} className="text-white" />
              </div>
              <h2 className="font-display text-3xl font-800 text-white sm:text-5xl"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}>
                Ready to stand out?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-base text-zinc-400">
                Join thousands of developers who built their dream portfolio with devfolio. It's free to start.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/signup">
                  <button className="glow-btn group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:from-violet-500 hover:to-indigo-500">
                    Build your portfolio
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
                {user && (
                  <Link href="/dashboard">
                    <button className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white">
                      Go to dashboard <ChevronRight size={14} />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Code2 size={11} className="text-white" />
              </div>
              <span className="font-display text-sm font-700 text-zinc-400"
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
                devfolio
              </span>
            </div>
            <p className="text-xs text-zinc-600">© {new Date().getFullYear()} devfolio. Built for developers.</p>
            <div className="flex gap-5">
              <Link href="/login" className="text-xs text-zinc-600 transition hover:text-zinc-400">Sign in</Link>
              <Link href="/signup" className="text-xs text-zinc-600 transition hover:text-zinc-400">Sign up</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}