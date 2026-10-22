import React, { forwardRef } from 'react';
import type { LucideIcon } from 'lucide-react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  brand: 'bg-brand-50 text-brand-600 border-brand-200',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

const iconSizes: Record<BadgeSize, number> = {
  sm: 12,
  md: 14,
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'neutral',
      size = 'sm',
      icon: Icon,
      children,
      className = '',
      title,
      ...rest
    },
    ref
  ) => {
    return (
      <span
        ref={ref}
        title={title}
        data-testid="badge"
        className={`rounded-badge font-semibold border inline-flex items-center gap-1.5 shrink-0 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...rest}
      >
        {Icon && (
          <Icon
            size={iconSizes[size]}
            className="shrink-0"
            aria-hidden="true"
          />
        )}
        {children && <span>{children}</span>}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
