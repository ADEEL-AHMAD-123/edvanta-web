import type { Metadata } from 'next';
import { ReportsView } from '@/components/reports/ReportsView';

export const metadata: Metadata = { title: 'Reports' };

export default function Page() {
  return <ReportsView />;
}
