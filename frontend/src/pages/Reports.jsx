import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Loading from '../components/Loading.jsx'
import { api } from '../services/api.js'

const COLORS = ['#5f8b4f', '#a3c497', '#f3d1d8', '#f7f3d9', '#fbe3b0']

export default function Reports() {
  const [stats, setStats] = useState(null)
  const [plants, setPlants] = useState([])
  const [flowerFilter, setFlowerFilter] = useState('All')
  const [flowers, setFlowers] = useState([])

  useEffect(() => {
    api.getDashboard().then(setStats).catch(() => {})
    api.getPlants().then(setPlants).catch(() => {})
    api.getFlowers().then(setFlowers).catch(() => {})
  }, [])

  const filteredPlants = flowerFilter === 'All' ? plants : plants.filter((p) => p.flower?.name === flowerFilter)

  const exportCsv = () => {
    const header = ['Plant ID', 'Flower', 'Variety', 'Location', 'Quantity', 'Moisture %', 'Health Status', 'Planted']
    const rows = filteredPlants.map((p) => [
      p.plant_code, p.flower?.name, p.variety, p.location, p.quantity, p.soil_moisture, p.health_status,
      new Date(p.planting_date).toLocaleDateString(),
    ])
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v ?? ''}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'floracare-report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!stats) return <Loading label="Loading reports..." />

  const maintenanceData = Object.entries(stats.maintenance_status).map(([name, value]) => ({ name, value }))
  const irrigationData = Object.entries(stats.irrigation_status).map(([name, value]) => ({ name, value }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <select
          value={flowerFilter}
          onChange={(e) => setFlowerFilter(e.target.value)}
          className="text-sm border border-botanical-100 rounded-xl px-3 py-2.5 bg-white shadow-soft"
        >
          <option value="All">All Flowers</option>
          {flowers.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
        </select>
        <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-botanical-700 text-white text-sm font-medium shadow-soft hover:bg-botanical-800">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5">
          <h3 className="font-semibold text-botanical-900 mb-4">Maintenance Completion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={maintenanceData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                {maintenanceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5">
          <h3 className="font-semibold text-botanical-900 mb-4">Irrigation Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={irrigationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3ede0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#7fa96f" />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} stroke="#7fa96f" />
              <Tooltip />
              <Bar dataKey="value" fill="#5f8b4f" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-botanical-500 border-b border-botanical-100">
              <th className="px-4 py-3 font-medium">Plant ID</th>
              <th className="px-4 py-3 font-medium">Flower</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Moisture</th>
              <th className="px-4 py-3 font-medium">Health</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlants.map((p) => (
              <tr key={p.id} className="border-b border-botanical-50 last:border-0">
                <td className="px-4 py-3 font-medium text-botanical-900">{p.plant_code}</td>
                <td className="px-4 py-3 text-botanical-700">{p.flower?.name}</td>
                <td className="px-4 py-3 text-botanical-700">{p.location}</td>
                <td className="px-4 py-3 text-botanical-700">{p.soil_moisture}%</td>
                <td className="px-4 py-3 text-botanical-700">{p.health_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
