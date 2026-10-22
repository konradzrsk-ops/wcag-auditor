import React, { useState, useId } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
  badge,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const generatedId = useId();
  const buttonId = `accordion-btn-${generatedId}`;
  const contentId = `accordion-content-${generatedId}`;

  return (
    <div
      className={`border border-slate-200 rounded-control overflow-hidden bg-white ${className}`}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 font-bold text-sm text-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset"
      >
        <span className="flex items-center gap-2">
          <span>{title}</span>
          {badge}
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id={contentId}
          role="region"
          aria-labelledby={buttonId}
          className="px-4 pb-4 pt-1 animate-slide-down text-slate-700"
        >
          {children}
        </div>
      )}
    </div>
  );
};
