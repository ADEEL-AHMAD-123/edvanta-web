import type { Metadata } from 'next';
import { RevenueView } from '@/components/superadmin/RevenueView';

export const metadata: Metadata = { title: 'Revenue' };

export default function Page() {
  return <RevenueView />;
}
