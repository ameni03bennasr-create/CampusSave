import {
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

interface ValidationStatusBadgeProps {
  status: string;
}

export const ValidationStatusBadge = ({ status }: ValidationStatusBadgeProps) => {
  if (status === 'Validé') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Validé
      </span>
    );
  }
  if (status === 'En attente') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E9C98B]/60 text-[#8A4B1C] border border-[#D98245]/30">
        <Clock className="w-3.5 h-3.5 text-[#D98245]" />
        En attente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
      <XCircle className="w-3.5 h-3.5" />
      Rejeté
    </span>
  );
};
