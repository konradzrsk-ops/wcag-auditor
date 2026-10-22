import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      <Icon
        className="w-12 h-12 text-slate-300 mb-4 shrink-0"
        aria-hidden="true"
      />
      <h3 className="text-lg font-bold text-slate-700 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-slate-600 max-w-md mb-0 font-medium">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
