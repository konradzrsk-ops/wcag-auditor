import {
  Globe,
  Smartphone,
  Tablet,
  FileText,
  Monitor,
  type LucideIcon,
} from 'lucide-react';

// ==========================================
// Types
// ==========================================

export interface ChannelData {
  /** Channel display name */
  name: string;
  /** Compliance percentage (0-100) */
  percentage: number;
  /** Icon identifier key */
  icon: string;
}

export interface ChannelBarsProps {
  /** Array of channel compliance data */
  channels: ChannelData[];
  /** Additional CSS classes */
  className?: string;
}

// ==========================================
// Icon mapping
// ==========================================

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  www: Globe,
  smartphone: Smartphone,
  ios: Smartphone,
  tablet: Tablet,
  android: Tablet,
  'file-text': FileText,
  pdf: FileText,
  doc: FileText,
  monitor: Monitor,
  desktop: Monitor,
};

// ==========================================
// Helpers
// ==========================================

function getBarColor(percentage: number): string {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function getTextColor(percentage: number): string {
  if (percentage >= 80) return 'text-emerald-600';
  if (percentage >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function getStatusLabel(percentage: number): string {
  if (percentage >= 80) return 'Wysoka';
  if (percentage >= 60) return 'Średnia';
  return 'Niska';
}

// ==========================================
// ChannelBars Component
// ==========================================

export function ChannelBars({ channels, className = '' }: ChannelBarsProps) {
  if (!channels || channels.length === 0) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-5 ${className}`}
      role="group"
      aria-label="Zgodność kanałów cyfrowych"
    >
      {channels.map((channel) => {
        const IconComponent = ICON_MAP[channel.icon.toLowerCase()] ?? Globe;
        const statusLabel = getStatusLabel(channel.percentage);

        return (
          <div key={channel.name} className="flex flex-col gap-1.5">
            {/* Channel name + icon + percentage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconComponent
                  size={16}
                  className="text-slate-400 shrink-0"
                  aria-hidden="true"
                />
                <span className="text-sm font-bold text-slate-800">
                  {channel.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold ${getTextColor(channel.percentage)}`}
                >
                  {statusLabel}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {channel.percentage}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${getBarColor(channel.percentage)}`}
                style={{ width: `${channel.percentage}%` }}
                role="progressbar"
                aria-valuenow={channel.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${channel.name}: ${channel.percentage}% zgodności — ${statusLabel}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
