import React, { useState, useEffect } from 'react';

/**
 * BlurTextReveal: Splits text into individual letters that blur in one-by-one.
 * Features an accessible sr-only text node for screen readers and test runners,
 * followed by staggered visual character spans.
 */
export function BlurTextReveal({
  text = '',
  className = '',
  delay = 45,
  initialDelay = 100,
  tag: Tag = 'h1'
}) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
    const timer = setTimeout(() => setMounted(true), initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const characters = Array.from(text);

  return (
    <Tag className={`inline-block ${className}`} aria-label={text}>
      {/* Screen-reader accessible full text */}
      <span className="sr-only">{text}</span>

      {/* Visual character animation */}
      <span aria-hidden="true" className="inline-block">
        {characters.map((char, idx) => {
          const isSpace = char === ' ';
          return (
            <span
              key={idx}
              style={{
                transitionDelay: `${mounted ? idx * delay : 0}ms`,
                filter: mounted ? 'blur(0px)' : 'blur(16px)',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(8px)'
              }}
              className="inline-block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[filter,opacity,transform]"
            >
              {isSpace ? '\u00A0' : char}
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

/**
 * Typewriter: Types and deletes roles or titles on an infinite loop.
 */
export function Typewriter({
  words = ['Full-Stack Architect', 'Real-Time Systems Lead', 'UI/UX Craftsman'],
  typingSpeed = 75,
  deletingSpeed = 40,
  pauseTime = 1800,
  className = ''
}) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setCurrentText(words[0] || '');
      return;
    }

    const fullWord = words[currentWordIndex % words.length];

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          setCurrentText(fullWord.slice(0, currentText.length + 1));
          if (currentText === fullWord) {
            // Reached end of word, pause before deleting
            setTimeout(() => setIsDeleting(true), pauseTime);
          }
        } else {
          // Deleting
          setCurrentText(fullWord.slice(0, currentText.length - 1));
          if (currentText === '') {
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime, reducedMotion]);

  return (
    <span className={`inline-flex items-center font-mono font-bold ${className}`} aria-live="polite">
      <span>{currentText}</span>
      <span
        aria-hidden="true"
        className="inline-block w-[3px] h-[1.15em] ml-1 bg-[#A31C1B] rounded-xs animate-pulse shadow-[0_0_8px_#A31C1B]"
      />
    </span>
  );
}
