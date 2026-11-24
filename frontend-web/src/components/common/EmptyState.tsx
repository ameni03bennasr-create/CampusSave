import type { LucideIcon } from 'lucide-react'

interface EmptyStateAction {
  label: string
  onClick: () => void
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  /** Smaller padding, for use inside a card or a table area. */
  compact?: boolean
  className?: string
}

/**
 * Standard "no data yet" block used across the three spaces.
 * Replaces any invented demo content: when the platform has no data, say so and offer the next step.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`bg-white rounded-3xl border border-[#E9C98B]/60 text-center flex flex-col items-center ${
        compact ? 'px-6 py-10' : 'px-6 py-14 sm:py-16'
      } ${className}`}
    >
      <span className="w-14 h-14 rounded-2xl bg-[#F8F1E7] text-[#A84F32] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </span>
      <h3 className="text-base sm:text-lg font-extrabold text-stone-900">{title}</h3>
      {description && <p className="text-sm text-stone-500 mt-1.5 max-w-md leading-relaxed">{description}</p>}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="px-5 py-2.5 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-sm font-bold transition-colors"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="px-5 py-2.5 rounded-xl border border-[#E9C98B] bg-white hover:bg-[#F8F1E7] text-stone-700 text-sm font-bold transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
