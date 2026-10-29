import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollProgressBar renders a high-tech gradient line pinned to the top of the viewport
 * that updates in real time based on scroll percentage.
 */
export function ScrollProgressBar({ height = 3, className = '' }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none bg-transparent ${className}`}
      style={{ height: `${height}px` }}
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-[#A31C1B] via-rose-500 to-amber-500 transition-[width] duration-75 ease-out shadow-[0_0_12px_rgba(163,28,27,0.7)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}

/**
 * ScrollToTopButton displays a sleek frosted glass floating action button
 * when the user scrolls down, clicking it smoothly animates back to top.
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
      className={`fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#171717]/90 backdrop-blur-xl border border-[#A31C1B]/40 text-[#A31C1B] shadow-xl shadow-black/50 hover:shadow-glow-crimson hover:border-[#A31C1B] hover:-translate-y-1 active:scale-95 transition-all duration-300 animate-scale-in group ${className}`}
    >
      <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 text-white" />
    </button>
  );
}

/**
 * ScrollReveal observes when its content scrolls into view and animates it in smoothly.
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  direction = 'up'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Safe check if matchMedia exists (browser vs jsdom test environment)
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
    if (isVisible) return 'opacity-100 translate-y-0 translate-x-0';
    if (direction === 'up') return 'opacity-0 translate-y-8';
    if (direction === 'down') return 'opacity-0 -translate-y-8';
    if (direction === 'left') return 'opacity-0 translate-x-8';
    if (direction === 'right') return 'opacity-0 -translate-x-8';
    return 'opacity-0 translate-y-8';
  };

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-[transform,opacity] ${getTransformClass()} ${className}`}
    >
      {children}
    </div>
  );
}
