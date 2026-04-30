import { notFound } from 'next/navigation'

import PortfolioSectionLayout from '@/components/portfolio/PortfolioSectionLayout'
import { getPortfolioByUsername } from '@/lib/portfolio'

interface Props {
  params: Promise<{ username: string }>
}

export default async function SkillsPage({ params }: Props) {
  const { username } = await params
  const data = await getPortfolioByUsername(username)

  if (!data) return notFound()

  return (
    <PortfolioSectionLayout
      data={data}
      title={`${data.full_name} - Skills`}
      subtitle="A curated set of technical strengths with practical depth across frontend, backend, data, and tooling."
      section="skills"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.skills.map((skill, index) => (
          <article
            key={skill.id}
            className="group rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{skill.category}</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{skill.name}</h2>
            <p className="mt-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition group-hover:bg-brand-50 group-hover:text-brand-700">
              {skill.level}
            </p>
          </article>
        ))}
      </div>
    </PortfolioSectionLayout>
  )
}
