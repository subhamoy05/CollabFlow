import React from 'react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/10 bg-[#171717]/60 backdrop-blur-sm ${className}`}>
      {Icon && (
        <div className="relative mb-4 group">
          {/* Subtle glowing halo behind icon */}
          <div className="absolute inset-0 rounded-full bg-[#A31C1B]/20 blur-xl animate-pulse-slow" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#171717] to-[#252525] border border-[#A31C1B]/40 flex items-center justify-center text-[#A31C1B] shadow-glow-crimson animate-float">
            <Icon className="w-7 h-7" />
          </div>
        </div>
      )}
      <h4 className="text-base font-semibold text-slate-100 mb-1">
        {title}
      </h4>
      {description && (
        <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="crimson" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
