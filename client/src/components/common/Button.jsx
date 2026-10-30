import React, { useRef, useState, useEffect } from 'react';

const VARIANTS = {
  primary: 'btn-shimmer bg-[#A31C1B] hover:bg-[#8A1716] text-white shadow-md shadow-[#A31C1B]/25 hover:shadow-[#A31C1B]/40 focus-visible:ring-[#A31C1B]',
  secondary: 'bg-white dark:bg-[#171717] hover:bg-slate-100 dark:hover:bg-[#222222] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:border-[#A31C1B]/50 shadow-sm focus-visible:ring-[#A31C1B]',
  outline: 'border border-[#A31C1B]/80 text-[#A31C1B] dark:text-rose-400 hover:bg-[#A31C1B]/15 hover:text-[#A31C1B] dark:hover:text-white focus-visible:ring-[#A31C1B]',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-500/20 focus-visible:ring-rose-500',
  ghost: 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#171717] hover:text-slate-900 dark:hover:text-white focus-visible:ring-[#A31C1B]',
  brand: 'btn-shimmer bg-[#A31C1B] hover:bg-[#8A1716] text-white shadow-md shadow-[#A31C1B]/30 hover:shadow-[#A31C1B]/50 focus-visible:ring-[#A31C1B]',
  gradient: 'btn-shimmer bg-gradient-to-r from-[#A31C1B] via-rose-600 to-amber-600 hover:from-[#8A1716] hover:to-rose-700 text-white shadow-md shadow-[#A31C1B]/30 hover:shadow-[#A31C1B]/50 focus-visible:ring-[#A31C1B]',
  glass: 'bg-white/70 dark:bg-[#171717]/80 hover:bg-white dark:hover:bg-[#171717] backdrop-blur-md text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10 hover:border-[#A31C1B]/50 shadow-sm focus-visible:ring-[#A31C1B]',
  crimson: 'btn-shimmer bg-[#A31C1B] hover:bg-[#8A1716] text-white shadow-md shadow-[#A31C1B]/30 hover:shadow-[#A31C1B]/50 border border-[#A31C1B]/80 focus-visible:ring-[#A31C1B]',
  crimsonOutline: 'border border-[#A31C1B]/80 text-[#A31C1B] dark:text-rose-400 hover:bg-[#A31C1B]/15 dark:hover:bg-[#A31C1B]/20 hover:text-slate-950 dark:hover:text-white focus-visible:ring-[#A31C1B]',
  charcoal: 'bg-slate-100 dark:bg-[#171717] hover:bg-slate-200 dark:hover:bg-[#242424] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-white/10 hover:border-[#A31C1B]/50 shadow-sm focus-visible:ring-[#A31C1B]'
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
  magnetic = false,
  onClick,
  ...props
}) {
  const btnRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [transition, setTransition] = useState('transform 0.2s ease-out');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!magnetic || reducedMotion || !btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (e.clientX - centerX) * 0.28;
    const dy = (e.clientY - centerY) * 0.28;

    setTransition('transform 0.1s ease-out');
    setOffset({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    if (!magnetic || reducedMotion) return;
    setTransition('transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)');
    setOffset({ x: 0, y: 0 });
  };

  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <button
      ref={btnRef}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        magnetic && !reducedMotion
          ? {
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
              transition
            }
          : undefined
      }
      className={`inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none ${variantClass} ${sizeClass} ${className}`}
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
