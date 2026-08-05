import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BillingView } from '@/components/billing/BillingView';

export const metadata: Metadata = { title: 'Billing' };

export default function Page() {
  return (
    <Suspense>
      <BillingView />
    </Suspense>
  );
}
