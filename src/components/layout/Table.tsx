import React, { forwardRef } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/* ==========================================================================
   Table Container & Root Table
   ========================================================================== */

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  children: React.ReactNode;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ children, className = '', containerClassName = '', ...rest }, ref) => {
    return (
      <div
        className={`w-full overflow-x-auto rounded-card border border-slate-200 bg-white ${containerClassName}`}
        tabIndex={0}
        role="region"
        aria-label="Tabela danych (przewijalna w poziomie)"
      >
        <table
          ref={ref}
          className={`w-full border-collapse text-left ${className}`}
          {...rest}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

/* ==========================================================================
   TableHeader
   ========================================================================== */

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className = '', ...rest }, ref) => {
    return (
      <thead
        ref={ref}
        className={`bg-slate-50 border-b border-slate-200 select-none ${className}`}
        {...rest}
      >
        {children}
      </thead>
    );
  }
);

TableHeader.displayName = 'TableHeader';

/* ==========================================================================
   TableHead (th)
   ========================================================================== */

export type SortDirection = 'asc' | 'desc' | null;

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  children?: React.ReactNode;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      sortable = false,
      sortDirection = null,
      onSort,
      children,
      className = '',
      onClick,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
      onClick?.(e);
      if (sortable && onSort) {
        onSort();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableCellElement>) => {
      onKeyDown?.(e);
      if (sortable && onSort && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort();
      }
    };

    const ariaSortValue: React.AriaAttributes['aria-sort'] = sortable
      ? sortDirection === 'asc'
        ? 'ascending'
        : sortDirection === 'desc'
        ? 'descending'
        : 'none'
      : undefined;

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={ariaSortValue}
        tabIndex={sortable ? 0 : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`px-5 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider ${
          sortable
            ? 'cursor-pointer hover:text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
            : ''
        } ${className}`}
        {...rest}
      >
        <div className="inline-flex items-center gap-1.5">
          <span>{children}</span>
          {sortable && (
            <span className="shrink-0" aria-hidden="true">
              {sortDirection === 'asc' && (
                <ChevronUp size={14} className="text-brand-500" />
              )}
              {sortDirection === 'desc' && (
                <ChevronDown size={14} className="text-brand-500" />
              )}
              {!sortDirection && (
                <ChevronsUpDown size={14} className="text-slate-400" />
              )}
            </span>
          )}
        </div>
      </th>
    );
  }
);

TableHead.displayName = 'TableHead';

/* ==========================================================================
   TableBody
   ========================================================================== */

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className = '', ...rest }, ref) => {
    return (
      <tbody
        ref={ref}
        className={`divide-y divide-slate-100 bg-white ${className}`}
        {...rest}
      >
        {children}
      </tbody>
    );
  }
);

TableBody.displayName = 'TableBody';

/* ==========================================================================
   TableRow
   ========================================================================== */

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  expandable?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      children,
      className = '',
      expandable = false,
      isExpanded,
      onToggleExpand,
      onClick,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
      onClick?.(e);
      if (expandable && onToggleExpand) {
        onToggleExpand();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTableRowElement>) => {
      onKeyDown?.(e);
      if (expandable && onToggleExpand && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onToggleExpand();
      }
    };

    return (
      <tr
        ref={ref}
        tabIndex={expandable ? 0 : undefined}
        aria-expanded={expandable ? isExpanded : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`hover:bg-slate-50 transition-colors ${
          expandable
            ? 'cursor-pointer focus-visible:outline-none focus-visible:bg-slate-50 focus-visible:ring-1 focus-visible:ring-brand-500'
            : ''
        } ${className}`}
        {...rest}
      >
        {children}
      </tr>
    );
  }
);

TableRow.displayName = 'TableRow';

/* ==========================================================================
   TableCell
   ========================================================================== */

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className = '', ...rest }, ref) => {
    return (
      <td
        ref={ref}
        className={`px-5 py-4 text-sm text-slate-700 align-middle ${className}`}
        {...rest}
      >
        {children}
      </td>
    );
  }
);

TableCell.displayName = 'TableCell';
