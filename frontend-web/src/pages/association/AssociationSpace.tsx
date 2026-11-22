import { useAssociationWorkspace } from '@/hooks/useAssociationWorkspace';
import { AssociationLayout } from '@/layouts/AssociationLayout';
import { AssociationHomePage } from './AssociationHomePage';
import { EmptyState } from '@/components/common/EmptyState';
import { Tag } from 'lucide-react';
// Importez vos pages CartPage, CheckoutPage, etc. (vous pouvez réutiliser celles de l'étudiant pour l'instant)

export default function AssociationSpace() {
  const ws = useAssociationWorkspace();
  
  return (
    <AssociationLayout ws={ws}>
      {ws.currentPage === 'home' && <AssociationHomePage ws={ws} />}
      {ws.currentPage === 'explore' && <EmptyState icon={Tag} title="Catalogue" description="Les offres s'afficheront ici." />}
      {/* Ajoutez vos pages Panier, etc. plus tard */}
    </AssociationLayout>
  );
}