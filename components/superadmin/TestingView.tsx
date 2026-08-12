'use client';

import { useState } from 'react';
import { FlaskConical, Play, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRunAutoRenewSweepMutation } from '@/store/api/billingApi';

/**
 * Superadmin-only tools for exercising backend jobs/flows on demand instead
 * of waiting for their real schedule (cron) or faking dates in the database.
 * Each tool is deliberately self-contained (its own card, its own run/result
 * state) so new ones can be dropped in independently as they're needed —
 * this page is meant to grow, not stay a single button forever.
 */
export function TestingView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Testing"
        description="Manually trigger backend jobs and flows — for verifying behavior without waiting for a schedule or faking dates."
      />
      <AutoRenewalSweepTool />
    </div>
  );
}

type SweepResult = { checked: number; charged: number; failed: number; fellBack: number };

function AutoRenewalSweepTool() {
  const [runSweep, { isLoading }] = useRunAutoRenewSweepMutation();
  const [result, setResult] = useState<SweepResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onRun = async () => {
    setError(null);
    setResult(null);
    try {
      const res = await runSweep().unwrap();
      setResult(res.data);
    } catch (e: any) {
      setError(e?.data?.error?.message || 'Could not run the sweep — check the server logs for details.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FlaskConical size={18} /> Auto-renewal charge sweep</CardTitle>
        <CardDescription>
          Runs the exact same daily job that normally fires at 02:30 (Asia/Karachi) — attempts a merchant-initiated
          charge for every subscription with auto-renewal on whose renewal date or retry is due. Safe to run any
          time: subscriptions that aren't actually due are skipped, so this never double-charges anyone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={onRun} loading={isLoading}>
          <Play size={15} /> Run sweep now
        </Button>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2.5 text-sm text-danger">
            <XCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-lg border border-success/30 bg-success-soft px-3 py-2.5 text-sm text-success">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>Sweep complete.</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <ResultStat label="Checked" value={result.checked} variant="neutral" />
              <ResultStat label="Charged" value={result.charged} variant="success" />
              <ResultStat label="Failed" value={result.failed} variant="warning" />
              <ResultStat label="Fell back to manual" value={result.fellBack} variant="danger" />
            </div>
            {result.failed > 0 && (
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                A failed charge doesn't necessarily mean something's broken — check the decline reason in the
                institution's charge attempts before assuming a bug.
              </p>
            )}
            {result.checked === 0 && (
              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <RefreshCw size={13} className="mt-0.5 shrink-0" />
                Nothing was due. If you're testing this, make sure a subscription has auto-renewal on, a saved
                card, and a <code className="rounded bg-muted px-1 py-0.5">nextBillingAt</code> in the past.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ResultStat({ label, value, variant }: { label: string; value: number; variant: 'neutral' | 'success' | 'warning' | 'danger' }) {
  return (
    <Badge variant={variant} className="gap-1.5 px-2.5 py-1 text-xs">
      <span className="font-semibold">{value}</span> {label}
    </Badge>
  );
}
