'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, CheckCircle2, Wallet, Clock, TrendingUp, Plus, AlertTriangle,
  School, CalendarCheck, DollarSign, ArrowRight, Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { AreaTrendChart, DonutChart } from '@/components/charts/charts';
import { useGetStudentStatsQuery } from '@/store/api/studentsApi';
import { useGetAttendanceSummaryQuery } from '@/store/api/attendanceApi';
import { useGetFeesSummaryQuery } from '@/store/api/feesApi';
import { useGetReportsQuery } from '@/store/api/reportsApi';
import { formatCurrency } from '@/lib/utils';

const attendanceLabels: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  leave: 'Leave',
};

/** Steps every brand-new institution needs before the dashboard has anything
 *  real to show — shown in place of fabricated charts/lists on first login. */
const ONBOARDING_STEPS = [
  { label: 'Create your first class & sections', href: '/admin/classes', icon: School },
  { label: 'Add your students', href: '/admin/students', icon: GraduationCap },
  { label: 'Set up fee structures', href: '/admin/fees', icon: DollarSign },
  { label: 'Start marking attendance', href: '/admin/attendance', icon: CalendarCheck },
];

export function AdminDashboard() {
  const router = useRouter();
  const { data: statsRes, isLoading: statsLoading } = useGetStudentStatsQuery();
  const stats = statsRes?.data;
  const totalStudents = statsLoading ? '…' : (stats?.total ?? 0).toLocaleString('en-PK');

  const { data: attRes } = useGetAttendanceSummaryQuery();
  const att = attRes?.data;
  const presentToday = att?.total ? att.present.toLocaleString('en-PK') : '—';

  const { data: feeRes } = useGetFeesSummaryQuery();
  const fees = feeRes?.data;

  const { data: reportsRes } = useGetReportsQuery();
  const reports = reportsRes?.data;

  const overLimit = (stats?.overLimitBy ?? 0) > 0;

  // A brand-new institution has no students yet — nothing below the stat
  // cards would be real, so guide the admin through setup instead of
  // rendering charts/lists with zero or fabricated data.
  const isNewInstitution = !statsLoading && (stats?.total ?? 0) === 0;

  const attendanceSplit = att?.total
    ? Object.entries(attendanceLabels)
        .map(([key, name]) => ({ name, value: (att as any)[key] ?? 0 }))
        .filter((s) => s.value > 0)
    : [];

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
        description={
          isNewInstitution
            ? "Welcome to Edvanta — let's get your institution set up."
            : "Welcome back — here's an overview of your institution."
        }
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => router.push('/admin/students')}>
              <Plus size={16} /> Add Student
            </Button>
            <Button variant="primary" size="sm" onClick={() => router.push('/admin/reports')}>
              <TrendingUp size={16} /> Reports
            </Button>
          </>
        }
      />

      {/* Stats — always real, even at zero */}
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

      {isNewInstitution ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-primary" />
              <CardTitle>Get your institution ready</CardTitle>
            </div>
            <CardDescription>
              You haven&apos;t added any data yet — follow these steps to start using Edvanta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {ONBOARDING_STEPS.map((step, i) => (
                <li key={step.href}>
                  <Link
                    href={step.href}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 transition-colors hover:text-primary"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                      {i + 1}
                    </span>
                    <step.icon size={16} className="shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{step.label}</span>
                    <ArrowRight size={16} className="shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Charts — real data from the reports & attendance APIs */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Fee Collection</CardTitle>
                <CardDescription>Monthly collected amount, last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                {reports?.feeCollection?.some((m) => m.amount > 0) ? (
                  <AreaTrendChart data={reports.feeCollection} xKey="label" yKey="amount" />
                ) : (
                  <EmptyState
                    icon={Wallet}
                    title="No payments recorded yet"
                    description="Once fee payments come in, this chart will fill in automatically."
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Attendance Today</CardTitle>
                <CardDescription>Across all classes</CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceSplit.length > 0 ? (
                  <>
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
                  </>
                ) : (
                  <EmptyState
                    icon={CalendarCheck}
                    title="Not marked yet today"
                    description="Attendance for today hasn't been submitted."
                    action={
                      <Button variant="secondary" size="sm" onClick={() => router.push('/admin/attendance')}>
                        Mark attendance
                      </Button>
                    }
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick actions — always accurate, never fabricated */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common things you might do next</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Link
                  href="/admin/attendance"
                  className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  <CalendarCheck size={18} className="shrink-0" /> Mark attendance
                </Link>
                <Link
                  href="/admin/fees"
                  className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  <DollarSign size={18} className="shrink-0" /> Record a payment
                </Link>
                <Link
                  href="/admin/notices"
                  className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  <TrendingUp size={18} className="shrink-0" /> Post a notice
                </Link>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
