import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Trash2, Pencil, Eye } from 'lucide-react'
import Loading from '../components/Loading.jsx'
import EmptyState from '../components/EmptyState.jsx'
import Modal from '../components/Modal.jsx'
import { HealthBadge } from '../components/Badge.jsx'
import { api } from '../services/api.js'
import { formatDate } from '../utils/format.js'

const HEALTH_OPTIONS = ['Healthy', 'Needs Attention', 'Pest Suspected', 'Disease Suspected', 'Nutrient Issue Suspected']

const emptyForm = {
  flower_id: '', variety: '', quantity: 1, location: '', soil_moisture: 50, temperature: 28, health_status: 'Healthy', notes: '',
}

export default function Nursery() {
  const [plants, setPlants] = useState(null)
  const [flowers, setFlowers] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [error, setError] = useState('')

  const load = () => {
    api.getPlants({ search, sort_by: sortBy }).then(setPlants).catch(() => setPlants([]))
  }

  useEffect(() => { api.getFlowers().then(setFlowers).catch(() => {}) }, [])
  useEffect(() => { load() }, [search, sortBy])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...emptyForm, flower_id: flowers[0]?.id || '' })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({
      flower_id: p.flower_id, variety: p.variety || '', quantity: p.quantity, location: p.location,
      soil_moisture: p.soil_moisture, temperature: p.temperature, health_status: p.health_status, notes: p.notes || '',
    })
    setError('')
    setModalOpen(true)
  }

  const save = async () => {
    if (!form.location.trim()) { setError('Nursery location/bed is required.'); return }
    if (!form.flower_id) { setError('Please select a flower.'); return }
    try {
      if (editing) {
        await api.updatePlant(editing.id, form)
      } else {
        await api.createPlant(form)
      }
      setModalOpen(false)
      load()
    } catch (e) {
      setError('Could not save. Check the backend is running.')
    }
  }

  const doDelete = async (id) => {
    await api.deletePlant(id)
    setConfirmDelete(null)
    load()
  }

  if (plants === null) return <Loading label="Loading nursery..." />

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-botanical-100 rounded-xl px-3 py-2.5 shadow-soft w-full sm:w-72">
          <Search size={16} className="text-botanical-400" />
          <input
            className="bg-transparent outline-none text-sm w-full placeholder:text-botanical-400"
            placeholder="Search by code, bed, variety..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-botanical-100 rounded-xl px-3 py-2.5 bg-white shadow-soft"
          >
            <option value="created_at">Newest first</option>
            <option value="moisture">Lowest moisture</option>
            <option value="location">Location</option>
          </select>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-botanical-700 text-white text-sm font-medium shadow-soft hover:bg-botanical-800"
          >
            <Plus size={16} /> Add Plant/Batch
          </button>
        </div>
      </div>

      {plants.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No plants found"
          description="Try a different search, or add your first plant/batch to get started."
          action={
            <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-botanical-700 text-white text-sm font-medium">
              Add Plant/Batch
            </button>
          }
        />
      ) : (
        <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-botanical-500 border-b border-botanical-100">
                <th className="px-4 py-3 font-medium">Plant ID</th>
                <th className="px-4 py-3 font-medium">Flower</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Moisture</th>
                <th className="px-4 py-3 font-medium">Health</th>
                <th className="px-4 py-3 font-medium">Planted</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plants.map((p) => (
                <tr key={p.id} className="border-b border-botanical-50 last:border-0 hover:bg-botanical-50/50">
                  <td className="px-4 py-3 font-medium text-botanical-900">{p.plant_code}</td>
                  <td className="px-4 py-3 text-botanical-700">{p.flower?.emoji} {p.flower?.name}</td>
                  <td className="px-4 py-3 text-botanical-700">{p.location}</td>
                  <td className="px-4 py-3 text-botanical-700">{p.soil_moisture}%</td>
                  <td className="px-4 py-3"><HealthBadge status={p.health_status} /></td>
                  <td className="px-4 py-3 text-botanical-500">{formatDate(p.planting_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/nursery/${p.id}`} className="p-1.5 rounded-lg hover:bg-botanical-100" title="View">
                        <Eye size={16} className="text-botanical-600" />
                      </Link>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-botanical-100" title="Edit">
                        <Pencil size={16} className="text-botanical-600" />
                      </button>
                      <button onClick={() => setConfirmDelete(p)} className="p-1.5 rounded-lg hover:bg-rose-50" title="Delete">
                        <Trash2 size={16} className="text-rose-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.plant_code}` : 'Add Plant / Batch'}
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-botanical-600 hover:bg-botanical-50">Cancel</button>
            <button onClick={save} className="px-4 py-2 rounded-xl text-sm font-medium bg-botanical-700 text-white hover:bg-botanical-800">
              {editing ? 'Save Changes' : 'Add Plant'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Flower</label>
            <select
              className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm"
              value={form.flower_id}
              disabled={!!editing}
              onChange={(e) => setForm({ ...form, flower_id: Number(e.target.value) })}
            >
              {flowers.map((f) => <option key={f.id} value={f.id}>{f.emoji} {f.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-botanical-700 mb-1">Variety</label>
              <input className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.variety}
                onChange={(e) => setForm({ ...form, variety: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-botanical-700 mb-1">Quantity</label>
              <input type="number" min={1} className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Nursery Location / Bed</label>
            <input className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.location}
              placeholder="e.g. Bed A1"
              onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-botanical-700 mb-1">Soil Moisture (%)</label>
              <input type="number" min={0} max={100} className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.soil_moisture}
                onChange={(e) => setForm({ ...form, soil_moisture: Number(e.target.value) })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-botanical-700 mb-1">Temperature (°C)</label>
              <input type="number" className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Health Status</label>
            <select className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={form.health_status}
              onChange={(e) => setForm({ ...form, health_status: e.target.value })}>
              {HEALTH_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-botanical-700 mb-1">Notes</label>
            <textarea className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" rows={2} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete plant/batch?"
        footer={
          <>
            <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-xl text-sm font-medium text-botanical-600 hover:bg-botanical-50">Cancel</button>
            <button onClick={() => doDelete(confirmDelete.id)} className="px-4 py-2 rounded-xl text-sm font-medium bg-rose-600 text-white hover:bg-rose-700">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-botanical-700">
          This will permanently remove <strong>{confirmDelete?.plant_code}</strong> and its maintenance/health history. This cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
