'use client';

import { useParams } from 'next/navigation';
import { InstitutionDetailView } from '@/components/superadmin/InstitutionDetailView';

export default function Page() {
  const params = useParams<{ id: string }>();
  return <InstitutionDetailView id={params.id} />;
}
