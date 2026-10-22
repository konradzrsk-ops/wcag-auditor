import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectSize = 'sm' | 'md';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  size?: SelectSize;
}

const sizeStyles: Record<SelectSize, { select: string; iconSize: number; iconRight: string }> = {
  sm: {
    select: 'px-3 py-2 pr-9 text-xs',
    iconSize: 16,
    iconRight: 'right-3',
  },
  md: {
    select: 'px-4 py-3 pr-10 text-sm',
    iconSize: 18,
    iconRight: 'right-3.5',
  },
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      placeholder,
      error,
      hint,
      size = 'md',
      id: propId,
      className = '',
      disabled,
      defaultValue,
      value,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = propId || generatedId;
    const errorId = error ? `${selectId}-error` : undefined;
    const hintId = hint ? `${selectId}-hint` : undefined;

    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;
    const sizeConfig = sizeStyles[size];

    return (
      <div className="w-full flex flex-col">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-bold text-slate-700 mb-1.5 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            value={value}
            defaultValue={defaultValue}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full bg-white border rounded-control font-semibold text-slate-900 appearance-none cursor-pointer transition-colors outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed ${
              sizeConfig.select
            } ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/50'
                : 'border-slate-200 focus:ring-brand-500/50 focus:border-brand-500'
            } ${className}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <div
            className={`absolute ${sizeConfig.iconRight} pointer-events-none text-slate-400 flex items-center justify-center`}
            aria-hidden="true"
          >
            <ChevronDown size={sizeConfig.iconSize} />
          </div>
        </div>

        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-600 mt-1.5">
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-slate-400 mt-1.5">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
