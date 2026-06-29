'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CheckCircle2, Phone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const schema = z.object({ phone: z.string().min(10, 'Enter a valid phone number') });
type Form = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(schema), mode: 'onTouched' });

  const onSubmit = async (_data: Form) => {
    setFormError(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSentTo(getValues('phone'));
      setSent(true);
    } catch {
      setFormError('Something went wrong. Please try again.');
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 size={28} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Check your phone</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          We&apos;ve sent a 6-digit reset code via SMS to{' '}
          <span className="font-medium text-foreground" dir="ltr">{sentTo}</span>. Enter it to set a new password.
        </p>
        <Button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 w-full"
          size="lg"
          variant="secondary"
        >
          Use a different number
        </Button>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={15} /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Forgot password?</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enter your phone number and we&apos;ll send a reset code via SMS.
        </p>
      </div>

      {formError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-3 text-sm text-danger"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <div className="relative">
            <Phone
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="phone"
              {...register('phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              autoFocus
              dir="ltr"
              placeholder="0300 1234567"
              aria-invalid={!!errors.phone}
              className={cn(
                'h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                errors.phone ? 'border-danger' : 'border-input'
              )}
            />
          </div>
          {errors.phone && <p className="mt-1.5 text-xs text-danger">{errors.phone.message}</p>}
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
          {isSubmitting ? 'Sending…' : 'Send reset code'}
        </Button>
      </form>

      <Link
        href="/login"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft size={15} /> Back to sign in
      </Link>
    </div>
  );
}
