import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Sprout, BookOpen, Droplets, HeartPulse,
  ClipboardList, Bell, BarChart3, Settings, Leaf,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/nursery', label: 'My Nursery', icon: Sprout },
  { to: '/flowers', label: 'Flower Library', icon: BookOpen },
  { to: '/irrigation', label: 'Irrigation', icon: Droplets },
  { to: '/health', label: 'Plant Health', icon: HeartPulse },
  { to: '/maintenance', label: 'Maintenance', icon: ClipboardList },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-white border-r border-botanical-100 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="w-9 h-9 rounded-xl bg-botanical-600 flex items-center justify-center text-white">
          <Leaf size={20} />
        </div>
        <span className="font-display text-xl font-semibold text-botanical-800">FloraCare</span>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-botanical-100 text-botanical-800'
                  : 'text-botanical-700/70 hover:bg-botanical-50 hover:text-botanical-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-botanical-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-botanical-50">
          <div className="w-9 h-9 rounded-full bg-sage-200 flex items-center justify-center font-semibold text-botanical-800">
            NV
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-botanical-800 truncate">Nursery Team</p>
            <p className="text-xs text-botanical-600 truncate">Shri Surya Nursery</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
