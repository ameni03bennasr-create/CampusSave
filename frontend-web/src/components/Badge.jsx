import React from 'react';

const Badge = ({ type, label }) => {
  const styles = {
    // Statuts de partenariat
    success: 'bg-olive/15 text-olive',
    warning: 'bg-sand/60 text-orange',
    danger: 'bg-red-50 text-red-700',
    // Disponibilité
    available: 'bg-terracotta text-white',
    soldout: 'bg-stone-500 text-white',
  };

  return (
    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider ${styles[type] || styles.warning}`}>
      {label}
    </span>
  );
};

export default Badge;