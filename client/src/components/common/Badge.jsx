import React from 'react';

const PRIORITY_STYLES = {
  Low: 'bg-[#171717] text-slate-300 border-white/10',
  Medium: 'bg-blue-950/60 text-blue-300 border-blue-800/60',
  High: 'bg-amber-950/60 text-amber-300 border-amber-800/60',
  Urgent: 'bg-[#A31C1B]/25 text-rose-200 border-[#A31C1B]/60'
};

const STATUS_STYLES = {
  Backlog: 'bg-[#171717] text-slate-400 border-white/10',
  Todo: 'bg-[#171717] text-slate-300 border-white/10',
  'In Progress': 'bg-[#A31C1B]/20 text-rose-300 border-[#A31C1B]/40',
  'In Review': 'bg-purple-950/60 text-purple-300 border-purple-800/60',
  Done: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  Planning: 'bg-sky-950/60 text-sky-300 border-sky-800/60',
  Active: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  'On Hold': 'bg-amber-950/60 text-amber-300 border-amber-800/60',
  Completed: 'bg-[#A31C1B]/20 text-rose-300 border-[#A31C1B]/40',
  Archived: 'bg-[#171717] text-slate-400 border-white/10'
};

const ROLE_STYLES = {
  Admin: 'bg-[#A31C1B]/25 text-rose-200 border-[#A31C1B]/60 font-semibold',
  'Project Manager': 'bg-rose-950/60 text-rose-300 border-rose-800/60',
  'Team Member': 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  Viewer: 'bg-[#171717] text-slate-400 border-white/10'
};

export function Badge({ children, variant = 'default', size = 'sm', dot = false, className = '' }) {
  let style = 'bg-[#171717] text-slate-200 border-white/10';

  if (PRIORITY_STYLES[children]) {
    style = PRIORITY_STYLES[children];
  } else if (STATUS_STYLES[children]) {
    style = STATUS_STYLES[children];
  } else if (ROLE_STYLES[children]) {
    style = ROLE_STYLES[children];
  } else if (variant === 'danger' || variant === 'overdue') {
    style = 'bg-[#A31C1B]/25 text-rose-200 border-[#A31C1B]/60';
  } else if (variant === 'success') {
    style = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
  } else if (variant === 'brand' || variant === 'crimson') {
    style = 'bg-[#A31C1B]/25 text-rose-200 border-[#A31C1B]/60';
  } else if (variant === 'glass') {
    style = 'bg-[#171717]/80 backdrop-blur-md text-slate-200 border-white/10';
  }

  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px] gap-1' : 'px-2.5 py-0.5 text-xs gap-1.5';

  const shouldShowDot = dot || children === 'Active' || children === 'In Progress' || children === 'Urgent';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border transition-all ${sizeClasses} ${style} ${className}`}>
      {shouldShowDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
}
