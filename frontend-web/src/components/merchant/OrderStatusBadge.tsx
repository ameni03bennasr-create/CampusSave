import {
  CheckCircle2,
  Clock,
  QrCode,
  XCircle
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  if (status === 'Payée / À récupérer') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#D98245]/15 text-[#A84F32] border border-[#D98245]/30">
        <QrCode className="w-3.5 h-3.5" />
        Payée / À récupérer
      </span>
    );
  }
  if (status === 'Récupérée') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Récupérée
      </span>
    );
  }
  if (status === 'En attente') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E9C98B]/50 text-[#8A4B1C]">
        <Clock className="w-3.5 h-3.5" />
        En attente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-3.5 h-3.5" />
      Annulée
    </span>
  );
};
