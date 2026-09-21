import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { Sprout, HeartPulse, Droplets, ClipboardList, Bug, CheckCircle2 } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import Loading from '../components/Loading.jsx'
import { HealthBadge, PriorityBadge } from '../components/Badge.jsx'
import { api } from '../services/api.js'
import { relativeDueLabel, formatDate } from '../utils/format.js'

const PIE_COLORS = ['#5f8b4f', '#a3c497', '#f3d1d8', '#f7f3d9', '#fbe3b0', '#dbe8d8']

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [tasks, setTasks] = useState([])
  const [plants, setPlants] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getTasks({ status: 'Pending' }), api.getPlants()])
      .then(([s, t, p]) => {
        setStats(s)
        setTasks(t.slice(0, 5))
        setPlants(p.slice(0, 5))
      })
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="bg-white rounded-xl2 border border-botanical-100 p-8 text-center">
        <p className="text-botanical-700 font-medium">Could not reach the FloraCare backend.</p>
        <p className="text-sm text-botanical-500 mt-1">
          Start it with <code className="bg-botanical-50 px-1.5 py-0.5 rounded">uvicorn app.main:app --reload</code> from the backend folder.
        </p>
      </div>
    )
  }

  if (!stats) return <Loading label="Loading dashboard..." />

  const flowerData = Object.entries(stats.plants_by_flower).map(([name, value]) => ({ name, value }))
  const healthData = Object.entries(stats.health_distribution).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Plants" value={stats.total_plants} icon={Sprout} tone="botanical" />
        <StatCard label="Healthy" value={stats.healthy_plants} icon={CheckCircle2} tone="botanical" />
        <StatCard label="Need Attention" value={stats.needs_attention} icon={HeartPulse} tone="amber" />
        <StatCard label="Irrigation Alerts" value={stats.irrigation_alerts} icon={Droplets} tone="sky" />
        <StatCard label="Maintenance Due" value={stats.maintenance_due} icon={ClipboardList} tone="amber" />
        <StatCard label="Pest/Disease Alerts" value={stats.pest_disease_alerts} icon={Bug} tone="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-botanical-900">Today's Priorities</h3>
            <Link to="/maintenance" className="text-sm text-botanical-600 hover:underline">View all</Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-sm text-botanical-500 py-6 text-center">No pending tasks. Nice work!</p>
          ) : (
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-botanical-50">
                  <div>
                    <p className="text-sm font-medium text-botanical-900">{t.task_name}</p>
                    <p className="text-xs text-botanical-500">{relativeDueLabel(t.due_date)} · {formatDate(t.due_date)}</p>
                  </div>
                  <PriorityBadge priority={t.priority} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5">
          <h3 className="font-display font-semibold text-botanical-900 mb-4">Plant Health Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={healthData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                {healthData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2 justify-center">
            {healthData.map((d, i) => (
              <span key={d.name} className="text-xs flex items-center gap-1 text-botanical-600">
                <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5">
          <h3 className="font-display font-semibold text-botanical-900 mb-4">Flower Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={flowerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3ede0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#7fa96f" />
              <YAxis tick={{ fontSize: 12 }} stroke="#7fa96f" allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#5f8b4f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-botanical-900">Recent Plant Health</h3>
            <Link to="/nursery" className="text-sm text-botanical-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {plants.map((p) => (
              <Link
                key={p.id}
                to={`/nursery/${p.id}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-botanical-50"
              >
                <div>
                  <p className="text-sm font-medium text-botanical-900">{p.plant_code}</p>
                  <p className="text-xs text-botanical-500">{p.flower?.name} · {p.location}</p>
                </div>
                <HealthBadge status={p.health_status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
