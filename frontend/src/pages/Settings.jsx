import { useState } from 'react'
import { Save } from 'lucide-react'

export default function Settings() {
  const [nurseryName, setNurseryName] = useState('Shri Surya Nursery')
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || '/api')
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-botanical-700 mb-1">Nursery Name</label>
          <input className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={nurseryName}
            onChange={(e) => setNurseryName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-botanical-700 mb-1">Backend API URL</label>
          <input className="w-full border border-botanical-200 rounded-xl px-3 py-2 text-sm" value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)} />
          <p className="text-xs text-botanical-500 mt-1">
            Set via the <code>VITE_API_URL</code> environment variable for a permanent change (see .env.example).
          </p>
        </div>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-botanical-700 text-white text-sm font-medium shadow-soft hover:bg-botanical-800">
          <Save size={16} /> {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
