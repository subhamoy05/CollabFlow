import React, { useRef, useState, useEffect } from 'react';

/**
 * Tilt3D: Gives any card or panel a realistic 3D perspective tilt
 * that dynamically tilts towards or follows the cursor.
 */
export function Tilt3D({
  children,
  className = '',
  maxTilt = 12,
  perspective = 1000,
  scale = 1.02,
  glare = false,
  ...props
}) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  const [transition, setTransition] = useState('transform 0.4s ease-out');
  const [glarePos, setGlarePos] = useState({ x: -500, y: -500, opacity: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransition('transform 0.1s ease-out');
    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    if (glare) {
      setGlarePos({ x, y, opacity: 0.25 });
    }
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    setTransition('transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)');
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
    if (glare) {
      setGlarePos((prev) => ({ ...prev, opacity: 0 }));
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
        transformStyle: 'preserve-3d'
      }}
      className={`relative will-change-transform ${className}`}
      {...props}
    >
      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-inherit overflow-hidden transition-opacity duration-300"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle 350px at ${glarePos.x}px ${glarePos.y}px, rgba(255, 255, 255, 0.3), transparent 75%)`
          }}
        />
      )}
      {children}
    </div>
  );
}

/**
 * Magnetic: Subtle physical pull towards cursor when hovered.
 * Ideal for CTA buttons and interactive badges.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className = '',
  as: Component = 'div',
  ...props
}) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [transition, setTransition] = useState('transform 0.2s ease-out');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  const handleMouseMove = (e) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = (e.clientX - centerX) * strength;
    const dy = (e.clientY - centerY) * strength;

    setTransition('transform 0.1s ease-out');
    setPosition({ x: dx, y: dy });
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    setTransition('transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)');
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Component
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition
      }}
      className={`inline-block will-change-transform ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * TechMarquee: An infinite running marquee of tech stacks and tools
 * that automatically pauses smoothly on hover.
 */
export function TechMarquee({ items, speed = 25, className = '' }) {
  const defaultItems = [
    { name: 'React 18', tag: 'Frontend' },
    { name: 'Node.js', tag: 'Runtime' },
    { name: 'Socket.IO', tag: 'WebSockets' },
    { name: 'Tailwind CSS', tag: 'Styling' },
    { name: 'TypeScript', tag: 'Language' },
    { name: 'MongoDB', tag: 'Database' },
    { name: 'Vite', tag: 'Bundler' },
    { name: 'Docker', tag: 'Container' },
    { name: 'Redis', tag: 'Cache' },
    { name: 'Vitest', tag: 'Testing' },
    { name: 'Express', tag: 'REST API' },
    { name: 'RBAC Security', tag: 'Auth' }
  ];

  const list = items || defaultItems;

  return (
    <div
      className={`relative w-full overflow-hidden py-4 group select-none ${className}`}
      aria-label="Technology Stack Running Marquee"
    >
      {/* Left and right fade-out edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 dark:from-[#06110C] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 dark:from-[#06110C] to-transparent z-10" />

      {/* Marquee Track (duplicated for seamless loop) */}
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[...list, ...list].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 mx-3 px-4 py-2 rounded-xl bg-white/80 dark:bg-[#171717] border border-slate-200/80 dark:border-white/10 shadow-sm hover:border-[#A31C1B]/50 transition-all hover:scale-105"
          >
            <span className="w-2 h-2 rounded-full bg-[#A31C1B] shadow-[0_0_8px_#A31C1B]" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{item.name}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-black/40 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
