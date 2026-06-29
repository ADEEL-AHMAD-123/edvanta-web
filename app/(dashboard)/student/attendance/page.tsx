import type { Metadata } from 'next';
import { StudentAttendanceView } from '@/components/portal/StudentViews';

export const metadata: Metadata = { title: 'My Attendance' };

export default function Page() {
  return <StudentAttendanceView />;
}
