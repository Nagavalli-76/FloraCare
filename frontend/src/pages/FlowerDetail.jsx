import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sun, Droplet, Mountain, Wrench, AlertTriangle, Lightbulb } from 'lucide-react'
import Loading from '../components/Loading.jsx'
import { api } from '../services/api.js'

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-botanical-100 text-botanical-700 flex items-center justify-center">
          <Icon size={16} />
        </div>
        <h3 className="font-semibold text-botanical-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default function FlowerDetail() {
  const { id } = useParams()
  const [flower, setFlower] = useState(null)

  useEffect(() => {
    api.getFlower(id).then(setFlower).catch(() => setFlower(false))
  }, [id])

  if (flower === null) return <Loading label="Loading care guide..." />
  if (flower === false) return <p className="text-botanical-600">Flower not found.</p>

  const issues = (flower.common_issues || '').split('\n').filter(Boolean)
  const tips = (flower.care_tips || '').split('\n').filter(Boolean)

  return (
    <div className="max-w-4xl">
      <Link to="/flowers" className="inline-flex items-center gap-1 text-sm text-botanical-600 hover:underline mb-4">
        <ArrowLeft size={14} /> Back to Flower Library
      </Link>

      <div className="bg-white rounded-xl2 border border-botanical-100 shadow-card p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{flower.emoji}</div>
          <div>
            <h1 className="font-display text-2xl font-semibold text-botanical-900">{flower.name}</h1>
            <p className="text-sm text-botanical-500">{flower.category}</p>
          </div>
        </div>
        <p className="text-botanical-700 mt-4">{flower.description}</p>
        <p className="text-xs text-botanical-400 mt-3 italic">
          Care values below are general guidance and can vary by variety, climate, soil and season.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Section icon={Sun} title="Sunlight"><p className="text-sm text-botanical-700">{flower.sunlight}</p></Section>
        <Section icon={Droplet} title="Watering"><p className="text-sm text-botanical-700">{flower.watering}</p></Section>
        <Section icon={Mountain} title="Soil"><p className="text-sm text-botanical-700">{flower.soil}</p></Section>
        <Section icon={Wrench} title="Maintenance"><p className="text-sm text-botanical-700">{flower.maintenance}</p></Section>

        <Section icon={AlertTriangle} title="Common Issues">
          <ul className="text-sm text-botanical-700 list-disc pl-5 space-y-1">
            {issues.map((i) => <li key={i}>{i}</li>)}
          </ul>
        </Section>
        <Section icon={Lightbulb} title="Care Tips">
          <ul className="text-sm text-botanical-700 list-disc pl-5 space-y-1">
            {tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </Section>
      </div>
    </div>
  )
}
