import type { Metadata } from 'next';
import { SuperadminDashboard } from '@/components/dashboards/SuperadminDashboard';

export const metadata: Metadata = { title: 'Platform Dashboard' };

export default function Page() {
  return <SuperadminDashboard />;
}
