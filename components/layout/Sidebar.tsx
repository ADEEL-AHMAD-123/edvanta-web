'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayout } from './layout-context';
import { SidebarNav } from './SidebarNav';

/** Desktop sidebar — hidden below lg, collapsible to an icon rail. */
export function Sidebar() {
  const { collapsed, toggleCollapsed } = useLayout();

  return (
    <aside
      className={cn(
        'relative hidden shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out lg:block',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <SidebarNav collapsed={collapsed} />

      <button
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
