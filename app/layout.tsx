import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ThemeScript } from '@/components/theme/ThemeScript';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: '%s | Edvanta',
    default: 'Edvanta — School & Campus Management Software',
  },
  description: 'The complete management platform for educational institutions in Pakistan',
  keywords: ['education ERP', 'institution management', 'academy software', 'college management', 'Pakistan'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
