import {
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

interface PaymentStatusBadgeProps {
  paymentStatus: string;
}

export const PaymentStatusBadge = ({ paymentStatus }: PaymentStatusBadgeProps) => {
  if (paymentStatus === 'Payée') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Payée
      </span>
    );
  }
  if (paymentStatus === 'En attente') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E9C98B]/55 text-[#8A4B1C]">
        <Clock className="w-3.5 h-3.5 text-[#D98245]" />
        En attente de paiement
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-3.5 h-3.5" />
      Échoué / Non payé
    </span>
  );
};
