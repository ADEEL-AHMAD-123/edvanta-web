'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { cn, getInitials } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';
import { LogoMark } from '@/components/brand/Logo';

interface SidebarNavProps {
  collapsed?: boolean;
  /** Called after a nav link is clicked (used to close the mobile drawer). */
  onNavigate?: () => void;
  /** Desktop collapse toggle — omitted in the mobile drawer, which has no
   *  collapsed state of its own. */
  onToggleCollapsed?: () => void;
}

export function SidebarNav({ collapsed = false, onNavigate, onToggleCollapsed }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);

  const role = user?.role || 'admin';
  const items = NAV_ITEMS[role] || NAV_ITEMS.admin;

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={cn(
          'flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border px-4',
          collapsed && 'justify-center px-0'
        )}
      >
        <LogoMark size={34} variant="plain" className="shrink-0" />
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">Edvanta</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2.5 py-4">
        {items.map(({ label, href, icon: Icon }, index) => {
          // The first item is the role's index/dashboard route, which is a
          // prefix of every other route — so it should match exactly only.
          const isIndex = index === 0;
          const active = isIndex
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                collapsed && 'justify-center px-0',
                active
                  ? 'bg-sidebar-active text-sidebar-active-foreground shadow-sm'
                  : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="border-t border-sidebar-border p-3">
          <div
            className={cn(
              'flex items-center gap-3 px-2 py-2',
              collapsed && 'justify-center px-0'
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-active text-sm font-semibold text-sidebar-active-foreground">
              {getInitials(user.firstName, user.lastName)}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs capitalize text-sidebar-muted">{user.role}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapse toggle — a dedicated footer row instead of a floating
          button, so it never overlaps content and is easy to find. */}
      {onToggleCollapsed && (
        <button
          onClick={onToggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={cn(
            'flex shrink-0 items-center gap-3 border-t border-sidebar-border px-3 py-3 text-sm font-medium text-sidebar-muted transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? <ChevronsRight size={18} className="shrink-0" /> : <ChevronsLeft size={18} className="shrink-0" />}
          {!collapsed && <span className="truncate">Collapse</span>}
        </button>
      )}
    </div>
  );
}
