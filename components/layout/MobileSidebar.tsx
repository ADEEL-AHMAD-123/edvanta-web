'use client';

import { useLayout } from './layout-context';
import { SidebarNav } from './SidebarNav';
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';

/** Mobile slide-in drawer (lg:hidden). Shares SidebarNav with desktop. */
export function MobileSidebar() {
  const { mobileOpen, setMobileOpen } = useLayout();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent
        side="left"
        className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:hidden"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
