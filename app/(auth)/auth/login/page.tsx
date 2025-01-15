import LoginForm from '@/components/auth/login-form'
import { requireNoAuth } from '@/lib/auth-utils'

export default async function LoginPage() {
  await requireNoAuth();
  return (
    <LoginForm />
  )
}