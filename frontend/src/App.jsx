import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Nursery from './pages/Nursery.jsx'
import PlantDetail from './pages/PlantDetail.jsx'
import FlowerLibrary from './pages/FlowerLibrary.jsx'
import FlowerDetail from './pages/FlowerDetail.jsx'
import Irrigation from './pages/Irrigation.jsx'
import PlantHealth from './pages/PlantHealth.jsx'
import Maintenance from './pages/Maintenance.jsx'
import Alerts from './pages/Alerts.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/nursery" element={<Nursery />} />
        <Route path="/nursery/:id" element={<PlantDetail />} />
        <Route path="/flowers" element={<FlowerLibrary />} />
        <Route path="/flowers/:id" element={<FlowerDetail />} />
        <Route path="/irrigation" element={<Irrigation />} />
        <Route path="/health" element={<PlantHealth />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
