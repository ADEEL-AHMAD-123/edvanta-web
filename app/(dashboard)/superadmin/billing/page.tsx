import type { Metadata } from 'next';
import { PendingPaymentsView } from '@/components/billing/PendingPaymentsView';

export const metadata: Metadata = { title: 'Subscription Payments' };

export default function Page() {
  return <PendingPaymentsView />;
}
