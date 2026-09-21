import { useEffect, useState } from 'react'
import { Bell, Droplets, HeartPulse, ClipboardList, Bug } from 'lucide-react'
import Loading from '../components/Loading.jsx'
import { SeverityBadge } from '../components/Badge.jsx'
import { api } from '../services/api.js'
import { formatDate } from '../utils/format.js'

const CATEGORY_ICON = { irrigation: Droplets, health: HeartPulse, maintenance: ClipboardList, pest: Bug }

export default function Alerts() {
  const [alerts, setAlerts] = useState(null)
  const [filter, setFilter] = useState('All')

  const load = () => api.getAlerts(filter === 'All' ? {} : { severity: filter }).then(setAlerts).catch(() => setAlerts([]))

  useEffect(() => { load() }, [filter])

  const markRead = async (id) => {
    await api.markAlertRead(id)
    load()
  }

  if (alerts === null) return <Loading label="Loading alerts..." />

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {['All', 'INFO', 'WARNING', 'CRITICAL'].map((s) => (
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

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl2 border border-botanical-100 p-10 text-center text-botanical-500">
          <Bell className="mx-auto mb-2 text-botanical-300" size={28} />
          No alerts to show.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => {
            const Icon = CATEGORY_ICON[a.category] || Bell
            return (
              <div key={a.id} className={`bg-white rounded-xl2 border shadow-soft p-4 flex items-start gap-3 ${a.is_read ? 'border-botanical-100 opacity-60' : 'border-botanical-100'}`}>
                <div className="w-9 h-9 rounded-lg bg-botanical-100 text-botanical-700 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={a.severity} />
                    <span className="text-xs text-botanical-400">{formatDate(a.created_at)}</span>
                  </div>
                  <p className="text-sm text-botanical-800 mt-1">{a.message}</p>
                </div>
                {!a.is_read && (
                  <button onClick={() => markRead(a.id)} className="text-xs text-botanical-600 hover:underline shrink-0">
                    Mark read
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
