import type { Metadata } from 'next';
import { ParentDashboardView } from '@/components/portal/ParentDashboardView';

export const metadata: Metadata = { title: 'Parent Dashboard' };

export default function Page() {
  return <ParentDashboardView />;
}
