import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-[#4C6749] hover:bg-[#3d543a] text-white",
    secondary: "bg-[#D98245] hover:bg-[#c0723a] text-white",
    danger: "bg-[#A84F32] hover:bg-[#8f3f26] text-white",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-100",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};