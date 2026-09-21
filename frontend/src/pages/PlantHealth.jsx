import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeartPulse } from 'lucide-react'
import Loading from '../components/Loading.jsx'
import { HealthBadge } from '../components/Badge.jsx'
import { api } from '../services/api.js'

const STATUS_FILTERS = ['All', 'Healthy', 'Needs Attention', 'Pest Suspected', 'Disease Suspected', 'Nutrient Issue Suspected']

export default function PlantHealth() {
  const [plants, setPlants] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    api.getPlants(filter === 'All' ? {} : { health_status: filter }).then(setPlants).catch(() => setPlants([]))
  }, [filter])

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
              filter === s ? 'bg-botanical-700 text-white border-botanical-700' : 'bg-white text-botanical-700 border-botanical-100 hover:bg-botanical-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {plants === null ? <Loading label="Loading plant health..." /> : plants.length === 0 ? (
        <div className="bg-white rounded-xl2 border border-botanical-100 p-10 text-center text-botanical-500">
          <HeartPulse className="mx-auto mb-2 text-botanical-300" size={28} />
          No plants match this status.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {plants.map((p) => (
            <Link key={p.id} to={`/nursery/${p.id}`} className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5 hover:shadow-card transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-botanical-900">{p.plant_code}</p>
                  <p className="text-xs text-botanical-500">{p.flower?.emoji} {p.flower?.name} · {p.location}</p>
                </div>
                <HealthBadge status={p.health_status} />
              </div>
              <p className="text-xs text-botanical-500 mt-3">{p.notes || 'No additional notes.'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
