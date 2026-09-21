import { useEffect, useState } from 'react'
import { Droplets } from 'lucide-react'
import { api } from '../services/api.js'
import Loading from '../components/Loading.jsx'

export default function Irrigation() {
  const [flowers, setFlowers] = useState([])
  const [form, setForm] = useState({ flower_id: '', soil_moisture: 40, temperature: 30, hours_since_watered: 12, rainfall_expected: false })
  const [result, setResult] = useState(null)
  const [plants, setPlants] = useState(null)

  useEffect(() => {
    api.getFlowers().then(setFlowers).catch(() => {})
    api.getPlants().then(setPlants).catch(() => setPlants([]))
  }, [])

  const check = async () => {
    const res = await api.checkIrrigation(form)
    setResult(res)
  }

  const statusStyle = (status) => {
    if (status === 'Irrigation Recommended') return 'bg-rose-100 text-rose-700 border-rose-200'
    if (status === 'Monitor') return 'bg-amber-100 text-amber-700 border-amber-200'
    return 'bg-botanical-100 text-botanical-700 border-botanical-200'
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6">
        <h3 className="font-display font-semibold text-botanical-900 mb-1">Check Irrigation Need</h3>
        <p className="text-xs text-botanical-500 mb-5">
          A simple, transparent decision-support tool — not a replacement for an agricultural expert's judgement.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Flower (optional)</label>
            <select className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm"
              value={form.flower_id} onChange={(e) => setForm({ ...form, flower_id: e.target.value })}>
              <option value="">— Not specific —</option>
              {flowers.map((f) => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-botanical-700 mb-1">Soil Moisture (%)</label>
              <input type="range" min={0} max={100} value={form.soil_moisture}
                onChange={(e) => setForm({ ...form, soil_moisture: Number(e.target.value) })} className="w-full accent-botanical-600" />
              <p className="text-sm text-botanical-800 font-medium">{form.soil_moisture}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-botanical-700 mb-1">Temperature (°C)</label>
              <input type="number" className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Hours since last watered</label>
            <input type="number" className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.hours_since_watered}
              onChange={(e) => setForm({ ...form, hours_since_watered: Number(e.target.value) })} />
          </div>
          <label className="flex items-center gap-2 text-sm text-botanical-700">
            <input type="checkbox" checked={form.rainfall_expected}
              onChange={(e) => setForm({ ...form, rainfall_expected: e.target.checked })} className="accent-botanical-600" />
            Rainfall expected soon
          </label>
          <button onClick={check} className="px-5 py-2.5 rounded-xl bg-botanical-700 text-white text-sm font-medium shadow-soft hover:bg-botanical-800">
            Check Irrigation
          </button>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-xl border ${statusStyle(result.status)}`}>
            <p className="font-semibold">{result.status}</p>
            <p className="text-sm mt-1">{result.recommendation}</p>
            <p className="text-xs mt-2 opacity-80">{result.reason}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6">
        <div className="flex items-center gap-2 mb-4">
          <Droplets size={18} className="text-botanical-600" />
          <h3 className="font-semibold text-botanical-900">Nursery Moisture Overview</h3>
        </div>
        {plants === null ? <Loading label="Loading..." /> : (
          <div className="space-y-3">
            {plants.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between text-xs text-botanical-600 mb-1">
                  <span>{p.plant_code}</span>
                  <span>{p.soil_moisture}%</span>
                </div>
                <div className="h-2 rounded-full bg-botanical-50 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.soil_moisture < 30 ? 'bg-rose-400' : p.soil_moisture < 45 ? 'bg-amber-400' : 'bg-botanical-500'}`}
                    style={{ width: `${p.soil_moisture}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
