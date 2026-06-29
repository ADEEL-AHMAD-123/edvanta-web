'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthBootstrap } from '@/components/auth/AuthBootstrap';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthBootstrap>{children}</AuthBootstrap>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            // Token-driven so toasts re-theme with the app.
            style: {
              background: 'hsl(var(--popover))',
              color: 'hsl(var(--popover-foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--success))',
                secondary: 'hsl(var(--card))',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(var(--danger))',
                secondary: 'hsl(var(--card))',
              },
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
}
