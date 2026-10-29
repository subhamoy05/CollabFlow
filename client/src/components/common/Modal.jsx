import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-lg',
  showClose = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with frosted blur */}
      <div
        className="fixed inset-0 bg-[#06110C]/85 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          role="dialog"
          aria-modal="true"
          className={`relative transform overflow-hidden rounded-2xl bg-[#171717] backdrop-blur-xl text-left shadow-2xl transition-all sm:my-8 w-full ${maxWidth} border border-white/10 shadow-glow-crimson animate-scale-in text-slate-100`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle top accent gradient */}
          <div className="h-1 w-full bg-gradient-to-r from-[#A31C1B] via-rose-600 to-amber-500" />

          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                {title && (
                  <h3 className="text-base font-semibold text-white flex items-center gap-2">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-white/10 bg-[#06110C] rounded">
                  Esc
                </span>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A31C1B]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-5 max-h-[calc(100vh-160px)] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
