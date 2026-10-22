import React, { forwardRef, useId } from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked,
      onChange,
      disabled = false,
      id: propId,
      className = '',
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = propId || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex items-center gap-3 select-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
      >
        <div className="relative flex items-center justify-center shrink-0 w-5 h-5">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            className="peer appearance-none w-5 h-5 rounded border-2 border-slate-300 checked:border-brand-500 checked:bg-brand-500 transition-all cursor-pointer disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            {...rest}
          />
          <CheckCircle2
            className={`pointer-events-none absolute w-3.5 h-3.5 text-white transition-opacity duration-150 ${
              checked ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        </div>
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
