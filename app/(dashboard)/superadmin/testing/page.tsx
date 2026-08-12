import type { Metadata } from 'next';
import { TestingView } from '@/components/superadmin/TestingView';

export const metadata: Metadata = { title: 'Testing' };

export default function Page() {
  return <TestingView />;
}
