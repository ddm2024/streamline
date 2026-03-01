'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { onboardingSchema } from '@/lib/validations/auth'
import { z } from 'zod'

type OnboardingInput = z.infer<typeof onboardingSchema>

export async function onboardUser(data: OnboardingInput) {
  const parsed = onboardingSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Invalid form data' }
  }

  const { fullName, email, password, companyName, phone } = parsed.data
  const supabase = createAdminClient()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    return { error: authError?.message ?? 'Failed to create user' }
  }

  const userId = authData.user.id

  // 2. Create organization
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)

  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name: companyName, slug: `${slug}-${Date.now()}`, owner_id: userId, phone })
    .select('id')
    .single()

  if (orgError || !org) {
    return { error: 'Failed to create organization' }
  }

  // 3. Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ org_id: org.id, user_id: userId, full_name: fullName, email, role: 'owner' })

  if (profileError) {
    return { error: 'Failed to create profile' }
  }

  // 4. Set org_id in user metadata for JWT claims
  await supabase.auth.admin.updateUser(userId, {
    user_metadata: { org_id: org.id, full_name: fullName },
  })

  // 5. Sign in the new user
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    return { error: 'Account created but sign-in failed. Please log in.' }
  }

  return { success: true, orgId: org.id }
}
