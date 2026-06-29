import type { Metadata } from 'next';
import { TeacherClassesView } from '@/components/portal/TeacherClassesView';

export const metadata: Metadata = { title: 'My Classes' };

export default function Page() {
  return <TeacherClassesView />;
}
