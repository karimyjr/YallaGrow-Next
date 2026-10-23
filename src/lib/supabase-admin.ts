// Service-role Supabase client — bypasses RLS. SERVER-SIDE ONLY.
// Never import this from a 'use client' component or an API route that
// doesn't check requireAdmin() first. Service role = full DB access.
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
}
if (!serviceKey) {
  console.warn(
    '[supabase-admin] SUPABASE_SERVICE_ROLE_KEY is not set. Admin writes will fail once RLS is enabled. Falling back to anon key.'
  )
}

export const supabaseAdmin = createClient(
  url,
  serviceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)
