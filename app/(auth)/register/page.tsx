'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, Building2, User, Phone, Mail, Lock, AlertCircle, Check,
} from 'lucide-react';
import { useRegisterMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const schema = z.object({
  institutionName: z.string().min(2, 'Institution name is required'),
  institutionType: z.enum(['academy', 'school', 'college', 'university'], {
    errorMap: () => ({ message: 'Select an institution type' }),
  }),
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Add an uppercase letter')
    .regex(/[0-9]/, 'Add a number'),
});

type Form = z.infer<typeof schema>;

const TYPES = [
  { value: 'academy', label: 'Academy / Tuition Center' },
  { value: 'school', label: 'School' },
  { value: 'college', label: 'College' },
  { value: 'university', label: 'University' },
];

const fieldCls = (err?: boolean) =>
  cn(
    'h-11 w-full rounded-lg border bg-card pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    err ? 'border-danger' : 'border-input'
  );

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [registerInstitution, { isLoading }] = useRegisterMutation();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>({ resolver: zodResolver(schema), mode: 'onTouched' });

  const password = watch('password') || '';
  const rules = [
    { ok: password.length >= 8, label: '8+ characters' },
    { ok: /[A-Z]/.test(password), label: 'Uppercase' },
    { ok: /[0-9]/.test(password), label: 'Number' },
  ];

  const onSubmit = async (data: Form) => {
    setFormError(null);
    try {
      const result = await registerInstitution(data).unwrap();
      dispatch(setCredentials({ user: result.data.user, accessToken: result.data.accessToken }));
      toast.success('Welcome to Edvanta! Your 14-day trial has started.');
      router.push('/admin');
    } catch (error: any) {
      setFormError(
        error?.data?.error?.message ||
          (error?.status === 'FETCH_ERROR'
            ? 'Cannot reach the server. Please try again.'
            : 'Could not create your account. Please try again.')
      );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start your free 14-day trial — no credit card required.
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
        {/* Institution name */}
        <div>
          <Label htmlFor="institutionName">Institution name</Label>
          <div className="relative">
            <Building2 size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="institutionName"
              {...register('institutionName')}
              placeholder="e.g. Iqra Academy"
              autoFocus
              aria-invalid={!!errors.institutionName}
              className={fieldCls(!!errors.institutionName)}
            />
          </div>
          {errors.institutionName && <p className="mt-1.5 text-xs text-danger">{errors.institutionName.message}</p>}
        </div>

        {/* Institution type */}
        <div>
          <Label htmlFor="institutionType">Institution type</Label>
          <Controller
            control={control}
            name="institutionType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={!!errors.institutionType} className={errors.institutionType ? 'border-danger' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.institutionType && <p className="mt-1.5 text-xs text-danger">{errors.institutionType.message}</p>}
        </div>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <div className="relative">
              <User size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input id="firstName" {...register('firstName')} placeholder="Ahmed" aria-invalid={!!errors.firstName} className={fieldCls(!!errors.firstName)} />
            </div>
            {errors.firstName && <p className="mt-1.5 text-xs text-danger">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <input id="lastName" {...register('lastName')} placeholder="Khan" aria-invalid={!!errors.lastName} className={cn(fieldCls(!!errors.lastName), 'pl-3')} />
            {errors.lastName && <p className="mt-1.5 text-xs text-danger">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <div className="relative">
            <Phone size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input id="phone" {...register('phone')} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="0300 1234567" aria-invalid={!!errors.phone} className={fieldCls(!!errors.phone)} />
          </div>
          {errors.phone && <p className="mt-1.5 text-xs text-danger">{errors.phone.message}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input id="email" {...register('email')} type="email" autoComplete="email" dir="ltr" placeholder="you@institute.pk" aria-invalid={!!errors.email} className={fieldCls(!!errors.email)} />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              aria-invalid={!!errors.password}
              className={cn(fieldCls(!!errors.password), 'pr-10')}
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
          <div className="mt-2 flex flex-wrap gap-2">
            {rules.map((r) => (
              <span
                key={r.label}
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs',
                  r.ok ? 'bg-success-soft text-success' : 'bg-muted text-muted-foreground'
                )}
              >
                <Check size={11} className={r.ok ? 'opacity-100' : 'opacity-40'} />
                {r.label}
              </span>
            ))}
          </div>
        </div>

        <Button type="submit" loading={isLoading} className="mt-1 w-full" size="lg">
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
