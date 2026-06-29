'use client';

import { CheckCircle2, XCircle, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  useGetPendingPaymentsQuery, useConfirmPaymentMutation, useRejectPaymentMutation,
} from '@/store/api/billingApi';

export function PendingPaymentsView() {
  const { data, isLoading } = useGetPendingPaymentsQuery();
  const rows = data?.data ?? [];
  const [confirm, { isLoading: confirming }] = useConfirmPaymentMutation();
  const [reject, { isLoading: rejecting }] = useRejectPaymentMutation();
  const busy = confirming || rejecting;

  const onConfirm = async (institutionId: string, paymentId: string) => {
    try { await confirm({ institutionId, paymentId }).unwrap(); toast.success('Payment confirmed — subscription renewed'); }
    catch (e: any) { toast.error(e?.data?.error?.message || 'Could not confirm'); }
  };
  const onReject = async (institutionId: string, paymentId: string) => {
    try { await reject({ institutionId, paymentId }).unwrap(); toast.success('Payment rejected'); }
    catch (e: any) { toast.error(e?.data?.error?.message || 'Could not reject'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subscription Payments" description="Confirm bank transfers and pending subscription payments." />

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
