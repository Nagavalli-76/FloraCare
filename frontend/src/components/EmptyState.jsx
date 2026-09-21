export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-botanical-100 text-botanical-600 flex items-center justify-center mb-4">
          <Icon size={26} />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-botanical-900">{title}</h3>
      {description && <p className="text-sm text-botanical-600 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
