import { useState, useRef, useEffect, forwardRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  X,
  Check,
  RotateCcw,
} from 'lucide-react';
import { Chip } from '../ui/Chip';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export type FilterType = 'select' | 'multiselect' | 'daterange';

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  options?: FilterOption[];
  value?: any;
}

export interface ActiveFilter {
  id: string;
  label: string;
  value: string;
}

export interface HorizontalFilterBarProps {
  filters: FilterConfig[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filterId: string, value: any) => void;
  onFilterRemove: (filterId: string) => void;
  onClearAll: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  extraFiltersCount?: number;
  className?: string;
}

export const HorizontalFilterBar = forwardRef<HTMLDivElement, HorizontalFilterBarProps>(
  (
    {
      filters,
      activeFilters,
      onFilterChange,
      onFilterRemove,
      onClearAll,
      searchValue = '',
      onSearchChange,
      searchPlaceholder = 'Szukaj...',
      extraFiltersCount = 4,
      className = '',
    },
    _ref
  ) => {
    const [openFilterId, setOpenFilterId] = useState<string | null>(null);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const barRef = useRef<HTMLDivElement>(null);

    // Close open popovers on outside click
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (barRef.current && !barRef.current.contains(e.target as Node)) {
          setOpenFilterId(null);
          setIsMoreOpen(false);
        }
      };

      document.addEventListener('mousedown', handleOutsideClick);
      return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, []);

    // Close on Escape
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (openFilterId !== null) {
            setOpenFilterId(null);
          } else if (isMoreOpen) {
            setIsMoreOpen(false);
          } else if (isMobileDrawerOpen) {
            setIsMobileDrawerOpen(false);
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [openFilterId, isMoreOpen, isMobileDrawerOpen]);

    const primaryFilters = filters.slice(0, extraFiltersCount);
    const overflowFilters = filters.slice(extraFiltersCount);

    const isFilterActive = (filter: FilterConfig) => {
      if (filter.value === undefined || filter.value === null || filter.value === '') {
        return false;
      }
      if (Array.isArray(filter.value)) {
        return filter.value.length > 0;
      }
      if (filter.type === 'daterange') {
        return Boolean(filter.value.from || filter.value.to);
      }
      return true;
    };

    const getFilterBadgeLabel = (filter: FilterConfig) => {
      if (!isFilterActive(filter)) return null;
      if (Array.isArray(filter.value)) {
        return filter.value.length;
      }
      if (filter.type === 'daterange') {
        if (filter.value.from && filter.value.to) return `${filter.value.from} - ${filter.value.to}`;
        if (filter.value.from) return `od ${filter.value.from}`;
        if (filter.value.to) return `do ${filter.value.to}`;
      }
      const matchingOption = filter.options?.find((o) => o.value === filter.value);
      return matchingOption ? matchingOption.label : String(filter.value);
    };

    const renderFilterContent = (filter: FilterConfig) => {
      if (filter.type === 'multiselect') {
        const selectedValues: string[] = Array.isArray(filter.value) ? filter.value : [];
        return (
          <div className="space-y-2">
            {filter.options && filter.options.length > 0 ? (
              filter.options.map((option) => {
                const checked = selectedValues.includes(option.value);
                const labelText =
                  option.count !== undefined
                    ? `${option.label} (${option.count})`
                    : option.label;

                return (
                  <div key={option.value} className="py-1">
                    <Checkbox
                      label={labelText}
                      checked={checked}
                      onChange={(isChecked) => {
                        const newValues = isChecked
                          ? [...selectedValues, option.value]
                          : selectedValues.filter((v) => v !== option.value);
                        onFilterChange(filter.id, newValues);
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-600 py-2">Brak opcji do wyboru</p>
            )}
          </div>
        );
      }

      if (filter.type === 'select') {
        return (
          <div className="space-y-1" role="radiogroup" aria-label={filter.label}>
            {filter.options && filter.options.length > 0 ? (
              filter.options.map((option) => {
                const isSelected = filter.value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => {
                      // Toggle off if already selected
                      const nextValue = isSelected ? undefined : option.value;
                      onFilterChange(filter.id, nextValue);
                      setOpenFilterId(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-control transition-colors text-left ${
                      isSelected
                        ? 'bg-brand-50 text-brand-600 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span>{option.label}</span>
                    <div className="flex items-center gap-2">
                      {option.count !== undefined && (
                        <span className="text-xs text-slate-600 font-semibold">
                          {option.count}
                        </span>
                      )}
                      {isSelected && (
                        <Check size={16} className="text-brand-500 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-slate-600 py-2">Brak opcji do wyboru</p>
            )}
          </div>
        );
      }

      if (filter.type === 'daterange') {
        const dateVal = filter.value || {};
        return (
          <div className="space-y-3 p-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Data początkowa (Od)</label>
              <Input
                type="date"
                size="sm"
                value={dateVal.from || ''}
                onChange={(e) =>
                  onFilterChange(filter.id, { ...dateVal, from: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Data końcowa (Do)</label>
              <Input
                type="date"
                size="sm"
                value={dateVal.to || ''}
                onChange={(e) =>
                  onFilterChange(filter.id, { ...dateVal, to: e.target.value })
                }
              />
            </div>
            {(dateVal.from || dateVal.to) && (
              <button
                type="button"
                onClick={() => onFilterChange(filter.id, undefined)}
                className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 mt-2"
              >
                <RotateCcw size={12} />
                <span>Resetuj zakres</span>
              </button>
            )}
          </div>
        );
      }

      return null;
    };

    return (
      <div
        ref={barRef}
        className={`w-full flex flex-col gap-3.5 bg-surface-card rounded-card border border-slate-200 p-4 shadow-card ${className}`}
      >
        {/* Layer 1 & 2 Container: Filters row + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Mobile Filter Button (< md) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              aria-label={`Otwórz filtry (${activeFilters.length} aktywnych)`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-control font-bold text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <SlidersHorizontal size={16} className="text-brand-500 shrink-0" aria-hidden="true" />
              <span>Filtry</span>
              {activeFilters.length > 0 && (
                <span className="bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Layer 2: Desktop Filter Dropdowns (>= md) */}
          <div className="hidden md:flex items-center flex-wrap gap-2 flex-1">
            {primaryFilters.map((filter) => {
              const isOpen = openFilterId === filter.id;
              const active = isFilterActive(filter);
              const badgeLabel = getFilterBadgeLabel(filter);

              return (
                <div key={filter.id} className="relative">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    onClick={() => {
                      setIsMoreOpen(false);
                      setOpenFilterId(isOpen ? null : filter.id);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-control text-xs font-bold transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                      active
                        ? 'border-brand-500 bg-brand-50 text-brand-600 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{filter.label}</span>

                    {active && badgeLabel && (
                      <span className="px-1.5 py-0.2 bg-brand-500 text-white rounded-full text-micro font-bold">
                        {badgeLabel}
                      </span>
                    )}

                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-brand-500' : 'text-slate-500'
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Filter Popover */}
                  {isOpen && (
                    <div
                      role="dialog"
                      aria-label={`Filtr: ${filter.label}`}
                      className="absolute left-0 top-full mt-1.5 min-w-[220px] max-w-[300px] bg-white border border-slate-200 rounded-control shadow-dropdown z-30 p-3 max-h-64 overflow-y-auto animate-slide-down"
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-800">
                          {filter.label}
                        </span>
                        {active && (
                          <button
                            type="button"
                            onClick={() => onFilterChange(filter.id, undefined)}
                            className="text-micro font-bold text-slate-600 hover:text-red-700 transition-colors"
                          >
                            Wyczyść
                          </button>
                        )}
                      </div>
                      {renderFilterContent(filter)}
                    </div>
                  )}
                </div>
              );
            })}

            {/* "+Więcej" button for overflow filters */}
            {overflowFilters.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={isMoreOpen}
                  onClick={() => {
                    setOpenFilterId(null);
                    setIsMoreOpen(!isMoreOpen);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control text-xs font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    overflowFilters.some(isFilterActive)
                      ? 'border-brand-500 bg-brand-50 text-brand-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>+Więcej ({overflowFilters.length})</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 shrink-0 ${
                      isMoreOpen ? 'rotate-180 text-brand-500' : 'text-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isMoreOpen && (
                  <div
                    role="dialog"
                    aria-label="Więcej filtrów"
                    className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-slate-200 rounded-control shadow-dropdown z-30 p-3.5 max-h-80 overflow-y-auto animate-slide-down space-y-4"
                  >
                    {overflowFilters.map((filter) => (
                      <div key={filter.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800">
                            {filter.label}
                          </span>
                          {isFilterActive(filter) && (
                            <button
                              type="button"
                              onClick={() => onFilterChange(filter.id, undefined)}
                              className="text-micro font-bold text-slate-600 hover:text-red-700 transition-colors"
                            >
                              Wyczyść
                            </button>
                          )}
                        </div>
                        {renderFilterContent(filter)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Layer 1: Search input (Right side) */}
          {onSearchChange && (
            <div className="w-full md:w-64 lg:w-72 shrink-0">
              <Input
                icon={Search}
                size="sm"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
              />
            </div>
          )}
        </div>

        {/* Layer 3: Active Filter Chips */}
        {activeFilters && activeFilters.length > 0 && (
          <div
            className="flex items-center flex-wrap gap-2 pt-3 border-t border-slate-100 animate-fade-in"
            aria-label="Aktywne filtry"
          >
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1 select-none">
              Aktywne:
            </span>

            {activeFilters.map((chip) => (
              <Chip
                key={chip.id}
                label={chip.label}
                onRemove={() => onFilterRemove(chip.id)}
                variant="brand"
              />
            ))}

            <button
              type="button"
              onClick={onClearAll}
              className="ml-auto text-xs font-bold text-brand-500 hover:text-brand-600 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded px-1.5 py-0.5 select-none"
            >
              Wyczyść wszystkie
            </button>
          </div>
        )}

        {/* Mobile Slide-up Filters Drawer */}
        {isMobileDrawerOpen && (
          <>
            <div
              className="fixed inset-0 bg-slate-900/60 z-50 md:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileDrawerOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Filtry"
              className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-white rounded-t-panel p-6 shadow-modal max-h-[85vh] overflow-y-auto animate-slide-up flex flex-col gap-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-brand-500" aria-hidden="true" />
                  <h2 className="text-base font-extrabold text-slate-900">Filtry</h2>
                </div>
                <div className="flex items-center gap-3">
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={onClearAll}
                      className="text-xs font-bold text-brand-500 hover:text-brand-600"
                    >
                      Wyczyść wszystkie
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    aria-label="Zamknij panel filtrów"
                    className="p-1 rounded-badge text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                  >
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {filters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {filter.label}
                      </span>
                      {isFilterActive(filter) && (
                        <button
                          type="button"
                          onClick={() => onFilterChange(filter.id, undefined)}
                          className="text-micro font-bold text-slate-400 hover:text-red-500"
                        >
                          Resetuj
                        </button>
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 rounded-control border border-slate-100">
                      {renderFilterContent(filter)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 mt-auto">
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-control text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  Zastosuj ({activeFilters.length})
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

HorizontalFilterBar.displayName = 'HorizontalFilterBar';
