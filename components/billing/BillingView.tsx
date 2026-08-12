'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  CreditCard, Building2, Info, Copy, CheckCircle2, Sparkles, Check, ArrowLeft, AlertTriangle,
  Wallet, Clock, ShieldCheck, RefreshCw, XCircle, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Table, TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import {
  useGetMyBillingQuery, useGetBillingPlansQuery, useSelectPlanMutation,
  useBillingCheckoutMutation, useVerifyPaymentMutation, useSubmitBankTransferMutation,
  useLazyGetMyPaymentsQuery, useStartAutoRenewMutation, useConfirmAutoRenewMutation, useDisableAutoRenewMutation,
  type Gateway, type MyBilling, type BillingPayment,
} from '@/store/api/billingApi';

// `myBilling()` already returns page 1 of payment history at this page
// size — "Load more" fetches subsequent pages at the same size so they
// line up with no gap or overlap.
const PAYMENTS_PAGE_SIZE = 10;

const statusBadge: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
  active: 'success', trial: 'primary', past_due: 'warning', suspended: 'danger', cancelled: 'neutral', expired: 'neutral',
};
const payBadge: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  success: 'success', pending: 'warning', failed: 'danger', refunded: 'neutral',
};
const payIcon: Record<string, React.ElementType> = {
  success: CheckCircle2, pending: Clock, failed: XCircle, refunded: RefreshCw,
};

const gatewayLabel: Record<Gateway, string> = {
  safepay: 'Pay with Safepay',
  jazzcash: 'Pay with JazzCash',
  easypaisa: 'Pay with EasyPaisa',
};

const declineReasonLabel: Record<string, string> = {
  insufficient_funds: 'insufficient funds',
  expired_card: 'the card has expired',
  card_blocked: 'the card was declined by the issuer',
  auth_failed: 'authentication failed',
  gateway_error: 'a temporary payment gateway issue',
  other: 'the card issuer',
};

type Step = 'summary' | 'plans' | 'payment';

const STEPS: { key: Step; label: string }[] = [
  { key: 'summary', label: 'Overview' },
  { key: 'plans', label: 'Choose plan' },
  { key: 'payment', label: 'Pay' },
];

