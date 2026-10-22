import React, { useId } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  position?: TooltipPosition;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const tooltipId = useId();

  const clonedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string }>, {
        'aria-describedby': [
          (children.props as { 'aria-describedby'?: string })['aria-describedby'],
          tooltipId,
        ]
          .filter(Boolean)
          .join(' ') || undefined,
      })
    : children;

  return (
    <div className={`relative inline-flex group ${className}`}>
      {clonedChild}
      <div
        id={tooltipId}
        role="tooltip"
        className={`absolute pointer-events-none bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-badge shadow-dropdown whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-150 delay-200 ${positionStyles[position]}`}
      >
        {content}
      </div>
    </div>
  );
};
