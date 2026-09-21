/**
 * FloraCare API service layer.
 *
 * All calls point at the FastAPI backend. If the backend is unreachable
 * (e.g. it hasn't been started yet), functions throw and calling code
 * should fall back to demo/static data so the UI never looks broken.
 */
const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${text}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getFlowers: () => request('/flowers'),
  getFlower: (id) => request(`/flowers/${id}`),

  getPlants: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/plants${qs ? `?${qs}` : ''}`)
  },
  getPlant: (id) => request(`/plants/${id}`),
  createPlant: (data) => request('/plants', { method: 'POST', body: JSON.stringify(data) }),
  updatePlant: (id, data) => request(`/plants/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePlant: (id) => request(`/plants/${id}`, { method: 'DELETE' }),

  getTasks: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/maintenance${qs ? `?${qs}` : ''}`)
  },
  createTask: (data) => request('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => request(`/maintenance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`/maintenance/${id}`, { method: 'DELETE' }),

  checkIrrigation: (data) => request('/irrigation/check', { method: 'POST', body: JSON.stringify(data) }),

  getHealthHistory: (plantId) => request(`/health/plant/${plantId}`),
  logObservation: (data) => request('/health', { method: 'POST', body: JSON.stringify(data) }),
  runAiDemo: (plantId) => request(`/health/ai-demo/${plantId}`, { method: 'POST' }),

  getAlerts: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/alerts${qs ? `?${qs}` : ''}`)
  },
  markAlertRead: (id) => request(`/alerts/${id}/read`, { method: 'PUT' }),

  getDashboard: () => request('/dashboard'),
}
