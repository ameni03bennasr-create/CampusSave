
interface OfferStatusBadgeProps {
  status: string;
  quantity: number;
}

export const OfferStatusBadge = ({ status, quantity }: OfferStatusBadgeProps) => {
  if (quantity === 0 || status === 'Épuisée') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
        Épuisée
      </span>
    );
  }
  if (quantity <= 2 || status === 'Stock faible') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E9C98B]/50 text-[#8A4B1C] border border-[#D98245]/30">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D98245]" />
        Stock faible ({quantity})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#4C6749]" />
      Active
    </span>
  );
};
