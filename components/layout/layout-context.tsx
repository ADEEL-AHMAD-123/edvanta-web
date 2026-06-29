'use client';

import { createContext, useContext, useState } from 'react';

interface LayoutContextValue {
  /** Desktop sidebar collapsed (icon-only) state. */
  collapsed: boolean;
  toggleCollapsed: () => void;
  /** Mobile drawer open state. */
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        collapsed,
        toggleCollapsed: () => setCollapsed((c) => !c),
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const ctx = useContext(LayoutContext);
  if (!ctx) throw new Error('useLayout must be used within <LayoutProvider>');
  return ctx;
}
