'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowLeft, Building2, GraduationCap, Users, School, BookOpen,
  Wallet, Ban, CheckCircle2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatCard } from '@/components/ui/stat-card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import { SearchInput } from '@/components/ui/search-input';
import { useDebounce } from '@/hooks/useDebounce';
import {
  useGetInstitutionQuery, useUpdateInstitutionMutation, useGetInstitutionStudentsQuery,
  type InstitutionDetail,
} from '@/store/api/superadminApi';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

const statusBadge: Record<string, { variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  trial: { variant: 'warning', label: 'Trial' },
  suspended: { variant: 'danger', label: 'Suspended' },
  pending: { variant: 'neutral', label: 'Pending' },
};

const PLAN_OPTS = ['free', 'growth', 'standard', 'enterprise'];

const originLabel: Record<string, string> = {
  bank_transfer: 'Bank transfer',
  auto_renewal: 'Auto-renewal',
  checkout: 'Manual (online)',
};

const declineReasonLabel: Record<string, string> = {
  insufficient_funds: 'Insufficient funds',
  expired_card: 'Card expired',
  card_blocked: 'Declined by issuer',
  auth_failed: 'Authentication failed',
  gateway_error: 'Gateway error',
  other: 'Declined',
};

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value || '—'}</span>
    </div>
  );
}

