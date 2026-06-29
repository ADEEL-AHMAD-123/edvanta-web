import type { Metadata } from 'next';
import { ChildrenView } from '@/components/portal/ParentViews';

export const metadata: Metadata = { title: 'My Children' };

export default function Page() {
  return <ChildrenView />;
}
