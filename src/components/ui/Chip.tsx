import React from 'react';
import { X } from 'lucide-react';

export type ChipVariant = 'default' | 'brand';

export interface ChipProps {
  label: string;
  onRemove?: () => void;
  variant?: ChipVariant;
  className?: string;
}

const variantStyles: Record<ChipVariant, { container: string; removeBtn: string }> = {
  default: {
    container: 'bg-slate-100 text-slate-700',
    removeBtn: 'hover:bg-slate-200 text-slate-500 hover:text-slate-800',
  },
  brand: {
    container: 'bg-brand-50 text-brand-600 border border-brand-200',
    removeBtn: 'hover:bg-brand-100 text-brand-500 hover:text-brand-800',
  },
};

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  variant = 'default',
  className = '',
}) => {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none ${styles.container} ${className}`}
    >
      <span>{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Usuń filtr: ${label}`}
          className={`rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${styles.removeBtn}`}
        >
          <X size={12} aria-hidden="true" />
        </button>
      )}
    </span>
  );
};
