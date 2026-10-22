import { useState, useRef, useCallback, type KeyboardEvent } from 'react';

// ==========================================
// Types
// ==========================================

export interface TrendDataPoint {
  /** Month label displayed below the bar group */
  month: string;
  /** Accessibility score percentage (0-100) */
  score: number;
  /** Error count for this month */
  errors: number;
}

export interface TrendChartProps {
  /** Array of monthly data points */
  data: TrendDataPoint[];
  /** Chart height in pixels */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

// ==========================================
// TrendChart Component
// ==========================================

export function TrendChart({
  data,
  height = 200,
  className = '',
}: TrendChartProps) {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const barGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Compute max error count to normalize error bars
  const maxErrors = Math.max(...data.map((d) => d.errors), 1);

  const handleBarKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>, index: number) => {
      let nextIndex: number | null = null;

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = Math.min(index + 1, data.length - 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = Math.max(index - 1, 0);
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = data.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== null) {
        barGroupRefs.current[nextIndex]?.focus();
      }
    },
    [data.length]
  );

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {/* Accessible chart container */}
      <div
        role="img"
        aria-label={`Wykres trendu dostępności i błędów za ostatnie ${data.length} miesięcy. Wynik dostępności od ${data[0]?.score}% do ${data[data.length - 1]?.score}%.`}
      >
        {/* Y-axis + Bars */}
        <div className="flex" style={{ height }}>
          {/* Y-axis labels */}
          <div className="w-8 shrink-0 flex flex-col justify-between items-end pb-6 pr-2 text-micro font-bold text-slate-600 border-r border-slate-200">
            <span className="leading-none">100</span>
            <span className="leading-none">50</span>
            <span className="leading-none">0</span>
          </div>

          {/* Bar groups */}
          <div className="flex-1 flex items-end gap-1 sm:gap-2 border-b border-slate-200 px-2 sm:px-4">
            {data.map((point, i) => (
              <div
                key={point.month}
                ref={(el) => {
                  barGroupRefs.current[i] = el;
                }}
                className="flex-1 flex justify-center items-end h-full relative group outline-none"
                tabIndex={0}
                role="group"
                aria-label={`${point.month}: dostępność ${point.score}%, błędy ${point.errors}`}
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => setFocusedIndex(null)}
                onMouseEnter={() => setFocusedIndex(i)}
                onMouseLeave={() => setFocusedIndex(null)}
                onKeyDown={(e) => handleBarKeyDown(e, i)}
              >
                {/* Score bar (blue) */}
                <div
                  className="w-full max-w-[32px] bg-brand-500/20 group-hover:bg-brand-500/30 group-focus-visible:bg-brand-500/30 transition-colors rounded-t-sm relative z-10"
                  style={{ height: `${point.score}%` }}
                  aria-hidden="true"
                />

                {/* Error bar (slate) */}
                <div
                  className="absolute bottom-0 w-1/2 max-w-[16px] bg-slate-300 group-hover:bg-slate-400 group-focus-visible:bg-slate-400 transition-colors rounded-t-sm"
                  style={{
                    height: `${(point.errors / maxErrors) * 100}%`,
                  }}
                  aria-hidden="true"
                />

                {/* Tooltip — shown on hover and focus */}
                {focusedIndex === i && (
                  <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-badge z-20 whitespace-nowrap pointer-events-none shadow-dropdown"
                    role="tooltip"
                  >
                    Dostępność: {point.score}% | Błędy: {point.errors}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Month labels */}
        <div className="flex ml-8 px-2 sm:px-4 pt-2">
          {data.map((point) => (
            <div
              key={point.month}
              className="flex-1 text-center text-micro sm:text-tiny font-bold text-slate-600"
              aria-hidden="true"
            >
              {point.month}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <div
            className="w-3 h-3 rounded-full bg-brand-500"
            aria-hidden="true"
          />
          % Dostępności
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <div
            className="w-3 h-3 rounded bg-slate-400"
            aria-hidden="true"
          />
          Liczba błędów
        </div>
      </div>

      {/* Visually hidden table for screen readers */}
      <table className="sr-only">
        <caption>
          Trend dostępności i błędów — dane miesięczne
        </caption>
        <thead>
          <tr>
            <th scope="col">Miesiąc</th>
            <th scope="col">Wynik dostępności (%)</th>
            <th scope="col">Liczba błędów</th>
          </tr>
        </thead>
        <tbody>
          {data.map((point) => (
            <tr key={point.month}>
              <td>{point.month}</td>
              <td>{point.score}%</td>
              <td>{point.errors}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
