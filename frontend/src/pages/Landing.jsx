import { Link } from 'react-router-dom'
import { Leaf, Droplets, HeartPulse, ClipboardList, QrCode, BarChart3, ArrowRight } from 'lucide-react'

const FEATURES = [
  { icon: Droplets, title: 'Smart Irrigation Guidance', desc: 'Transparent, rule-based recommendations from soil moisture and recent watering — not a black box.' },
  { icon: HeartPulse, title: 'Plant Health Tracking', desc: 'Log symptoms and observations per plant, with a labelled AI-analysis demo ready for a future ML model.' },
  { icon: ClipboardList, title: 'Maintenance Scheduler', desc: 'Pruning, pest inspection, fertilizer checks — see what is due today, upcoming, or overdue.' },
  { icon: QrCode, title: 'QR Plant Identification', desc: 'Generate a scannable ID for every plant batch to open its full record instantly.' },
  { icon: BarChart3, title: 'Reports & Statistics', desc: 'Flower distribution, health status and maintenance completion at a glance.' },
  { icon: Leaf, title: 'Flower Care Encyclopedia', desc: 'General, clearly-labelled care guidance for Rose, Jasmine, Marigold and ornamentals.' },
]

const FLOWERS = [
  { emoji: '🌹', name: 'Rose' },
  { emoji: '🌼', name: 'Jasmine' },
  { emoji: '🟠', name: 'Marigold' },
  { emoji: '🪴', name: 'Ornamentals' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Nav */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-botanical-600 flex items-center justify-center text-white">
            <Leaf size={20} />
          </div>
          <span className="font-display text-xl font-semibold text-botanical-800">FloraCare</span>
        </div>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded-xl bg-botanical-700 text-white text-sm font-medium shadow-soft hover:bg-botanical-800 transition-colors"
        >
          Open Dashboard
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-12 pb-16">
        <span className="inline-block px-3 py-1 rounded-full bg-botanical-100 text-botanical-700 text-xs font-semibold tracking-wide uppercase mb-5">
          Floriculture Nursery Management
        </span>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-botanical-900 leading-tight">
          Smarter Care for Every Bloom.
        </h1>
        <p className="mt-5 text-botanical-700 text-lg max-w-2xl mx-auto">
          FloraCare helps nursery teams monitor flowering plants, manage maintenance, track irrigation,
          and respond to plant health concerns from one simple dashboard.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/nursery" className="px-5 py-3 rounded-xl bg-botanical-700 text-white font-medium shadow-soft hover:bg-botanical-800 flex items-center gap-2">
            Explore Nursery <ArrowRight size={16} />
          </Link>
          <Link to="/flowers" className="px-5 py-3 rounded-xl bg-white border border-botanical-200 text-botanical-800 font-medium hover:bg-botanical-50">
            View Plant Care
          </Link>
        </div>
      </section>

      {/* Why FloraCare */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl2 border border-botanical-100 shadow-card p-8 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-display text-3xl font-semibold text-botanical-800">4</p>
            <p className="text-sm text-botanical-600 mt-1">Flower care guides included</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-botanical-800">12</p>
            <p className="text-sm text-botanical-600 mt-1">Nursery management modules</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-botanical-800">100%</p>
            <p className="text-sm text-botanical-600 mt-1">Runs locally — no paid APIs required</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl font-semibold text-botanical-900 text-center mb-8">
          Everything a nursery team needs
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6">
              <div className="w-10 h-10 rounded-lg bg-botanical-100 text-botanical-700 flex items-center justify-center mb-4">
                <Icon size={20} />
              </div>
              <h3 className="font-semibold text-botanical-900">{title}</h3>
              <p className="text-sm text-botanical-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Flower care */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl font-semibold text-botanical-900 text-center mb-8">Flower Care</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {FLOWERS.map((f) => (
            <div key={f.name} className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6 text-center hover:shadow-card transition-shadow">
              <div className="text-4xl mb-3">{f.emoji}</div>
              <p className="font-semibold text-botanical-900">{f.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-2xl font-semibold text-botanical-900 text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            ['1. Log your plants', 'Record each batch with its flower type, bed location and planting date.'],
            ['2. Track daily conditions', 'Update soil moisture and watering, and let FloraCare flag what needs attention.'],
            ['3. Stay ahead of tasks', 'See maintenance and alerts in one place, so nothing falls through the cracks.'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6">
              <h3 className="font-semibold text-botanical-900">{title}</h3>
              <p className="text-sm text-botanical-600 mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sustainable floriculture */}
      <section className="max-w-4xl mx-auto px-6 py-10 text-center">
        <div className="bg-botanical-700 text-cream-50 rounded-xl2 p-10 shadow-card">
          <h2 className="font-display text-2xl font-semibold mb-3">Supporting Sustainable Floriculture</h2>
          <p className="text-botanical-100 max-w-2xl mx-auto text-sm md:text-base">
            Built from real field observations with rural nursery growers, FloraCare aims to make
            everyday plant care more systematic — without replacing the knowledge and judgement
            nursery workers already bring to their craft.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-botanical-100 mt-10">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-botanical-600">
          <div className="flex items-center gap-2">
            <Leaf size={16} className="text-botanical-500" />
            <span>FloraCare — Community Service Project (CSP) Mini-Project</span>
          </div>
          <span>© {new Date().getFullYear()} FloraCare. Built for educational demonstration.</span>
        </div>
      </footer>
    </div>
  )
}
