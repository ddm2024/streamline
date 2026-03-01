import { OnboardingForm } from './onboarding-form'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Get Started</h1>
          <p className="text-muted-foreground mt-2">Create your Streamline account. Free to start.</p>
        </div>
        <OnboardingForm />
        <p className="text-center text-xs text-muted-foreground mt-6">
          Already have an account?{' '}
          <a href="/login" className="underline underline-offset-4 hover:text-primary">Sign in</a>
        </p>
      </div>
    </div>
  )
}
