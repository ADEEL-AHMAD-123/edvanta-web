'use client';

import { Building2, CheckCircle2, Beaker, GraduationCap, TrendingUp, BarChart3 } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { BarsChart, DonutChart } from '@/components/charts/charts';
import { useGetPlatformOverviewQuery, useGetRevenueQuery } from '@/store/api/superadminApi';
import { formatCurrency } from '@/lib/utils';

export function PlatformAnalyticsView() {
  const { data: ovRes, isLoading: ovLoading } = useGetPlatformOverviewQuery();
  const { data: revRes, isLoading: revLoading } = useGetRevenueQuery();
  const ov = ovRes?.data;
  const rev = revRes?.data;

  if (ovLoading || revLoading || !ov || !rev) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Platform-wide insights." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <Card key={i} className="p-5"><Skeleton className="h-16 w-full" /></Card>)}
        </div>
        <Card className="p-5"><Skeleton className="h-64 w-full" /></Card>
      </div>
    );
  }

  const statusDist = [
    { name: 'Active', value: ov.active },
    { name: 'Trial', value: ov.trial },
    { name: 'Suspended', value: ov.suspended },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Platform-wide insights across all institutions." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Institutions" value={ov.total.toLocaleString('en-PK')} icon={Building2} tone="primary" />
        <StatCard label="Active" value={ov.active.toLocaleString('en-PK')} icon={CheckCircle2} tone="success" />
        <StatCard label="On Trial" value={ov.trial.toLocaleString('en-PK')} icon={Beaker} tone="warning" />
        <StatCard label="Total Students" value={ov.totalStudents.toLocaleString('en-PK')} icon={GraduationCap} tone="info" />
        <StatCard label="MRR" value={formatCurrency(ov.mrr)} icon={TrendingUp} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>MRR Trend</CardTitle>
            <CardDescription>Last 6 months (PKR)</CardDescription>
          </CardHeader>
          <CardContent>
            {rev.trend.some((t) => t.mrr > 0) ? (
              <BarsChart data={rev.trend} xKey="label" yKey="mrr" />
            ) : (
              <EmptyState icon={BarChart3} title="No paid subscriptions yet" description="MRR appears once institutions upgrade to a paid plan." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Institutions by Status</CardTitle>
            <CardDescription>Across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {statusDist.length ? (
              <>
                <DonutChart data={statusDist} />
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {statusDist.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: `hsl(var(--chart-${(i % 5) + 1}))` }} />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="ml-auto font-medium text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState icon={BarChart3} title="No institutions yet" />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Institutions by plan</CardDescription>
          </CardHeader>
          <CardContent>
            {rev.planDistribution.length ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DonutChart data={rev.planDistribution} />
                <div className="flex flex-col justify-center gap-2">
                  {rev.planDistribution.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: `hsl(var(--chart-${(i % 5) + 1}))` }} />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="ml-auto font-medium text-foreground">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState icon={BarChart3} title="No data" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
