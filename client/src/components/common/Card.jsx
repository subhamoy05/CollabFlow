import React from 'react';

export function Card({ children, className = '', hover = false, onClick, ...props }) {
  const hoverClass = hover ? 'transition-all duration-200 hover:shadow-card hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl shadow-subtle p-5 ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
