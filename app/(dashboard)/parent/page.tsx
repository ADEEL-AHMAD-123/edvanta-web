import type { Metadata } from 'next';
import { GraduationCap, CalendarCheck, Wallet, ChevronRight } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Parent Dashboard' };

const children = [
  { name: 'Ali Khan', cls: 'Grade 8 — A', attendance: '95%', fees: 'paid' as const },
  { name: 'Sara Khan', cls: 'Grade 5 — B', attendance: '88%', fees: 'pending' as const },
];

const feeBadge = {
  paid: { variant: 'success' as const, label: 'Fees Paid' },
  pending: { variant: 'warning' as const, label: 'Fees Pending' },
};

export default function ParentDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Portal"
        description="Stay updated on your children's progress."
        actions={<Button size="sm"><Wallet size={16} /> Pay Fees</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children.map((c) => (
          <Card key={c.name}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-base font-semibold text-primary-soft-foreground">
                  {c.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.cls}</p>
                </div>
                <Badge variant={feeBadge[c.fees].variant}>{feeBadge[c.fees].label}</Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarCheck size={13} /> Attendance
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">{c.attendance}</p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <GraduationCap size={13} /> Class
                  </p>
                  <p className="mt-1 text-lg font-bold text-foreground">{c.cls.split('—')[0].trim()}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="mt-3 w-full justify-between">
                View details <ChevronRight size={16} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
