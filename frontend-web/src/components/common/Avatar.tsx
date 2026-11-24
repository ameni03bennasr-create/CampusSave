import { SafeImage } from '@/components/common/SafeImage'

interface AvatarProps {
  src?: string | null
  name: string
  /** Sizing/shape classes, e.g. "w-10 h-10 rounded-full". */
  className?: string
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

/** Profile picture, or the user's initials when no picture is set (no stock photo). */
export function Avatar({ src, name, className = 'w-10 h-10 rounded-full' }: AvatarProps) {
  if (src) return <SafeImage src={src} alt={name} className={`${className} object-cover`} />
  return (
    <span
      aria-hidden="true"
      className={`${className} bg-[#A84F32]/15 text-[#A84F32] font-extrabold text-sm flex items-center justify-center shrink-0`}
    >
      {initialsOf(name)}
    </span>
  )
}
