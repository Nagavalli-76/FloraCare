export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function daysFromNow(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function relativeDueLabel(dateStr) {
  const days = daysFromNow(dateStr)
  if (days === null) return ''
  if (days < 0) return `Overdue by ${Math.abs(days)}d`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `Due in ${days}d`
}

export const healthColors = {
  Healthy: { bg: 'bg-botanical-100', text: 'text-botanical-700', dot: 'bg-botanical-500' },
  'Needs Attention': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Pest Suspected': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Disease Suspected': { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  'Nutrient Issue Suspected': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
}

export const severityColors = {
  INFO: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  WARNING: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  CRITICAL: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
}
