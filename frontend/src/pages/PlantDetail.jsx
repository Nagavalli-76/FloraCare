import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Droplets, Sprout, Calendar, MapPin, Camera } from 'lucide-react'
import Loading from '../components/Loading.jsx'
import { HealthBadge } from '../components/Badge.jsx'
import { api } from '../services/api.js'
import { formatDate } from '../utils/format.js'

export default function PlantDetail() {
  const { id } = useParams()
  const [plant, setPlant] = useState(null)
  const [tasks, setTasks] = useState([])
  const [history, setHistory] = useState([])
  const [irrigation, setIrrigation] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)

  const load = () => {
    api.getPlant(id).then(setPlant).catch(() => setPlant(false))
    api.getTasks({ plant_id: id }).then(setTasks).catch(() => {})
    api.getHealthHistory(id).then(setHistory).catch(() => {})
  }

  useEffect(load, [id])

  useEffect(() => {
    if (plant) {
      api.checkIrrigation({
        flower_id: plant.flower_id,
        soil_moisture: plant.soil_moisture,
        temperature: plant.temperature,
        hours_since_watered: plant.last_watered ? (Date.now() - new Date(plant.last_watered).getTime()) / 3600000 : null,
      }).then(setIrrigation).catch(() => {})
    }
  }, [plant])

  const runAiDemo = async () => {
    setAiLoading(true)
    try {
      const result = await api.runAiDemo(id)
      setAiResult(result)
      load()
    } finally {
      setAiLoading(false)
    }
  }

  if (plant === null) return <Loading label="Loading plant details..." />
  if (plant === false) return <p className="text-botanical-600">Plant not found.</p>

  return (
    <div className="max-w-5xl">
      <Link to="/nursery" className="inline-flex items-center gap-1 text-sm text-botanical-600 hover:underline mb-4">
        <ArrowLeft size={14} /> Back to My Nursery
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl2 border border-botanical-100 shadow-card p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-2xl font-semibold text-botanical-900">{plant.plant_code}</h1>
                <p className="text-botanical-600 flex items-center gap-1 mt-1">
                  {plant.flower?.emoji} {plant.flower?.name} {plant.variety && `· ${plant.variety}`}
                </p>
              </div>
              <HealthBadge status={plant.health_status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-botanical-700">
                <MapPin size={15} className="text-botanical-400" /> {plant.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-botanical-700">
                <Sprout size={15} className="text-botanical-400" /> Qty: {plant.quantity}
              </div>
              <div className="flex items-center gap-2 text-sm text-botanical-700">
                <Calendar size={15} className="text-botanical-400" /> {formatDate(plant.planting_date)}
              </div>
              <div className="flex items-center gap-2 text-sm text-botanical-700">
                <Droplets size={15} className="text-botanical-400" /> {plant.soil_moisture}% moisture
              </div>
            </div>
            {plant.notes && <p className="text-sm text-botanical-600 mt-4 border-t border-botanical-100 pt-4">{plant.notes}</p>}
          </div>

          {irrigation && (
            <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6">
              <h3 className="font-semibold text-botanical-900 mb-3">Irrigation Status</h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  irrigation.status === 'Irrigation Recommended' ? 'bg-rose-100 text-rose-700' :
                  irrigation.status === 'Monitor' ? 'bg-amber-100 text-amber-700' : 'bg-botanical-100 text-botanical-700'
                }`}>
                  {irrigation.status}
                </span>
                <span className="text-sm text-botanical-600">{irrigation.recommendation}</span>
              </div>
              <p className="text-xs text-botanical-500 mt-2">{irrigation.reason}</p>
            </div>
          )}

          <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-botanical-900">Health Observations</h3>
              <button
                onClick={runAiDemo}
                disabled={aiLoading}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl bg-botanical-100 text-botanical-700 hover:bg-botanical-200 disabled:opacity-50"
              >
                <Camera size={15} /> {aiLoading ? 'Analyzing...' : 'Upload Plant Image → Analyze'}
              </button>
            </div>
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 mb-3">
              AI Analysis Demo — not a real diagnostic model
            </span>
            {aiResult && (
              <div className="mb-3 p-3 rounded-xl bg-botanical-50 border border-botanical-100 text-sm">
                <p className="font-medium text-botanical-800">{aiResult.status}</p>
                <p className="text-botanical-600 text-xs mt-1">{aiResult.observation_notes}</p>
              </div>
            )}
            {history.length === 0 ? (
              <p className="text-sm text-botanical-500">No health observations logged yet.</p>
            ) : (
              <ul className="space-y-2">
                {history.map((h) => (
                  <li key={h.id} className="text-sm border-b border-botanical-50 last:border-0 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-botanical-800">{h.status}</span>
                      <span className="text-xs text-botanical-400">{formatDate(h.created_at)}</span>
                    </div>
                    {h.observation_notes && <p className="text-xs text-botanical-600 mt-0.5">{h.observation_notes}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6">
            <h3 className="font-semibold text-botanical-900 mb-3">Maintenance History</h3>
            {tasks.length === 0 ? (
              <p className="text-sm text-botanical-500">No maintenance tasks for this plant yet.</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between text-sm border-b border-botanical-50 last:border-0 pb-2">
                    <span className="text-botanical-800">{t.task_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'Completed' ? 'bg-botanical-100 text-botanical-700' : 'bg-amber-100 text-amber-700'}`}>
                      {t.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6 text-center">
            <h3 className="font-semibold text-botanical-900 mb-3">Plant QR ID</h3>
            <div className="flex justify-center p-3 bg-white border border-botanical-100 rounded-xl inline-block">
              <QRCodeSVG value={plant.plant_code} size={140} fgColor="#31482b" />
            </div>
            <p className="text-sm font-mono text-botanical-700 mt-3">{plant.plant_code}</p>
            <p className="text-xs text-botanical-500 mt-1">Scan to open this plant's record on-site.</p>
          </div>

          <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6">
            <h3 className="font-semibold text-botanical-900 mb-3">Care Information</h3>
            <Link to={`/flowers/${plant.flower_id}`} className="text-sm text-botanical-700 hover:underline">
              View {plant.flower?.name} care guide →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
