import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

// ==========================================
// Types
// ==========================================

export interface ComplianceGaugeProps {
  /** Compliance score (0-100) */
  score: number;
  /** Display size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show compliance label below score */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// ==========================================
// Size configurations
// ==========================================

const SIZE_CONFIG = {
  sm: {
    textClass: 'text-sm font-bold',
    iconSize: 14,
    gap: 'gap-1',
    labelClass: 'text-micro',
  },
  md: {
    textClass: 'text-xl font-bold',
    iconSize: 18,
    gap: 'gap-1.5',
    labelClass: 'text-xs',
  },
  lg: {
    textClass: 'text-3xl font-extrabold',
    iconSize: 24,
    gap: 'gap-2',
    labelClass: 'text-sm',
  },
} as const;

// ==========================================
// Helpers
// ==========================================

function getVariant(score: number) {
  if (score >= 80) {
    return {
      colorClass: 'text-emerald-600',
      Icon: CheckCircle2,
      label: 'Wysoka zgodność',
      level: 'high' as const,
    };
  }
  if (score >= 60) {
    return {
      colorClass: 'text-amber-600',
      Icon: AlertTriangle,
      label: 'Średnia zgodność',
      level: 'medium' as const,
    };
  }
  return {
    colorClass: 'text-red-600',
    Icon: AlertOctagon,
    label: 'Niska zgodność',
    level: 'low' as const,
  };
}

// ==========================================
// ComplianceGauge Component
// ==========================================

export function ComplianceGauge({
  score,
  size = 'md',
  showLabel = false,
  className = '',
}: ComplianceGaugeProps) {
  const sizeConfig = SIZE_CONFIG[size];
  const variant = getVariant(score);
  const { Icon, colorClass, label } = variant;

  return (
    <div
      className={`inline-flex flex-col items-center ${className}`}
      role="status"
      aria-label={`Zgodność: ${score.toFixed(1)}% — ${label}`}
    >
      <div className={`flex items-center ${sizeConfig.gap} ${colorClass}`}>
        <Icon
          size={sizeConfig.iconSize}
          aria-hidden="true"
          className="shrink-0"
        />
        <span className={sizeConfig.textClass}>
          {score.toFixed(1)}%
        </span>
      </div>

      {showLabel && (
        <span
          className={`${sizeConfig.labelClass} font-medium text-slate-500 mt-0.5`}
          aria-hidden="true"
        >
          {label}
        </span>
      )}
    </div>
  );
}
