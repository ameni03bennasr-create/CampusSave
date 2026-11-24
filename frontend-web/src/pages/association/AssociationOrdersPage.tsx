import { EmptyState } from '@/components/common/EmptyState';
import { FileText } from 'lucide-react';
import { formatPrice } from '@/utils/format';

interface AssociationOrder {
  id: string | number;
  productTitle: string;
  quantity: number;
  totalAmount: number;
  status: string;
}

export function AssociationOrdersPage({ orders = [] }: { orders?: AssociationOrder[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Demandes Groupées</h1>
        <p className="text-sm text-stone-500 mt-1">Suivez l'état de vos commandes pour événements.</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState 
          icon={FileText} 
          title="Aucune demande groupée" 
          description="Vos réservations de grande quantité pour des événements apparaîtront ici." 
          action={{ label: 'Explorer le catalogue', onClick: () => window.location.href = '/association/explore' }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E9C98B] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase">
                <th className="p-4 font-bold">ID Demande</th>
                <th className="p-4 font-bold">Produit</th>
                <th className="p-4 font-bold">Quantité</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((req) => (
                <tr key={req.id} className="hover:bg-stone-50">
                  <td className="p-4 font-bold text-stone-800">{req.id}</td>
                  <td className="p-4 text-sm text-stone-600">{req.productTitle}</td>
                  <td className="p-4 text-sm font-bold text-[#A84F32]">{req.quantity} paniers</td>
                  <td className="p-4 text-sm font-bold">{formatPrice(req.totalAmount)}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#4C6749]/10 text-[#4C6749]">{req.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}