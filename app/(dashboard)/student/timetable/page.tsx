import type { Metadata } from 'next';
import { MyTimetableView } from '@/components/timetable/MyTimetableView';

export const metadata: Metadata = { title: 'Timetable' };

export default function Page() {
  return <MyTimetableView role="student" />;
}
