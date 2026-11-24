import logoUrl from '../../assets/brand/campussave-logo.png'

interface BrandLogoProps {
  /** Sizing only (e.g. "h-11 w-auto"). Never recolor or distort the logo. */
  className?: string
}

/**
 * Official CampusSave logo. The artwork is used unmodified; only its displayed
 * size changes per interface. Master file: assets/brand/original/.
 * Intrinsic size 800x485 keeps the aspect ratio and prevents layout shift.
 */
export default function BrandLogo({ className = 'h-12 w-auto' }: BrandLogoProps) {
  return (
    <img
      src={logoUrl}
      width={800}
      height={485}
      alt="CampusSave – Moins de gaspillage, plus de partage"
      className={`object-contain select-none ${className}`}
      draggable={false}
    />
  )
}
