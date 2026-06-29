import type { Metadata } from 'next';
import { PlatformAnalyticsView } from '@/components/superadmin/PlatformAnalyticsView';

export const metadata: Metadata = { title: 'Analytics' };

export default function Page() {
  return <PlatformAnalyticsView />;
}
