'use client'

import { useState } from 'react'
import { saveOnboardingData, getOnboardingData } from '@/lib/onboarding-store'
import { Skill } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface Props {
  onNext: () => void
  onBack: () => void
}

const CATEGORIES = ['Frontend', 'Backend', 'Tools', 'Database'] as const
const LEVELS = ['Beginner', 'Intermediate', 'Expert'] as const

export default function StepSkills({ onNext, onBack }: Props) {
  const stored = getOnboardingData()
  const [skills, setSkills] = useState<Omit<Skill, 'id' | 'profile_id'>[]>(stored.skills)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Frontend')
  const [level, setLevel] = useState<typeof LEVELS[number]>('Intermediate')
  const [suggesting, setSuggesting] = useState(false)
  const [error, setError] = useState('')

  function addSkill() {
    if (!name.trim()) return
    setError('')
    const newSkill = { name: name.trim(), category, level }
    setSkills((s) => [...s, newSkill])
    setName('')
  }

  function removeSkill(index: number) {
    setSkills((s) => s.filter((_, i) => i !== index))
  }

  async function suggestSkills() {
    if (!name.trim()) return
    setSuggesting(true)
    try {
      const res = await fetch('/api/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill: name }),
      })
      const data = await res.json()
      const suggested = data.skills.map((s: string) => ({
        name: s,
        category,
        level,
      }))
      setSkills((prev) => {
        const existing = prev.map((s) => s.name.toLowerCase())
        const filtered = suggested.filter(
          (s: { name: string }) => !existing.includes(s.name.toLowerCase())
        )
        return [...prev, ...filtered]
      })
    } catch (e) {
      console.error(e)
    }
    setSuggesting(false)
  }

  function handleNext() {
    if (skills.length === 0) {
      setError('Add at least one skill before continuing.')
      return
    }
    saveOnboardingData({ skills })
    onNext()
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-100 shadow-sm">
      <h2 className="mb-2 text-xl font-bold text-white">Your Skills</h2>
      <p className="mb-6 text-sm text-slate-400">
        Add the technologies and tools you know
      </p>

      {/* Add skill form */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="e.g. React, Node.js, PostgreSQL"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1"
          />
          <Button onClick={addSkill} disabled={!name.trim()}>
            Add
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Category */}
          <div className="flex gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  category === cat
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Level */}
          <div className="flex gap-1">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  level === lvl
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={suggestSkills}
          disabled={suggesting || !name.trim()}
          className="text-xs text-brand-600 hover:underline disabled:opacity-50 text-left"
        >
          {suggesting ? 'Suggesting...' : '✨ AI suggest related skills'}
        </button>
      </div>

      {/* Skills list */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-xl min-h-16">
          {skills.map((skill, i) => (
            <div
              key={i}
              className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-3 py-1"
            >
              <span className="text-sm text-gray-700">{skill.name}</span>
              <span className="text-xs text-gray-400">· {skill.level}</span>
              <button
                onClick={() => removeSkill(i)}
                className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center text-gray-400 text-sm">
          No skills added yet. Add your first skill above.
        </div>
      )}
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={handleNext}>
          Next →
        </Button>
      </div>
    </div>
  )
}