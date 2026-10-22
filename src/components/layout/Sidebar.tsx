import { useState, useEffect, useRef, forwardRef } from 'react';
import {
  LayoutGrid,
  ClipboardCheck,
  Library,
  BarChart2,
  MessageSquare,
  Eye,
  PanelLeftOpen,
  PanelLeftClose,
  X,
  User,
  LogOut,
  MoreVertical,
  LucideIcon,
} from 'lucide-react';

export interface SidebarNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { path: '/', label: 'Przegląd', icon: LayoutGrid },
  { path: '/audyty', label: 'Audyty', icon: ClipboardCheck },
  { path: '/uslugi', label: 'Baza Usług', icon: Library },
  { path: '/raportowanie', label: 'Raportowanie', icon: BarChart2 },
  { path: '/reklamacje', label: 'Reklamacje', icon: MessageSquare },
];

export interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  (
    {
      currentPath,
      onNavigate,
      onLogout,
      isCollapsed: controlledCollapsed,
      onToggleCollapse,
      isMobileOpen: controlledMobileOpen,
      onMobileClose,
      className = '',
    },
    ref
  ) => {
    // Internal collapse state if not controlled
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const isCollapsed =
      controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

    const handleToggleCollapse = () => {
      if (onToggleCollapse) {
        onToggleCollapse();
      } else {
        setInternalCollapsed((prev) => !prev);
      }
    };

    // Internal mobile state if not controlled
    const [internalMobileOpen, setInternalMobileOpen] = useState(false);
    const isMobileOpen =
      controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen;

    const handleCloseMobile = () => {
      if (onMobileClose) {
        onMobileClose();
      } else {
        setInternalMobileOpen(false);
      }
    };

    // Profile menu state
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const profileTriggerRef = useRef<HTMLButtonElement>(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          profileMenuRef.current &&
          !profileMenuRef.current.contains(event.target as Node)
        ) {
          setIsProfileMenuOpen(false);
        }
      };

      if (isProfileMenuOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isProfileMenuOpen]);

    // Handle Escape key
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isProfileMenuOpen) {
            setIsProfileMenuOpen(false);
            profileTriggerRef.current?.focus();
          } else if (isMobileOpen) {
            handleCloseMobile();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isProfileMenuOpen, isMobileOpen]);

    const isPathActive = (itemPath: string) => {
      if (itemPath === '/') {
        return (
          currentPath === '/' ||
          currentPath === '' ||
          currentPath === 'przeglad' ||
          currentPath === '/przeglad'
        );
      }
      return (
        currentPath === itemPath ||
        currentPath.startsWith(itemPath) ||
        currentPath.replace('/', '') === itemPath.replace('/', '')
      );
    };

    return (
      <>
        {/* Mobile Backdrop */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
            onClick={handleCloseMobile}
            aria-hidden="true"
          />
        )}

        <aside
          ref={ref}
          data-testid="sidebar"
          aria-label="Pasek boczny nawigacji"
          className={`
            fixed md:relative z-50 h-full bg-surface-dark text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out select-none
            ${
              isMobileOpen
                ? 'translate-x-0 shadow-2xl'
                : '-translate-x-full md:translate-x-0'
            }
            ${isCollapsed ? 'md:w-sidebar-collapsed w-sidebar' : 'w-sidebar'}
            ${className}
          `}
        >
          {/* Top Brand & Collapse header */}
          <div
            className={`flex ${
              isCollapsed
                ? 'items-center justify-between md:flex-col md:justify-center md:gap-4 px-6 md:px-0 py-6 md:py-8'
                : 'items-center justify-between px-6 py-8'
            } overflow-hidden shrink-0 border-b border-white/5`}
          >
            {/* Logo */}
            <div
              className={`flex items-center gap-3 ${
                isCollapsed ? 'md:justify-center' : ''
              }`}
            >
              <div
                className="w-9 h-9 bg-brand-500 rounded-badge flex items-center justify-center text-white shadow-sm flex-shrink-0"
                aria-hidden="true"
              >
                <Eye size={20} strokeWidth={2.5} />
              </div>
              <div
                className={`flex flex-col whitespace-nowrap ${
                  isCollapsed ? 'md:hidden' : ''
                }`}
              >
                <span className="text-white font-bold text-lg leading-none tracking-tight">
                  WCAG
                </span>
                <span className="text-slate-400 text-micro font-semibold tracking-[0.2em] mt-1 uppercase">
                  Auditor
                </span>
              </div>
            </div>

            {/* Action buttons (collapse on desktop, close on mobile) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleCollapse}
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? 'Rozwiń pasek boczny' : 'Zwiń pasek boczny'}
                title={isCollapsed ? 'Rozwiń menu' : 'Zwiń menu'}
                className="hidden md:flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-dark-hover w-8 h-8 rounded-badge transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {isCollapsed ? (
                  <PanelLeftOpen size={18} aria-hidden="true" />
                ) : (
                  <PanelLeftClose size={18} aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={handleCloseMobile}
                aria-label="Zamknij menu mobilne"
                className="md:hidden text-slate-400 hover:text-white p-1 rounded-badge hover:bg-surface-dark-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav
            role="navigation"
            aria-label="Menu główne"
            className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden"
          >
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const active = isPathActive(item.path);
              const Icon = item.icon;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path);
                    handleCloseMobile();
                  }}
                  aria-current={active ? 'page' : undefined}
                  aria-label={item.label}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'md:justify-center px-4 md:px-0' : 'gap-3 px-4'
                  } py-3 rounded-control font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    active
                      ? 'bg-brand-500 text-white shadow-sm font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-surface-dark-hover'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 ${active ? 'text-white' : 'text-slate-400'}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-sm whitespace-nowrap ${
                      isCollapsed ? 'md:hidden' : ''
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div
            ref={profileMenuRef}
            className="p-4 mt-auto border-t border-white/5 relative"
          >
            {isProfileMenuOpen && (
              <div
                role="menu"
                aria-label="Opcje profilu"
                className={`absolute bottom-full mb-2 bg-[#1e1e2d] border border-slate-700/50 shadow-dropdown rounded-control z-50 py-2 overflow-hidden animate-slide-up transition-all ${
                  isCollapsed ? 'left-4 w-48' : 'left-4 right-4'
                }`}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:bg-slate-800 focus-visible:text-white"
                >
                  <User size={16} className="shrink-0 text-slate-400" aria-hidden="true" />
                  <span>Mój profil</span>
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:bg-slate-800 focus-visible:text-red-300"
                >
                  <LogOut size={16} className="shrink-0" aria-hidden="true" />
                  <span>Wyloguj</span>
                </button>
              </div>
            )}

            <button
              ref={profileTriggerRef}
              type="button"
              aria-haspopup="true"
              aria-expanded={isProfileMenuOpen}
              aria-label="Menu profilu: P. Smułkowski, Administrator"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`w-full flex items-center ${
                isCollapsed ? 'md:justify-center' : 'justify-between px-2'
              } py-2.5 rounded-control hover:bg-surface-dark-hover transition-colors cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                isProfileMenuOpen ? 'bg-surface-dark-hover' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4"
                  alt="P. Smułkowski avatar"
                  className="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 object-cover shrink-0"
                />
                <div
                  className={`flex flex-col text-left whitespace-nowrap min-w-0 ${
                    isCollapsed ? 'md:hidden' : ''
                  }`}
                >
                  <span className="text-white text-sm font-semibold truncate">
                    P. Smułkowski
                  </span>
                  <span className="text-slate-400 text-tiny font-bold uppercase tracking-wider">
                    Admin
                  </span>
                </div>
              </div>

              <MoreVertical
                size={16}
                aria-hidden="true"
                className={`text-slate-400 shrink-0 transition-transform ${
                  isProfileMenuOpen ? 'rotate-90 text-white' : ''
                } ${isCollapsed ? 'md:hidden' : ''}`}
              />
            </button>
          </div>
        </aside>
      </>
    );
  }
);

Sidebar.displayName = 'Sidebar';
