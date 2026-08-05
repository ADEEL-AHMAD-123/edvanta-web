'use client';

import { useState } from 'react';
import {
  CreditCard, Building2, Info, Copy, CheckCircle2, Sparkles, Check, ArrowLeft, AlertTriangle,
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
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  useGetMyBillingQuery, useGetBillingPlansQuery, useSelectPlanMutation,
  useBillingCheckoutMutation, useSubmitBankTransferMutation, type Gateway, type MyBilling,
} from '@/store/api/billingApi';

const statusBadge: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
  active: 'success', trial: 'primary', past_due: 'warning', suspended: 'danger', cancelled: 'neutral', expired: 'neutral',
};
const payBadge: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  success: 'success', pending: 'warning', failed: 'danger', refunded: 'neutral',
};

const gatewayLabel: Record<Gateway, string> = {
  safepay: 'Pay with Safepay',
  jazzcash: 'Pay with JazzCash',
  easypaisa: 'Pay with EasyPaisa',
};

type Step = 'summary' | 'plans' | 'payment';

export function BillingView() {
  const { data, isLoading } = useGetMyBillingQuery();
  const b = data?.data;
  const { data: plansRes } = useGetBillingPlansQuery();
  const plans = plansRes?.data ?? [];
  const [selectPlan, { isLoading: selectingPlan }] = useSelectPlanMutation();
  const [checkout, { isLoading: checkingOut }] = useBillingCheckoutMutation();
  const [submitTransfer, { isLoading: submitting }] = useSubmitBankTransferMutation();
  const [reference, setReference] = useState('');
  const [step, setStep] = useState<Step>('summary');

  if (isLoading || !b) {
    return (
      <div className="space-y-6">
        <PageHeader title="Billing & Subscription" description="Your Edvanta plan and payments." />
        <Card className="p-5"><Skeleton className="h-48 w-full" /></Card>
      </div>
    );
  }

  const free = b.monthlyAmount <= 0;
  const needsPayment = !free && b.status !== 'active';
  const liveGateways = (Object.keys(gatewayLabel) as Gateway[]).filter((g) => b.online[g]);

  const payOnline = async (gateway: Gateway) => {
    try {
      const res = await checkout({ gateway }).unwrap();
      // Never assume success by default — only two outcomes count as "ok":
      // the gateway actually settled it (mock/dev), or it handed back a real
      // redirect to complete payment on. Anything else is an error, even if
      // the request itself didn't throw.
      if (res.data.settled) {
        toast.success('Payment received — subscription renewed');
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
      toast.success('Submitted — we\'ll confirm and renew your subscription shortly');
      setReference('');
      setStep('summary');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not submit');
    }
  };

  const copy = (v: string) => { navigator.clipboard?.writeText(v); toast.success('Copied'); };

  const choosePlan = async (planKey: string, price: number) => {
    try {
      await selectPlan({ planKey }).unwrap();
      toast.success('Plan updated');
      // A paid plan needs payment next — walk the admin straight there
      // instead of dropping them back on a page with nothing to do.
      setStep(price > 0 ? 'payment' : 'summary');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not update plan');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Subscription" description="Your Edvanta plan and payments." />

      {step === 'summary' && (
        <SummaryStep
          b={b}
          free={free}
          needsPayment={needsPayment}
          onChangePlan={() => setStep('plans')}
          onPay={() => setStep('payment')}
        />
      )}

      {step === 'plans' && (
        <PlansStep
          plans={plans}
          currentPlan={b.plan}
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

/* ── Step 1: summary — the landing view, with clear next actions ────────── */
function SummaryStep({
  b, free, needsPayment, onChangePlan, onPay,
}: {
  b: MyBilling;
  free: boolean;
  needsPayment: boolean;
  onChangePlan: () => void;
  onPay: () => void;
}) {
  return (
    <div className="space-y-6">
      {needsPayment && (
        <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <span className="flex-1">
            Your <strong className="capitalize">{b.plan}</strong> plan payment of{' '}
            <strong>{formatCurrency(b.amountDue)}</strong> is outstanding.
          </span>
          <Button size="sm" onClick={onPay}>Pay now</Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="mt-1 text-2xl font-bold capitalize text-foreground">{b.plan}</p>
          <Badge variant={statusBadge[b.status] ?? 'neutral'} className="mt-2 capitalize">{b.status.replace('_', ' ')}</Badge>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Amount due / cycle</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{free ? 'Free' : formatCurrency(b.amountDue)}</p>
          <p className="mt-2 text-xs text-muted-foreground capitalize">{b.billingCycle}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Next renewal</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{b.nextBillingAt ? formatDate(b.nextBillingAt) : '—'}</p>
          {b.lastPaymentAt && <p className="mt-2 text-xs text-muted-foreground">Last paid {formatDate(b.lastPaymentAt)}</p>}
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant={free ? 'primary' : 'secondary'} onClick={onChangePlan}>
          <Sparkles size={16} /> {free ? 'Choose a plan' : 'Change plan'}
        </Button>
        {!free && !needsPayment && (
          <Button variant="secondary" onClick={onPay}><CreditCard size={16} /> Make a payment</Button>
        )}
      </div>

      <Card>
        <CardHeader><CardTitle>Payment history</CardTitle></CardHeader>
        <CardContent>
          {b.payments.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">No payments yet.</p>
          ) : (
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {b.payments.map((p, i) => (
                    <TableRow key={p.id ?? i}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(p.paidAt ?? p.createdAt)}</TableCell>
                      <TableCell className="font-medium text-foreground">{formatCurrency(p.amount)}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{p.gateway}</TableCell>
                      <TableCell className="max-w-[160px] truncate text-muted-foreground" title={p.reference ?? ''}>{p.reference ?? '—'}</TableCell>
                      <TableCell><Badge variant={payBadge[p.status]} className="capitalize">{p.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Step 2: plans — shown only when the admin asks to view/change plans ── */
function PlansStep({
  plans, currentPlan, selecting, onBack, onChoose,
}: {
  plans: { key: string; name: string; price: number; studentsLimit: number; storageGB: number; features: string[] }[];
  currentPlan: string;
  selecting: boolean;
  onBack: () => void;
  onChoose: (planKey: string, price: number) => void;
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
              return (
                <div
                  key={p.key}
                  className={cn(
                    'flex flex-col rounded-xl border p-4',
                    current ? 'border-primary bg-primary-soft/40' : 'border-border'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{p.name}</p>
                    {current && <Badge variant="primary">Current</Badge>}
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
                    variant={current ? 'secondary' : 'primary'}
                    disabled={current}
                    loading={selecting}
                    onClick={() => onChoose(p.key, p.price)}
                  >
                    {current ? 'Current plan' : 'Choose plan'}
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
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground" aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-sm font-medium text-foreground">
            Paying for the <span className="capitalize">{b.plan}</span> plan
          </p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(b.amountDue)}</p>
        </div>
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
