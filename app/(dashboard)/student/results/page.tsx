import type { Metadata } from 'next';
import { StudentResultsView } from '@/components/portal/StudentViews';

export const metadata: Metadata = { title: 'My Results' };

export default function Page() {
  return <StudentResultsView />;
}
