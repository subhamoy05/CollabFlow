import React from 'react';

const SIZES = {
  xs: 'w-5 h-5 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg'
};

const BG_COLORS = [
  'bg-indigo-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-violet-600',
  'bg-sky-600',
  'bg-pink-600',
  'bg-teal-600'
];

function getInitials(name = '') {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorIndex(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % BG_COLORS.length;
}

export function Avatar({ user, name, avatarUrl, size = 'md', isOnline, className = '' }) {
  const userName = user?.name || name || 'User';
  const src = user?.avatarUrl || avatarUrl;
  const initials = getInitials(userName);
  const sizeClass = SIZES[size] || SIZES.md;
  const bgClass = BG_COLORS[getColorIndex(userName)];

  return (
    <div className={`relative inline-flex flex-shrink-0 items-center justify-center rounded-full select-none ${className}`}>
      {src ? (
        <img
          src={src}
          alt={userName}
          className={`${sizeClass} rounded-full object-cover border border-slate-200 dark:border-slate-700`}
        />
      ) : (
        <div
          className={`${sizeClass} ${bgClass} text-white font-semibold flex items-center justify-center rounded-full shadow-sm`}
        >
          {initials}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-slate-900 ${
            size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
          } ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}
        />
      )}
    </div>
  );
}
