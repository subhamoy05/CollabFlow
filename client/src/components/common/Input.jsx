import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    type = 'text',
    className = '',
    containerClassName = '',
    id,
    ...props
  },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(2, 9);

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-200 mb-1.5 select-none">
          {label}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-4 h-4 transition-colors" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`block w-full rounded-xl text-sm bg-[#171717] border transition-all duration-200 ${
            error
              ? 'border-[#A31C1B] focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/30'
              : 'border-white/10 focus:border-[#A31C1B] focus:ring-2 focus:ring-[#A31C1B]/25 hover:border-white/20'
          } ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 animate-slide-down">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});