export function BillingView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, isLoading, isError, refetch } = useGetMyBillingQuery();
  const b = data?.data;
  const { data: plansRes } = useGetBillingPlansQuery();
  const plans = plansRes?.data ?? [];
  const [selectPlan, { isLoading: selectingPlan }] = useSelectPlanMutation();
  const [checkout, { isLoading: checkingOut }] = useBillingCheckoutMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [submitTransfer, { isLoading: submitting }] = useSubmitBankTransferMutation();
  const [startAutoRenew, { isLoading: startingAutoRenew }] = useStartAutoRenewMutation();
  const [confirmAutoRenew] = useConfirmAutoRenewMutation();
  const [disableAutoRenew, { isLoading: disablingAutoRenew }] = useDisableAutoRenewMutation();
  const [reference, setReference] = useState('');
  const [step, setStep] = useState<Step>('summary');
  const [reconciling, setReconciling] = useState(false);
  const verifiedRef = useRef(false);

  // "Load more" payment history — page 1 already came inline with
  // getMyBilling; this appends subsequent pages at the same page size.
  const [extraPayments, setExtraPayments] = useState<BillingPayment[]>([]);
  const [paymentsPage, setPaymentsPage] = useState(2);
  const [fetchPayments, { isFetching: loadingMorePayments }] = useLazyGetMyPaymentsQuery();
  const loadMorePayments = async () => {
    const res = await fetchPayments({ page: paymentsPage, limit: PAYMENTS_PAGE_SIZE }).unwrap();
    setExtraPayments((prev) => [...prev, ...res.data.items]);
    setPaymentsPage((p) => p + 1);
  };

  // Reconciliation fallback: Safepay appends ?tracker=... to our return URL
  // when the payer comes back from the hosted checkout page. Don't rely on
  // the webhook alone (it can be delayed, or never configured) — actively
  // check the real status here so the admin isn't stuck looking at "pending"
  // after a payment that actually succeeded.
  useEffect(() => {
    const tracker = searchParams.get('tracker');
    if (!tracker || verifiedRef.current) return;
    verifiedRef.current = true;
    setReconciling(true);
    // Our own returnUrl for the save-card flow carries `?autorenew=1` so we
    // can tell "returning from a one-off payment" apart from "returning
    // from saving a card for auto-renewal" — they need different endpoints
    // and different confirmation messages even though both come back with
    // the same `?tracker=...` shape from Safepay.
    const isAutoRenewSetup = searchParams.get('autorenew') === '1';

    (async () => {
      if (isAutoRenewSetup) {
        try {
          const res = await confirmAutoRenew({ gatewayTxnId: tracker }).unwrap();
          if (res.data.ok) {
            toast.success('Auto-renewal enabled — your card is saved securely with Safepay');
          } else {
            toast.error(res.data.reason || 'Card setup did not complete — please try again');
          }
        } catch (e: any) {
          toast.error(e?.data?.error?.message || 'Card setup did not complete — please try again');
        }
        setReconciling(false);
        router.replace(pathname);
        return;
      }

      // A couple of quick retries in case the gateway's own record hasn't
      // caught up yet (a few seconds' lag is normal right after redirect).
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const res = await verifyPayment({ gateway: 'safepay', gatewayTxnId: tracker }).unwrap();
          if (res.data.status === 'success') {
            toast.success('Payment received — subscription updated');
            break;
          }
          if (res.data.status === 'failed') {
            toast.error('That payment did not complete — please try again');
            break;
          }
          if (res.data.status === 'refunded') {
            toast('This payment was refunded', { icon: 'ℹ️' });
            break;
          }
        } catch {
          // keep retrying — the payment row may not be visible yet
        }
        if (attempt < 3) await new Promise((r) => setTimeout(r, 2000));
      }
      setReconciling(false);
      router.replace(pathname);
    })();
  }, [searchParams, verifyPayment, confirmAutoRenew, router, pathname]);

  if (isLoading || reconciling) {
    return (
      <div className="space-y-6">
        <PageHeader title="Billing & Subscription" description="Your Edvanta plan and payments." />
        {reconciling && (
          <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary-soft/40 px-4 py-3 text-sm text-primary">
            <RefreshCw size={16} className="animate-spin" /> Confirming your payment with the gateway…
          </div>
        )}
        <Card className="p-5"><Skeleton className="h-48 w-full" /></Card>
      </div>
    );
  }

  if (isError || !b) {
    return (
      <div className="space-y-6">
        <PageHeader title="Billing & Subscription" description="Your Edvanta plan and payments." />
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <AlertTriangle size={28} className="text-danger" />
          <p className="text-sm font-medium text-foreground">Couldn't load your billing details</p>
          <p className="text-xs text-muted-foreground">Check your connection and try again.</p>
          <Button size="sm" variant="secondary" onClick={() => refetch()}><RefreshCw size={14} /> Retry</Button>
        </Card>
      </div>
    );
  }

  const free = b.planPrice <= 0;
  const needsPayment = !free && b.status !== 'active' && !b.pendingPlan;
  // Informational only — nothing on the backend enforces this, so it's
  // purely a nudge to pick a paid plan once the welcome trial window has
  // passed while still on the free plan. Never blocks anything.
  const trialExpired = free && !!b.trialEndsAt && new Date(b.trialEndsAt) < new Date();
  const liveGateways = (Object.keys(gatewayLabel) as Gateway[]).filter((g) => b.online[g]);

  const payOnline = async (gateway: Gateway) => {
    try {
      const res = await checkout({ gateway }).unwrap();
      // Never assume success by default — only two outcomes count as "ok":
      // the gateway actually settled it (mock/dev), or it handed back a real
      // redirect to complete payment on. Anything else is an error, even if
      // the request itself didn't throw.
      if (res.data.settled) {
        toast.success('Payment received — subscription updated');
        setStep('summary');
        return;
      }
      if (res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
        return;
      }
      toast.error('Could not start payment — please try again or use bank transfer');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not start payment');
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim()) return toast.error('Enter the transfer reference / transaction ID');
    try {
      await submitTransfer({ reference: reference.trim() }).unwrap();
      toast.success('Submitted — we\'ll confirm and update your subscription shortly');
      setReference('');
      setStep('summary');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not submit');
    }
  };

  const copy = (v: string) => { navigator.clipboard?.writeText(v); toast.success('Copied'); };

  const choosePlan = async (planKey: string) => {
    try {
      const res = await selectPlan({ planKey }).unwrap();
      const { effective, overStudentLimit } = res.data;
      if (effective === 'pending_payment') {
        toast.success('Plan selected — pay to activate it');
        setStep('payment'); // walk the admin straight to payment
      } else if (effective === 'next_renewal') {
        if (overStudentLimit) {
          toast(
            `Scheduled — but you currently have ${overStudentLimit} more active student${overStudentLimit === 1 ? '' : 's'} than this plan allows. You won't be able to add new students once it takes effect until you're back under the limit.`,
            { icon: '⚠️', duration: 7000 }
          );
        } else {
          toast.success('Got it — this takes effect at your next renewal, no payment needed now');
        }
        setStep('summary');
      } else {
        toast.success('Plan updated');
        setStep('summary');
      }
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not update plan');
    }
  };

  const onEnableAutoRenew = async () => {
    try {
      const res = await startAutoRenew().unwrap();
      // Same "never assume success" rule as payOnline() — this only ever
      // hands back a redirect to Safepay's card-save flow, there's no
      // auto-settled shortcut for saving a card.
      if (res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
        return;
      }
      toast.error('Could not start card setup — please try again');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not start card setup');
    }
  };

  const onDisableAutoRenew = async () => {
    if (!window.confirm('Turn off auto-renewal? Your saved card will be removed and you\'ll need to pay manually going forward.')) return;
    try {
      await disableAutoRenew().unwrap();
      toast.success('Auto-renewal turned off');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not turn off auto-renewal');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Subscription" description="Your Edvanta plan and payments." />
      <Stepper step={step} />

      {step === 'summary' && (
        <SummaryStep
          b={b}
          free={free}
          needsPayment={needsPayment}
          trialExpired={trialExpired}
          onChangePlan={() => setStep('plans')}
          onPay={() => setStep('payment')}
          onCancelScheduled={() => choosePlan(b.plan)}
          extraPayments={extraPayments}
          onLoadMorePayments={loadMorePayments}
          loadingMorePayments={loadingMorePayments}
          onEnableAutoRenew={onEnableAutoRenew}
          onDisableAutoRenew={onDisableAutoRenew}
          startingAutoRenew={startingAutoRenew}
          disablingAutoRenew={disablingAutoRenew}
        />
      )}

      {step === 'plans' && (
        <PlansStep
          plans={plans}
          currentPlan={b.plan}
          pendingPlan={b.pendingPlan}
          scheduledPlan={b.scheduledPlan}
          selecting={selectingPlan}
          onBack={() => setStep('summary')}
          onChoose={choosePlan}
        />
      )}

      {step === 'payment' && (
        <PaymentStep
          b={b}
          liveGateways={liveGateways}
          checkingOut={checkingOut}
          submitting={submitting}
          reference={reference}
          setReference={setReference}
          onBack={() => setStep('summary')}
          onPayOnline={payOnline}
          onSubmitTransfer={submit}
          onCopy={copy}
        />
      )}
    </div>
  );
}

