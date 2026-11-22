import {
  ShieldCheck,
  Store,
  User
} from 'lucide-react';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  if (role === 'Administrateur') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#A84F32]/15 text-[#A84F32]">
        <ShieldCheck className="w-3 h-3" />
        Administrateur
      </span>
    );
  }
  if (role === 'Commerçant') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#D98245]/15 text-[#8A4B1C]">
        <Store className="w-3 h-3 text-[#D98245]" />
        Commerçant
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749]">
      <User className="w-3 h-3" />
      Étudiant
    </span>
  );
};
