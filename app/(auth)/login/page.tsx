'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Phone, Lock, AlertCircle, MailWarning } from 'lucide-react';
import { useLoginMutation, useResendVerificationMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { roleHome } from '@/lib/role-routes';

const loginSchema = z.object({
  phone: z.string().min(10, 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [login, { isLoading }] = useLoginMutation();
  const [resendVerification, { isLoading: resending }] = useResendVerificationMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginForm) => {
    setFormError(null);
    setNeedsVerification(false);
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({ user: result.data.user, accessToken: result.data.accessToken }));
      toast.success(`Welcome back, ${result.data.user.firstName}!`);
      router.push(roleHome(result.data.user.role));
    } catch (error: any) {
      if (error?.data?.error?.code === 'EMAIL_NOT_VERIFIED') {
        setNeedsVerification(true);
        setFormError(error.data.error.message);
        return;
      }
      const message =
        error?.data?.error?.message ||
        (error?.status === 'FETCH_ERROR'
          ? 'Cannot reach the server. Please try again.'
          : 'Invalid phone number or password.');
      setFormError(message);
    }
  };

  const onResend = async () => {
    if (!resendEmail.trim()) { toast.error('Enter the email you registered with'); return; }
    try {
      await resendVerification({ email: resendEmail.trim() }).unwrap();
      toast.success('Verification email sent — check your inbox.');
    } catch {
      toast.error('Could not resend the email. Please try again in a moment.');
    }
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your Marksly account to continue.
        </p>
      </div>

      {formError && !needsVerification && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger-soft px-3.5 py-3 text-sm text-danger"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {needsVerification && (
        <div
          role="alert"
          className="mb-5 space-y-2.5 rounded-lg border border-warning/30 bg-warning-soft px-3.5 py-3 text-sm text-warning"
        >
          <div className="flex items-start gap-2.5">
            <MailWarning size={17} className="mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Your registered email"
              dir="ltr"
              className="h-9 flex-1 rounded-md border border-warning/30 bg-card px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button type="button" size="sm" variant="secondary" loading={resending} onClick={onResend}>
              Resend
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Phone */}
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

        {/* Password */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <Label htmlFor="password" className="mb-0">Password</Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={!!errors.password}
              className={cn(
                'h-11 w-full rounded-lg border bg-card pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                errors.password ? 'border-danger' : 'border-input'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" loading={isLoading} className="mt-1 w-full" size="lg">
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Marksly?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Having trouble?{' '}
        <a href="mailto:support@marksly.pk" className="font-medium text-primary hover:underline">
          Contact support
        </a>
      </p>
    </div>
  );
}
