'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, BriefcaseBusiness, Copy, ExternalLink, FolderGit2,
  Home, LayoutTemplate, LogOut, Rocket, Save, UserRound, X,
  Plus, Trash2, Globe, MapPin,
  Mail, Link2, Eye, TrendingUp, Layers, Zap, ChevronRight,
  Star, Menu, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from 'recharts'
import type { Experience, PortfolioData, Profile, Project, Skill } from '@/types'
import { isOptionalHttpUrl, isValidEmail, isValidHttpUrl, isValidUsername } from '@/lib/validation'

type DashboardTab = 'overview' | 'profile' | 'skills' | 'projects' | 'experience' | 'template' | 'analytics'

type ViewRow = { viewed_at: string }

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: BriefcaseBusiness },
  { id: 'template', label: 'Template', icon: LayoutTemplate },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
] as const

// ─── Reusable primitives ───────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-400">{label}</label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-xs text-rose-400">
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-white/8 bg-white/4 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none ring-0 transition-all duration-200 focus:border-violet-500/60 focus:bg-white/6 focus:ring-2 focus:ring-violet-500/20 hover:border-white/12'

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
  const el = (
    <select className={`${inputCls} cursor-pointer`} {...props}>
      {children}
    </select>
  )
  if (!label) return el
  return <Field label={label}>{el}</Field>
}

