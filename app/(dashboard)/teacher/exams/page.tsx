import type { Metadata } from 'next';
import { ExamsView } from '@/components/exams/ExamsView';

export const metadata: Metadata = { title: 'Exams' };

export default function Page() {
  return <ExamsView title="Exams & Results" />;
}
