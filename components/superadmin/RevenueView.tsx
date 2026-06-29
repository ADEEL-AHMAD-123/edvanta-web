'use client';

import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Table, TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { BarsChart, DonutChart } from '@/components/charts/charts';
import { useGetRevenueQuery } from '@/store/api/superadminApi';
import { formatCurrency, formatDate } from '@/lib/utils';

export function RevenueView() {
  const { data, isLoading } = useGetRevenueQuery();
  const r = data?.data;

  if (isLoading || !r) {
    return (
      <div className="space-y-6">
        <PageHeader title="Revenue" description="Platform subscription revenue." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Card className="p-5"><Skeleton className="h-16 w-full" /></Card><Card className="p-5"><Skeleton className="h-16 w-full" /></Card></div>
        <Card className="p-5"><Skeleton className="h-64 w-full" /></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Revenue" description="Platform subscription revenue (estimated from active plans)." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Monthly Recurring Revenue" value={formatCurrency(r.mrr)} icon={TrendingUp} tone="success" />
        <StatCard label="Annual Run Rate" value={formatCurrency(r.arr)} icon={DollarSign} tone="primary" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>MRR Trend</CardTitle>
            <CardDescription>Last 6 months (PKR)</CardDescription>
          </CardHeader>
          <CardContent>
            {r.trend.some((t) => t.mrr > 0) ? (
              <BarsChart data={r.trend} xKey="label" yKey="mrr" />
            ) : (
              <EmptyState icon={BarChart3} title="No paid subscriptions yet" description="MRR appears once institutions move to a paid plan." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Institutions by plan</CardDescription>
          </CardHeader>
          <CardContent>
            {r.planDistribution.length ? (
              <>
                <DonutChart data={r.planDistribution} />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {r.planDistribution.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: `hsl(var(--chart-${(i % 5) + 1}))` }} />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="ml-auto font-medium text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState icon={BarChart3} title="No data" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions — where revenue comes from */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>Active institutions, their plan and monthly amount.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {r.subscriptions.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No subscriptions yet.</p>
          ) : (
            <TableWrapper className="rounded-none border-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Institution</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Monthly</TableHead>
                    <TableHead>Since</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {r.subscriptions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium text-foreground">{s.institution}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{s.plan}</TableCell>
                      <TableCell className="text-foreground">{formatCurrency(s.monthlyAmount)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(s.since)}</TableCell>
                      <TableCell><Badge variant={s.status === 'active' ? 'success' : s.status === 'trial' ? 'warning' : 'neutral'} className="capitalize">{s.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          )}
        </CardContent>
      </Card>

      {/* Payments — when revenue was collected */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Subscription payments received, most recent first.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {r.payments.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No payments recorded yet.</p>
          ) : (
            <TableWrapper className="rounded-none border-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Institution</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {r.payments.map((p, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-foreground">{p.institution}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{p.plan}</TableCell>
                      <TableCell className="text-foreground">{formatCurrency(p.amount)}</TableCell>
                      <TableCell className="capitalize text-muted-foreground">{p.gateway}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(p.paidAt)}</TableCell>
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
