import type { Metadata } from 'next';
import { InstitutionsView } from '@/components/superadmin/InstitutionsView';

export const metadata: Metadata = { title: 'Institutions' };

export default function Page() {
  return <InstitutionsView />;
}
