import BrandLogo from '@/components/brand/BrandLogo'

/** Full-screen loading state (route chunks, auth status). */
export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F8F1E7] flex flex-col items-center justify-center gap-5" role="status" aria-busy="true">
      <BrandLogo className="h-24 w-auto opacity-90" />
      <span className="w-6 h-6 rounded-full border-2 border-[#E9C98B] border-t-[#A84F32] animate-spin" />
      <span className="sr-only">Chargement…</span>
    </div>
  )
}
