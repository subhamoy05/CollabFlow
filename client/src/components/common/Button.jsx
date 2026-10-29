import React from 'react';

const VARIANTS = {
  primary: 'btn-shimmer bg-[#A31C1B] hover:bg-[#8A1716] text-white shadow-md shadow-[#A31C1B]/25 hover:shadow-[#A31C1B]/40 focus-visible:ring-[#A31C1B]',
  secondary: 'bg-[#171717] hover:bg-[#222222] text-slate-200 border border-white/10 hover:border-[#A31C1B]/50 shadow-sm focus-visible:ring-[#A31C1B]',
  outline: 'border border-[#A31C1B]/80 text-rose-400 hover:bg-[#A31C1B]/20 hover:text-white focus-visible:ring-[#A31C1B]',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20 focus-visible:ring-rose-500',
  ghost: 'text-slate-300 hover:bg-[#171717] hover:text-white focus-visible:ring-[#A31C1B]',
  brand: 'btn-shimmer bg-[#A31C1B] hover:bg-[#8A1716] text-white shadow-md shadow-[#A31C1B]/30 hover:shadow-[#A31C1B]/50 focus-visible:ring-[#A31C1B]',
  gradient: 'btn-shimmer bg-gradient-to-r from-[#A31C1B] via-rose-600 to-[#A31C1B] hover:from-[#8A1716] hover:to-rose-700 text-white shadow-md shadow-[#A31C1B]/30 hover:shadow-[#A31C1B]/50 focus-visible:ring-[#A31C1B]',
  glass: 'bg-[#171717]/80 hover:bg-[#171717] backdrop-blur-md text-slate-100 border border-white/10 hover:border-[#A31C1B]/50 shadow-sm focus-visible:ring-[#A31C1B]',
  crimson: 'btn-shimmer bg-[#A31C1B] hover:bg-[#8A1716] text-white shadow-md shadow-[#A31C1B]/30 hover:shadow-[#A31C1B]/50 border border-[#A31C1B]/80 focus-visible:ring-[#A31C1B]',
  crimsonOutline: 'border border-[#A31C1B]/80 text-rose-400 hover:bg-[#A31C1B]/20 hover:text-white focus-visible:ring-[#A31C1B]',
  charcoal: 'bg-[#171717] hover:bg-[#242424] text-slate-100 border border-white/10 hover:border-[#A31C1B]/50 shadow-md focus-visible:ring-[#A31C1B]'
};

const SIZES = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2.5'
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${children ? 'mr-0.5' : ''}`} />
      ) : null}
      {children}
    </button>
  );
}
