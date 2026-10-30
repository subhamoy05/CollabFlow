import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollProgressBar: High-tech multi-stop gradient line pinned to top of viewport
 * that updates smoothly based on scroll percentage.
 */
export function ScrollProgressBar({ height = 3.5, className = '' }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none bg-black/10 dark:bg-black/20 ${className}`}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-[#A31C1B] via-rose-500 via-amber-500 to-indigo-500 transition-[width] duration-100 ease-out shadow-[0_0_14px_rgba(163,28,27,0.85)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

/**
 * ScrollReveal: Animates elements in as they scroll into view,
 * with blur-to-sharp fade transition.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.12,
  direction = 'up',
  blur = true
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const getTransformClass = () => {
    if (isVisible) {
      return 'opacity-100 translate-y-0 translate-x-0 filter-none';
    }
    const blurClass = blur ? 'blur-[10px]' : '';
    if (direction === 'up') return `opacity-0 translate-y-8 ${blurClass}`;
    if (direction === 'down') return `opacity-0 -translate-y-8 ${blurClass}`;
    if (direction === 'left') return `opacity-0 translate-x-8 ${blurClass}`;
    if (direction === 'right') return `opacity-0 -translate-x-8 ${blurClass}`;
    return `opacity-0 translate-y-8 ${blurClass}`;
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[transform,opacity,filter] ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * CountUp: Animates a numeric stat from 0 to target when scrolled into view.
 */
export function CountUp({
  end = 100,
  decimals = 0,
  duration = 1800,
  prefix = '',
  suffix = '',
  className = ''
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [end, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Smooth ease-out exponential easing
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(eased * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [hasStarted, end, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

  return (
    <span ref={elementRef} className={`font-mono tabular-nums ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/**
 * SkillBar: Visual skill / capability bar that animates from 0% to target %
 * when entering viewport.
 */
export function SkillBar({
  label = '',
  percentage = 85,
  badge = '',
  color = 'from-[#A31C1B] to-rose-500',
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const node = barRef.current;
    if (!node) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={barRef} className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800 dark:text-slate-100">{label}</span>
          {badge && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
              {badge}
            </span>
          )}
        </div>
        <span className="font-mono font-bold text-[#A31C1B]">{percentage}%</span>
      </div>

      <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(163,28,27,0.4)]`}
          style={{ width: isVisible ? `${percentage}%` : '0%' }}
        />
      </div>
    </div>
  );
}

/**
 * useActiveSection: Tracks which section is currently active in the viewport
 * for highlighting the sticky navigation bar.
 */
export function useActiveSection(sectionIds = [], offset = 120) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');

  useEffect(() => {
    if (!sectionIds.length) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}

/**
 * ScrollToTopButton: Sleek frosted glass button to animate back to top smoothly.
 */
export function ScrollToTopButton({ threshold = 350, className = '' }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top of page"
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white/80 dark:bg-[#171717]/90 backdrop-blur-xl border border-slate-200 dark:border-[#A31C1B]/40 text-[#A31C1B] shadow-xl hover:shadow-2xl hover:border-[#A31C1B] hover:-translate-y-1 active:scale-95 transition-all duration-300 group ${className}`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 text-slate-800 dark:text-white" />
    </button>
  );
}
