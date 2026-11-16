// Public affiliate self-service endpoint.
// Caller must POST both their email AND their ref_code — knowing just
// one isn't enough. Returns the affiliate's profile + every referral
// logged against their ref_code. Uses the service-role client so it
// works regardless of RLS on the tables.
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  let body: { email?: string; ref_code?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = String(body.email || '').trim().toLowerCase()
  const refCode = String(body.ref_code || '').trim().toUpperCase()

  if (!email || !refCode) {
    return NextResponse.json({ error: 'Email and referral code are required.' }, { status: 400 })
  }

  // Look up the affiliate by BOTH email and ref_code.
  // Mismatched pair → 401, same response as "doesn't exist", so you
  // can't probe the table.
  const { data: affiliate, error } = await supabaseAdmin
    .from('affiliates')
    .select('id, full_name, email, country, audience_size, website, promotion_plan, ref_code, status, created_at')
    .ilike('email', email)
    .eq('ref_code', refCode)
    .maybeSingle()

  if (error || !affiliate) {
    return NextResponse.json({ error: 'No match — check your email and referral code.' }, { status: 401 })
  }

  if (affiliate.status === 'rejected') {
    return NextResponse.json({ error: 'This affiliate account was not approved.' }, { status: 403 })
  }

  // Load their referrals
  const { data: referrals } = await supabaseAdmin
    .from('referrals')
    .select('id, client_name, client_email, invoice_amount, commission_rate, commission_amount, status, created_at')
    .eq('ref_code', refCode)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    affiliate,
    referrals: referrals || [],
  })
}
