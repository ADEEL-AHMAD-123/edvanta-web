'use client';

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
      <SidebarNav collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
    </aside>
  );
}
