import { LoginForm } from './login-form'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Streamline</h1>
          <p className="text-muted-foreground mt-2">Field service management for home service businesses.</p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <a href="/onboarding" className="underline underline-offset-4 hover:text-primary">Get started</a>
        </p>
      </div>
    </div>
  )
}
