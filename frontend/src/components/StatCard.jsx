export default function StatCard({ label, value, icon: Icon, tone = 'botanical', hint }) {
  const toneMap = {
    botanical: 'bg-botanical-100 text-botanical-700',
    amber: 'bg-amber-100 text-amber-700',
    rose: 'bg-rose-100 text-rose-700',
    sky: 'bg-sky-100 text-sky-700',
  }
  return (
    <div className="bg-white rounded-xl2 border border-botanical-100 shadow-soft p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-botanical-600">{label}</p>
        <p className="text-2xl font-display font-semibold text-botanical-900 mt-1">{value}</p>
        {hint && <p className="text-xs text-botanical-500 mt-1">{hint}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${toneMap[tone]}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  )
}
