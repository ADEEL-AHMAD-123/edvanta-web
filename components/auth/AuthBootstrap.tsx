'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';

/**
 * On first load, silently calls /auth/refresh using the httpOnly refresh
 * cookie to restore the session. This prevents a page refresh from logging
 * the user out (access tokens live in memory only). Renders a splash until
 * the attempt resolves so protected layouts don't redirect prematurely.
 */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const base =
          process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${base}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (res.ok) {
          const json = await res.json();
          if (active && json?.data?.accessToken && json?.data?.user) {
            dispatch(
              setCredentials({
                user: json.data.user,
                accessToken: json.data.accessToken,
              })
            );
          }
        }
      } catch {
        /* no valid session — user stays logged out */
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [dispatch]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
