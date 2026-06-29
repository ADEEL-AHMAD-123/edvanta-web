import type { Metadata } from 'next';
import { AcademicYearView } from '@/components/academic/AcademicYearView';

export const metadata: Metadata = { title: 'Academic Year' };

export default function Page() {
  return <AcademicYearView />;
}
