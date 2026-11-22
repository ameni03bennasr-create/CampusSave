import {
  Clock
} from 'lucide-react';

interface AccountStatusBadgeProps {
  status: string;
}

export const AccountStatusBadge = ({ status }: AccountStatusBadgeProps) => {
  if (status === 'Actif') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4C6749]" />
        Actif
      </span>
    );
  }
  if (status === 'En attente') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E9C98B]/55 text-[#8A4B1C]">
        <Clock className="w-3 h-3 text-[#D98245]" />
        En attente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
      <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
      Désactivé
    </span>
  );
};
