'use client';

import { Building2, TrendingUp, Users, Beaker } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { BarsChart } from '@/components/charts/charts';
import {
  useGetPlatformOverviewQuery,
  useGetRevenueQuery,
  useGetInstitutionsQuery,
} from '@/store/api/superadminApi';
import { formatCurrency } from '@/lib/utils';

const statusBadge = {
  active: 'success' as const,
  trial: 'warning' as const,
  suspended: 'danger' as const,
  pending: 'neutral' as const,
  past_due: 'warning' as const,
};

export function SuperadminDashboard() {
  const { data: ovRes } = useGetPlatformOverviewQuery();
  const { data: revRes } = useGetRevenueQuery();
  const { data: instRes } = useGetInstitutionsQuery({ page: 1, limit: 5 });

  const ov = ovRes?.data;
  const trend = revRes?.data?.trend ?? [];
  const institutions = instRes?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Overview" description="Edvanta — all institutions." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Institutions" value={ov ? ov.total.toLocaleString('en-PK') : '—'} icon={Building2} tone="primary" delta={ov?.newThisMonth ? `${ov.newThisMonth} new` : undefined} />
        <StatCard label="MRR" value={ov ? formatCurrency(ov.mrr) : '—'} icon={TrendingUp} tone="success" />
        <StatCard label="Total Students" value={ov ? ov.totalStudents.toLocaleString('en-PK') : '—'} icon={Users} tone="info" />
        <StatCard label="On Trial" value={ov ? ov.trial.toLocaleString('en-PK') : '—'} icon={Beaker} tone="warning" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Recurring Revenue</CardTitle>
          <CardDescription>Last 6 months (PKR)</CardDescription>
        </CardHeader>
        <CardContent>
          {trend.some((t) => t.mrr > 0) ? (
            <BarsChart data={trend} xKey="label" yKey="mrr" />
          ) : (
            <EmptyState icon={TrendingUp} title="No paid subscriptions yet" description="MRR appears once institutions upgrade to a paid plan." />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Institutions</CardTitle>
          <CardDescription>Newest sign-ups</CardDescription>
        </CardHeader>
        <CardContent>
          {institutions.length === 0 ? (
            <EmptyState icon={Building2} title="No institutions yet" />
          ) : (
            <ul className="divide-y divide-border">
              {institutions.map((i) => (
                <li key={i.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
                    <Building2 size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{i.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{i.city ?? '—'} · {i.students} students</p>
                  </div>
                  <Badge variant="neutral" className="hidden capitalize sm:inline-flex">{i.plan}</Badge>
                  <Badge variant={statusBadge[i.status] ?? 'neutral'} className="capitalize">{i.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
