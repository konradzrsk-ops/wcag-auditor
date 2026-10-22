import React from 'react';

export type ProgressBarVariant = 'brand' | 'success' | 'warning' | 'danger';
export type ProgressBarSize = 'sm' | 'md';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const variantStyles: Record<ProgressBarVariant, string> = {
  brand: 'bg-brand-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

const sizeStyles: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'brand',
  size = 'md',
  label,
  showValue = false,
  className = '',
}) => {
  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(Math.max(0, value), safeMax);
  const percentage = Math.min(Math.max(0, (clampedValue / safeMax) * 100), 100);
  const roundedPercent = Math.round(percentage);

  return (
    <div className={`flex items-center gap-3 w-full ${className}`}>
      <div
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-label={label || 'Postęp'}
        aria-valuetext={`${roundedPercent}%`}
        className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${sizeStyles[size]}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showValue && (
        <span className="text-xs font-semibold text-slate-600 shrink-0 select-none">
          {roundedPercent}%
        </span>
      )}
    </div>
  );
};
