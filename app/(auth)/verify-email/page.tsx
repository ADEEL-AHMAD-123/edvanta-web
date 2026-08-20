import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmailView } from '@/components/auth/VerifyEmailView';

export const metadata: Metadata = { title: 'Verify Email' };

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailView />
    </Suspense>
  );
}
