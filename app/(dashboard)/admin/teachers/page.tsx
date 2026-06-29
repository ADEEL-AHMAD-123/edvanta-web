import type { Metadata } from 'next';
import { TeachersView } from '@/components/teachers/TeachersView';

export const metadata: Metadata = { title: 'Teachers' };

export default function Page() {
  return <TeachersView />;
}
