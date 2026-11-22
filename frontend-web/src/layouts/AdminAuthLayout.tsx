import {
  ChevronLeft,
  ShieldCheck,
  Store
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BrandLogo from '@/components/brand/BrandLogo';
import type { ReactNode } from 'react';

interface AdminAuthLayoutProps {
  children: ReactNode;
}

export function AdminAuthLayout({ children }: AdminAuthLayoutProps) {

  return (
<div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col justify-between">

        <main className="flex-1 flex flex-col items-center justify-center gap-4 p-4 sm:p-8">
          <div className="w-full max-w-4xl">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#A84F32] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour à l’accueil
            </Link>
          </div>
          <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E9C98B]/60">
            {/* Panneau gauche identité Administration */}
            <div className="lg:col-span-5 bg-[#A84F32] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex flex-col items-center gap-1 bg-white shadow-sm px-5 py-3 rounded-2xl mb-8">
                  <BrandLogo className="h-20 w-auto" />
                  <span className="text-[11px] text-[#A84F32] font-semibold">
                    Administration • ESSECT
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-4">
                  Supervision & Gouvernance de la plateforme.
                </h1>
                <p className="text-white/85 text-sm leading-relaxed">
                  Espace réservé aux administrateurs CampusSave pour la gestion des utilisateurs, la validation des restaurants et cafétérias partenaires autour de l’ESSECT et le suivi global de l’activité.
                </p>
              </div>

              <div className="relative z-10 mt-8 pt-6 border-t border-white/20 space-y-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#E9C98B] shrink-0" />
                  <span>Contrôle d’accès sécurisé par rôle (RBAC)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-[#E9C98B] shrink-0" />
                  <span>Validation obligatoire des établissements partenaires</span>
                </div>
              </div>
            </div>

            {/* Formulaire de connexion Page 01 */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
{children}
</div>
          </div>
        </main>

        <footer className="py-4 text-center text-xs text-stone-500">
          CampusSave © 2026 • Portail Administration — ESSECT Montfleury, Tunis
        </footer>
      </div>
  );
}
