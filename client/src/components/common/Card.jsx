import React, { useRef, useState, useEffect } from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  tilt = false,
  variant = 'default',
  shine = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!shine || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const baseClasses = 'relative rounded-2xl transition-all duration-300 overflow-hidden';
  
  const variantClasses = {
    default: 'bg-white/80 dark:bg-[#171717] border border-slate-200/90 dark:border-white/10 shadow-md text-slate-800 dark:text-slate-100',
    glass: 'glass-card backdrop-blur-xl text-slate-800 dark:text-slate-100',
    glow: 'bg-white/90 dark:bg-[#171717] border border-[#A31C1B]/30 dark:border-[#A31C1B]/40 shadow-glow-crimson backdrop-blur-md text-slate-900 dark:text-white',
    crimson: 'bg-white/90 dark:bg-[#171717] border border-[#A31C1B]/40 dark:border-[#A31C1B]/45 shadow-glow-crimson backdrop-blur-xl text-slate-900 dark:text-white',
    obsidian: 'bg-white/85 dark:bg-[#171717] border border-slate-200 dark:border-white/10 hover:border-[#A31C1B]/60 shadow-xl backdrop-blur-xl text-slate-900 dark:text-white'
  };

  const hoverClass = hover
    ? 'hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-glow-crimson hover:border-[#A31C1B]/50 cursor-pointer'
    : '';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} p-5 ${hoverClass} ${className}`}
      {...props}
    >
      {/* Specular cursor shine */}
      {shine && !reducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.12), rgba(163, 28, 27, 0.08) 50%, transparent 80%)`
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
