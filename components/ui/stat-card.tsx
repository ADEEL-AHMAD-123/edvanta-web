import * as React from 'react';
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Card } from './card';
import { cn } from '@/lib/utils';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'info';

const toneClasses: Record<Tone, string> = {
  primary: 'bg-primary-soft text-primary-soft-foreground',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-primary-soft text-primary-soft-foreground',
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: Tone;
  /** e.g. "+12%". Positive (default) shows green up arrow; negative red down. */
  delta?: string;
  deltaDirection?: 'up' | 'down';
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  delta,
  deltaDirection = 'up',
}: StatCardProps) {
  const down = deltaDirection === 'down';
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', toneClasses[tone])}>
          <Icon size={20} />
        </div>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
              down ? 'bg-danger-soft text-danger' : 'bg-success-soft text-success'
            )}
          >
            {down ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
    </Card>
  );
}
