import type { Metadata } from 'next';
import { StudentSubjectsView } from '@/components/portal/StudentSubjectsView';

export const metadata: Metadata = { title: 'My Subjects' };

export default function Page() {
  return <StudentSubjectsView />;
}
