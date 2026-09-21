import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import Topbar from '../components/Topbar.jsx'
import { api } from '../services/api.js'
import { X, Leaf } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const TITLES = {
  '/dashboard': ['Dashboard', "Here's your nursery overview for today."],
  '/nursery': ['My Nursery', 'Manage every plant and batch in one place.'],
  '/flowers': ['Flower Library', 'Care guides for the flowers you grow.'],
  '/irrigation': ['Smart Irrigation', 'Transparent, rule-based watering guidance.'],
  '/health': ['Plant Health', 'Track symptoms, observations and history.'],
  '/maintenance': ['Maintenance Scheduler', 'Keep every recurring task on track.'],
  '/alerts': ['Alerts & Notifications', 'Everything that needs your attention.'],
  '/reports': ['Reports', 'Nursery statistics and exportable summaries.'],
  '/settings': ['Settings', 'Preferences for your FloraCare workspace.'],
}

export default function DashboardLayout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    api.getAlerts().then((data) => setAlertCount(data.filter((a) => !a.is_read).length)).catch(() => {})
  }, [location.pathname])

  const matchKey = Object.keys(TITLES).find((k) => location.pathname.startsWith(k))
  const [title, subtitle] = TITLES[matchKey] || ['FloraCare', '']

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-botanical-900/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full bg-white p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-botanical-600 flex items-center justify-center text-white">
                  <Leaf size={16} />
                </div>
                <span className="font-display font-semibold">FloraCare</span>
              </div>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <nav className="space-y-1">
              {Object.keys(TITLES).map((to) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-botanical-100 text-botanical-800' : 'text-botanical-700'}`
                  }
                >
                  {TITLES[to][0]}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <Topbar title={title} subtitle={subtitle} onMenuClick={() => setMobileOpen(true)} alertCount={alertCount} />
        <main className="px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
