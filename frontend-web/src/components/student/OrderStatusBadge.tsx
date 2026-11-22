import {
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

// Badge de statut de commande
interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  if (status.includes('Confirmée') || status.includes('Prête')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4C6749]/15 text-[#4C6749]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4C6749]" />
        {status}
      </span>
    );
  }
  if (status.includes('Récupérée')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#4C6749]" />
        {status}
      </span>
    );
  }
  if (status.includes('attente')) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E9C98B]/45 text-[#8A4B1C]">
        <Clock className="w-3.5 h-3.5 text-[#D98245]" />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-3.5 h-3.5 text-red-600" />
      {status}
    </span>
  );
};
