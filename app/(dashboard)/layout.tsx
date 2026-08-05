'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';
import { Navbar } from '@/components/layout/Navbar';
import { LayoutProvider } from '@/components/layout/layout-context';
import { ForcePasswordChangeGate } from '@/components/auth/ForcePasswordChangeGate';
import { useAppSelector } from '@/store/hooks';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, accessToken } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!accessToken || !user) {
      router.replace('/login');
    }
  }, [accessToken, user, router]);

  if (!user || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user.mustChangePassword) {
    return <ForcePasswordChangeGate />;
  }

  return (
    <LayoutProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <MobileSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto w-full max-w-7xl animate-fade-in">{children}</div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
