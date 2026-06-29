import type { Metadata } from 'next';
import { ParentScopedView } from '@/components/portal/ParentViews';

export const metadata: Metadata = { title: "Child's Results" };

export default function Page() {
  return <ParentScopedView kind="results" />;
}
