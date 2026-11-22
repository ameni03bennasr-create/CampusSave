import {
  CheckCircle2,
  Clock
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  if (status === 'Confirmée / À récupérer') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#D98245]/15 text-[#A84F32]">
        <Clock className="w-3.5 h-3.5" />
        {status}
      </span>
    );
  }
  if (status === 'Récupérée') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Récupérée
      </span>
    );
  }
  if (status === 'En attente') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E9C98B]/50 text-[#8A4B1C]">
        En attente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
      Annulée
    </span>
  );
};
