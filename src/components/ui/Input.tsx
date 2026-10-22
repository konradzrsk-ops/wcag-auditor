import React, { forwardRef, useId } from 'react';
import type { LucideIcon } from 'lucide-react';

export type InputSize = 'sm' | 'md';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  hint?: string;
  size?: InputSize;
}

const sizeStyles: Record<InputSize, { input: string; withIcon: string; iconSize: number; iconLeft: string }> = {
  sm: {
    input: 'px-3 py-2 text-xs',
    withIcon: 'pl-10',
    iconSize: 16,
    iconLeft: 'left-3',
  },
  md: {
    input: 'px-4 py-3 text-sm',
    withIcon: 'pl-11',
    iconSize: 18,
    iconLeft: 'left-3.5',
  },
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      icon: Icon,
      error,
      hint,
      size = 'md',
      id: propId,
      className = '',
      disabled,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = propId || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
    const sizeConfig = sizeStyles[size];

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-slate-700 mb-1.5 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {Icon && (
            <div
              className={`absolute ${sizeConfig.iconLeft} pointer-events-none text-slate-500 flex items-center justify-center`}
              aria-hidden="true"
            >
              <Icon size={sizeConfig.iconSize} />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full bg-white border rounded-control font-semibold text-slate-900 placeholder:text-slate-500 placeholder:font-medium transition-colors outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${
              sizeConfig.input
            } ${Icon ? sizeConfig.withIcon : ''} ${
              error
                ? 'border-red-400 focus:border-red-600 focus:ring-red-500/50'
                : 'border-slate-300 focus:ring-brand-500/50 focus:border-brand-500'
            } ${className}`}
            {...rest}
          />
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-700 font-semibold mt-1.5">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-600 font-medium mt-1.5">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
