import type { Metadata } from 'next';
import { CalendarCheck, FileText, Wallet, Bell } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Student Dashboard' };

const results = [
  { subject: 'Mathematics', marks: '88 / 100', grade: 'A' },
  { subject: 'English', marks: '76 / 100', grade: 'B+' },
  { subject: 'Science', marks: '91 / 100', grade: 'A+' },
  { subject: 'Urdu', marks: '82 / 100', grade: 'A' },
];

const notices = [
  { title: 'Mid-term exams start Monday', date: '20 Jun', priority: 'high' as const },
  { title: 'Sports day registration open', date: '18 Jun', priority: 'normal' as const },
];

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="My Dashboard" description="Track your attendance, results and fees." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Attendance" value="94%" icon={CalendarCheck} tone="success" />
        <StatCard label="Class Rank" value="#4" icon={FileText} tone="primary" />
        <StatCard label="Fees Due" value="₨ 0" icon={Wallet} tone="info" />
        <StatCard label="New Notices" value="2" icon={Bell} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Latest Results</CardTitle>
            <CardDescription>Mid-term 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-border">
              {results.map((r) => (
                <li key={r.subject} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <span className="text-sm font-medium text-foreground">{r.subject}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{r.marks}</span>
                    <Badge variant="primary">{r.grade}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notices</CardTitle>
            <CardDescription>From your institution</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {notices.map((n) => (
                <li key={n.title} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Bell size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.date}</p>
                  </div>
                  {n.priority === 'high' && <Badge variant="danger">Important</Badge>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
