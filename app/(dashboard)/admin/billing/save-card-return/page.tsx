import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SaveCardReturnRedirect } from '@/components/billing/SaveCardReturnRedirect';

export const metadata: Metadata = { title: 'Billing' };

/**
 * Dedicated return URL for the "save a card" (auto-renewal enrollment) flow
 * — a distinct PATH, not just a `?autorenew=1` query flag on the regular
 * `/admin/billing` page. That flag was how BillingView used to tell "coming
 * back from a real payment" apart from "coming back from a card-save"
 * (both return with the same `?tracker=...` shape), but real Safepay
 * redirects confirmed it only reliably preserves `tracker` and drops
 * whatever other query params we put on `returnUrl` — so `autorenew=1` was
 * silently lost on the way back, and the return trip was misread as a
 * payment (looked up a Payment record for a tracker that only ever existed
 * as an instrument-session, got a 404 loop from `/billing/verify`).
 *
 * A URL's path always survives a redirect (the gateway has to keep it to
 * know where to send the browser back to at all) even if its query string
 * doesn't, so this page exists purely to receive that guaranteed part and
 * hand off to BillingView with the flag re-added ourselves, client-side,
 * where we're not at the mercy of what Safepay chooses to preserve.
 */
export default function Page() {
  return (
    <Suspense>
      <SaveCardReturnRedirect />
    </Suspense>
  );
}
