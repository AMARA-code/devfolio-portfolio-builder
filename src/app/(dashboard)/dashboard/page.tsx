'use client'

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS SECTION UPGRADE + TEXT VISIBILITY FIXES
// Drop-in replacement for the existing dashboard.tsx
// Changes:
//  1. Full premium skills tab with category grouping, animated bars, glassmorphism cards
//  2. Text colour upgrades across the entire dashboard (zinc-500→zinc-400, zinc-600→zinc-500, etc.)
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useEffect, useMemo, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  BarChart3, BriefcaseBusiness, Copy, ExternalLink, FolderGit2,
  Home, LayoutTemplate, LogOut, Rocket, Save, UserRound, X,
  Plus, Trash2, Globe,
  Link2, Eye, TrendingUp, Zap, ChevronRight,
  Menu, CheckCircle2, AlertCircle, Sparkles, Activity,
  Clock, ArrowUpRight, Code2, Database, Wrench, Server, Layers
} from 'lucide-react'
import {
  CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, Area, AreaChart, BarChart, Bar, Cell
} from 'recharts'
import type { Experience, PortfolioData, Profile, Project, Skill } from '@/types'
import { isOptionalHttpUrl, isValidEmail, isValidHttpUrl, isValidUsername } from '@/lib/validation'
import { buildPublicAppUrl } from '@/lib/public-app-url'

type DashboardTab = 'overview' | 'profile' | 'skills' | 'projects' | 'experience' | 'template' | 'analytics'
type ViewRow = { viewed_at: string; referrer?: string; country?: string; duration_seconds?: number }

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: BriefcaseBusiness },
  { id: 'template', label: 'Template', icon: LayoutTemplate },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const

