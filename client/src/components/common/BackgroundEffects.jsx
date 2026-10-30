import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * AmbientBlobs: Three large blurred color blobs that smoothly drift and
 * shift their positions as the user scrolls the page.
 */
export function AmbientBlobs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute smooth shifting offsets based on scroll position
  const shift1 = scrollY * 0.22;
  const shift2 = -scrollY * 0.18;
  const shift3 = scrollY * 0.14;

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {/* Blob 1: Crimson Glow - top left drifting down-right */}
      <div
        className="absolute w-[620px] h-[620px] rounded-full blur-[140px] opacity-40 dark:opacity-35 transition-transform duration-700 ease-out will-change-transform"
        style={{
          top: '-150px',
          left: '-150px',
          background: 'radial-gradient(circle, #A31C1B 0%, rgba(163, 28, 27, 0) 70%)',
          transform: `translate3d(${shift1 * 0.4}px, ${shift1}px, 0)`
        }}
      />

      {/* Blob 2: Deep Violet / Indigo - middle right drifting up-left */}
      <div
        className="absolute w-[680px] h-[680px] rounded-full blur-[160px] opacity-25 dark:opacity-20 transition-transform duration-700 ease-out will-change-transform"
        style={{
          top: '35%',
          right: '-200px',
          background: 'radial-gradient(circle, #6366F1 0%, rgba(99, 102, 241, 0) 70%)',
          transform: `translate3d(${shift2 * 0.3}px, ${shift2}px, 0)`
        }}
      />

      {/* Blob 3: Rose / Amber Ember - bottom center drifting across */}
      <div
        className="absolute w-[580px] h-[580px] rounded-full blur-[150px] opacity-30 dark:opacity-25 transition-transform duration-700 ease-out will-change-transform"
        style={{
          bottom: '5%',
          left: '30%',
          background: 'radial-gradient(circle, #F43F5E 0%, #D97706 40%, rgba(217, 119, 6, 0) 70%)',
          transform: `translate3d(${shift3 * 0.6}px, ${shift3 * -0.5}px, 0)`
        }}
      />

      {/* Subtle modern dot-grid matrix texture */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
}

/**
 * CursorSpotlight: A soft flashlight spotlight following the cursor across the viewport.
 */
export function CursorSpotlight({ radius = 600, color = 'rgba(163, 28, 27, 0.08)' }) {
  const [position, setPosition] = useState({ x: -1000, y: -1000 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer devices (not mobile touch or non-browser)
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    let frameId;
    const handleMouseMove = (e) => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        if (!visible) setVisible(true);
      });
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      style={{
        background: `radial-gradient(${radius}px circle at ${position.x}px ${position.y}px, ${color}, transparent 80%)`
      }}
    />
  );
}

/**
 * ParticleNetwork: An HTML5 Canvas particle simulation where floating dots drift
 * and draw luminous connective lines between nearby dots and the cursor.
 * Respects prefers-reduced-motion.
 */
export function ParticleNetwork({
  particleCount = 45,
  connectDistance = 110,
  className = ''
}) {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof canvas.getContext !== 'function') return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
    } catch {
      return;
    }
    if (!ctx) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth || 1200);
    let height = (canvas.height = window.innerHeight || 800);

    // Responsive count
    const count = width < 768 ? Math.min(22, particleCount) : particleCount;

    // Mouse tracking for particle interaction
    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth || 1200;
      height = canvas.height = window.innerHeight || 800;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.color = Math.random() > 0.4 ? '#A31C1B' : (isDark ? '#E2E8F0' : '#475569');
      }

      update() {
        if (!prefersReducedMotion) {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        // Slight push away from mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius && !prefersReducedMotion) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * 2.5;
          const directionY = (dy / distance) * force * 2.5;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = isDark ? 0.6 : 0.4;
        ctx.fill();
      }
    }

    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    // Main render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            const alpha = (1 - dist / connectDistance) * (isDark ? 0.25 : 0.15);
            ctx.beginPath();
            ctx.strokeStyle = '#A31C1B';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }

        // Also connect to cursor if in range
        const mdx = mouse.x - particles[a].x;
        const mdy = mouse.y - particles[a].y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouse.radius) {
          const mAlpha = (1 - mDist / mouse.radius) * (isDark ? 0.35 : 0.25);
          ctx.beginPath();
          ctx.strokeStyle = isDark ? '#FFFFFF' : '#A31C1B';
          ctx.globalAlpha = mAlpha;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        particles[a].update();
        particles[a].draw();
      }

      ctx.globalAlpha = 1;

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark, particleCount, connectDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-0 opacity-80 ${className}`}
    />
  );
}
