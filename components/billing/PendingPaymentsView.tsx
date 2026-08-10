'use client';

import { CheckCircle2, XCircle, Inbox, AlertTriangle, ShieldOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  useGetPendingPaymentsQuery, useGetDisputedPaymentsQuery, useResolveDisputeMutation,
  useConfirmPaymentMutation, useRejectPaymentMutation,
} from '@/store/api/billingApi';
import { useUpdateInstitutionMutation } from '@/store/api/superadminApi';

export function PendingPaymentsView() {
  const { data, isLoading } = useGetPendingPaymentsQuery();
  const rows = data?.data ?? [];
  const { data: disputedRes } = useGetDisputedPaymentsQuery();
  const disputed = disputedRes?.data ?? [];
  const [confirm, { isLoading: confirming }] = useConfirmPaymentMutation();
  const [reject, { isLoading: rejecting }] = useRejectPaymentMutation();
  const [resolveDispute, { isLoading: resolving }] = useResolveDisputeMutation();
  const [updateInstitution, { isLoading: suspending }] = useUpdateInstitutionMutation();
  const busy = confirming || rejecting;

  const onConfirm = async (institutionId: string, paymentId: string) => {
    try { await confirm({ institutionId, paymentId }).unwrap(); toast.success('Payment confirmed — subscription renewed'); }
    catch (e: any) { toast.error(e?.data?.error?.message || 'Could not confirm'); }
  };
  const onReject = async (institutionId: string, paymentId: string) => {
    try { await reject({ institutionId, paymentId }).unwrap(); toast.success('Payment rejected'); }
    catch (e: any) { toast.error(e?.data?.error?.message || 'Could not reject'); }
  };
  const onResolveDispute = async (institutionId: string, paymentId: string) => {
    try { await resolveDispute({ institutionId, paymentId }).unwrap(); toast.success('Dispute marked as resolved'); }
    catch (e: any) { toast.error(e?.data?.error?.message || 'Could not resolve'); }
  };
  const onSuspend = async (institutionId: string, institutionName: string) => {
    if (!window.confirm(`Suspend ${institutionName}? They'll lose access until reactivated.`)) return;
    try { await updateInstitution({ id: institutionId, body: { status: 'suspended' } }).unwrap(); toast.success('Institution suspended'); }
    catch (e: any) { toast.error(e?.data?.error?.message || 'Could not suspend'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subscription Payments" description="Confirm bank transfers and pending subscription payments." />

      {disputed.length > 0 && (
        <Card className="border-danger/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-danger"><AlertTriangle size={17} /> Disputed payments</CardTitle>
            <CardDescription>Chargebacks reported by the gateway — these need a manual decision and were not automatically reversed.</CardDescription>
          </CardHeader>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Institution</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {disputed.map((r) => (
                  <TableRow key={r.paymentId}>
                    <TableCell className="font-medium text-foreground">{r.institutionName}</TableCell>
                    <TableCell className="font-medium text-foreground">{formatCurrency(r.amount)}</TableCell>
                    <TableCell><Badge variant="neutral" className="capitalize">{r.gateway}</Badge></TableCell>
                    <TableCell className="max-w-[140px] truncate text-muted-foreground" title={r.reference ?? ''}>{r.reference ?? '—'}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                    <TableCell className="max-w-[240px] truncate text-xs text-muted-foreground" title={r.disputeNote ?? ''}>{r.disputeNote ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" disabled={suspending} onClick={() => onSuspend(r.institutionId, r.institutionName)}>
                          <ShieldOff size={14} /> Suspend
                        </Button>
                        <Button size="sm" variant="soft" disabled={resolving} onClick={() => onResolveDispute(r.institutionId, r.paymentId)}>
                          <CheckCircle2 size={14} /> Mark resolved
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-5"><Skeleton className="h-64 w-full" /></Card>
      ) : rows.length === 0 ? (
        <Card><EmptyState icon={Inbox} title="Nothing pending" description="Confirmed and online payments appear in Revenue." /></Card>
      ) : (
        <Card className="p-0">
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Institution</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.paymentId}>
                    <TableCell className="font-medium text-foreground">{r.institutionName}</TableCell>
                    <TableCell className="capitalize text-muted-foreground">{r.planType}</TableCell>
                    <TableCell className="font-medium text-foreground">{formatCurrency(r.amount)}</TableCell>
                    <TableCell><Badge variant="neutral" className="capitalize">{r.gateway}</Badge></TableCell>
                    <TableCell className="max-w-[160px] truncate text-muted-foreground" title={r.reference ?? ''}>{r.reference ?? '—'}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="soft" disabled={busy} onClick={() => onConfirm(r.institutionId, r.paymentId)}><CheckCircle2 size={15} /> Confirm</Button>
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => onReject(r.institutionId, r.paymentId)}><XCircle size={15} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
        </Card>
      )}
    </div>
  );
}
