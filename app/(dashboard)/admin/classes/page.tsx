import type { Metadata } from 'next';
import { ClassesView } from '@/components/classes/ClassesView';

export const metadata: Metadata = { title: 'Classes' };

export default function Page() {
  return <ClassesView />;
}
