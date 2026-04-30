'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { saveOnboardingData, getOnboardingData } from '@/lib/onboarding-store'
import { isValidHttpUrl, isOptionalHttpUrl } from '@/lib/validation'
import { createClient } from '@/lib/supabase/client'
import { Project } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Props {
  onNext: () => void
  onBack: () => void
}

const emptyProject: Omit<Project, 'id' | 'profile_id'> = {
  title: '',
  description: '',
  thumbnail_url: '',
  live_url: '',
  github_url: '',
  tech_stack: [],
  featured: false,
  order_index: 0,
}

export default function StepProjects({ onNext, onBack }: Props) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const stored = getOnboardingData()
  const [projects, setProjects] = useState<Omit<Project, 'id' | 'profile_id'>[]>(stored.projects)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState(emptyProject)
  const [techInput, setTechInput] = useState('')
  const [enhancing, setEnhancing] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [stepError, setStepError] = useState('')
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)

  function update(field: string, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: '' }))
  }

  async function uploadScreenshot(file: File) {
    if (!file.type.startsWith('image/')) {
      setFormErrors((prev) => ({ ...prev, thumbnail_url: 'Please upload an image file.' }))
      return
    }

    setUploadingScreenshot(true)
    setFormErrors((prev) => ({ ...prev, thumbnail_url: '' }))

    try {
      const ext = file.name.split('.').pop() || 'png'
      const filePath = `projects/${Date.now()}-${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('project-screenshots')
        .upload(filePath, file, { upsert: false, contentType: file.type })

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage.from('project-screenshots').getPublicUrl(filePath)
      update('thumbnail_url', data.publicUrl)
    } catch (error) {
      setFormErrors((prev) => ({
        ...prev,
        thumbnail_url:
          error instanceof Error
            ? `Upload failed: ${error.message}`
            : 'Upload failed. Please try again.',
      }))
    } finally {
      setUploadingScreenshot(false)
      setIsDragActive(false)
    }
  }

  function addTech() {
    if (!techInput.trim()) return
    setForm((f) => ({ ...f, tech_stack: [...f.tech_stack, techInput.trim()] }))
    setTechInput('')
  }

  function removeTech(i: number) {
    setForm((f) => ({ ...f, tech_stack: f.tech_stack.filter((_, idx) => idx !== i) }))
  }

  async function enhanceDescription() {
    if (!form.description.trim()) return
    setEnhancing(true)
    try {
      const res = await fetch('/api/enhance-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: form.description }),
      })
      const data = await res.json()
      update('description', data.description)
    } catch (e) {
      console.error(e)
    }
    setEnhancing(false)
  }

  function saveProject() {
    const errors: Record<string, string> = {}
    if (!form.title.trim()) errors.title = 'Project title is required'
    if (!form.description.trim()) errors.description = 'Project description is required'
    if (!form.live_url.trim()) errors.live_url = 'Project live URL is required'
    if (form.live_url.trim() && !isValidHttpUrl(form.live_url)) errors.live_url = 'Enter a valid project URL'
    if (!form.thumbnail_url.trim()) errors.thumbnail_url = 'Screenshot upload is required for this project.'
    if (form.thumbnail_url.trim() && !isValidHttpUrl(form.thumbnail_url)) {
      errors.thumbnail_url = 'Upload a valid screenshot image'
    }
    if (!isOptionalHttpUrl(form.github_url)) errors.github_url = 'Enter a valid GitHub URL or keep empty'

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStepError('')
    if (editingIndex !== null) {
      setProjects((p) => p.map((project, idx) => (idx === editingIndex ? { ...form, order_index: idx } : project)))
    } else {
      setProjects((p) => [...p, { ...form, order_index: p.length }])
    }
    setForm(emptyProject)
    setTechInput('')
    setAdding(false)
    setEditingIndex(null)
  }

  function removeProject(i: number) {
    setProjects((p) => p.filter((_, idx) => idx !== i))
    if (editingIndex === i) {
      setEditingIndex(null)
      setForm(emptyProject)
      setAdding(false)
    }
  }

  function editProject(index: number) {
    setForm(projects[index])
    setEditingIndex(index)
    setAdding(true)
    setFormErrors({})
    setStepError('')
  }

  function onScreenshotSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) void uploadScreenshot(file)
    event.target.value = ''
  }

  function handleNext() {
    if (projects.length === 0) {
      setStepError('Add at least one project to continue.')
      return
    }
    saveOnboardingData({ projects })
    onNext()
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-100 shadow-sm">
      <h2 className="mb-2 text-xl font-bold text-white">Your Projects</h2>
      <p className="mb-6 text-sm text-slate-400">
        Showcase your best work
      </p>

      {/* Projects list */}
      {projects.length > 0 && (
        <div className="flex flex-col gap-3 mb-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-900 text-sm">{project.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {project.tech_stack.join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => editProject(i)}
                  className="text-gray-500 hover:text-brand-600 transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => removeProject(i)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit project form */}
      {adding ? (
        <div className="border border-gray-200 rounded-xl p-4 mb-6 flex flex-col gap-3">
          <Input
            label="Project Title"
            placeholder="My Awesome App"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            error={formErrors.title}
            required
          />

          <div className="relative">
            <Textarea
              label="Description"
              placeholder="What does this project do?"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
              error={formErrors.description}
              required
            />
            <button
              type="button"
              onClick={enhanceDescription}
              disabled={enhancing || !form.description.trim()}
              className="absolute right-2 bottom-2 text-xs bg-brand-50 text-brand-600 px-2 py-1 rounded-md hover:bg-brand-100 disabled:opacity-50 transition-colors"
            >
              {enhancing ? 'Enhancing...' : '✨ AI Enhance'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Live URL"
              placeholder="https://myapp.com"
              value={form.live_url}
              onChange={(e) => update('live_url', e.target.value)}
              error={formErrors.live_url}
              required
            />
            <Input
              label="GitHub URL"
              placeholder="https://github.com/..."
              value={form.github_url}
              onChange={(e) => update('github_url', e.target.value)}
              error={formErrors.github_url}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Project Screenshot <span className="ml-1 text-red-500">*</span>
            </p>
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragActive(true)
              }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                const file = e.dataTransfer.files?.[0]
                if (file) void uploadScreenshot(file)
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`mt-2 cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${
                isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 bg-gray-50 hover:border-brand-400'
              }`}
            >
              <p className="text-sm font-medium text-gray-700">
                {uploadingScreenshot ? 'Uploading screenshot...' : 'Drag & drop screenshot here or click to upload'}
              </p>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP supported</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onScreenshotSelect}
            />
            {form.thumbnail_url && (
              <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <img src={form.thumbnail_url} alt="Project screenshot preview" className="h-40 w-full object-cover" />
              </div>
            )}
            {formErrors.thumbnail_url && (
              <p className="mt-2 text-xs text-red-500">{formErrors.thumbnail_url}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Screenshot will be clickable and linked to project live URL.
            </p>
          </div>

          {/* Tech stack */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Tech Stack
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="React, Node.js..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTech()}
                className="flex-1"
              />
              <Button variant="outline" onClick={addTech}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {form.tech_stack.map((tech, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 bg-brand-50 text-brand-700 text-xs px-2 py-1 rounded-full"
                >
                  {tech}
                  <button onClick={() => removeTech(i)} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button onClick={saveProject} disabled={!form.title.trim()}>
              {editingIndex !== null ? 'Update Project' : 'Save Project'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAdding(false)
                setEditingIndex(null)
                setForm(emptyProject)
                setFormErrors({})
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            setAdding(true)
            setEditingIndex(null)
            setForm(emptyProject)
            setFormErrors({})
          }}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors mb-6 text-sm"
        >
          + Add a Project
        </button>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext}>Next →</Button>
      </div>
      {stepError && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{stepError}</p>}
    </div>
  )
}