function Btn({
  children, variant = 'primary', size = 'md', loading, className = '', ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'outline'; size?: 'sm' | 'md'; loading?: boolean }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed select-none'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2.5 text-sm' }
  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98]',
    ghost: 'bg-white/5 text-zinc-300 border border-white/8 hover:bg-white/10 hover:text-white active:scale-[0.98]',
    outline: 'border border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white active:scale-[0.98]',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98]',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : children}
    </button>
  )
}

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: typeof Eye; accent: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-white/3 p-5">
      <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full blur-2xl opacity-30 ${accent}`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent} bg-opacity-20`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 shadow-2xl">
        <p className="text-xs text-zinc-400">{label}</p>
        <p className="mt-1 text-lg font-bold text-violet-300">{payload[0].value} views</p>
      </div>
    )
  }
  return null
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function DashboardPage() {
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
        supabase.from('portfolio_views').select('viewed_at').eq('profile_id', profileData.id),
      ])

      setProfile(profileData as Profile)
      setSkills((skillsRes.data || []) as Skill[])
      setProjects((projectsRes.data || []) as Project[])
      setExperience((experienceRes.data || []) as Experience[])
      setViews((viewsRes.data || []) as ViewRow[])
      setProfileForm({
        full_name: profileData.full_name || '', username: profileData.username || '',
        bio: profileData.bio || '', location: profileData.location || '',
        email: profileData.email || '', website: profileData.website || '',
        github_url: profileData.github_url || '', linkedin_url: profileData.linkedin_url || '',
        twitter_url: profileData.twitter_url || '', is_published: profileData.is_published,
      })
      setLoading(false)
    }
    void loadDashboardData()
  }, [router, supabase])

  const last7DaysData = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 7 }).map((_, idx) => {
      const date = new Date(now)
      date.setDate(now.getDate() - (6 - idx))
      const key = date.toISOString().slice(0, 10)
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        views: views.filter((e) => e.viewed_at.slice(0, 10) === key).length,
      }
    })
  }, [views])

  const totalViews = views.length
  const weekViews = last7DaysData.reduce((s, d) => s + d.views, 0)
  const portfolioUrl = typeof window !== 'undefined' && profile?.username ? `${window.location.origin}/u/${profile.username}` : ''
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

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

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
    if (!profile) return
    setSaving(true)
    const { data, error } = await supabase.from('profiles').update({ template }).eq('id', profile.id).select('*').single()
    if (!error && data) setProfile(data as Profile)
    setSaving(false)
  }

  async function saveSkills() {
    if (!profile) return
    setSaving(true)
    await supabase.from('skills').delete().eq('profile_id', profile.id)
    const cleaned = skills.map(s => ({ profile_id: profile.id, name: s.name, category: s.category, level: s.level })).filter(s => s.name.trim())
    if (cleaned.length) await supabase.from('skills').insert(cleaned)
    const { data } = await supabase.from('skills').select('*').eq('profile_id', profile.id)
    setSkills((data || []) as Skill[])
    setSaving(false)
  }

  async function saveProjects() {
    if (!profile) return
    setSaving(true)
    await supabase.from('projects').delete().eq('profile_id', profile.id)
    const cleaned = projects.map((p, i) => ({ profile_id: profile.id, title: p.title, description: p.description, thumbnail_url: p.thumbnail_url || '', live_url: p.live_url || '', github_url: p.github_url || '', tech_stack: p.tech_stack || [], featured: p.featured || false, order_index: i })).filter(p => p.title.trim())
    if (cleaned.length) await supabase.from('projects').insert(cleaned)
    const { data } = await supabase.from('projects').select('*').eq('profile_id', profile.id).order('order_index')
    setProjects((data || []) as Project[])
    setSaving(false)
  }

  async function saveExperience() {
    if (!profile) return
    setSaving(true)
    await supabase.from('experience').delete().eq('profile_id', profile.id)
    const cleaned = experience.map(e => ({ profile_id: profile.id, company: e.company, role: e.role, start_date: e.start_date, end_date: e.end_date || '', is_current: e.is_current, description: e.description || '', company_logo_url: e.company_logo_url || '' })).filter(e => e.company.trim() && e.role.trim())
    if (cleaned.length) await supabase.from('experience').insert(cleaned)
    const { data } = await supabase.from('experience').select('*').eq('profile_id', profile.id).order('start_date', { ascending: false })
    setExperience((data || []) as Experience[])
    setSaving(false)
  }

  async function copyPortfolioLink() {
    if (!portfolioUrl) return
    await navigator.clipboard.writeText(portfolioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
          <p className="text-sm text-zinc-500">Loading workspace…</p>
        </div>
      </div>
    )
  }

  // ── No profile ───────────────────────────────────────────────────────────
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-6">
        <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/8 bg-white/3 p-10 text-center backdrop-blur-sm">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/30">
              <Sparkles size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Build your portfolio</h1>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">Complete onboarding to create your public portfolio. It takes just a few minutes.</p>
            <div className="mt-8 flex flex-col gap-3">
              <Btn onClick={() => router.push('/onboarding')} className="w-full justify-center">
                <Rocket size={16} /> Start Portfolio
              </Btn>
              <Btn variant="ghost" onClick={handleLogout} className="w-full justify-center">
                <LogOut size={16} /> Logout
              </Btn>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const initials = profile.full_name?.slice(0, 2)?.toUpperCase() || 'U'

  // ── Tab content ──────────────────────────────────────────────────────────
  const tabContent = {
    overview: (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Views" value={totalViews} icon={Eye} accent="bg-violet-500" />
          <StatCard label="This Week" value={weekViews} icon={TrendingUp} accent="bg-indigo-500" />
          <StatCard label="Projects" value={projects.length} icon={FolderGit2} accent="bg-sky-500" />
          <StatCard label="Skills" value={skills.length} icon={Zap} accent="bg-emerald-500" />
        </div>

        {justPublished && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-400" />
              <div>
                <p className="text-sm font-semibold text-emerald-300">Portfolio published!</p>
                <p className="text-xs text-emerald-500">Your portfolio is now live and public.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Btn size="sm" variant="ghost" onClick={copyPortfolioLink}>
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy URL'}
              </Btn>
              <Btn size="sm" onClick={() => window.open(portfolioUrl, '_blank')} disabled={!portfolioUrl}>
                <ExternalLink size={14} /> Preview
              </Btn>
            </div>
          </motion.div>
        )}

        <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
          <p className="mb-1 text-[11px] uppercase tracking-[0.15em] text-zinc-500">Live Portfolio URL</p>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/6 bg-black/30 px-4 py-3">
            <Globe size={14} className="shrink-0 text-violet-400" />
            <span className="flex-1 truncate text-sm text-zinc-300 font-mono">{portfolioUrl || 'Complete onboarding to get your URL'}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Btn size="sm" variant="ghost" onClick={copyPortfolioLink} disabled={!portfolioUrl}>
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy URL'}
            </Btn>
            <Btn size="sm" onClick={() => window.open(portfolioUrl, '_blank')} disabled={!portfolioUrl}>
              <ExternalLink size={14} /> Preview Portfolio
            </Btn>
            <Btn size="sm" variant="ghost" onClick={() => router.push('/onboarding')}>
              <Rocket size={14} /> New Project
            </Btn>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { tab: 'profile', icon: UserRound, label: 'Edit Profile', desc: 'Update your bio and links' },
            { tab: 'projects', icon: FolderGit2, label: 'Manage Projects', desc: `${projects.length} projects added` },
            { tab: 'skills', icon: Zap, label: 'Edit Skills', desc: `${skills.length} skills listed` },
          ].map(item => (
            <button key={item.tab} onClick={() => setActiveTab(item.tab as DashboardTab)}
              className="group flex items-center gap-4 rounded-2xl border border-white/6 bg-white/3 p-5 text-left transition-all hover:border-violet-500/30 hover:bg-white/5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-zinc-400 transition group-hover:bg-violet-500/20 group-hover:text-violet-300">
                <item.icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white">{item.label}</p>
                <p className="mt-0.5 text-xs text-zinc-500">{item.desc}</p>
              </div>
              <ChevronRight size={16} className="ml-auto shrink-0 text-zinc-700 transition group-hover:text-zinc-400" />
            </button>
          ))}
        </div>
      </div>
    ),

    profile: (
      <div className="space-y-6">
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 size={16} /> Profile saved successfully!
          </motion.div>
        )}
        <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
          <h3 className="mb-5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">Basic Info</h3>
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

        <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
          <h3 className="mb-5 text-[11px] uppercase tracking-[0.18em] text-zinc-500">Links</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Website', key: 'website', icon: Globe, placeholder: 'https://yoursite.com' },
              { label: 'GitHub', key: 'github_url', icon: Link2, placeholder: 'https://github.com/you' },
              { label: 'LinkedIn', key: 'linkedin_url', icon: Link2, placeholder: 'https://linkedin.com/in/you' },
              { label: 'Twitter / X', key: 'twitter_url', icon: Link2, placeholder: 'https://x.com/you' },
            ].map(({ label, key, icon: Icon, placeholder }) => (
              <Field key={key} label={label} error={profileErrors[key]}>
                <div className="relative">
                  <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input className={`${inputCls} pl-9`} placeholder={placeholder}
                    value={(profileForm as any)[key]}
                    onChange={e => { setProfileForm(p => ({ ...p, [key]: e.target.value })); setProfileErrors(p => ({ ...p, [key]: '' })) }} />
                </div>
              </Field>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Btn onClick={saveProfile} loading={saving} disabled={!isProfileFormValid}>
            <Save size={15} /> Save Profile
          </Btn>
          <Btn variant="ghost" onClick={copyPortfolioLink} disabled={!portfolioUrl}>
            {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />} {copied ? 'Copied!' : 'Copy Link'}
          </Btn>
          <Btn variant="ghost" onClick={() => window.open(portfolioUrl, '_blank')} disabled={!portfolioUrl}>
            <Eye size={15} /> Preview
          </Btn>
        </div>
      </div>
    ),

    skills: (
      <div className="space-y-4">
        <div className="space-y-3">
          <AnimatePresence>
            {skills.map((skill, idx) => (
              <motion.div key={skill.id || `skill-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
                className="grid gap-3 rounded-2xl border border-white/6 bg-white/3 p-4 sm:grid-cols-[1fr,140px,140px,36px]">
                <StyledInput placeholder="Skill name (e.g. React)" value={skill.name}
                  onChange={e => setSkills(prev => prev.map((s, i) => i === idx ? { ...s, name: e.target.value } : s))} />
                <StyledSelect value={skill.category}
                  onChange={e => setSkills(prev => prev.map((s, i) => i === idx ? { ...s, category: e.target.value as Skill['category'] } : s))}>
                  {['Frontend', 'Backend', 'Tools', 'Database'].map(v => <option key={v}>{v}</option>)}
                </StyledSelect>
                <StyledSelect value={skill.level}
                  onChange={e => setSkills(prev => prev.map((s, i) => i === idx ? { ...s, level: e.target.value as Skill['level'] } : s))}>
                  {['Beginner', 'Intermediate', 'Expert'].map(v => <option key={v}>{v}</option>)}
                </StyledSelect>
                <button onClick={() => setSkills(prev => prev.filter((_, i) => i !== idx))}
                  className="flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/8 text-rose-400 transition hover:bg-rose-500/20">
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {skills.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/8 py-12 text-center">
            <Zap size={24} className="mx-auto text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-500">No skills yet. Add your first one below.</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Btn variant="ghost" onClick={() => setSkills(prev => [...prev, { id: crypto.randomUUID(), profile_id: profile.id, name: '', category: 'Frontend', level: 'Intermediate' }])}>
            <Plus size={15} /> Add Skill
          </Btn>
          <Btn onClick={saveSkills} loading={saving}><Save size={15} /> Save Skills</Btn>
        </div>
      </div>
    ),

    projects: (
      <div className="space-y-4">
        <AnimatePresence>
          {projects.map((project, idx) => (
            <motion.div key={project.id || `project-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
              className="rounded-2xl border border-white/6 bg-white/3 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Project {idx + 1}</span>
                <button onClick={() => setProjects(prev => prev.filter((_, i) => i !== idx))}
                  className="flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/8 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/20">
                  <Trash2 size={12} /> Remove
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
                      <span key={t} className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-300">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {projects.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/8 py-12 text-center">
            <FolderGit2 size={24} className="mx-auto text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-500">No projects yet. Showcase your best work.</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Btn variant="ghost" onClick={() => setProjects(prev => [...prev, { id: crypto.randomUUID(), profile_id: profile.id, title: '', description: '', thumbnail_url: '', live_url: '', github_url: '', tech_stack: [], featured: false, order_index: prev.length }])}>
            <Plus size={15} /> Add Project
          </Btn>
          <Btn onClick={saveProjects} loading={saving}><Save size={15} /> Save Projects</Btn>
        </div>
      </div>
    ),

    experience: (
      <div className="space-y-4">
        <AnimatePresence>
          {experience.map((item, idx) => (
            <motion.div key={item.id || `exp-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -16 }}
              className="rounded-2xl border border-white/6 bg-white/3 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Role {idx + 1}</span>
                <button onClick={() => setExperience(prev => prev.filter((_, i) => i !== idx))}
                  className="flex items-center gap-1 rounded-lg border border-rose-500/20 bg-rose-500/8 px-2.5 py-1 text-xs text-rose-400 hover:bg-rose-500/20">
                  <Trash2 size={12} /> Remove
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
                  <StyledInput placeholder={item.is_current ? 'Present' : 'End date (e.g. Dec 2023)'} value={item.end_date} disabled={item.is_current}
                    onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, end_date: e.target.value } : x))} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={item.is_current} className="h-4 w-4 accent-violet-500 cursor-pointer"
                    onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, is_current: e.target.checked, end_date: e.target.checked ? '' : x.end_date } : x))} />
                  <span className="text-xs text-zinc-400">Currently working here</span>
                </label>
                <StyledTextarea placeholder="Describe your responsibilities, achievements, and impact…" rows={3} value={item.description}
                  onChange={e => setExperience(prev => prev.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {experience.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/8 py-12 text-center">
            <BriefcaseBusiness size={24} className="mx-auto text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-500">No experience added yet.</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Btn variant="ghost" onClick={() => setExperience(prev => [...prev, { id: crypto.randomUUID(), profile_id: profile.id, company: '', role: '', start_date: '', end_date: '', is_current: false, description: '', company_logo_url: '' }])}>
            <Plus size={15} /> Add Experience
          </Btn>
          <Btn onClick={saveExperience} loading={saving}><Save size={15} /> Save Experience</Btn>
        </div>
      </div>
    ),

    template: (
      <div className="space-y-4">
        <p className="text-sm text-zinc-400">Choose a template for your public portfolio. Changes are applied immediately.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {([
            { id: 'minimal', label: 'Minimal', desc: 'Clean, focused, typography-forward. Great for writers and designers.', accent: 'from-zinc-600 to-zinc-700' },
            { id: 'dark', label: 'Dark', desc: 'Sleek dark aesthetic with glowing accents. Perfect for developers.', accent: 'from-violet-600 to-indigo-700' },
            { id: 'creative', label: 'Creative', desc: 'Bold, expressive, colorful. Ideal for creatives and artists.', accent: 'from-rose-600 to-orange-600' },
          ] as const).map(t => {
            const active = profile.template === t.id
            return (
              <button key={t.id} onClick={() => void saveTemplate(t.id)}
                className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${active ? 'border-violet-500/50 bg-violet-500/8 ring-1 ring-violet-500/30' : 'border-white/6 bg-white/3 hover:border-white/12 hover:bg-white/5'}`}>
                <div className={`mb-4 h-24 w-full rounded-xl bg-gradient-to-br ${t.accent} opacity-70`} />
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">{t.desc}</p>
                  </div>
                  {active && <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-violet-400" />}
                </div>
                {active && <p className="mt-3 text-xs font-medium text-violet-400">Active template</p>}
              </button>
            )
          })}
        </div>
      </div>
    ),

    analytics: (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard label="Total Views" value={totalViews} icon={Eye} accent="bg-violet-500" />
          <StatCard label="Views This Week" value={weekViews} icon={TrendingUp} accent="bg-indigo-500" />
        </div>
        <div className="rounded-2xl border border-white/6 bg-white/3 p-6">
          <p className="mb-1 text-sm font-semibold text-white">Views — Last 7 Days</p>
          <p className="mb-6 text-xs text-zinc-500">Daily portfolio visitor count</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#viewsGrad)" dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#a78bfa' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    ),
  }

  const currentTab = NAV_ITEMS.find(t => t.id === activeTab)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
        :root { color-scheme: dark; }
        select option { background: #18181b; color: #e4e4e7; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
        input[type=checkbox] { cursor: pointer; }
      `}</style>

      <div className="flex min-h-screen bg-[#0a0a0f] text-zinc-100">

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="hidden w-64 shrink-0 lg:flex lg:flex-col border-r border-white/5 bg-white/[0.015]">
          <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/5 px-5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-md shadow-violet-500/30">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Folio</span>
          </div>

          <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
            <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-zinc-600">Menu</p>
            {NAV_ITEMS.map(item => {
              const active = activeTab === item.id
              return (
                <button key={item.id} onClick={() => setActiveTab(item.id as DashboardTab)}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${active ? 'bg-violet-500/15 text-violet-200' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}>
                  <item.icon size={16} className={active ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                  {item.label}
                  {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />}
                </button>
              )
            })}
          </div>

          <div className="border-t border-white/5 p-3">
            <div className="mb-3 flex items-center gap-3 rounded-xl px-3 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/50 to-indigo-600/50 text-xs font-bold text-violet-200">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-zinc-300">{profile.full_name}</p>
                <p className="truncate text-[10px] text-zinc-600">@{profile.username}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-zinc-500 transition hover:bg-white/5 hover:text-zinc-300">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </aside>

        {/* ── Main ─────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden">

          {/* Top bar */}
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 px-5 lg:px-7">
            <div className="flex items-center gap-3">
              {/* Mobile logo + hamburger */}
              <div className="flex items-center gap-2 lg:hidden">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                  <Sparkles size={13} className="text-white" />
                </div>
              </div>
              <button onClick={() => setMobileNavOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/4 lg:hidden">
                <Menu size={16} />
              </button>
              <div className="hidden lg:block">
                <h1 className="text-base font-semibold text-white">{currentTab?.label}</h1>
                <p className="text-xs text-zinc-500">
                  {activeTab === 'overview' && 'Your portfolio at a glance'}
                  {activeTab === 'profile' && 'Update your public profile'}
                  {activeTab === 'skills' && `${skills.length} skills listed`}
                  {activeTab === 'projects' && `${projects.length} projects`}
                  {activeTab === 'experience' && `${experience.length} roles`}
                  {activeTab === 'template' && 'Pick your portfolio style'}
                  {activeTab === 'analytics' && `${totalViews} total views`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {portfolioUrl && (
                <Btn size="sm" variant="ghost" onClick={() => window.open(portfolioUrl, '_blank')}>
                  <Eye size={13} /> <span className="hidden sm:inline">Preview</span>
                </Btn>
              )}
              <Btn size="sm" onClick={() => router.push('/onboarding')}>
                <Rocket size={13} /> <span className="hidden sm:inline">New Project</span>
              </Btn>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-5 lg:p-7">
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                {tabContent[activeTab]}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* ── Mobile nav overlay ────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileNavOpen(false)}
                className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/8 bg-[#0f0f16] lg:hidden">
                <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                      <Sparkles size={13} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-white">Folio</span>
                  </div>
                  <button onClick={() => setMobileNavOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/8 text-zinc-400">
                    <X size={15} />
                  </button>
                </div>
                <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
                  {NAV_ITEMS.map(item => {
                    const active = activeTab === item.id
                    return (
                      <button key={item.id} onClick={() => { setActiveTab(item.id as DashboardTab); setMobileNavOpen(false) }}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${active ? 'bg-violet-500/15 text-violet-200' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'}`}>
                        <item.icon size={16} className={active ? 'text-violet-400' : 'text-zinc-500'} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
                <div className="border-t border-white/5 p-3">
                  <div className="mb-3 flex items-center gap-3 px-3 py-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/50 to-indigo-600/50 text-xs font-bold text-violet-200">{initials}</div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-300">{profile.full_name}</p>
                      <p className="truncate text-[10px] text-zinc-600">@{profile.username}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-300">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}