/* ── A small stepper so the flow always reads as "one thing at a time" ─── */
function Stepper({ step }: { step: Step }) {
  const activeIndex = STEPS.findIndex((s) => s.key === step);
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1.5">
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1',
              i === activeIndex && 'bg-primary-soft text-primary-soft-foreground',
              i < activeIndex && 'text-foreground'
            )}
          >
            <span
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded-full text-[10px]',
                i <= activeIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}
            >
              {i < activeIndex ? <Check size={10} /> : i + 1}
            </span>
            {s.label}
          </span>
          {i < STEPS.length - 1 && <ChevronRight size={13} className="text-muted-foreground/50" />}
        </div>
      ))}
    </div>
  );
}

/* ── Step 1: summary — the landing view, with clear next actions ────────── */
function SummaryStep({
  b, free, needsPayment, trialExpired, onChangePlan, onPay, onCancelScheduled,
  extraPayments, onLoadMorePayments, loadingMorePayments,
  onEnableAutoRenew, onDisableAutoRenew, startingAutoRenew, disablingAutoRenew,
}: {
  b: MyBilling;
  free: boolean;
  needsPayment: boolean;
  trialExpired: boolean;
  onChangePlan: () => void;
  onPay: () => void;
  onCancelScheduled: () => void;
  extraPayments: BillingPayment[];
  onLoadMorePayments: () => void;
  loadingMorePayments: boolean;
  onEnableAutoRenew: () => void;
  onDisableAutoRenew: () => void;
  startingAutoRenew: boolean;
  disablingAutoRenew: boolean;
}) {
  const allPayments = [...b.payments, ...extraPayments];
  const hasMorePayments = allPayments.length < b.paymentsTotal;
  return (
    <div className="space-y-6">
      {/* Exactly one banner can ever show — pending plan change takes
          priority over an outstanding renewal, since it's the more specific
          and more recent thing needing attention. Never show both at once,
          and never let their numbers appear anywhere near the plan card
          below (that's what caused the "Enterprise costs Rs 6,000?"
          confusion). */}
      {b.pendingPlan ? (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary-soft/40 px-4 py-3.5 text-sm text-primary sm:flex-row sm:items-start">
          <Info size={17} className="mt-0.5 shrink-0" />
          <span className="flex-1">
            You've selected the <strong className="capitalize">{b.pendingPlan}</strong> plan —{' '}
            <strong>{formatCurrency(b.amountDue)}/{b.billingCycle === 'annual' ? 'yr' : 'mo'}</strong>.
            It won't take effect until payment is completed. You're still on{' '}
            <strong className="capitalize">{b.plan}</strong> for now, and nothing has been charged.
          </span>
          <Button size="sm" onClick={onPay}>Complete payment</Button>
        </div>
      ) : b.scheduledPlan ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/50 px-4 py-3.5 text-sm text-foreground">
          <Info size={17} className="mt-0.5 shrink-0 text-muted-foreground" />
          <span className="flex-1">
            You're moving to the <strong className="capitalize">{b.scheduledPlan}</strong> plan
            {b.nextBillingAt && <> on <strong>{formatDate(b.nextBillingAt)}</strong></>} — no payment
            needed, you'll keep <strong className="capitalize">{b.plan}</strong> until then.
          </span>
          <Button size="sm" variant="ghost" onClick={onCancelScheduled}>Cancel</Button>
        </div>
      ) : needsPayment ? (
        <div className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3.5 text-sm text-warning sm:flex-row sm:items-start">
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <span className="flex-1">
            Your <strong className="capitalize">{b.plan}</strong> plan payment of{' '}
            <strong>{formatCurrency(b.amountDue)}</strong> is outstanding.
          </span>
          <Button size="sm" onClick={onPay}>Pay now</Button>
        </div>
      ) : trialExpired ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3.5 text-sm text-foreground sm:flex-row sm:items-start">
          <Info size={17} className="mt-0.5 shrink-0 text-muted-foreground" />
          <span className="flex-1">
            Your trial period has ended — you're still on the <strong className="capitalize">{b.plan}</strong> plan
            with no changes to your account. Take a look at paid plans whenever you're ready to unlock more.
          </span>
          <Button size="sm" variant="secondary" onClick={onChangePlan}>View plans</Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Wallet size={14} /> Current plan</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-bold capitalize text-foreground">{b.plan}</p>
            {!free && <p className="text-sm text-muted-foreground">{formatCurrency(b.planPrice)}/{b.billingCycle === 'annual' ? 'yr' : 'mo'}</p>}
          </div>
          <Badge variant={statusBadge[b.status] ?? 'neutral'} className="mt-2 capitalize">{b.status.replace('_', ' ')}</Badge>
        </Card>
        <Card className="p-5">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock size={14} /> Next renewal</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{free ? '—' : b.nextBillingAt ? formatDate(b.nextBillingAt) : '—'}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {free ? 'Free plan — nothing to renew' : b.lastPaymentAt ? `Last paid ${formatDateTime(b.lastPaymentAt)}` : 'No payments yet'}
          </p>
        </Card>
      </div>

      {/* One clear primary action depending on state, never several
          competing buttons that all sort of do the same thing. */}
      <div className="flex flex-wrap gap-2">
        {free && (
          <Button onClick={onChangePlan}><Sparkles size={16} /> Choose a paid plan</Button>
        )}
        {!free && !b.pendingPlan && (
          <Button variant="secondary" onClick={onChangePlan}><Sparkles size={16} /> Change plan</Button>
        )}
        {!free && b.pendingPlan && (
          <Button variant="secondary" onClick={onChangePlan}><Sparkles size={16} /> Choose a different plan</Button>
        )}
        {!free && !needsPayment && !b.pendingPlan && (
          <Button variant="ghost" onClick={onPay}><CreditCard size={16} /> Renew early</Button>
        )}
      </div>

      {/* Auto-renewal — a distinct opt-in, never shown for the free plan
          (nothing to auto-charge). The "Save a card" entry point is gated
          on the feature flag, but the card itself (and the "Turn off"
          action specifically) still renders for anyone who's ALREADY
          enrolled even if the flag gets turned off later — otherwise an
          institution that opted in before a platform-side pause would have
          no way to see or disable their own auto-renewal state. */}
      {!free && (b.autoRenewalAvailable || b.autoRenew) && (
        <Card className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-2.5">
              <RefreshCw size={17} className="mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Auto-renewal</p>
                {b.autoRenew && b.savedCard ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    We'll automatically charge <strong className="text-foreground">{b.savedCard.brand ?? 'your card'} •••• {b.savedCard.last4 ?? '····'}</strong>
                    {b.savedCard.expiry && <> (expires {b.savedCard.expiry})</>} on your renewal date — no need to pay manually.
                  </p>
                ) : (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Save a card once and we'll charge it automatically each renewal — no more remembering to pay manually.
                    You can turn this off any time.
                  </p>
                )}
              </div>
            </div>
            {b.autoRenew ? (
              <Button size="sm" variant="ghost" loading={disablingAutoRenew} onClick={onDisableAutoRenew}>Turn off</Button>
            ) : (
              <Button size="sm" variant="secondary" loading={startingAutoRenew} onClick={onEnableAutoRenew}>
                <CreditCard size={14} /> Save a card
              </Button>
            )}
          </div>
          {/* Visible dunning state — if recent auto-charge attempts have
              failed, say so plainly rather than letting it fail silently
              until the account eventually goes past-due with no context. */}
          {b.autoRenew && b.autoChargeFailCount > 0 && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-warning">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              <span>
                Your saved card was declined on the last {b.autoChargeFailCount === 1 ? 'attempt' : `${b.autoChargeFailCount} attempts`}
                {b.lastChargeAttempt?.reasonCode && <> — reported reason: {declineReasonLabel[b.lastChargeAttempt.reasonCode] ?? 'declined by the card issuer'}</>} —
                we'll keep retrying automatically for a few days. If it keeps failing, you can pay manually below or update your card.
              </span>
            </div>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Payment history</CardTitle>
          <CardDescription>Every payment attempt for your subscription, most recent first.</CardDescription>
        </CardHeader>
        <CardContent>
          {allPayments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Wallet size={22} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            </div>
          ) : (
            <>
              <TableWrapper>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Date & time</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allPayments.map((p, i) => {
                      const Icon = payIcon[p.status] ?? Clock;
                      return (
                        <TableRow key={p.id ?? i}>
                          <TableCell className="whitespace-nowrap text-muted-foreground">{formatDateTime(p.paidAt ?? p.createdAt)}</TableCell>
                          <TableCell className="font-medium text-foreground">{formatCurrency(p.amount)}</TableCell>
                          <TableCell className="capitalize text-muted-foreground">{p.gateway}</TableCell>
                          <TableCell className="max-w-[160px] truncate text-muted-foreground" title={p.reference ?? ''}>{p.reference ?? '—'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge variant={payBadge[p.status]} className="capitalize">
                                <Icon size={11} /> {p.status}
                              </Badge>
                              {p.disputed && (
                                <Badge variant="danger" title="A chargeback was reported for this payment — under review">
                                  <AlertTriangle size={11} /> Disputed
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableWrapper>
              {hasMorePayments && (
                <div className="flex justify-center pt-4">
                  <Button size="sm" variant="secondary" loading={loadingMorePayments} onClick={onLoadMorePayments}>
                    Load more ({allPayments.length} of {b.paymentsTotal})
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 2: plans — shown only when the admin asks to view/change plans ── */
function PlansStep({
  plans, currentPlan, pendingPlan, scheduledPlan, selecting, onBack, onChoose,
}: {
  plans: { key: string; name: string; price: number; studentsLimit: number; storageGB: number; features: string[] }[];
  currentPlan: string;
  pendingPlan: string | null;
  scheduledPlan: string | null;
  selecting: boolean;
  onBack: () => void;
  onChoose: (planKey: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground" aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <CardTitle className="flex items-center gap-2"><Sparkles size={18} /> Choose your plan</CardTitle>
            <CardDescription>Pick the plan that fits your institution — you can change it any time.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {plans.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">No plans available right now.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((p) => {
              const current = p.key === currentPlan;
              const pending = p.key === pendingPlan;
              const scheduled = p.key === scheduledPlan;
              return (
                <div
                  key={p.key}
                  className={cn(
                    'flex flex-col rounded-xl border p-4 transition-colors',
                    current ? 'border-primary bg-primary-soft/40'
                      : pending ? 'border-warning bg-warning-soft/40'
                      : scheduled ? 'border-border bg-muted/50'
                      : 'border-border hover:border-primary/40'
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-foreground">{p.name}</p>
                    {current && <Badge variant="primary"><ShieldCheck size={11} /> Current</Badge>}
                    {pending && <Badge variant="warning"><Clock size={11} /> Pending</Badge>}
                    {scheduled && <Badge variant="neutral"><Clock size={11} /> Scheduled</Badge>}
                  </div>
                  <p className="mt-2 text-2xl font-bold text-foreground">
                    {p.price > 0 ? formatCurrency(p.price) : 'Free'}
                    {p.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5"><Check size={13} className="text-success" /> Up to {p.studentsLimit.toLocaleString('en-PK')} students</li>
                    <li className="flex items-center gap-1.5"><Check size={13} className="text-success" /> {p.storageGB} GB storage</li>
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 capitalize"><Check size={13} className="text-success" /> {f}</li>
                    ))}
                  </ul>
                  <Button
                    className="mt-4"
                    variant={current || pending || scheduled ? 'secondary' : 'primary'}
                    disabled={current}
                    loading={selecting}
                    onClick={() => onChoose(p.key)}
                  >
                    {current ? 'Current plan' : pending ? 'Selected — pay to activate' : scheduled ? 'Scheduled — choose again' : 'Choose plan'}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Step 3: payment — only the current amount due, one focused screen ──── */
function PaymentStep({
  b, liveGateways, checkingOut, submitting, reference, setReference, onBack, onPayOnline, onSubmitTransfer, onCopy,
}: {
  b: MyBilling;
  liveGateways: Gateway[];
  checkingOut: boolean;
  submitting: boolean;
  reference: string;
  setReference: (v: string) => void;
  onBack: () => void;
  onPayOnline: (g: Gateway) => void;
  onSubmitTransfer: (e: React.FormEvent) => void;
  onCopy: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-4">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            Paying for the <span className="capitalize">{b.pendingPlan || b.plan}</span> plan
          </p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(b.amountDue)}</p>
        </div>
        <Badge variant="neutral" className="capitalize">{b.billingCycle}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pay online */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard size={18} /> Pay online</CardTitle>
            <CardDescription>Pay instantly by card or wallet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!b.online.live && (
              <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-warning">
                <Info size={14} className="mt-0.5 shrink-0" />
                <span>Test mode — no online gateway is configured yet. This will simulate an instant payment.</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {liveGateways.length > 0 ? (
                liveGateways.map((g, i) => (
                  <Button key={g} variant={i === 0 ? 'primary' : 'secondary'} onClick={() => onPayOnline(g)} loading={checkingOut}>
                    {gatewayLabel[g]}
                  </Button>
                ))
              ) : (
                <Button onClick={() => onPayOnline('safepay')} loading={checkingOut}>Pay now (test mode)</Button>
              )}
            </div>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck size={12} /> Payments are processed securely by the gateway — Edvanta never sees your card details.
            </p>
          </CardContent>
        </Card>

        {/* Bank transfer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 size={18} /> Bank transfer</CardTitle>
            <CardDescription>Transfer to our account, then submit the reference.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {b.bank.iban ? (
              <div className="space-y-1.5 rounded-lg bg-muted p-3 text-sm">
                <BankRow label="Bank" value={b.bank.name} />
                <BankRow label="Title" value={b.bank.accountTitle} />
                <BankRow label="IBAN" value={b.bank.iban} onCopy={onCopy} />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Bank details will appear here once configured. Contact support for transfer details.</p>
            )}
            <form onSubmit={onSubmitTransfer} className="space-y-2">
              <Label htmlFor="ref">Transfer reference / transaction ID</Label>
              <Input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. IBFT-123456" />
              <Button type="submit" variant="secondary" loading={submitting} className="w-full"><CheckCircle2 size={16} /> I've transferred — submit</Button>
            </form>
            <p className="text-[11px] text-muted-foreground">Bank transfers are confirmed manually and may take up to one business day.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BankRow({ label, value, onCopy }: { label: string; value: string | null; onCopy?: (v: string) => void }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 font-medium text-foreground">
        {value}
        {onCopy && <button type="button" onClick={() => onCopy(value)} className="text-muted-foreground hover:text-foreground" aria-label="Copy"><Copy size={13} /></button>}
      </span>
    </div>
  );
}
