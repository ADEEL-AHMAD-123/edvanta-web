import type { Metadata } from 'next';
import { IdCardsView } from '@/components/students/IdCardsView';

export const metadata: Metadata = { title: 'ID Cards' };

export default function Page() {
  return <IdCardsView />;
}
