'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableWrapper, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { SearchInput } from '@/components/ui/search-input';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate } from '@/lib/utils';
import { useGetInstitutionsQuery, type InstitutionRow } from '@/store/api/superadminApi';

const statusBadge: Record<InstitutionRow['status'], { variant: 'success' | 'warning' | 'danger' | 'neutral'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  trial: { variant: 'warning', label: 'Trial' },
  suspended: { variant: 'danger', label: 'Suspended' },
  pending: { variant: 'neutral', label: 'Pending' },
};

const PAGE_SIZE = 20;

export function InstitutionsView() {
  const router = useRouter();
  const [query, setQuery] = useState(() =>
    typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('q') ?? ''
  );
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(query, 350);
  const openDetail = (id: string) => router.push(`/superadmin/institutions/${id}`);

  const { data, isLoading, isFetching, isError, refetch } = useGetInstitutionsQuery({
    search: debounced || undefined,
    status: status === 'all' ? undefined : status,
    page,
    limit: PAGE_SIZE,
  });

  const rows = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Institutions" description={isLoading ? 'Loading…' : `${data?.meta?.total ?? rows.length} institutions`} />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={(v) => { setQuery(v); setPage(1); }}
            placeholder="Search by name, slug or city…"
            className="flex-1"
          />
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="sm:w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {isError ? (
        <Card><EmptyState icon={AlertCircle} title="Couldn't load institutions" action={<Button variant="secondary" size="sm" onClick={() => refetch()}>Retry</Button>} /></Card>
      ) : isLoading ? (
        <Card className="p-5"><Skeleton className="h-56 w-full" /></Card>
      ) : rows.length === 0 ? (
        <Card><EmptyState icon={Building2} title="No institutions found" /></Card>
      ) : (
        <div className={isFetching ? 'opacity-60' : ''}>
          <div className="hidden md:block">
            <TableWrapper>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Institution</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((i) => (
                    <TableRow key={i.id} className="cursor-pointer" onClick={() => openDetail(i.id)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground"><Building2 size={16} /></span>
                          <div>
                            <p className="font-medium text-foreground">{i.name}</p>
                            <p className="text-xs capitalize text-muted-foreground">{i.type}{i.city ? ` · ${i.city}` : ''}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize text-muted-foreground">{i.plan}</TableCell>
                      <TableCell className="text-foreground">{i.students}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(i.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={statusBadge[i.status].variant}>{statusBadge[i.status].label}</Badge>
                          {i.autoRenew && (
                            <span title="Auto-renewal is on for this institution">
                              <Badge variant="neutral"><RefreshCw size={10} /> Auto</Badge>
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </div>

          <div className="space-y-3 md:hidden">
            {rows.map((i) => (
              <Card key={i.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground"><Building2 size={16} /></span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{i.name}</p>
                      <p className="text-xs capitalize text-muted-foreground">{i.plan} · {i.students} students</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={statusBadge[i.status].variant}>{statusBadge[i.status].label}</Badge>
                    {i.autoRenew && <Badge variant="neutral"><RefreshCw size={10} /> Auto</Badge>}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} aria-label="Previous"><ChevronLeft size={16} /></Button>
              <Button variant="secondary" size="icon" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} aria-label="Next"><ChevronRight size={16} /></Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
