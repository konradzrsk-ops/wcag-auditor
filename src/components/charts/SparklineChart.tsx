import { useMemo } from 'react';

// ==========================================
// Types
// ==========================================

export interface SparklineDataPoint {
  /** Date label for the data point */
  date: string;
  /** Score value (0-100) */
  score: number;
}

export interface SparklineChartProps {
  /** Array of data points */
  data: SparklineDataPoint[];
  /** SVG width in pixels */
  width?: number;
  /** SVG height in pixels */
  height?: number;
  /** Line and marker color */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

// ==========================================
// SparklineChart Component
// ==========================================

export function SparklineChart({
  data,
  width = 120,
  height = 40,
  color = '#0038F8',
  className = '',
}: SparklineChartProps) {
  const gradientId = useMemo(
    () => `sparkline-gradient-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  const computed = useMemo(() => {
    if (!data || data.length === 0) return null;

    const padding = 4; // space for circle markers
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const min = 0;
    const max = 100;
    const stepX = chartWidth / Math.max(data.length - 1, 1);

    const points = data.map((d, i) => ({
      x: padding + i * stepX,
      y: padding + chartHeight - ((d.score - min) / (max - min)) * chartHeight,
      date: d.date,
      score: d.score,
    }));

    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

    // Closed polygon for gradient fill area
    const fillPoints = [
      ...points.map((p) => `${p.x},${p.y}`),
      `${points[points.length - 1].x},${height - padding}`,
      `${points[0].x},${height - padding}`,
    ].join(' ');

    const firstScore = data[0].score;
    const lastScore = data[data.length - 1].score;

    return { points, polylinePoints, fillPoints, firstScore, lastScore };
  }, [data, width, height]);

  if (!computed) return null;

  const { points, polylinePoints, fillPoints, firstScore, lastScore } = computed;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        role="img"
        aria-label={`Trend: od ${firstScore}% do ${lastScore}%`}
        focusable="false"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Filled area under curve */}
        <polygon
          points={fillPoints}
          fill={`url(#${gradientId})`}
        />

        {/* Line */}
        <polyline
          points={polylinePoints}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data point markers */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="white"
            stroke={color}
            strokeWidth="2"
          >
            <title>
              {p.date}: {p.score.toFixed(1)}%
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
