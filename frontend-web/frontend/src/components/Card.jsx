import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-sand/60 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

export default Card;