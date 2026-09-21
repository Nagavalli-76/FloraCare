import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import { api } from '../services/api.js'

export default function FlowerLibrary() {
  const [flowers, setFlowers] = useState(null)

  useEffect(() => {
    api.getFlowers().then(setFlowers).catch(() => setFlowers([]))
  }, [])

  if (!flowers) return <Loading label="Loading flower library..." />

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {flowers.map((f) => (
          <div key={f.id} className="bg-white rounded-xl2 border border-botanical-100 shadow-soft overflow-hidden hover:shadow-card transition-shadow">
            <div className="h-28 flex items-center justify-center text-5xl" style={{ background: f.image_color }}>
              {f.emoji}
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-botanical-900">{f.name}</h3>
              <p className="text-xs text-botanical-500 mb-2">{f.category}</p>
              <p className="text-sm text-botanical-600 line-clamp-3">{f.description}</p>
              <Link
                to={`/flowers/${f.id}`}
                className="inline-block mt-4 text-sm font-medium text-botanical-700 hover:text-botanical-900"
              >
                View Care Guide →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
