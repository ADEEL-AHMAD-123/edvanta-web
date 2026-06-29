'use client';

import {
  GraduationCap, CheckCircle2, Wallet, Clock, TrendingUp, Plus, AlertTriangle,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { AreaTrendChart, DonutChart } from '@/components/charts/charts';
import { useGetStudentStatsQuery } from '@/store/api/studentsApi';
import { useGetAttendanceSummaryQuery } from '@/store/api/attendanceApi';
import { useGetFeesSummaryQuery } from '@/store/api/feesApi';
import { formatCurrency } from '@/lib/utils';

const feeTrend = [
  { month: 'Jan', amount: 1.8 }, { month: 'Feb', amount: 2.4 },
  { month: 'Mar', amount: 2.1 }, { month: 'Apr', amount: 3.2 },
  { month: 'May', amount: 2.9 }, { month: 'Jun', amount: 4.2 },
];

const attendanceSplit = [
  { name: 'Present', value: 1118 },
  { name: 'Absent', value: 64 },
  { name: 'Late', value: 38 },
  { name: 'Leave', value: 20 },
];

const recent = [
  { name: 'Ali Khan', cls: 'Grade 8 — A', status: 'present' as const },
  { name: 'Sara Fatima', cls: 'Grade 6 — B', status: 'late' as const },
  { name: 'Hamza Raza', cls: 'Grade 9 — A', status: 'absent' as const },
  { name: 'Ayesha Noor', cls: 'Grade 7 — C', status: 'present' as const },
  { name: 'Bilal Ahmed', cls: 'Grade 10 — A', status: 'present' as const },
];

const statusBadge = {
  present: { variant: 'success' as const, label: 'Present' },
  late: { variant: 'warning' as const, label: 'Late' },
  absent: { variant: 'danger' as const, label: 'Absent' },
};

export function AdminDashboard() {
  const { data: statsRes, isLoading: statsLoading } = useGetStudentStatsQuery();
  const stats = statsRes?.data;
  const totalStudents = statsLoading ? '…' : (stats?.total ?? 0).toLocaleString('en-PK');

  const { data: attRes } = useGetAttendanceSummaryQuery();
  const att = attRes?.data;
  const presentToday = att?.total ? att.present.toLocaleString('en-PK') : '—';

  const { data: feeRes } = useGetFeesSummaryQuery();
  const fees = feeRes?.data;

  const overLimit = (stats?.overLimitBy ?? 0) > 0;

  return (
    <div className="space-y-6">
      {overLimit && (
        <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <span>
            You&apos;ve exceeded your plan limit by <strong>{stats?.overLimitBy}</strong> student{stats?.overLimitBy === 1 ? '' : 's'}
            {stats?.planLimit != null ? ` (limit ${stats.planLimit})` : ''}. Please upgrade your plan to avoid account restrictions.
          </span>
        </div>
      )}

      <PageHeader
        title="Dashboard"
        description="Welcome back — here's an overview of your institution."
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Plus size={16} /> Add Student
            </Button>
            <Button variant="primary" size="sm">
              <TrendingUp size={16} /> Reports
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          icon={GraduationCap}
          tone="primary"
          delta={stats?.newThisMonth ? `${stats.newThisMonth} new` : undefined}
        />
        <StatCard
          label="Present Today"
          value={presentToday}
          icon={CheckCircle2}
          tone="success"
          delta={att?.total ? `${att.presentRate}%` : undefined}
        />
        <StatCard
          label="Fees Collected"
          value={fees ? formatCurrency(fees.collectedThisMonth) : '—'}
          icon={Wallet}
          tone="info"
        />
        <StatCard
          label="Outstanding Fees"
          value={fees ? formatCurrency(fees.outstanding) : '—'}
          icon={Clock}
          tone="warning"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fee Collection</CardTitle>
            <CardDescription>Monthly collected amount (PKR millions)</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaTrendChart data={feeTrend} xKey="month" yKey="amount" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Today</CardTitle>
            <CardDescription>Across all classes</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart data={attendanceSplit} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {attendanceSplit.map((s, i) => (
                <div key={s.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: `hsl(var(--chart-${i + 1}))` }}
                  />
                  <span className="text-muted-foreground">{s.name}</span>
                  <span className="ml-auto font-medium text-foreground">{s.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance</CardTitle>
          <CardDescription>Latest student check-ins</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {recent.map((r) => {
              const b = statusBadge[r.status];
              return (
                <li key={r.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                    {r.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.cls}</p>
                  </div>
                  <Badge variant={b.variant} className="ml-auto">{b.label}</Badge>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
