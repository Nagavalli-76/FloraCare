import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-botanical-900/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl2 shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-botanical-100 sticky top-0 bg-white rounded-t-xl2">
          <h3 className="font-display text-lg font-semibold text-botanical-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-botanical-100">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-botanical-100 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
