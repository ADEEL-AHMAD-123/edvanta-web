import type { Metadata } from 'next';
import { PlansView } from '@/components/superadmin/PlansView';

export const metadata: Metadata = { title: 'Plans' };

export default function Page() {
  return <PlansView />;
}
