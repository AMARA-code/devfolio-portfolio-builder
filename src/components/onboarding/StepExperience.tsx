'use client'

import { useState } from 'react'
import { saveOnboardingData, getOnboardingData } from '@/lib/onboarding-store'
import { Experience, Education } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function StepExperience({ onNext, onBack }: Props) {
  const stored = getOnboardingData()

  const [experiences, setExperiences] = useState<Omit<Experience, 'id' | 'profile_id'>[]>(stored.experience)
  const [educations, setEducations] = useState<Omit<Education, 'id' | 'profile_id'>[]>(stored.education)

  const [addingExp, setAddingExp] = useState(false)
  const [addingEdu, setAddingEdu] = useState(false)
  const [error, setError] = useState('')

  const [expForm, setExpForm] = useState({
    company: '', role: '', start_date: '', end_date: '',
    is_current: false, description: '', company_logo_url: '',
  })

  const [eduForm, setEduForm] = useState({
    institution: '', degree: '', field: '', start_year: '', end_year: '',
  })


  function saveExp() {
    if (!expForm.company.trim() || !expForm.role.trim() || !expForm.start_date.trim()) return
    setError('')
    setExperiences((e) => [...e, expForm])
    setExpForm({ company: '', role: '', start_date: '', end_date: '', is_current: false, description: '', company_logo_url: '' })
    setAddingExp(false)
  }

  function saveEdu() {
    if (!eduForm.institution.trim() || !eduForm.degree.trim() || !eduForm.field.trim()) return
    setError('')
    setEducations((e) => [...e, eduForm])
    setEduForm({ institution: '', degree: '', field: '', start_year: '', end_year: '' })
    setAddingEdu(false)
  }

  function handleNext() {
    if (experiences.length === 0) {
      setError('Add at least one experience entry before continuing.')
      return
    }
    if (educations.length === 0) {
      setError('Add at least one education entry before continuing.')
      return
    }
    saveOnboardingData({ experience: experiences, education: educations })
    onNext()
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-100 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-white">Experience & Education</h2>

      {/* Experience */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Work Experience</h3>

        {experiences.map((exp, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl mb-2 border border-gray-200">
            <div>
              <p className="font-medium text-sm text-gray-900">{exp.role}</p>
              <p className="text-xs text-gray-500">{exp.company}</p>
            </div>
            <button onClick={() => setExperiences((e) => e.filter((_, idx) => idx !== i))} className="text-xs text-gray-400 hover:text-red-500">
              Remove
            </button>
          </div>
        ))}

        {addingExp ? (
          <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Company" placeholder="Google" value={expForm.company} onChange={(e) => setExpForm((f) => ({ ...f, company: e.target.value }))} required />
              <Input label="Role" placeholder="Frontend Developer" value={expForm.role} onChange={(e) => setExpForm((f) => ({ ...f, role: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Date" placeholder="Jan 2022" value={expForm.start_date} onChange={(e) => setExpForm((f) => ({ ...f, start_date: e.target.value }))} required />
              <Input label="End Date" placeholder="Dec 2023" value={expForm.end_date} onChange={(e) => setExpForm((f) => ({ ...f, end_date: e.target.value }))} disabled={expForm.is_current} />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={expForm.is_current} onChange={(e) => setExpForm((f) => ({ ...f, is_current: e.target.checked }))} />
              Currently working here
            </label>
            <Textarea
              label="Role Description"
              placeholder="Describe your responsibilities and impact."
              rows={3}
              value={expForm.description}
              onChange={(e) => setExpForm((f) => ({ ...f, description: e.target.value }))}
            />
            <div className="flex gap-2">
              <Button onClick={saveExp}>Save</Button>
              <Button variant="outline" onClick={() => setAddingExp(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingExp(true)} className="w-full border-2 border-dashed border-gray-200 rounded-xl p-3 text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors text-sm">
            + Add Experience
          </button>
        )}
      </div>

      {/* Education */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Education</h3>

        {educations.map((edu, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl mb-2 border border-gray-200">
            <div>
              <p className="font-medium text-sm text-gray-900">{edu.institution}</p>
              <p className="text-xs text-gray-500">{edu.degree} · {edu.field}</p>
            </div>
            <button onClick={() => setEducations((e) => e.filter((_, idx) => idx !== i))} className="text-xs text-gray-400 hover:text-red-500">
              Remove
            </button>
          </div>
        ))}

        {addingEdu ? (
          <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
            <Input label="Institution" placeholder="LUMS, FAST, etc." value={eduForm.institution} onChange={(e) => setEduForm((f) => ({ ...f, institution: e.target.value }))} required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Degree" placeholder="BS, MS, etc." value={eduForm.degree} onChange={(e) => setEduForm((f) => ({ ...f, degree: e.target.value }))} required />
              <Input label="Field" placeholder="Computer Science" value={eduForm.field} onChange={(e) => setEduForm((f) => ({ ...f, field: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Year" placeholder="2020" value={eduForm.start_year} onChange={(e) => setEduForm((f) => ({ ...f, start_year: e.target.value }))} />
              <Input label="End Year" placeholder="2024" value={eduForm.end_year} onChange={(e) => setEduForm((f) => ({ ...f, end_year: e.target.value }))} />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveEdu}>Save</Button>
              <Button variant="outline" onClick={() => setAddingEdu(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingEdu(true)} className="w-full border-2 border-dashed border-gray-200 rounded-xl p-3 text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors text-sm">
            + Add Education
          </button>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext}>Next →</Button>
      </div>
      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
    </div>
  )
}