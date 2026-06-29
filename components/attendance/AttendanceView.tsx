'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck, CheckCheck, AlertCircle, Users, Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useGetClassesQuery } from '@/store/api/classesApi';
import { useMyClassesQuery } from '@/store/api/portalApi';
import {
  useGetRosterQuery,
  useMarkAttendanceMutation,
  type AttendanceStatus,
} from '@/store/api/attendanceApi';
import { useAppSelector } from '@/store/hooks';
import { cn, getInitials } from '@/lib/utils';

const STATUSES: { key: AttendanceStatus; label: string; active: string }[] = [
  { key: 'present', label: 'Present', active: 'bg-success text-success-foreground' },
  { key: 'absent', label: 'Absent', active: 'bg-danger text-danger-foreground' },
  { key: 'late', label: 'Late', active: 'bg-warning text-warning-foreground' },
  { key: 'leave', label: 'Leave', active: 'bg-info text-info-foreground' },
];

const todayStr = () => new Date().toISOString().slice(0, 10);

export function AttendanceView({ title = 'Attendance' }: { title?: string }) {
  const role = useAppSelector((s) => s.auth.user?.role);
  const isTeacher = role === 'teacher';

  // Teachers only see their own assigned classes/sections; admins see all.
  const { data: allClassesRes } = useGetClassesQuery(undefined, { skip: isTeacher });
  const { data: myClassesRes } = useMyClassesQuery(undefined, { skip: !isTeacher });

  const classes = useMemo<{ id: string; name: string; sections: { id: string; name: string }[] }[]>(() => {
    const src: any[] = isTeacher ? myClassesRes?.data ?? [] : allClassesRes?.data ?? [];
    return src.map((c) => ({
      id: c.id,
      name: c.name,
      sections: (c.sections ?? []).map((s: any) => ({ id: s.id, name: s.name })),
    }));
  }, [isTeacher, myClassesRes, allClassesRes]);

  const [classId, setClassId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [date, setDate] = useState(todayStr());
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>({});

  const sections = useMemo(
    () => classes.find((c) => c.id === classId)?.sections ?? [],
    [classes, classId]
  );

  const ready = !!classId && !!sectionId;
  const { data: rosterRes, isFetching, isError, refetch } = useGetRosterQuery(
    { classId, sectionId, date },
    { skip: !ready }
  );
  const roster = rosterRes?.data;
  const [markAttendance, { isLoading: saving }] = useMarkAttendanceMutation();

  // Seed local statuses whenever a roster loads
  useEffect(() => {
    if (roster) {
      const next: Record<string, AttendanceStatus> = {};
      roster.students.forEach((s) => { next[s.studentId] = s.status; });
      setStatuses(next);
    }
  }, [roster]);

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, leave: 0 };
    Object.values(statuses).forEach((s) => { c[s] += 1; });
    return c;
  }, [statuses]);

  const setAll = (status: AttendanceStatus) => {
    if (!roster) return;
    const next: Record<string, AttendanceStatus> = {};
    roster.students.forEach((s) => { next[s.studentId] = status; });
    setStatuses(next);
  };

  const save = async () => {
    if (!roster) return;
    const records = roster.students.map((s) => ({
      studentId: s.studentId,
      status: statuses[s.studentId] ?? 'present',
    }));
    try {
      await markAttendance({ classId, sectionId, date, records }).unwrap();
      toast.success('Attendance saved');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not save attendance');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={title} description="Mark and review daily attendance." />

      {/* Controls */}
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label>Class</Label>
            <Select value={classId} onValueChange={(v) => { setClassId(v); setSectionId(''); }}>
              <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Section</Label>
            <Select value={sectionId} onValueChange={setSectionId} disabled={!classId}>
              <SelectTrigger><SelectValue placeholder="Section" /></SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <input
              id="date"
              type="date"
              value={date}
              max={todayStr()}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
      </Card>

      {classes.length === 0 ? (
        <Card>
          <EmptyState
            icon={Users}
            title="No classes yet"
            description="Create a class with sections first, then you can mark attendance."
          />
        </Card>
      ) : !ready ? (
        <Card>
          <EmptyState
            icon={CalendarCheck}
            title="Select a class and section"
            description="Choose a class, section and date to load the student roster."
          />
        </Card>
      ) : isError ? (
        <Card>
          <EmptyState
            icon={AlertCircle}
            title="Couldn't load roster"
            description="Check the API connection and try again."
            action={<Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>}
          />
        </Card>
      ) : isFetching || !roster ? (
        <Card className="p-5"><Skeleton className="h-64 w-full" /></Card>
      ) : roster.students.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="No students in this section" description="Add students to this class and section first." />
        </Card>
      ) : (
        <>
          {/* Summary + quick actions */}
          <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {roster.alreadyMarked && (
                <Badge variant="primary" className="gap-1"><Info size={12} /> Already marked</Badge>
              )}
              <Badge variant="success">Present {counts.present}</Badge>
              <Badge variant="danger">Absent {counts.absent}</Badge>
              <Badge variant="warning">Late {counts.late}</Badge>
              <Badge variant="neutral">Leave {counts.leave}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => setAll('present')}>
                <CheckCheck size={16} /> All present
              </Button>
              <Button size="sm" loading={saving} onClick={save}>Save attendance</Button>
            </div>
          </Card>

          {/* Roster */}
          <Card className="divide-y divide-border">
            {roster.students.map((s) => (
              <div key={s.studentId} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
                    {getInitials(s.name.split(' ')[0] || '', s.name.split(' ')[1] || '')}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.rollNumber}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {STATUSES.map((st) => {
                    const active = statuses[s.studentId] === st.key;
                    return (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setStatuses((prev) => ({ ...prev, [s.studentId]: st.key }))}
                        className={cn(
                          'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                          active
                            ? st.active
                            : 'bg-muted text-muted-foreground hover:bg-secondary'
                        )}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </Card>

          <div className="flex justify-end">
            <Button loading={saving} onClick={save}>Save attendance</Button>
          </div>
        </>
      )}
    </div>
  );
}
