import type { Metadata } from 'next';
import { StudentDashboardView } from '@/components/students/StudentDashboardView';

export const metadata: Metadata = { title: 'Student Dashboard' };

export default function Page() {
  return <StudentDashboardView />;
}
