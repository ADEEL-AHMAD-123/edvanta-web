import type { Metadata } from 'next';
import { TimetableView } from '@/components/timetable/TimetableView';

export const metadata: Metadata = { title: 'Timetable' };

export default function Page() {
  return <TimetableView />;
}