export function InstitutionDetailView({ id }: { id: string }) {
  const { data, isLoading } = useGetInstitutionQuery(id);
  const [update, { isLoading: saving }] = useUpdateInstitutionMutation();
  const d = data?.data as InstitutionDetail | undefined;

  const setStatus = async (status: string) => {
    try { await update({ id, body: { status } }).unwrap(); toast.success('Status updated'); }
    catch { toast.error('Could not update status'); }
  };
  const setPlan = async (planType: string) => {
    try { await update({ id, body: { planType } }).unwrap(); toast.success('Plan updated'); }
    catch { toast.error('Could not update plan'); }
  };

  if (isLoading || !d) {
    return (
      <div className="space-y-6">
        <Link href="/superadmin/institutions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={15} /> Institutions</Link>
        <Card className="p-5"><Skeleton className="h-20 w-full" /></Card>
        <Card className="p-5"><Skeleton className="h-64 w-full" /></Card>
      </div>
    );
  }

  const inst = d.institution;

  return (
    <div className="space-y-6">
      <Link href="/superadmin/institutions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft size={15} /> Institutions
      </Link>

      <PageHeader
        title={inst.name}
        description={`${inst.type} · ${inst.city ?? '—'} · joined ${formatDate(inst.createdAt)}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusBadge[inst.status].variant}>{statusBadge[inst.status].label}</Badge>
            <Select value={inst.plan} onValueChange={setPlan}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLAN_OPTS.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
              </SelectContent>
            </Select>
            {inst.status === 'suspended' ? (
              <Button size="sm" loading={saving} onClick={() => setStatus('active')}><CheckCircle2 size={16} /> Activate</Button>
            ) : (
              <Button size="sm" variant="danger" loading={saving} onClick={() => setStatus('suspended')}><Ban size={16} /> Suspend</Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Students" value={d.counts.students} icon={GraduationCap} tone="primary" />
        <StatCard label="Teachers" value={d.counts.teachers} icon={Users} tone="info" />
        <StatCard label="Classes" value={d.counts.classes} icon={School} tone="success" />
        <StatCard label="Subjects" value={d.counts.subjects} icon={BookOpen} tone="warning" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                <Row label="Email" value={inst.contactEmail} />
                <Row label="Phone" value={inst.contactPhone} />
                <Row label="City" value={inst.city} />
                <Row label="Province" value={inst.province} />
                <Row label="Subdomain" value={`${inst.slug}.edvanta.pk`} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Wallet size={18} /> Subscription</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                <Row label="Plan" value={inst.plan[0].toUpperCase() + inst.plan.slice(1)} />
                <Row label="Monthly" value={formatCurrency(inst.monthlyAmount)} />
                <Row label="Students limit" value={inst.studentsLimit ? String(inst.studentsLimit) : '—'} />
                <Row label="Status" value={statusBadge[inst.status].label} />
                <Row label="Trial ends" value={inst.trialEndsAt ? formatDate(inst.trialEndsAt) : '—'} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classes">
          <ClassesTab classes={d.classes} />
        </TabsContent>

        <TabsContent value="subjects">
          <SearchableTable
            head={['Subject', 'Code', 'Class', 'Teacher']}
            rows={d.subjects.map((s) => [s.name, s.code ?? '—', s.className ?? 'All', s.teacherName ?? '—'])}
            placeholder="Search subjects…"
            empty="No subjects."
          />
        </TabsContent>

        <TabsContent value="teachers">
          <SearchableTable
            head={['Teacher', 'Phone', 'Email', 'Status']}
            rows={d.teachers.map((t) => [t.name, t.phone, t.email ?? '—', t.isActive ? 'Active' : 'Inactive'])}
            placeholder="Search teachers…"
            empty="No teachers."
          />
        </TabsContent>

        <TabsContent value="students">
          <InstitutionStudentsTab institutionId={inst.id} />
        </TabsContent>

        <TabsContent value="billing">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader><CardTitle className="flex items-center gap-2"><Wallet size={18} /> Subscription</CardTitle></CardHeader>
              <CardContent className="divide-y divide-border">
                <Row label="Plan" value={inst.plan[0].toUpperCase() + inst.plan.slice(1)} />
                <Row label="Monthly amount" value={formatCurrency(inst.monthlyAmount)} />
                <Row label="Status" value={statusBadge[inst.status].label} />
                <Row label="Subscribed since" value={inst.subscribedSince ? formatDate(inst.subscribedSince) : '—'} />
                <Row label="Last payment" value={inst.lastPaymentAt ? formatDateTime(inst.lastPaymentAt) : '—'} />
                <Row label="Next billing" value={inst.nextBillingAt ? formatDate(inst.nextBillingAt) : '—'} />
                <Row
                  label="Auto-renewal"
                  value={inst.autoRenew ? `On (card •••• ${inst.savedCardLast4 ?? '····'})` : 'Off — manual payment'}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader><CardTitle>Payment history</CardTitle></CardHeader>
              <CardContent className="p-0">
                {d.payments.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">No payments recorded yet.</p>
                ) : (
                  <TableWrapper className="rounded-none border-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Origin</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date &amp; time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {d.payments.map((p, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium text-foreground">{formatCurrency(p.amount)}</TableCell>
                            <TableCell className="capitalize text-muted-foreground">{p.gateway}</TableCell>
                            <TableCell className="text-muted-foreground">
                              <Badge variant={p.origin === 'auto_renewal' ? 'neutral' : 'neutral'}>{originLabel[p.origin] ?? p.origin}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={p.status === 'success' ? 'success' : p.status === 'failed' ? 'danger' : 'warning'} className="capitalize">{p.status}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{formatDateTime(p.paidAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableWrapper>
                )}
              </CardContent>
            </Card>

            {/* Only shown when there's actually auto-renewal attempt history
                to review — most institutions (manual-only) will never see
                this card at all. Surfaces the same decline-reason data the
                institution admin already sees on their own billing page
                (myBilling()'s lastChargeAttempt), so a superadmin
                investigating a past_due account doesn't have to guess why
                auto-renewal gave up. */}
            {d.chargeAttempts.length > 0 && (
              <Card className="lg:col-span-3">
                <CardHeader><CardTitle>Auto-renewal charge attempts</CardTitle></CardHeader>
                <CardContent className="p-0">
                  <TableWrapper className="rounded-none border-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>Amount</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Attempted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {d.chargeAttempts.map((a, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium text-foreground">{formatCurrency(a.amount)}</TableCell>
                            <TableCell>
                              <Badge variant={a.success ? 'success' : 'danger'}>{a.success ? 'Succeeded' : 'Declined'}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{a.reasonCode ? declineReasonLabel[a.reasonCode] ?? a.reasonCode : '—'}</TableCell>
                            <TableCell className="text-muted-foreground">{formatDateTime(a.attemptedAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableWrapper>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const TAB_PAGE_SIZE = 10;

/** Client-side searchable + paginated table for the detail tabs (full data in memory). */
function SearchableTable({ head, rows, placeholder, empty }: { head: string[]; rows: string[][]; placeholder: string; empty: string }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.some((c) => (c ?? '').toLowerCase().includes(q)));
  }, [rows, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / TAB_PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * TAB_PAGE_SIZE, pageSafe * TAB_PAGE_SIZE);

  if (rows.length === 0) return <Card><p className="p-8 text-center text-sm text-muted-foreground">{empty}</p></Card>;

  return (
    <div className="space-y-3">
      <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder={placeholder} />
      {filtered.length === 0 ? (
        <Card><p className="p-8 text-center text-sm text-muted-foreground">No matches.</p></Card>
      ) : (
        <>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {head.map((h) => <TableHead key={h}>{h}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((r, i) => (
                  <TableRow key={i}>
                    {r.map((c, j) => <TableCell key={j} className={j === 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}>{c}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {pageSafe} of {totalPages} · {filtered.length}</p>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="icon" disabled={pageSafe <= 1} onClick={() => setPage(pageSafe - 1)} aria-label="Previous"><ChevronLeft size={16} /></Button>
              <Button variant="secondary" size="icon" disabled={pageSafe >= totalPages} onClick={() => setPage(pageSafe + 1)} aria-label="Next"><ChevronRight size={16} /></Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Classes tab — client-side searchable + paginated, keeping the section chips. */
function ClassesTab({ classes }: { classes: InstitutionDetail['classes'] }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return classes;
    return classes.filter((c) =>
      [c.name, c.academicYear, ...c.sections.map((s) => s.name)].some((v) => (v ?? '').toLowerCase().includes(q))
    );
  }, [classes, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / TAB_PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = filtered.slice((pageSafe - 1) * TAB_PAGE_SIZE, pageSafe * TAB_PAGE_SIZE);

  if (classes.length === 0) return <Card><p className="p-8 text-center text-sm text-muted-foreground">No classes.</p></Card>;

  return (
    <div className="space-y-3">
      <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search classes by name, year or section…" />
      {filtered.length === 0 ? (
        <Card><p className="p-8 text-center text-sm text-muted-foreground">No matches.</p></Card>
      ) : (
        <>
          <Card><CardContent className="p-0">
            <ul className="divide-y divide-border">
              {paged.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.academicYear}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {c.sections.map((s) => (
                      <span key={s.name} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{s.name} · {s.students}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent></Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {pageSafe} of {totalPages} · {filtered.length} classes</p>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="icon" disabled={pageSafe <= 1} onClick={() => setPage(pageSafe - 1)} aria-label="Previous"><ChevronLeft size={16} /></Button>
              <Button variant="secondary" size="icon" disabled={pageSafe >= totalPages} onClick={() => setPage(pageSafe + 1)} aria-label="Next"><ChevronRight size={16} /></Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Students tab — full, server-side searchable + paginated list for this institution. */
function InstitutionStudentsTab({ institutionId }: { institutionId: string }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(query, 350);

  const { data, isLoading, isFetching } = useGetInstitutionStudentsQuery({
    id: institutionId, search: debounced || undefined, page, limit: TAB_PAGE_SIZE,
  });
  const rows = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-3">
      <SearchInput value={query} onChange={(v) => { setQuery(v); setPage(1); }} placeholder="Search students by name or roll…" />
      {isLoading ? (
        <Card className="p-5"><Skeleton className="h-56 w-full" /></Card>
      ) : rows.length === 0 ? (
        <Card><p className="p-8 text-center text-sm text-muted-foreground">{debounced ? 'No students match.' : 'No students.'}</p></Card>
      ) : (
        <div className={isFetching ? 'opacity-60' : ''}>
          <TableWrapper>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Student</TableHead>
                  <TableHead>Roll</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.rollNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{s.className ?? '—'}</TableCell>
                    <TableCell><Badge variant={s.status === 'active' ? 'success' : 'neutral'} className="capitalize">{s.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages} · {data?.meta?.total ?? rows.length} students</p>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)} aria-label="Previous"><ChevronLeft size={16} /></Button>
              <Button variant="secondary" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)} aria-label="Next"><ChevronRight size={16} /></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
