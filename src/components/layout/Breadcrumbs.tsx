import React, { forwardRef } from 'react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ items, className = '', ...rest }, ref) => {
    if (!items || items.length === 0) {
      return null;
    }

    return (
      <nav
        ref={ref}
        aria-label="Ścieżka nawigacyjna"
        className={`flex items-center text-[13px] font-medium text-slate-500 ${className}`}
        {...rest}
      >
        <ol role="list" className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="text-slate-800 font-semibold select-none truncate max-w-md"
                  >
                    {item.label}
                  </span>
                ) : item.onClick ? (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="text-slate-500 hover:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 rounded-sm cursor-pointer"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className="text-slate-500">
                    {item.label}
                  </span>
                )}

                {!isLast && (
                  <span
                    className="text-slate-300 select-none font-normal"
                    aria-hidden="true"
                  >
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
