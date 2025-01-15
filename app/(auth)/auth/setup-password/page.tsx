import SetupPasswordForm from '@/components/auth/set-password-form'
import { requireNoAuth } from '@/lib/auth-utils';

export default async function SetupPasswordPage() {
  await requireNoAuth();
  return (
    <SetupPasswordForm />
  )
}