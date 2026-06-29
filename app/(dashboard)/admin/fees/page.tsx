import type { Metadata } from 'next';
import { FeesView } from '@/components/fees/FeesView';

export const metadata: Metadata = { title: 'Fees' };

export default function Page() {
  return <FeesView />;
}
