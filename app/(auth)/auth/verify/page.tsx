import VerifyForm from '@/components/auth/verify-form'
import { requireNoAuth } from '@/lib/auth-utils';

export default async function VerifyPage() {
  await requireNoAuth();
  return (
    <VerifyForm />
  )
}