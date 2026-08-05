'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Palette } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { useUpdateProfileMutation, useChangePasswordMutation } from '@/store/api/authApi';
import { useTheme } from '@/components/theme/ThemeProvider';
import { THEMES } from '@/lib/themes';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const { user } = useAppSelector((s) => s.auth);
  const isSuperadmin = user?.role === 'superadmin';

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {isSuperadmin && <TabsTrigger value="appearance">Appearance</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="security"><SecurityTab /></TabsContent>
        {isSuperadmin && <TabsContent value="appearance"><AppearanceTab /></TabsContent>}
      </Tabs>
    </div>
  );
}

/* ── Profile ───────────────────────────────────────────────────────────────── */
const profileSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Enter a valid phone number'),
});
type ProfileForm = z.infer<typeof profileSchema>;

function ProfileTab() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    },
  });

  const onSubmit = async (values: ProfileForm) => {
    try {
      const res = await updateProfile({ ...values, email: values.email || undefined }).unwrap();
      dispatch(updateUser(res.data));
      toast.success('Profile updated');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not update profile');
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && <p className="mt-1 text-xs text-danger">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && <p className="mt-1 text-xs text-danger">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" dir="ltr" {...register('phone')} />
            {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" dir="ltr" {...register('email')} />
            {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isLoading}>Save changes</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── Security ──────────────────────────────────────────────────────────────── */
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'Add an uppercase letter').regex(/[0-9]/, 'Add a number'),
  confirm: z.string(),
}).refine((d) => d.newPassword === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });
type PasswordForm = z.infer<typeof passwordSchema>;

function SecurityTab() {
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: PasswordForm) => {
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword }).unwrap();
      dispatch(updateUser({ mustChangePassword: false }));
      toast.success('Password changed');
      reset();
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not change password');
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>Use at least 8 characters with an uppercase letter and a number.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" type="password" autoComplete="current-password" {...register('currentPassword')} />
            {errors.currentPassword && <p className="mt-1 text-xs text-danger">{errors.currentPassword.message}</p>}
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" type="password" autoComplete="new-password" {...register('newPassword')} />
            {errors.newPassword && <p className="mt-1 text-xs text-danger">{errors.newPassword.message}</p>}
          </div>
          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input id="confirm" type="password" autoComplete="new-password" {...register('confirm')} />
            {errors.confirm && <p className="mt-1 text-xs text-danger">{errors.confirm.message}</p>}
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={isLoading}>Update password</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ── Appearance (super admin) ──────────────────────────────────────────────── */
function AppearanceTab() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Palette size={18} /> Theme</CardTitle>
        <CardDescription>Choose the color theme for the whole platform. Applies to everyone.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {THEMES.map((t) => {
            const active = t.id === theme;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                  active ? 'border-primary bg-primary-soft' : 'border-border hover:bg-muted'
                )}
              >
                <span className="h-8 w-8 shrink-0 rounded-full ring-1 ring-border" style={{ background: t.swatch }} />
                <span className="flex-1 text-sm font-medium text-foreground">{t.name}</span>
                {active && <Check size={16} className="text-primary" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
