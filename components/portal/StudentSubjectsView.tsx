'use client';

import toast from 'react-hot-toast';
import { BookOpen, Check, Clock, Plus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import {
  useMySubjectsQuery,
  useJoinSubjectMutation,
  useLeaveSubjectMutation,
  type ElectiveSubject,
} from '@/store/api/portalApi';

export function StudentSubjectsView() {
  const { data, isLoading } = useMySubjectsQuery();
  const [join, { isLoading: joining }] = useJoinSubjectMutation();
  const [leave, { isLoading: leaving }] = useLeaveSubjectMutation();

  const core = data?.data.core ?? [];
  const electives = data?.data.electives ?? [];

  const doJoin = async (id: string) => {
    try { await join(id).unwrap(); toast.success('Request sent — pending approval'); }
    catch (e: any) { toast.error(e?.data?.error?.message || 'Could not join'); }
  };
  const doLeave = async (id: string) => {
    try { await leave(id).unwrap(); toast.success('Left subject'); }
    catch (e: any) { toast.error(e?.data?.error?.message || 'Could not leave'); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My Subjects" description="Your core subjects and available electives." />

      {isLoading ? (
        <Card className="p-5"><Skeleton className="h-40 w-full" /></Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Core subjects</CardTitle>
              <CardDescription>Automatically part of your class</CardDescription>
            </CardHeader>
            <CardContent>
              {core.length === 0 ? (
                <EmptyState icon={BookOpen} title="No core subjects yet" />
              ) : (
                <ul className="divide-y divide-border">
                  {core.map((s) => (
                    <li key={s.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.code ? `${s.code} · ` : ''}{s.teacherName ?? 'Unassigned'}</p>
                      </div>
                      <Badge variant="neutral">Core</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Elective subjects</CardTitle>
              <CardDescription>Opt in — requests are approved by your teacher or admin</CardDescription>
            </CardHeader>
            <CardContent>
              {electives.length === 0 ? (
                <EmptyState icon={BookOpen} title="No electives available" description="There are no elective subjects for your class right now." />
              ) : (
                <ul className="divide-y divide-border">
                  {electives.map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.code ? `${s.code} · ` : ''}{s.teacherName ?? 'Unassigned'}</p>
                      </div>
                      <ElectiveAction s={s} onJoin={() => doJoin(s.id)} onLeave={() => doLeave(s.id)} busy={joining || leaving} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function ElectiveAction({ s, onJoin, onLeave, busy }: { s: ElectiveSubject; onJoin: () => void; onLeave: () => void; busy: boolean }) {
  if (s.status === 'enrolled') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="success" className="gap-1"><Check size={12} /> Enrolled</Badge>
        <Button variant="ghost" size="sm" disabled={busy} onClick={onLeave}>Leave</Button>
      </div>
    );
  }
  if (s.status === 'pending') {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="warning" className="gap-1"><Clock size={12} /> Pending</Badge>
        <Button variant="ghost" size="sm" disabled={busy} onClick={onLeave}>Cancel</Button>
      </div>
    );
  }
  // none / rejected / dropped → can (re)join
  return (
    <Button variant="soft" size="sm" disabled={busy} onClick={onJoin}>
      <Plus size={15} /> Join
    </Button>
  );
}
