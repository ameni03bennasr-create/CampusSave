import { ChevronLeft, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from '@/components/brand/BrandLogo';
import type { ReactNode } from 'react';

export function AssociationAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col justify-between">
      <main className="flex-1 flex flex-col items-center justify-center gap-4 p-4 sm:p-8">
        <div className="w-full max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#A84F32] transition-colors">
            <ChevronLeft className="w-4 h-4" /> Retour à l’accueil
          </Link>
        </div>
        
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E9C98B]/50">
          {/* Panneau gauche */}
          <div className="lg:col-span-5 bg-[#A84F32] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex flex-col items-center gap-1 bg-white shadow-sm px-5 py-3 rounded-2xl mb-8">
                <BrandLogo className="h-20 w-auto" />
                <span className="text-[11px] text-[#A84F32] font-semibold">Espace Association</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-4">
                Gérez les achats de votre club et événements.
              </h1>
              <p className="text-white/85 text-sm leading-relaxed">
                Commandez en groupe pour vos réunions, assemblez des paniers surprise pour vos membres et suivez vos demandes groupées.
              </p>
            </div>
            <div className="relative z-10 mt-8 pt-6 border-t border-white/20 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-8 h-8 rounded-full bg-[#4C6749] flex items-center justify-center shrink-0"><Users className="w-4 h-4 text-white" /></span>
                <span>Créez des demandes de devis groupés</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-8 h-8 rounded-full bg-[#D98245] flex items-center justify-center shrink-0"><ShieldCheck className="w-4 h-4 text-white" /></span>
                <span>Paiement sécurisé au nom de votre club</span>
              </div>
            </div>
          </div>
          
          {/* Formulaire */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </main>
      <footer className="py-4 text-center text-xs text-stone-500">
        CampusSave © 2026 • Espace Association — ESSECT Tunis
      </footer>
    </div>
  );
}