import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-terracotta hover:bg-[#8E4128] text-white",
    secondary: "bg-olive hover:bg-[#3B5239] text-white",
    outline: "border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-100 shadow-none",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;