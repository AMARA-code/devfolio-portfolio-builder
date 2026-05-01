'use client'

import { useState } from 'react'
import { saveOnboardingData, getOnboardingData } from '@/lib/onboarding-store'
import Button from '@/components/ui/Button'

interface Props {
  onBack: () => void
  onSubmit: () => void
  submitting: boolean
}

const TEMPLATES = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, professional, lots of whitespace',
    colors: ['#ffffff', '#f9fafb', '#0284c7'],
    preview: '📄',
  },
  {
    id: 'dark',
    name: 'Dark Dev',
    description: 'Dark theme with terminal aesthetics',
    colors: ['#0f172a', '#1e293b', '#22d3ee'],
    preview: '💻',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold, colorful, eye-catching design',
    colors: ['#fafafa', '#6366f1', '#f43f5e'],
    preview: '🎨',
  },
]

export default function StepTemplate({ onBack, onSubmit, submitting }: Props) {
  const stored = getOnboardingData()
  const [selected, setSelected] = useState<'minimal' | 'dark' | 'creative'>(stored.template)

  function handleSubmit() {
    saveOnboardingData({ template: selected })
    onSubmit()
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-100 shadow-sm">
      <h2 className="mb-2 text-xl font-bold text-white">
        Choose Your Template
      </h2>
      <p className="mb-6 text-sm text-slate-400">
        You can change this anytime from your dashboard
      </p>

      <div className="flex flex-col gap-4 mb-8">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelected(template.id as typeof selected)}
            className={`
              flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200
              ${selected === template.id
                ? 'border-brand-500 bg-brand-500/10 shadow-[0_12px_30px_rgba(15,23,42,0.45)]'
                : 'border-slate-700 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/70 hover:shadow-md'
              }
            `}
          >
            {/* Color preview */}
            <div className="flex gap-1 shrink-0">
              {template.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-10 rounded-md border border-slate-600"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{template.preview}</span>
                <span className="font-semibold text-slate-100">{template.name}</span>
                {selected === template.id && (
                  <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mt-0.5">{template.description}</p>
            </div>

            <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center
              ${selected === template.id ? 'border-brand-500 bg-brand-500' : 'border-slate-500'}`}
            >
              {selected === template.id && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button
          size="lg"
          onClick={handleSubmit}
          loading={submitting}
        >
          🚀 Publish Portfolio
        </Button>
      </div>
    </div>
  )
}