import { useEffect, useState } from 'react'
import { Plus, CheckCircle2 } from 'lucide-react'
import Modal from '../components/Modal.jsx'
import { PriorityBadge } from '../components/Badge.jsx'
import { api } from '../services/api.js'
import { formatDate, daysFromNow, relativeDueLabel } from '../utils/format.js'
import Loading from '../components/Loading.jsx'

const TABS = ['Today', 'Upcoming', 'Overdue', 'Completed']

const emptyForm = { plant_id: '', task_name: 'Watering', due_date: '', priority: 'Medium', notes: '' }

export default function Maintenance() {
  const [tasks, setTasks] = useState(null)
  const [plants, setPlants] = useState([])
  const [tab, setTab] = useState('Today')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const load = () => api.getTasks().then(setTasks).catch(() => setTasks([]))

  useEffect(() => { load(); api.getPlants().then(setPlants).catch(() => {}) }, [])

  const grouped = {
    Today: (tasks || []).filter((t) => t.status === 'Pending' && daysFromNow(t.due_date) === 0),
    Upcoming: (tasks || []).filter((t) => t.status === 'Pending' && daysFromNow(t.due_date) > 0),
    Overdue: (tasks || []).filter((t) => t.status === 'Pending' && daysFromNow(t.due_date) < 0),
    Completed: (tasks || []).filter((t) => t.status === 'Completed'),
  }

  const complete = async (id) => {
    await api.updateTask(id, { status: 'Completed' })
    load()
  }

  const create = async () => {
    if (!form.plant_id || !form.due_date) return
    await api.createTask({ ...form, plant_id: Number(form.plant_id), due_date: new Date(form.due_date).toISOString() })
    setModalOpen(false)
    setForm(emptyForm)
    load()
  }

  if (tasks === null) return <Loading label="Loading maintenance schedule..." />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                tab === t ? 'bg-botanical-700 text-white border-botanical-700' : 'bg-white text-botanical-700 border-botanical-100 hover:bg-botanical-50'
              }`}
            >
              {t} ({grouped[t].length})
            </button>
          ))}
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-botanical-700 text-white text-sm font-medium shadow-soft hover:bg-botanical-800">
          <Plus size={16} /> New Task
        </button>
      </div>

      {grouped[tab].length === 0 ? (
        <div className="bg-white rounded-xl2 border border-botanical-100 p-10 text-center text-botanical-500">
          Nothing here right now.
        </div>
      ) : (
        <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft divide-y divide-botanical-50">
          {grouped[tab].map((t) => (
            <div key={t.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-medium text-botanical-900">{t.task_name}</p>
                <p className="text-xs text-botanical-500">{relativeDueLabel(t.due_date)} · {formatDate(t.due_date)}</p>
                {t.notes && <p className="text-xs text-botanical-400 mt-0.5">{t.notes}</p>}
              </div>
              <div className="flex items-center gap-3">
                <PriorityBadge priority={t.priority} />
                {t.status === 'Pending' && (
                  <button onClick={() => complete(t.id)} className="p-1.5 rounded-lg hover:bg-botanical-100" title="Mark complete">
                    <CheckCircle2 size={18} className="text-botanical-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Maintenance Task"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-botanical-600 hover:bg-botanical-50">Cancel</button>
            <button onClick={create} className="px-4 py-2 rounded-xl text-sm font-medium bg-botanical-700 text-white hover:bg-botanical-800">Create Task</button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Plant / Batch</label>
            <select className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.plant_id}
              onChange={(e) => setForm({ ...form, plant_id: e.target.value })}>
              <option value="">Select a plant...</option>
              {plants.map((p) => <option key={p.id} value={p.id}>{p.plant_code} ({p.location})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Task</label>
            <select className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.task_name}
              onChange={(e) => setForm({ ...form, task_name: e.target.value })}>
              {['Watering', 'Pruning', 'Pest Inspection', 'Fertilizer Check', 'Soil Check', 'Cleaning', 'Plant Inspection'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-botanical-700 mb-1">Due Date</label>
              <input type="date" className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-botanical-700 mb-1">Priority</label>
              <select className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {['Low', 'Medium', 'High'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Notes</label>
            <textarea className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" rows={2} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
