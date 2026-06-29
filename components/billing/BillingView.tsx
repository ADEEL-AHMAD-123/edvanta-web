'use client';

import { useState } from 'react';
import { CreditCard, Building2, Info, Copy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  useGetMyBillingQuery, useBillingCheckoutMutation, useSubmitBankTransferMutation, type Gateway,
} from '@/store/api/billingApi';

const statusBadge: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
  active: 'success', trial: 'primary', past_due: 'warning', suspended: 'danger', cancelled: 'neutral', expired: 'neutral',
};
const payBadge: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
  success: 'success', pending: 'warning', failed: 'danger', refunded: 'neutral',
};

export function BillingView() {
  const { data, isLoading } = useGetMyBillingQuery();
  const b = data?.data;
  const [checkout, { isLoading: checkingOut }] = useBillingCheckoutMutation();
  const [submitTransfer, { isLoading: submitting }] = useSubmitBankTransferMutation();
  const [reference, setReference] = useState('');

  if (isLoading || !b) {
    return (
      <div className="space-y-6">
        <PageHeader title="Billing & Subscription" description="Your Edvanta plan and payments." />
        <Card className="p-5"><Skeleton className="h-48 w-full" /></Card>
      </div>
    );
  }

  const free = b.monthlyAmount <= 0;

  const payOnline = async (gateway: Gateway) => {
    try {
      const res = await checkout({ gateway }).unwrap();
      if (!res.data.settled && res.data.redirectUrl) { window.location.href = res.data.redirectUrl; return; }
      toast.success('Payment received — subscription renewed');
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
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not submit');
    }
  };

  const copy = (v: string) => { navigator.clipboard?.writeText(v); toast.success('Copied'); };

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Subscription" description="Your Edvanta plan and payments." />

      {/* Plan summary */}
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

      {!free && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Pay online */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard size={18} /> Pay online</CardTitle>
              <CardDescription>Pay your subscription instantly by card or wallet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!b.online.live && (
                <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-warning">
                  <Info size={14} className="mt-0.5 shrink-0" />
                  <span>Test mode — online gateway keys not added yet. Payments are simulated and auto-confirmed.</span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => payOnline('safepay')} loading={checkingOut}>Pay with Safepay</Button>
                <Button variant="secondary" onClick={() => payOnline('jazzcash')} loading={checkingOut}>JazzCash</Button>
                <Button variant="secondary" onClick={() => payOnline('easypaisa')} loading={checkingOut}>EasyPaisa</Button>
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
                  <BankRow label="IBAN" value={b.bank.iban} onCopy={copy} />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Bank details will appear here once configured. Contact support for transfer details.</p>
              )}
              <form onSubmit={submit} className="space-y-2">
                <Label htmlFor="ref">Transfer reference / transaction ID</Label>
                <Input id="ref" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="e.g. IBFT-123456" />
                <Button type="submit" variant="secondary" loading={submitting} className="w-full"><CheckCircle2 size={16} /> I've transferred — submit</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment history */}
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
