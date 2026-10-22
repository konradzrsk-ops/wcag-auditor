import React, { forwardRef } from 'react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  padding?: CardPadding;
  hoverable?: boolean;
}

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className = '',
      padding = 'md',
      hoverable = false,
      onClick,
      onKeyDown,
      role,
      tabIndex,
      ...rest
    },
    ref
  ) => {
    const isInteractive = Boolean(onClick);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
      onKeyDown?.(e);
    };

    return (
      <div
        ref={ref}
        data-testid="card"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        role={role ?? (isInteractive ? 'button' : undefined)}
        tabIndex={tabIndex ?? (isInteractive ? 0 : undefined)}
        className={`bg-surface-card rounded-card shadow-card border border-slate-200 ${
          paddingStyles[padding]
        } ${
          hoverable ? 'hover:shadow-card-hover transition-shadow duration-200' : ''
        } ${
          isInteractive
            ? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
            : ''
        } ${className}`}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
