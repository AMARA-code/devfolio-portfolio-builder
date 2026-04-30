import { notFound } from 'next/navigation'

import PortfolioSectionLayout from '@/components/portfolio/PortfolioSectionLayout'
import { getPortfolioByUsername } from '@/lib/portfolio'

interface Props {
  params: Promise<{ username: string }>
}

export default async function ExperiencePage({ params }: Props) {
  const { username } = await params
  const data = await getPortfolioByUsername(username)

  if (!data) return notFound()

  return (
    <PortfolioSectionLayout
      data={data}
      title={`${data.full_name} - Experience`}
      subtitle="Professional journey and impact across companies, roles, and measurable delivery."
      section="experience"
    >
      <ol className="space-y-4">
        {data.experience.map((item) => (
          <li
            key={item.id}
            className="group rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{item.role}</h2>
                <p className="text-sm text-slate-600">{item.company}</p>
              </div>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 group-hover:bg-brand-50 group-hover:text-brand-700">
                {item.start_date} - {item.is_current ? 'Present' : item.end_date}
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{item.description}</p>
          </li>
        ))}
      </ol>
    </PortfolioSectionLayout>
  )
}
