import type { Metadata } from 'next';
import { StudentFeesView } from '@/components/portal/StudentViews';

export const metadata: Metadata = { title: 'My Fees' };

export default function Page() {
  return <StudentFeesView />;
}
