import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  variant = 'default',
  onClick,
  ...props
}) {
  const baseClasses = 'rounded-xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-[#171717] border border-white/10 shadow-lg text-slate-100',
    glass: 'glass-card backdrop-blur-xl text-slate-100',
    glow: 'bg-[#171717] border border-[#A31C1B]/40 shadow-glow-crimson backdrop-blur-md text-white',
    crimson: 'bg-[#171717] border border-[#A31C1B]/45 shadow-glow-crimson backdrop-blur-xl text-white',
    obsidian: 'bg-[#171717] border border-white/10 hover:border-[#A31C1B]/60 shadow-xl backdrop-blur-xl text-white'
  };

  const hoverClass = hover
    ? 'hover:-translate-y-1 hover:shadow-glow-crimson hover:border-[#A31C1B]/50 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} p-5 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