// Category metadata
const CATEGORY_META: Record<string, { icon: typeof Zap; color: string; glow: string; bg: string; border: string; label: string }> = {
  Frontend:  { icon: Layers,   color: 'text-violet-300', glow: 'shadow-violet-500/30',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20', label: 'Frontend' },
  Backend:   { icon: Server,   color: 'text-sky-300',    glow: 'shadow-sky-500/30',     bg: 'bg-sky-500/10',     border: 'border-sky-500/20',    label: 'Backend'  },
  Database:  { icon: Database, color: 'text-emerald-300',glow: 'shadow-emerald-500/30', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20',label: 'Database' },
  Tools:     { icon: Wrench,   color: 'text-amber-300',  glow: 'shadow-amber-500/30',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',  label: 'Tools'    },
}

const LEVEL_CONFIG = {
  Beginner:     { pct: 33,  label: 'Beginner',     color: 'from-sky-500 to-sky-400',         dot: 'bg-sky-400' },
  Intermediate: { pct: 66,  label: 'Intermediate', color: 'from-violet-500 to-indigo-400',   dot: 'bg-violet-400' },
  Expert:       { pct: 100, label: 'Expert',        color: 'from-amber-500 to-orange-400',    dot: 'bg-amber-400' },
}

// ─── Animated progress bar ────────────────────────────────────────────────
function SkillBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80 + delay)
    return () => clearTimeout(t)
  }, [pct, delay])
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
      <motion.div
        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
      />
      {/* Shimmer */}
      <motion.div
        className="absolute inset-y-0 w-8 rounded-full bg-white/20 blur-sm"
        initial={{ left: '-10%' }}
        animate={{ left: `${width + 2}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
      />
    </div>
  )
}

// ─── Premium skill card ───────────────────────────────────────────────────
function SkillCard({
  skill, idx, onUpdate, onRemove
}: {
  skill: Skill; idx: number
  onUpdate: (updates: Partial<Skill>) => void
  onRemove: () => void
}) {
  const [editing, setEditing] = useState(false)
  const meta = CATEGORY_META[skill.category] || CATEGORY_META.Tools
  const level = LEVEL_CONFIG[skill.level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.Intermediate
  const CatIcon = meta.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={`group relative overflow-hidden rounded-2xl border ${meta.border} bg-white/[0.025] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.04] hover:shadow-lg hover:${meta.glow}`}
    >
      {/* Category colour stripe */}
      <div className={`absolute left-0 top-0 h-full w-[3px] rounded-l-2xl bg-gradient-to-b ${level.color} opacity-60`} />

      {/* Corner glow */}
      <div className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${meta.bg}`} />

      <div className="px-5 py-4">
        {editing ? (
          // ── Edit mode ──
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
              <input
                autoFocus
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm font-bold text-white placeholder-zinc-500 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                value={skill.name}
                onChange={e => onUpdate({ name: e.target.value })}
                placeholder="Skill name"
              />
              <button
                onClick={() => setEditing(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
              >
                <CheckCircle2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="w-full cursor-pointer rounded-xl border border-white/[0.07] bg-[#0f0f17] px-3 py-2 text-xs font-bold text-zinc-300 outline-none focus:border-violet-500/50"
                value={skill.category}
                onChange={e => onUpdate({ category: e.target.value as Skill['category'] })}
              >
                {Object.keys(CATEGORY_META).map(v => <option key={v}>{v}</option>)}
              </select>
              <select
                className="w-full cursor-pointer rounded-xl border border-white/[0.07] bg-[#0f0f17] px-3 py-2 text-xs font-bold text-zinc-300 outline-none focus:border-violet-500/50"
                value={skill.level}
                onChange={e => onUpdate({ level: e.target.value as Skill['level'] })}
              >
                {Object.keys(LEVEL_CONFIG).map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
        ) : (
          // ── Display mode ──
          <div className="flex items-center gap-4">
            {/* Icon badge */}
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.bg} border ${meta.border}`}>
              <CatIcon size={16} className={meta.color} />
            </div>

            {/* Name + bar */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-bold text-zinc-100">{skill.name || <span className="text-zinc-600 italic">Unnamed</span>}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className={`h-1.5 w-1.5 rounded-full ${level.dot}`} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">{level.label}</span>
                </div>
              </div>
              <SkillBar pct={level.pct} color={level.color} delay={idx * 60} />
            </div>

            {/* Actions */}
            <div className="ml-2 flex shrink-0 items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => setEditing(true)}
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.bg} border ${meta.border} ${meta.color} hover:brightness-125 transition-all text-[10px] font-bold`}
              >
                ✎
              </button>
              <button
                onClick={onRemove}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/[0.06] text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Category section ─────────────────────────────────────────────────────
function SkillCategory({
  category, skills, onUpdate, onRemove, startIdx
}: {
  category: string
  skills: { skill: Skill; originalIdx: number }[]
  onUpdate: (idx: number, updates: Partial<Skill>) => void
  onRemove: (idx: number) => void
  startIdx: number
}) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Tools
  const CatIcon = meta.icon

  return (
    <div className="space-y-2.5">
      <div className={`flex items-center gap-2.5 rounded-xl ${meta.bg} border ${meta.border} px-3.5 py-2`}>
        <CatIcon size={13} className={meta.color} />
        <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${meta.color}`}>{meta.label}</span>
        <span className={`ml-auto rounded-md ${meta.bg} border ${meta.border} px-2 py-0.5 text-[10px] font-bold ${meta.color}`}>{skills.length}</span>
      </div>
      <div className="space-y-2 pl-1">
        <AnimatePresence>
          {skills.map(({ skill, originalIdx }, i) => (
            <SkillCard
              key={skill.id || `skill-${originalIdx}`}
              skill={skill}
              idx={startIdx + i}
              onUpdate={u => onUpdate(originalIdx, u)}
              onRemove={() => onRemove(originalIdx)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Skills overview bar ──────────────────────────────────────────────────
function SkillsOverviewBar({ skills }: { skills: Skill[] }) {
  const counts = useMemo(() => {
    const c: Record<string, number> = { Frontend: 0, Backend: 0, Database: 0, Tools: 0 }
    skills.forEach(s => { if (c[s.category] !== undefined) c[s.category]++ })
    return c
  }, [skills])
  const total = skills.length || 1

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-zinc-100">Skill Breakdown</p>
          <p className="mt-0.5 text-xs text-zinc-400">{skills.length} skills across {Object.values(counts).filter(Boolean).length} categories</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-violet-500/20 bg-violet-500/[0.06] px-2.5 py-1.5">
          <Zap size={10} className="text-violet-400" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-violet-400">{skills.length} Total</span>
        </div>
      </div>

      {/* Segmented bar */}
      {skills.length > 0 && (
        <div className="mb-4 flex h-2.5 w-full overflow-hidden rounded-full gap-0.5">
          {Object.entries(counts).filter(([, v]) => v > 0).map(([cat, count]) => {
            const meta = CATEGORY_META[cat]
            return (
              <motion.div
                key={cat}
                className={`h-full rounded-full bg-gradient-to-r ${LEVEL_CONFIG.Expert.color}`}
                style={{ background: undefined }}
                initial={{ width: 0 }}
                animate={{ width: `${(count / total) * 100}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={`h-full w-full rounded-full ${meta.bg.replace('bg-', 'bg-').replace('/10', '/60')}`}
                  style={{ background: cat === 'Frontend' ? 'linear-gradient(90deg,#7c3aed,#6366f1)' : cat === 'Backend' ? 'linear-gradient(90deg,#0ea5e9,#38bdf8)' : cat === 'Database' ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)' }} />
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {Object.entries(counts).map(([cat, count]) => {
          const meta = CATEGORY_META[cat]
          const CatIcon = meta.icon
          return (
            <div key={cat} className={`flex items-center gap-2 rounded-xl border ${meta.border} ${meta.bg} px-3 py-2`}>
              <CatIcon size={11} className={meta.color} />
              <div>
                <p className={`text-[10px] font-bold ${meta.color}`}>{cat}</p>
                <p className="text-[10px] text-zinc-400">{count} skill{count !== 1 ? 's' : ''}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Add skill quick bar ──────────────────────────────────────────────────
function AddSkillBar({ onAdd }: { onAdd: (skill: Partial<Skill>) => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Skill['category']>('Frontend')
  const [level, setLevel] = useState<Skill['level']>('Intermediate')
  const meta = CATEGORY_META[category]

  function submit() {
    if (!name.trim()) return
    onAdd({ name: name.trim(), category, level })
    setName('')
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 rounded-2xl border ${meta.border} bg-white/[0.02] p-3 backdrop-blur-sm transition-all duration-300`}>
      <div className="relative flex-1 min-w-[160px]">
        <Zap size={12} className={`absolute left-3 top-1/2 -translate-y-1/2 ${meta.color}`} />
        <input
          className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-2 pl-8 pr-3 text-sm font-medium text-zinc-100 placeholder-zinc-500 outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10 transition-all"
          placeholder="Add a skill…"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
      </div>
      <select
        className="cursor-pointer rounded-xl border border-white/[0.07] bg-[#0f0f17] px-3 py-2 text-xs font-bold text-zinc-300 outline-none focus:border-violet-500/50"
        value={category}
        onChange={e => setCategory(e.target.value as Skill['category'])}
      >
        {Object.keys(CATEGORY_META).map(v => <option key={v}>{v}</option>)}
      </select>
      <select
        className="cursor-pointer rounded-xl border border-white/[0.07] bg-[#0f0f17] px-3 py-2 text-xs font-bold text-zinc-300 outline-none focus:border-violet-500/50"
        value={level}
        onChange={e => setLevel(e.target.value as Skill['level'])}
      >
        {Object.keys(LEVEL_CONFIG).map(v => <option key={v}>{v}</option>)}
      </select>
      <button
        onClick={submit}
        disabled={!name.trim()}
        className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${meta.bg} border ${meta.border} ${meta.color} hover:brightness-125 active:scale-95`}
      >
        <Plus size={12} /> Add
      </button>
    </div>
  )
}

// ─── Ambient cursor light ─────────────────────────────────────────────────
function AmbientCursor() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 50, damping: 18 })
  const springY = useSpring(y, { stiffness: 50, damping: 18 })
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])
  return (
    <motion.div style={{ left: springX, top: springY, translateX: '-50%', translateY: '-50%' }}
      className="pointer-events-none fixed z-0 h-[600px] w-[600px] rounded-full" aria-hidden>
      <div className="absolute inset-0 rounded-full bg-violet-600/[0.035] blur-[100px]" />
    </motion.div>
  )
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-60 -top-60 h-[500px] w-[500px] animate-pulse rounded-full bg-violet-700/[0.07] blur-[120px]" style={{ animationDuration: '9s' }} />
      <div className="absolute -right-40 top-1/4 h-[400px] w-[400px] animate-pulse rounded-full bg-indigo-600/[0.05] blur-[100px]" style={{ animationDuration: '13s', animationDelay: '3s' }} />
      <div className="absolute bottom-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 animate-pulse rounded-full bg-violet-500/[0.04] blur-[100px]" style={{ animationDuration: '11s', animationDelay: '1.5s' }} />
      <div className="absolute inset-0 opacity-[0.012]"
        style={{ backgroundImage: `linear-gradient(rgba(139,92,246,1) 1px, transparent 1px),linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)`, backgroundSize: '72px 72px' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(7,7,13,0.6) 100%)' }} />
    </div>
  )
}

// ─── Primitives — TEXT VISIBILITY FIXES applied ───────────────────────────
// Key changes: zinc-500→zinc-400, zinc-600→zinc-500, zinc-700→zinc-500 for labels

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* FIXED: was zinc-500, now zinc-400 */}
      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">{label}</label>
      {children}
      {error && (
        <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 text-xs text-rose-400">
          <AlertCircle size={11} /> {error}
        </motion.span>
      )}
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-200 focus:border-violet-500/50 focus:bg-white/[0.04] focus:ring-2 focus:ring-violet-500/[0.12] hover:border-violet-400/35 hover:shadow-[0_10px_24px_rgba(76,29,149,0.22)]'

function StyledInput({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  const el = <input className={inputCls} {...props} />
  if (!label) return el
  return <Field label={label} error={error}>{el}</Field>
}

function StyledTextarea({ label, error, rows = 3, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }) {
  const el = <textarea className={`${inputCls} resize-none`} rows={rows} {...props} />
  if (!label) return el
  return <Field label={label} error={error}>{el}</Field>
}

function StyledSelect({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const el = <select className={`${inputCls} cursor-pointer`} {...props}>{children}</select>
  if (!label) return el
  return <Field label={label}>{el}</Field>
}

function Btn({ children, variant = 'primary', size = 'md', loading, className = '', ...props }:
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'outline'; size?: 'sm' | 'md'; loading?: boolean }) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm' }
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/45 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.97]',
    ghost: 'bg-white/[0.035] text-zinc-200 border border-white/[0.08] hover:bg-white/[0.07] hover:text-white active:scale-[0.97]',
    outline: 'border border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.04] hover:text-white active:scale-[0.97]',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/18 active:scale-[0.97]',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : children}
    </button>
  )
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = performance.now(); const duration = 1100; const from = 0
    const raf = requestAnimationFrame(function step(now) {
      const t = Math.min((now - start) / duration, 1); const ease = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (value - from) * ease))
      if (t < 1) requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{display.toLocaleString()}</>
}

function StatCard({ label, value, icon: Icon, accent, trend }: {
  label: string; value: number | string; icon: typeof Eye; accent: string; trend?: number
}) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.015 }} transition={{ duration: 0.18 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%)' }} />
      <div className={`absolute -right-5 -top-5 h-24 w-24 rounded-full blur-2xl opacity-15 group-hover:opacity-35 transition-opacity ${accent}`} />
      <div className="relative flex items-start justify-between">
        <div>
          {/* FIXED: was zinc-600 */}
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">{label}</p>
          <p className="mt-2.5 text-[2rem] font-bold leading-none tracking-tight text-white">
            {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
          </p>
          {trend !== undefined && (
            <div className={`mt-2 flex items-center gap-1 text-[11px] font-bold ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <ArrowUpRight size={11} className={trend < 0 ? 'rotate-180' : ''} />
              {Math.abs(trend)}% vs last week
            </div>
          )}
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent} bg-opacity-15 border border-white/[0.06] group-hover:scale-110 transition-transform duration-200`}>
          <Icon size={16} className="text-white opacity-75" />
        </div>
      </div>
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-zinc-950/95 px-4 py-3 shadow-2xl backdrop-blur-xl">
        {/* FIXED: was zinc-600 */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
        <p className="mt-1 text-xl font-bold text-violet-300">{payload[0].value}</p>
        <p className="text-[10px] text-zinc-500">portfolio views</p>
      </div>
    )
  }
  return null
}

function useRealAnalytics(views: ViewRow[]) {
  return useMemo(() => {
    const now = new Date()
    const last30 = Array.from({ length: 30 }).map((_, idx) => {
      const date = new Date(now); date.setDate(now.getDate() - (29 - idx))
      const key = date.toISOString().slice(0, 10)
      return { date: key, day: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), views: views.filter(e => e.viewed_at?.slice(0, 10) === key).length }
    })
    const last7 = last30.slice(-7).map(d => ({ ...d, day: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }) }))
    const thisWeekTotal = last7.reduce((s, d) => s + d.views, 0)
    const prevWeekTotal = last30.slice(-14, -7).reduce((s, d) => s + d.views, 0)
    const weekTrend = prevWeekTotal === 0 ? 0 : Math.round(((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100)
    const todayKey = now.toISOString().slice(0, 10)
    const todayViews = views.filter(v => v.viewed_at?.slice(0, 10) === todayKey).length
    const durViews = views.filter(v => v.duration_seconds && v.duration_seconds > 0)
    const avgDuration = durViews.length ? Math.round(durViews.reduce((s, v) => s + (v.duration_seconds || 0), 0) / durViews.length) : null
    const dayTotals = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => ({ day: d, views: views.filter(v => new Date(v.viewed_at).getDay() === i).length }))
    const hourly = Array.from({ length: 24 }).map((_, h) => ({ hour: h, label: h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`, views: views.filter(v => new Date(v.viewed_at).getHours() === h).length }))
    return { last30, last7, thisWeekTotal, weekTrend, todayViews, avgDuration, dayTotals, hourly }
  }, [views])
}

// ─── Inner component ───────────────────────────────────────────────────────
function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [views, setViews] = useState<ViewRow[]>([])
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [analyticsRange, setAnalyticsRange] = useState<'7' | '30'>('7')

  const [profileForm, setProfileForm] = useState({
    full_name: '', username: '', bio: '', location: '',
    email: '', website: '', github_url: '', linkedin_url: '', twitter_url: '', is_published: true,
  })

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
      if (!profileData) { setLoading(false); return }
      const [skillsRes, projectsRes, experienceRes, viewsRes] = await Promise.all([
        supabase.from('skills').select('*').eq('profile_id', profileData.id),
        supabase.from('projects').select('*').eq('profile_id', profileData.id).order('order_index'),
        supabase.from('experience').select('*').eq('profile_id', profileData.id).order('start_date', { ascending: false }),
        supabase.from('portfolio_views').select('viewed_at, referrer, country, duration_seconds').eq('profile_id', profileData.id),
      ])
      setProfile(profileData as Profile); setSkills((skillsRes.data || []) as Skill[])
      setProjects((projectsRes.data || []) as Project[]); setExperience((experienceRes.data || []) as Experience[])
      setViews((viewsRes.data || []) as ViewRow[])
      setProfileForm({ full_name: profileData.full_name || '', username: profileData.username || '', bio: profileData.bio || '', location: profileData.location || '', email: profileData.email || '', website: profileData.website || '', github_url: profileData.github_url || '', linkedin_url: profileData.linkedin_url || '', twitter_url: profileData.twitter_url || '', is_published: profileData.is_published })
      setLoading(false)
    }
    void loadDashboardData()
  }, [router, supabase])

  const analytics = useRealAnalytics(views)
  const totalViews = views.length
  const chartData = analyticsRange === '7' ? analytics.last7 : analytics.last30
  const portfolioUrl = profile?.username ? buildPublicAppUrl(`/u/${profile.username}`) : ''
  const justPublished = searchParams.get('published') === '1'

  const isProfileFormValid = useMemo(() => (
    profileForm.full_name.trim().length > 0 && profileForm.username.trim().length > 0 &&
    isValidUsername(profileForm.username) && profileForm.bio.trim().length > 0 &&
    profileForm.location.trim().length > 0 && profileForm.email.trim().length > 0 &&
    isValidEmail(profileForm.email) &&
    (profileForm.website.trim().length === 0 || isValidHttpUrl(profileForm.website)) &&
    isOptionalHttpUrl(profileForm.github_url) && isOptionalHttpUrl(profileForm.linkedin_url) &&
    isOptionalHttpUrl(profileForm.twitter_url)
  ), [profileForm])

  async function handleLogout() { await supabase.auth.signOut(); router.push('/login'); router.refresh() }

  async function saveProfile() {
    if (!profile) return
    const errors: Record<string, string> = {}
    if (!profileForm.full_name.trim()) errors.full_name = 'Required'
    if (!profileForm.username.trim()) errors.username = 'Required'
    if (profileForm.username.trim() && !isValidUsername(profileForm.username)) errors.username = 'Lowercase, numbers, - and _ only'
    if (!profileForm.bio.trim()) errors.bio = 'Required'
    if (!profileForm.location.trim()) errors.location = 'Required'
    if (!profileForm.email.trim()) errors.email = 'Required'
    if (profileForm.email.trim() && !isValidEmail(profileForm.email)) errors.email = 'Enter a valid email'
    if (profileForm.website.trim() && !isValidHttpUrl(profileForm.website)) errors.website = 'Enter a valid URL'
    if (!isOptionalHttpUrl(profileForm.github_url)) errors.github_url = 'Enter a valid URL or leave empty'
    if (!isOptionalHttpUrl(profileForm.linkedin_url)) errors.linkedin_url = 'Enter a valid URL or leave empty'
    if (!isOptionalHttpUrl(profileForm.twitter_url)) errors.twitter_url = 'Enter a valid URL or leave empty'
    setProfileErrors(errors)
    if (Object.keys(errors).length > 0) return
    setSaving(true)
    const { data, error } = await supabase.from('profiles').update({ ...profileForm, template: profile.template }).eq('id', profile.id).select('*').single()
    if (!error && data) { setProfile(data as Profile); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000) }
    setSaving(false)
  }

  async function saveTemplate(template: PortfolioData['template']) {
    if (!profile) return; setSaving(true)
    const { data, error } = await supabase.from('profiles').update({ template }).eq('id', profile.id).select('*').single()
    if (!error && data) setProfile(data as Profile); setSaving(false)
  }

  async function saveSkills() {
    if (!profile) return; setSaving(true)
    await supabase.from('skills').delete().eq('profile_id', profile.id)
    const cleaned = skills.map(s => ({ profile_id: profile.id, name: s.name, category: s.category, level: s.level })).filter(s => s.name.trim())
    if (cleaned.length) await supabase.from('skills').insert(cleaned)
    const { data } = await supabase.from('skills').select('*').eq('profile_id', profile.id)
    setSkills((data || []) as Skill[]); setSaving(false)
  }

  async function saveProjects() {
    if (!profile) return; setSaving(true)
    await supabase.from('projects').delete().eq('profile_id', profile.id)
    const cleaned = projects.map((p, i) => ({ profile_id: profile.id, title: p.title, description: p.description, thumbnail_url: p.thumbnail_url || '', live_url: p.live_url || '', github_url: p.github_url || '', tech_stack: p.tech_stack || [], featured: p.featured || false, order_index: i })).filter(p => p.title.trim())
    if (cleaned.length) await supabase.from('projects').insert(cleaned)
    const { data } = await supabase.from('projects').select('*').eq('profile_id', profile.id).order('order_index')
    setProjects((data || []) as Project[]); setSaving(false)
  }

  async function saveExperience() {
    if (!profile) return; setSaving(true)
    await supabase.from('experience').delete().eq('profile_id', profile.id)
    const cleaned = experience.map(e => ({ profile_id: profile.id, company: e.company, role: e.role, start_date: e.start_date, end_date: e.end_date || '', is_current: e.is_current, description: e.description || '', company_logo_url: e.company_logo_url || '' })).filter(e => e.company.trim() && e.role.trim())
    if (cleaned.length) await supabase.from('experience').insert(cleaned)
    const { data } = await supabase.from('experience').select('*').eq('profile_id', profile.id).order('start_date', { ascending: false })
    setExperience((data || []) as Experience[]); setSaving(false)
  }

  async function copyPortfolioLink() {
    if (!portfolioUrl) return
    await navigator.clipboard.writeText(portfolioUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  // Grouped skills for the premium view
  const groupedSkills = useMemo(() => {
    const groups: Record<string, { skill: Skill; originalIdx: number }[]> = {}
    skills.forEach((skill, originalIdx) => {
      const cat = skill.category || 'Tools'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push({ skill, originalIdx })
    })
    return groups
  }, [skills])

  function updateSkill(idx: number, updates: Partial<Skill>) {
    setSkills(prev => prev.map((s, i) => i === idx ? { ...s, ...updates } : s))
  }
  function removeSkill(idx: number) {
    setSkills(prev => prev.filter((_, i) => i !== idx))
  }
  function addSkill(partial: Partial<Skill>) {
    if (!profile) return
    setSkills(prev => [...prev, { id: crypto.randomUUID(), profile_id: profile.id, name: partial.name || '', category: partial.category || 'Frontend', level: partial.level || 'Intermediate' }])
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070d]">
        <Background />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center gap-5">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-xl shadow-violet-500/40 flex items-center justify-center">
              <Code2 size={24} className="text-white" />
            </div>
            <div className="absolute inset-0 h-14 w-14 rounded-2xl border-2 border-violet-500/40 animate-ping" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-white tracking-tight">DevFolio</p>
            <p className="mt-1 text-xs text-zinc-400">Loading your workspace…</p>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="h-1.5 w-1.5 rounded-full bg-violet-500/60 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1.2s' }} />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07070d] p-6">
        <Background />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.02] p-10 text-center backdrop-blur-xl">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-600/12 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/12 blur-3xl" />
          <div className="relative">
            <motion.div animate={{ rotate: [0,6,-6,0], scale: [1,1.06,1] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-500/40">
              <Sparkles size={26} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Build your portfolio</h1>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">Complete onboarding to create your public portfolio.</p>
            <div className="mt-8 flex flex-col gap-3">
              <Btn onClick={() => router.push('/onboarding')} className="w-full justify-center"><Rocket size={15} /> Start Portfolio</Btn>
              <Btn variant="ghost" onClick={handleLogout} className="w-full justify-center"><LogOut size={15} /> Logout</Btn>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  const initials = profile.full_name?.slice(0, 2)?.toUpperCase() || 'U'

  // ── PREMIUM SKILLS TAB ─────────────────────────────────────────────────
  const skillsTab = (
    <div className="space-y-5">
      {/* Overview bar — only when there are skills */}
      {skills.length > 0 && <SkillsOverviewBar skills={skills} />}

      {/* Add skill quick bar */}
      <AddSkillBar onAdd={addSkill} />

      {/* Category groups */}
      {skills.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(CATEGORY_META)
            .filter(([cat]) => groupedSkills[cat]?.length)
            .map(([cat, ], catIdx) => {
              const catSkills = groupedSkills[cat]
              const startIdx = Object.entries(CATEGORY_META)
                .slice(0, catIdx)
                .reduce((acc, [c]) => acc + (groupedSkills[c]?.length || 0), 0)
              return (
                <motion.div key={cat}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.06, duration: 0.3 }}>
                  <SkillCategory
                    category={cat}
                    skills={catSkills}
                    onUpdate={updateSkill}
                    onRemove={removeSkill}
                    startIdx={startIdx}
                  />
                </motion.div>
              )
            })}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl border border-dashed border-white/[0.07] py-16 text-center">
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/[0.07]">
            <Zap size={20} className="text-violet-400" />
          </motion.div>
          <p className="text-sm font-bold text-zinc-300">No skills yet</p>
          <p className="mt-1 text-xs text-zinc-500">Use the field above to add your first skill.</p>
        </motion.div>
      )}

      {/* Save */}
      {skills.length > 0 && (
        <div className="flex items-center gap-3 pt-1">
          <Btn onClick={saveSkills} loading={saving}>
            <Save size={14} /> Save Skills
          </Btn>
          <span className="text-xs text-zinc-500">{skills.filter(s => s.name.trim()).length} skill{skills.filter(s => s.name.trim()).length !== 1 ? 's' : ''} ready to save</span>
        </div>
      )}
    </div>
  )

  // ── Tab content ────────────────────────────────────────────────────────
  const tabContent = {

    overview: (
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Views', value: totalViews, icon: Eye, accent: 'bg-violet-500', trend: analytics.weekTrend },
            { label: 'This Week', value: analytics.thisWeekTotal, icon: TrendingUp, accent: 'bg-indigo-500' },
            { label: 'Projects', value: projects.length, icon: FolderGit2, accent: 'bg-sky-500' },
            { label: 'Skills', value: skills.length, icon: Zap, accent: 'bg-emerald-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {justPublished && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-300">Portfolio is live!</p>
                  <p className="text-xs text-emerald-400">Your portfolio is now public and tracking real visitors.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Btn size="sm" variant="ghost" onClick={copyPortfolioLink}>{copied ? <CheckCircle2 size={13} /> : <Copy size={13} />} {copied ? 'Copied!' : 'Copy URL'}</Btn>
                <Btn size="sm" onClick={() => window.open(portfolioUrl, '_blank')} disabled={!portfolioUrl}><ExternalLink size={13} /> Open</Btn>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
          {/* FIXED: was zinc-600 */}
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Your Live URL</p>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/[0.05] bg-black/25 px-4 py-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
              <Globe size={11} className="text-violet-400" />
            </div>
            <span className="flex-1 truncate font-mono text-sm text-zinc-200">{portfolioUrl || 'Complete onboarding to get your URL'}</span>
            {portfolioUrl && <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn size="sm" variant="ghost" onClick={copyPortfolioLink} disabled={!portfolioUrl}>{copied ? <CheckCircle2 size={13} /> : <Copy size={13} />} {copied ? 'Copied!' : 'Copy'}</Btn>
            <Btn size="sm" onClick={() => window.open(portfolioUrl, '_blank')} disabled={!portfolioUrl}><ExternalLink size={13} /> Preview</Btn>
          </div>
        </motion.div>

        {totalViews > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">Portfolio Traffic</p>
                {/* FIXED: was zinc-600 */}
                <p className="text-xs text-zinc-400">Last 7 days · real visitor data</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-white/[0.05] bg-black/20 px-2.5 py-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" style={{ animationDuration: '2s' }} />
                {/* FIXED: was zinc-600 */}
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Live</span>
              </div>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.last7}>
                  <defs>
                    <linearGradient id="overviewGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={22} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2} fill="url(#overviewGrad)"
                    dot={{ fill: '#8b5cf6', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#a78bfa', strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { tab: 'profile', icon: UserRound, label: 'Edit Profile', desc: 'Bio, links & visibility' },
            { tab: 'projects', icon: FolderGit2, label: 'Projects', desc: `${projects.length} added` },
            { tab: 'skills', icon: Zap, label: 'Skills', desc: `${skills.length} listed` },
          ].map((item, i) => (
            <motion.button key={item.tab}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(item.tab as DashboardTab)}
              className="group flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-all hover:border-violet-500/20 backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.03] text-zinc-400 transition-all group-hover:border-violet-500/20 group-hover:bg-violet-500/12 group-hover:text-violet-300">
                <item.icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                {/* FIXED: was zinc-400 */}
                <p className="text-sm font-bold text-zinc-300 transition-colors group-hover:text-white">{item.label}</p>
                {/* FIXED: was zinc-700 */}
                <p className="mt-0.5 text-xs text-zinc-500">{item.desc}</p>
              </div>
              {/* FIXED: was zinc-800 */}
              <ChevronRight size={13} className="shrink-0 text-zinc-600 transition-all group-hover:text-zinc-400 group-hover:translate-x-0.5" />
            </motion.button>
          ))}
        </div>
      </div>
    ),

    profile: (
      <div className="space-y-5">
        <AnimatePresence>
          {saveSuccess && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] px-4 py-3 text-sm font-bold text-emerald-300">
              <CheckCircle2 size={14} /> Profile saved
            </motion.div>
          )}
        </AnimatePresence>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
          {/* FIXED: was zinc-600 */}
          <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Basic Info</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <StyledInput label="Full Name" placeholder="Jane Doe" value={profileForm.full_name} error={profileErrors.full_name}
              onChange={e => { setProfileForm(p => ({ ...p, full_name: e.target.value })); setProfileErrors(p => ({ ...p, full_name: '' })) }} />
            <StyledInput label="Username" placeholder="janedoe" value={profileForm.username} error={profileErrors.username}
              onChange={e => { setProfileForm(p => ({ ...p, username: e.target.value.toLowerCase() })); setProfileErrors(p => ({ ...p, username: '' })) }} />
            <div className="sm:col-span-2">
              <StyledTextarea label="Bio" rows={4} placeholder="Tell the world about yourself…" value={profileForm.bio} error={profileErrors.bio}
                onChange={e => { setProfileForm(p => ({ ...p, bio: e.target.value })); setProfileErrors(p => ({ ...p, bio: '' })) }} />
            </div>
            <StyledInput label="Location" placeholder="San Francisco, CA" value={profileForm.location} error={profileErrors.location}
              onChange={e => { setProfileForm(p => ({ ...p, location: e.target.value })); setProfileErrors(p => ({ ...p, location: '' })) }} />
            <StyledInput label="Email" type="email" placeholder="hello@example.com" value={profileForm.email} error={profileErrors.email}
              onChange={e => { setProfileForm(p => ({ ...p, email: e.target.value })); setProfileErrors(p => ({ ...p, email: '' })) }} />
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
          <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Social Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Website', key: 'website', icon: Globe, placeholder: 'https://yoursite.com' },
              { label: 'GitHub', key: 'github_url', icon: Code2, placeholder: 'https://github.com/you' },
              { label: 'LinkedIn', key: 'linkedin_url', icon: Link2, placeholder: 'https://linkedin.com/in/you' },
              { label: 'Twitter / X', key: 'twitter_url', icon: Link2, placeholder: 'https://x.com/you' },
            ].map(({ label, key, icon: Icon, placeholder }) => (
              <Field key={key} label={label} error={profileErrors[key]}>
                <div className="relative">
                  <Icon size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input className={`${inputCls} pl-9`} placeholder={placeholder}
                    value={(profileForm as any)[key]}
                    onChange={e => { setProfileForm(p => ({ ...p, [key]: e.target.value })); setProfileErrors(p => ({ ...p, [key]: '' })) }} />
                </div>
              </Field>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Btn onClick={saveProfile} loading={saving} disabled={!isProfileFormValid}><Save size={14} /> Save Profile</Btn>
          <Btn variant="ghost" onClick={copyPortfolioLink} disabled={!portfolioUrl}>{copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Link'}</Btn>
          <Btn variant="ghost" onClick={() => window.open(portfolioUrl, '_blank')} disabled={!portfolioUrl}><Eye size={14} /> Preview</Btn>
        </div>
      </div>
    ),

    // ── REPLACED: premium skills tab
    skills: skillsTab,

    projects: (
      <div className="space-y-4">
        <AnimatePresence>
          {projects.map((project, idx) => (
            <motion.div key={project.id || `project-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                {/* FIXED: was zinc-600 */}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Project {idx + 1}</span>
                <button onClick={() => setProjects(prev => prev.filter((_, i) => i !== idx))}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/[0.05] px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-500/12 transition-colors">
                  <Trash2 size={11} /> Remove
                </button>
              </div>
              <div className="grid gap-3">
                <StyledInput placeholder="Project title" value={project.title}
                  onChange={e => setProjects(prev => prev.map((p, i) => i === idx ? { ...p, title: e.target.value } : p))} />
                <StyledTextarea placeholder="Describe what you built and the impact…" rows={3} value={project.description}
                  onChange={e => setProjects(prev => prev.map((p, i) => i === idx ? { ...p, description: e.target.value } : p))} />
                <div className="grid gap-3 sm:grid-cols-3">
                  <StyledInput placeholder="Live URL" value={project.live_url}
                    onChange={e => setProjects(prev => prev.map((p, i) => i === idx ? { ...p, live_url: e.target.value } : p))} />
                  <StyledInput placeholder="GitHub URL" value={project.github_url}
                    onChange={e => setProjects(prev => prev.map((p, i) => i === idx ? { ...p, github_url: e.target.value } : p))} />
                  <StyledInput placeholder="Tech stack (comma separated)" value={project.tech_stack.join(', ')}
                    onChange={e => setProjects(prev => prev.map((p, i) => i === idx ? { ...p, tech_stack: e.target.value.split(',').map(v => v.trim()).filter(Boolean) } : p))} />
                </div>
                {project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack.map(t => (
                      <span key={t} className="rounded-md border border-violet-500/20 bg-violet-500/[0.07] px-2.5 py-0.5 text-xs font-bold text-violet-400">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {projects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.06] py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.02]">
              <FolderGit2 size={18} className="text-zinc-500" />
            </div>
            {/* FIXED: was zinc-600 */}
            <p className="mt-3 text-sm text-zinc-400">No projects yet. Showcase your best work.</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Btn variant="ghost" onClick={() => setProjects(prev => [...prev, { id: crypto.randomUUID(), profile_id: profile.id, title: '', description: '', thumbnail_url: '', live_url: '', github_url: '', tech_stack: [], featured: false, order_index: prev.length }])}>
            <Plus size={13} /> Add Project
          </Btn>
          <Btn onClick={saveProjects} loading={saving}><Save size={13} /> Save</Btn>
        </div>
      </div>
    ),

    experience: (
      <div className="space-y-4">
        <AnimatePresence>
          {experience.map((item, idx) => (
            <motion.div key={item.id || `exp-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Role {idx + 1}</span>
                <button onClick={() => setExperience(prev => prev.filter((_, i) => i !== idx))}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/[0.05] px-2.5 py-1 text-xs font-bold text-rose-400 hover:bg-rose-500/12 transition-colors">
                  <Trash2 size={11} /> Remove
                </button>
              </div>
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <StyledInput placeholder="Company name" value={item.company}
                    onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, company: e.target.value } : x))} />
                  <StyledInput placeholder="Your role / title" value={item.role}
                    onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, role: e.target.value } : x))} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <StyledInput placeholder="Start date (e.g. Jan 2022)" value={item.start_date}
                    onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, start_date: e.target.value } : x))} />
                  <StyledInput placeholder={item.is_current ? 'Present' : 'End date'} value={item.end_date} disabled={item.is_current}
                    onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, end_date: e.target.value } : x))} />
                </div>
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={item.is_current} className="h-4 w-4 cursor-pointer accent-violet-500"
                    onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, is_current: e.target.checked, end_date: e.target.checked ? '' : x.end_date } : x))} />
                  <span className="text-xs text-zinc-400">Currently working here</span>
                </label>
                <StyledTextarea placeholder="Responsibilities, achievements, and impact…" rows={3} value={item.description}
                  onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {experience.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.06] py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.02]">
              <BriefcaseBusiness size={18} className="text-zinc-500" />
            </div>
            <p className="mt-3 text-sm text-zinc-400">No experience added yet.</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Btn variant="ghost" onClick={() => setExperience(prev => [...prev, { id: crypto.randomUUID(), profile_id: profile.id, company: '', role: '', start_date: '', end_date: '', is_current: false, description: '', company_logo_url: '' }])}>
            <Plus size={13} /> Add Experience
          </Btn>
          <Btn onClick={saveExperience} loading={saving}><Save size={13} /> Save</Btn>
        </div>
      </div>
    ),

    template: (
      <div className="space-y-5">
        {/* FIXED: was zinc-500 */}
        <p className="text-sm text-zinc-400">Choose a template for your public portfolio. Applied instantly.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {([
            { id: 'minimal', label: 'Minimal', desc: 'Clean, focused, typography-forward.', gradient: 'from-zinc-700 to-zinc-900', ring: 'ring-zinc-500/30 border-zinc-500/30' },
            { id: 'dark', label: 'Dark', desc: 'Sleek dark with glowing accents. Perfect for devs.', gradient: 'from-violet-700 to-indigo-900', ring: 'ring-violet-500/30 border-violet-500/30' },
            { id: 'creative', label: 'Creative', desc: 'Bold, expressive, colorful.', gradient: 'from-rose-600 to-orange-700', ring: 'ring-rose-500/30 border-rose-500/30' },
          ] as const).map(t => {
            const active = profile.template === t.id
            return (
              <motion.button key={t.id} whileHover={{ y: -3, scale: 1.015 }} whileTap={{ scale: 0.97 }}
                onClick={() => void saveTemplate(t.id)}
                className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${active ? `${t.ring} bg-white/[0.04] ring-1` : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.09]'}`}>
                <div className={`mb-4 h-24 w-full rounded-xl bg-gradient-to-br ${t.gradient} flex items-end justify-end p-3 overflow-hidden relative`}>
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5 w-1/2">
                    <div className="h-1.5 rounded-full bg-white/20 w-3/4" />
                    <div className="h-1 rounded-full bg-white/10 w-full" />
                    <div className="h-1 rounded-full bg-white/10 w-1/2" />
                  </div>
                  <div className="h-5 w-14 rounded-md bg-white/25 backdrop-blur-sm" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-white">{t.label}</p>
                    {/* FIXED: was zinc-500 */}
                    <p className="mt-1 text-xs leading-relaxed text-zinc-400">{t.desc}</p>
                  </div>
                  {active && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={14} className="mt-0.5 shrink-0 text-violet-400" /></motion.div>}
                </div>
                {active && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-violet-400">Active</p>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    ),

    analytics: (
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Views', value: totalViews, icon: Eye, accent: 'bg-violet-500' },
            { label: 'This Week', value: analytics.thisWeekTotal, icon: TrendingUp, accent: 'bg-indigo-500', trend: analytics.weekTrend },
            { label: 'Today', value: analytics.todayViews, icon: Activity, accent: 'bg-sky-500' },
            { label: 'Avg Duration', value: analytics.avgDuration !== null ? analytics.avgDuration >= 60 ? `${Math.floor(analytics.avgDuration / 60)}m ${analytics.avgDuration % 60}s` : `${analytics.avgDuration}s` : '—', icon: Clock, accent: 'bg-emerald-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-white">Portfolio Views Over Time</p>
              {/* FIXED: was zinc-600 */}
              <p className="mt-0.5 text-xs text-zinc-400">{totalViews === 0 ? 'No views yet — share your link to start tracking' : `${totalViews} real views · not estimated`}</p>
            </div>
            <div className="flex rounded-xl border border-white/[0.06] bg-black/20 p-1">
              {(['7','30'] as const).map(r => (
                <button key={r} onClick={() => setAnalyticsRange(r)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${analyticsRange === r ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/25' : 'text-zinc-400 hover:text-zinc-200'}`}>
                  {r}d
                </button>
              ))}
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} interval={analyticsRange === '30' ? 4 : 0} />
                <YAxis allowDecimals={false} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={22} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#analyticsGrad)"
                  dot={analyticsRange === '7' ? { fill: '#8b5cf6', r: 4, strokeWidth: 0 } : false}
                  activeDot={{ r: 6, fill: '#a78bfa', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
            <p className="mb-1 text-sm font-bold text-white">Views by Day of Week</p>
            {/* FIXED: was zinc-600 */}
            <p className="mb-4 text-xs text-zinc-400">All-time breakdown</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.dayTotals} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="views" radius={[5,5,0,0]}>
                    {analytics.dayTotals.map((entry, i) => {
                      const max = Math.max(...analytics.dayTotals.map(d => d.views), 1)
                      return <Cell key={i} fill={`rgba(139,92,246,${0.15 + (entry.views / max) * 0.75})`} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm">
            <p className="mb-1 text-sm font-bold text-white">Traffic by Hour</p>
            <p className="mb-4 text-xs text-zinc-400">When visitors arrive (all-time)</p>
            <div className="grid grid-cols-6 gap-1.5">
              {analytics.hourly.map((h, i) => {
                const max = Math.max(...analytics.hourly.map(x => x.views), 1); const pct = h.views / max
                return (
                  <div key={i} title={`${h.label}: ${h.views} views`} className="flex flex-col items-center gap-1">
                    <div className="w-full rounded-md transition-all duration-300"
                      style={{ height: '28px', background: pct > 0 ? `rgba(139,92,246,${0.08 + pct * 0.88})` : 'rgba(255,255,255,0.02)', border: `1px solid rgba(139,92,246,${pct * 0.45})` }} />
                    {i % 4 === 0 && <span className="text-[9px] text-zinc-500">{h.label}</span>}
                  </div>
                )
              })}
            </div>
            {/* FIXED: was zinc-700 */}
            {totalViews === 0 && <p className="mt-4 text-center text-xs text-zinc-500">No data yet</p>}
          </div>
        </div>
        {totalViews === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-violet-500/15 bg-violet-500/[0.02] p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/15 bg-violet-500/[0.07]">
              <BarChart3 size={18} className="text-violet-400" />
            </div>
            <p className="text-sm font-bold text-zinc-300">No views tracked yet</p>
            <p className="mt-1 text-xs text-zinc-400">Share your portfolio link — every visit will be recorded here in real time.</p>
            <Btn size="sm" className="mx-auto mt-4" onClick={copyPortfolioLink} disabled={!portfolioUrl}><Copy size={12} /> Copy Portfolio URL</Btn>
          </motion.div>
        )}
      </div>
    ),
  }

  const currentTab = NAV_ITEMS.find(t => t.id === activeTab)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { font-family: 'Syne', sans-serif !important; }
        .font-mono, .font-mono * { font-family: 'DM Mono', monospace !important; }
        :root { color-scheme: dark; }
        select option { background: #0f0f17; color: #e4e4e7; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.12); border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.28); }
        @keyframes shimmer-logo { 0% { transform: translateX(-120%) skewX(-20deg); } 100% { transform: translateX(220%) skewX(-20deg); } }
        .logo-shine::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%); animation: shimmer-logo 4s infinite; skew: -20deg; }
      `}</style>

      <div className="relative flex h-screen bg-[#07070d] text-zinc-100 overflow-hidden">
        <Background />
        <AmbientCursor />

        {/* ── Sidebar ── */}
        <aside className="relative z-10 hidden h-screen w-[220px] shrink-0 flex-col border-r border-white/[0.05] bg-[#07070d]/80 backdrop-blur-2xl lg:flex">
          <div className="flex h-[58px] shrink-0 items-center gap-3 border-b border-white/[0.04] px-5">
            <div className="logo-shine relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg shadow-violet-600/30">
              <Code2 size={15} className="relative z-10 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold tracking-tight text-white leading-none">DevFolio</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-violet-400/70">Dashboard</p>
            </div>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-hidden px-3 py-4">
            {/* FIXED: was zinc-700 */}
            <p className="mb-2 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-500">Menu</p>
            {NAV_ITEMS.map(item => {
              const active = activeTab === item.id
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-all duration-300 ${active ? 'text-violet-200 shadow-[0_8px_20px_rgba(76,29,149,0.22)]' : 'text-zinc-400 hover:text-zinc-200 hover:translate-x-1'}`}>
                  {active && (
                    <motion.div layoutId="sidebarActive"
                      className="absolute inset-0 rounded-xl bg-violet-500/[0.10] border border-violet-500/[0.15]"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }} />
                  )}
                  <item.icon size={14} className={`relative z-10 ${active ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-400'} transition-colors`} />
                  <span className={`relative z-10 transition-transform duration-300 ${active ? 'translate-x-0.5' : 'group-hover:translate-x-1'}`}>{item.label}</span>
                  {active && <div className="relative z-10 ml-auto h-1 w-1 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.7)]" />}
                </button>
              )
            })}
          </nav>
          <div className="border-t border-white/[0.04] p-3">
            <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 bg-white/[0.015]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/35 to-indigo-600/35 text-xs font-bold text-violet-200">{initials}</div>
              <div className="min-w-0 flex-1">
                {/* FIXED: was zinc-300 */}
                <p className="truncate text-[12px] font-bold text-zinc-200">{profile.full_name}</p>
                {/* FIXED: was zinc-700 */}
                <p className="truncate text-[10px] font-mono text-zinc-500">@{profile.username}</p>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_7px_rgba(52,211,153,0.7)]" />
            </div>
            <button onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-[12px] font-semibold text-zinc-500 transition hover:bg-white/[0.03] hover:text-zinc-300">
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="relative z-10 flex h-screen flex-1 flex-col overflow-hidden">
          <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-white/[0.04] bg-[#07070d]/60 px-5 backdrop-blur-2xl lg:px-7">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 lg:hidden">
                <div className="logo-shine relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-md shadow-violet-500/35">
                  <Code2 size={13} className="relative z-10 text-white" />
                </div>
                <span className="text-[13px] font-bold text-white">DevFolio</span>
              </div>
              <button onClick={() => setMobileNavOpen(true)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] lg:hidden">
                <Menu size={14} />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-[15px] font-bold text-white leading-none">{currentTab?.label}</h1>
                {/* FIXED: was zinc-600 */}
                <p className="mt-0.5 text-[11px] text-zinc-400">
                  {activeTab === 'overview' && 'Portfolio at a glance'}
                  {activeTab === 'profile' && 'Manage public profile'}
                  {activeTab === 'skills' && `${skills.length} skills`}
                  {activeTab === 'projects' && `${projects.length} projects`}
                  {activeTab === 'experience' && `${experience.length} roles`}
                  {activeTab === 'template' && 'Visual style'}
                  {activeTab === 'analytics' && `${totalViews} real views`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {portfolioUrl && (
                <Btn size="sm" variant="ghost" onClick={() => window.open(portfolioUrl, '_blank')}>
                  <Eye size={12} /> <span className="hidden sm:inline">Preview</span>
                </Btn>
              )}
              <Btn size="sm" onClick={() => router.push('/onboarding')}>
                <Rocket size={12} /> <span className="hidden sm:inline">New Project</span>
              </Btn>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-5 lg:p-7">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* ── Mobile nav ── */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileNavOpen(false)}
                className="fixed inset-0 z-40 bg-black/75 backdrop-blur-md lg:hidden" />
              <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-white/[0.07] bg-[#0b0b14] backdrop-blur-xl lg:hidden">
                <div className="flex h-[58px] items-center justify-between border-b border-white/[0.05] px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700">
                      <Code2 size={13} className="text-white" />
                    </div>
                    <span className="text-[13px] font-bold text-white">DevFolio</span>
                  </div>
                  <button onClick={() => setMobileNavOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/[0.07] text-zinc-400">
                    <X size={13} />
                  </button>
                </div>
                <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
                  {NAV_ITEMS.map(item => {
                    const active = activeTab === item.id
                    return (
                      <button key={item.id}
                        onClick={() => { setActiveTab(item.id as DashboardTab); setMobileNavOpen(false) }}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-all ${active ? 'bg-violet-500/[0.10] text-violet-200 border border-violet-500/[0.14]' : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'}`}>
                        <item.icon size={14} className={active ? 'text-violet-400' : 'text-zinc-500'} />
                        {item.label}
                      </button>
                    )
                  })}
                </nav>
                <div className="border-t border-white/[0.05] p-3">
                  <div className="mb-2 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.015]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/35 to-indigo-600/35 text-xs font-bold text-violet-200">{initials}</div>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-bold text-zinc-200">{profile.full_name}</p>
                      <p className="truncate text-[10px] font-mono text-zinc-500">@{profile.username}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px] font-semibold text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300 transition-colors">
                    <LogOut size={12} /> Sign out
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#07070d]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/[0.08] border-t-violet-500" />
          <p className="text-sm font-bold text-zinc-400">DevFolio</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
