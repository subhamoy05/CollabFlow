import React, { useRef, useState, useEffect } from 'react';

/**
 * GlassCard: Frosted blur panel with a light edge and a specular shine
 * highlight that dynamically follows the user's cursor.
 * Optionally supports 3D tilt interaction.
 */
export function GlassCard({
  children,
  className = '',
  tilt = false,
  maxTilt = 8,
  glowColor = 'rgba(163, 28, 27, 0.15)',
  lightEdge = true,
  onClick,
  ...props
}) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);
      const listener = (e) => setPrefersReducedMotion(e.matches);
      if (media.addEventListener) media.addEventListener('change', listener);
      return () => media.removeEventListener?.('change', listener);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (tilt && !prefersReducedMotion) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.1s ease-out'
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: -1000, y: -1000 });
    if (tilt) {
      setTiltStyle({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: 'transform 0.4s ease-out'
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={tilt ? tiltStyle : undefined}
      className={`relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-300
        bg-white/70 dark:bg-[#171717]/80
        border ${lightEdge ? 'border-slate-200/80 dark:border-white/10 shadow-[0_1px_0_1px_rgba(255,255,255,0.6)_inset] dark:shadow-[0_1px_0_1px_rgba(255,255,255,0.08)_inset]' : 'border-slate-200 dark:border-white/10'}
        hover:border-[#A31C1B]/50 dark:hover:border-[#A31C1B]/60
        hover:shadow-xl dark:hover:shadow-2xl hover:shadow-[#A31C1B]/10 dark:hover:shadow-[#A31C1B]/20
        ${className}`}
      {...props}
    >
      {/* Specular cursor shine spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.18), ${glowColor} 45%, transparent 75%)`
        }}
      />

      {/* Top rim specular highlight line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent" />

      {/* Content */}
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
}
