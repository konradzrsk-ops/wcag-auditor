import React, { forwardRef } from 'react';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  bordered?: boolean;
  className?: string;
}

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  (
    {
      title,
      subtitle,
      actions,
      breadcrumbs,
      bordered = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={`w-full flex flex-col gap-3 ${
          bordered ? 'border-b border-slate-200 pb-6' : ''
        } ${className}`}
        {...rest}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-1">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex items-center flex-wrap gap-3 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </header>
    );
  }
);

PageHeader.displayName = 'PageHeader';
