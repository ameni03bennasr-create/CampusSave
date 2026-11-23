import { EmptyState } from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';

export function AssociationOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Demandes Groupées</h1>
        <p className="text-sm text-stone-500 mt-1">Suivez l'état de vos commandes pour événements.</p>
      </div>

      <EmptyState 
        icon={FileText} 
        title="Aucune demande groupée" 
        description="Vos réservations de grande quantité pour des événements apparaîtront ici." 
        action={{ label: 'Explorer le catalogue', onClick: () => window.location.href = '/association/explore' }}
      />
    </div>
  );
}