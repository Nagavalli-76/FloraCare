export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex items-center gap-3 text-botanical-600">
        <div className="w-5 h-5 border-2 border-botanical-300 border-t-botanical-600 rounded-full animate-spin" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  )
}
