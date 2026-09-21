import { healthColors, severityColors } from '../utils/format'

export function HealthBadge({ status }) {
  const c = healthColors[status] || healthColors.Healthy
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}

export function SeverityBadge({ severity }) {
  const c = severityColors[severity] || severityColors.INFO
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      {severity}
    </span>
  )
}

export function PriorityBadge({ priority }) {
  const map = {
    High: 'bg-rose-100 text-rose-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-sky-100 text-sky-700',
  }
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[priority] || map.Medium}`}>{priority}</span>
}
