import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';

// ==========================================
// Types
// ==========================================

export interface PriorityStatsProps {
  /** Count of critical priority items */
  critical: number;
  /** Count of important priority items */
  important: number;
  /** Count of marginal priority items */
  marginal: number;
  /** Display size variant */
  size?: 'sm' | 'md';
  /** Additional CSS classes */
  className?: string;
}

// ==========================================
// Size configurations
// ==========================================

const SIZE_CONFIG = {
  sm: {
    textClass: 'text-xs font-bold',
    iconSize: 14,
    gap: 'gap-3',
    innerGap: 'gap-1',
  },
  md: {
    textClass: 'text-sm font-bold',
    iconSize: 16,
    gap: 'gap-4',
    innerGap: 'gap-1.5',
  },
} as const;

// ==========================================
// Priority item config
// ==========================================

interface PriorityItem {
  label: string;
  count: number;
  Icon: typeof AlertOctagon;
  activeIconClass: string;
  activeTextClass: string;
}

// ==========================================
// PriorityStats Component
// ==========================================

export function PriorityStats({
  critical,
  important,
  marginal,
  size = 'md',
  className = '',
}: PriorityStatsProps) {
  const sizeConfig = SIZE_CONFIG[size];

  const items: PriorityItem[] = [
    {
      label: 'Błędy priorytetowe',
      count: critical,
      Icon: AlertOctagon,
      activeIconClass: 'text-red-700',
      activeTextClass: 'text-red-700 font-bold',
    },
    {
      label: 'Błędy ważne',
      count: important,
      Icon: AlertTriangle,
      activeIconClass: 'text-amber-800',
      activeTextClass: 'text-amber-800 font-bold',
    },
    {
      label: 'Błędy marginalne',
      count: marginal,
      Icon: Info,
      activeIconClass: 'text-blue-700',
      activeTextClass: 'text-blue-700 font-bold',
    },
  ];

  return (
    <div
      className={`inline-flex items-center ${sizeConfig.gap} ${className}`}
      aria-label={`Błędy: ${critical} priorytetowych, ${important} ważnych, ${marginal} marginalnych`}
      role="group"
    >
      {items.map((item) => {
        const isZero = item.count === 0;
        const iconClass = isZero ? 'text-slate-500' : item.activeIconClass;
        const textClass = isZero ? 'text-slate-600 font-bold' : item.activeTextClass;

        return (
          <div
            key={item.label}
            className={`relative group/tip flex items-center ${sizeConfig.innerGap} cursor-help`}
            title={`${item.label}: ${item.count}`}
          >
            <item.Icon
              size={sizeConfig.iconSize}
              className={`shrink-0 ${iconClass}`}
              aria-hidden="true"
            />
            <span className={`${sizeConfig.textClass} ${textClass}`}>
              {item.count}
            </span>
            <div
              role="tooltip"
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 invisible group-hover/tip:opacity-100 group-hover/tip:visible transition-all duration-150 z-50 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap"
            >
              {item.label}: {item.count}
              <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
