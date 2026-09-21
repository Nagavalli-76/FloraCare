import { Bell, Menu, Search } from 'lucide-react'

export default function Topbar({ title, subtitle, onMenuClick, alertCount = 0 }) {
  return (
    <header className="sticky top-0 z-10 bg-cream-50/90 backdrop-blur border-b border-botanical-100">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="md:hidden p-2 rounded-lg hover:bg-botanical-100">
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-display text-xl md:text-2xl font-semibold text-botanical-900">{title}</h1>
            {subtitle && <p className="text-sm text-botanical-600">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-white border border-botanical-100 rounded-xl px-3 py-2 shadow-soft">
            <Search size={16} className="text-botanical-400" />
            <input
              className="bg-transparent outline-none text-sm w-40 placeholder:text-botanical-400"
              placeholder="Search plants..."
            />
          </div>
          <button className="relative p-2.5 rounded-xl bg-white border border-botanical-100 shadow-soft hover:bg-botanical-50">
            <Bell size={18} className="text-botanical-700" />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-rose-500 text-white">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
