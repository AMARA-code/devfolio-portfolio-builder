'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

import type { PortfolioData } from '@/types'

type SectionKey = 'home' | 'skills' | 'experience' | 'education'

type PortfolioSectionLayoutProps = {
  data: PortfolioData
  title: string
  subtitle: string
  section: SectionKey
  children: ReactNode
}

const navItems: { id: SectionKey; label: string; href: (username: string) => string }[] = [
  { id: 'home', label: 'Overview', href: (username) => `/u/${username}` },
  { id: 'skills', label: 'Skills', href: (username) => `/u/${username}/skills` },
  { id: 'experience', label: 'Experience', href: (username) => `/u/${username}/experience` },
  { id: 'education', label: 'Education', href: (username) => `/u/${username}/education` },
]

const themeByTemplate = {
  minimal: {
    page: 'bg-slate-50 text-slate-900',
    shell: 'border-slate-200 bg-white/95',
    badge: 'text-brand-600',
    navActive: 'bg-slate-900 text-white',
    navIdle: 'bg-white text-slate-700 hover:bg-slate-100',
  },
  dark: {
    page: 'bg-slate-950 text-slate-100',
    shell: 'border-cyan-400/30 bg-slate-900/80',
    badge: 'text-cyan-300',
    navActive: 'bg-cyan-400/20 text-cyan-200',
    navIdle: 'bg-slate-800 text-slate-300 hover:bg-slate-700',
  },
  creative: {
    page: 'bg-gradient-to-b from-indigo-50 via-white to-violet-100 text-slate-900',
    shell: 'border-indigo-200 bg-white/90',
    badge: 'text-indigo-600',
    navActive: 'bg-indigo-600 text-white',
    navIdle: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  },
} as const

export default function PortfolioSectionLayout({ data, title, subtitle, section, children }: PortfolioSectionLayoutProps) {
  const theme = themeByTemplate[data.template]

  return (
    <div className={`min-h-screen ${theme.page}`}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          className={`rounded-3xl border p-8 shadow-xl backdrop-blur ${theme.shell}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className={`text-xs uppercase tracking-[0.2em] ${theme.badge}`}>Professional Portfolio</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-500 sm:text-base">{subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const isActive = section === item.id
              return (
                <Link
                  key={item.id}
                  href={item.href(data.username)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5 ${
                    isActive ? theme.navActive : theme.navIdle
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </motion.div>

        <motion.section
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          {children}
        </motion.section>
      </div>
    </div>
  )
}
