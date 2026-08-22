'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { useChangePasswordMutation } from '@/store/api/authApi';
import { Logo } from '@/components/brand/Logo';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Required'),
    newPassword: z
      .string()
      .min(8, 'At least 8 characters')
      .regex(/[A-Z]/, 'Add an uppercase letter')
      .regex(/[0-9]/, 'Add a number'),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });
type PasswordForm = z.infer<typeof passwordSchema>;

/**
 * Blocks the entire dashboard behind a mandatory password-reset form for
 * accounts still on an auto-generated temporary password. Rendered by the
 * dashboard layout whenever `user.mustChangePassword` is true — nothing
 * else in the app is reachable until it succeeds.
 */
export function ForcePasswordChangeGate() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values: PasswordForm) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      dispatch(updateUser({ mustChangePassword: false }));
      toast.success('Password updated — welcome to Marksly.');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Could not change password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Logo className="mb-2" />
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>
            {user?.firstName ? `Hi ${user.firstName}, ` : ''}your account was created with a temporary
            password. Set your own before continuing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Temporary password</Label>
              <Input
                id="currentPassword"
                type="password"
                autoComplete="current-password"
                {...register('currentPassword')}
              />
              {errors.currentPassword && (
                <p className="mt-1 text-xs text-danger">{errors.currentPassword.message}</p>
              )}
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
            <Button type="submit" className="w-full" loading={isLoading}>
              Set password &amp; continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
