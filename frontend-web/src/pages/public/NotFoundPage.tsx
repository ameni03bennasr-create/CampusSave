import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import BrandLogo from '@/components/brand/BrandLogo'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page introuvable')
  return (
    <div className="min-h-screen bg-[#F8F1E7] flex flex-col items-center justify-center gap-5 px-6 text-center">
      <BrandLogo className="h-24 w-auto" />
      <span className="w-14 h-14 rounded-2xl bg-white text-[#A84F32] border border-[#E9C98B]/60 flex items-center justify-center">
        <Compass className="w-7 h-7" aria-hidden="true" />
      </span>
      <h1 className="text-2xl font-extrabold text-stone-900">Page introuvable</h1>
      <p className="text-sm text-stone-500 max-w-sm">Cette adresse n’existe pas ou n’est plus disponible.</p>
      <Link to="/" className="px-5 py-2.5 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-sm font-bold">
        Retour à l’accueil
      </Link>
    </div>
  )
}
