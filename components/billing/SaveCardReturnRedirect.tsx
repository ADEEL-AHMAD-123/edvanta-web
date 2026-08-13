'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * See save-card-return/page.tsx's own comment for the full "why" — this
 * just forwards whatever Safepay actually gave us (in practice: `tracker`)
 * on to `/admin/billing` with `autorenew=1` re-added ourselves, so
 * BillingView's reconciliation effect can reliably tell this apart from a
 * regular payment return trip.
 */
export function SaveCardReturnRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tracker = searchParams.get('tracker');
    const qs = new URLSearchParams();
    qs.set('autorenew', '1');
    if (tracker) qs.set('tracker', tracker);
    router.replace(`/admin/billing?${qs.toString()}`);
  }, [searchParams, router]);

  return null;
}
