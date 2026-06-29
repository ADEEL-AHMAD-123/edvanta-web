import type { Metadata } from 'next';
import { BillingView } from '@/components/billing/BillingView';

export const metadata: Metadata = { title: 'Billing' };

export default function Page() {
  return <BillingView />;
}
