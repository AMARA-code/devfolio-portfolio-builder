'use client'

import { motion } from 'framer-motion'

const pulseDelays = [0, 0.2, 0.4]

export default function AnimatedPortfolioLoader() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.28),transparent_42%),radial-gradient(circle_at_80%_15%,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_50%_85%,rgba(236,72,153,0.22),transparent_38%)]" />

      <motion.div
        className="absolute -left-28 top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
        animate={{ x: [0, 140, -30, 0], y: [0, 80, 120, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-400/15 blur-3xl"
        animate={{ x: [0, -120, -40, 0], y: [0, -60, 90, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
        <motion.div
          className="w-full rounded-3xl border border-white/15 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="flex items-center justify-between">
            <motion.p
              className="text-sm uppercase tracking-[0.35em] text-indigo-200/90"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Loading Portfolio
            </motion.p>
            <div className="flex gap-1.5">
              {pulseDelays.map((delay) => (
                <motion.span
                  key={delay}
                  className="h-2.5 w-2.5 rounded-full bg-indigo-300"
                  animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay }}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4">
                <motion.div
                  className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-30%', '360%'] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: row * 0.2 }}
                />
                <div className="h-2.5 w-1/3 rounded-full bg-white/15" />
                <div className="mt-3 h-2 w-3/4 rounded-full bg-white/10" />
              </div>
            ))}
          </div>

          <motion.div
            className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-cyan-300 to-fuchsia-400"
              animate={{ x: ['-40%', '180%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
