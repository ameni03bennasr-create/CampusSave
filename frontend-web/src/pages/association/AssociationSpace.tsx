import { useAssociationWorkspace } from '@/hooks/useAssociationWorkspace';
import { AssociationLayout } from '@/layouts/AssociationLayout';
import { AssociationAuthLayout } from '@/layouts/AssociationAuthLayout';
import { AssociationHomePage } from './AssociationHomePage';
import { AssociationRegisterPage } from './AssociationRegisterPage';
import { AssociationLoginPage } from './AssociationLoginPage';
import { EmptyState } from '@/components/common/EmptyState';
import { Tag } from 'lucide-react';

export default function AssociationSpace() {
  const ws = useAssociationWorkspace();
  const { currentPage, navigateTo } = ws;

  // 1. GESTION DE L'AUTHENTIFICATION (Login & Register)
  if (currentPage === 'login' || currentPage === 'register') {
    return (
      <AssociationAuthLayout>
        {currentPage === 'register' ? (
          <AssociationRegisterPage onGoLogin={() => navigateTo('login')} />
        ) : (
          <AssociationLoginPage 
            onGoRegister={() => navigateTo('register')} 
            onLogin={() => navigateTo('home')} // Simule une connexion réussie
          />
        )}
      </AssociationAuthLayout>
    );
  }

  // 2. GESTION DE L'ESPACE CONNECTÉ (Tableau de bord, Panier, etc.)
  return (
    <AssociationLayout ws={ws}>
      {currentPage === 'home' && <AssociationHomePage ws={ws} />}
      {currentPage === 'explore' && <EmptyState icon={Tag} title="Catalogue" description="Les offres s'afficheront ici." />}
      {currentPage === 'cart' && <EmptyState icon={Tag} title="Panier Groupé" description="Votre panier s'affichera ici." />}
      {currentPage === 'orders' && <EmptyState icon={Tag} title="Demandes Groupées" description="Vos demandes s'afficheront ici." />}
      {currentPage === 'profile' && <EmptyState icon={Tag} title="Profil" description="Le profil du club s'affichera ici." />}
    </AssociationLayout>
  );
}