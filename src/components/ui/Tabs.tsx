import React, { createContext, useContext, useId, useState, forwardRef, useRef } from 'react';

interface TabsContextValue {
  activeIndex: number;
  selectTab: (index: number) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab components must be used within a TabGroup');
  }
  return context;
}

export interface TabGroupProps {
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  children: React.ReactNode;
  className?: string;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  defaultIndex = 0,
  selectedIndex,
  onChange,
  children,
  className = '',
}) => {
  const [uncontrolledIndex, setUncontrolledIndex] = useState(defaultIndex);
  const isControlled = selectedIndex !== undefined;
  const activeIndex = isControlled ? selectedIndex : uncontrolledIndex;
  const baseId = useId();

  const selectTab = (index: number) => {
    if (!isControlled) {
      setUncontrolledIndex(index);
    }
    onChange?.(index);
  };

  return (
    <TabsContext.Provider value={{ activeIndex, selectTab, baseId }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabList: React.FC<TabListProps> = ({
  children,
  className = '',
  onKeyDown,
  ...rest
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!listRef.current) return;
    const tabs = Array.from(
      listRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
    );
    if (!tabs.length) return;

    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      onKeyDown?.(e);
      return;
    }

    e.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
    onKeyDown?.(e);
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={`flex gap-1 bg-slate-100 p-1 rounded-control ${className}`}
      {...rest}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<TabProps>, {
          index: (child.props as TabProps).index ?? index,
        });
      })}
    </div>
  );
};

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  index?: number;
  children: React.ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ index = 0, children, className = '', onClick, ...rest }, ref) => {
    const { activeIndex, selectTab, baseId } = useTabs();
    const isSelected = activeIndex === index;
    const tabId = `${baseId}-tab-${index}`;
    const panelId = `${baseId}-panel-${index}`;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        aria-selected={isSelected}
        aria-controls={panelId}
        tabIndex={isSelected ? 0 : -1}
        onClick={(e) => {
          selectTab(index);
          onClick?.(e);
        }}
        className={`px-4 py-2 text-sm font-bold rounded-badge transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
          isSelected
            ? 'bg-white text-brand-500 shadow-sm'
            : 'text-slate-600 hover:text-slate-900'
        } ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

Tab.displayName = 'Tab';

export interface TabPanelsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const TabPanels: React.FC<TabPanelsProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <div className={`mt-3 ${className}`} {...rest}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child as React.ReactElement<TabPanelProps>, {
          index: (child.props as TabPanelProps).index ?? index,
        });
      })}
    </div>
  );
};

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  index?: number;
  children: React.ReactNode;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  index = 0,
  children,
  className = '',
  ...rest
}) => {
  const { activeIndex, baseId } = useTabs();
  const isSelected = activeIndex === index;
  if (!isSelected) return null;

  const tabId = `${baseId}-tab-${index}`;
  const panelId = `${baseId}-panel-${index}`;

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={tabId}
      tabIndex={0}
      className={`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-control ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};
