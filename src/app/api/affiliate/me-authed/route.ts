// Affiliate data endpoint for Magic Link flow.
// Client sends its Supabase access_token (Authorization: Bearer ...);
// we validate it with the service-role client, extract the email, and
// return that affiliate's profile + referrals.
//
// Magic Link auth means the email is proven-owned (they clicked a
// link sent to it) — so email alone is enough to fetch, no ref_code
// required like the legacy /api/affiliate/me endpoint.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  if (!token) {
    return NextResponse.json({ error: 'Missing auth token' }, { status: 401 })
  }

  // Validate the token via the admin client's auth helper
  const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token)
  if (userErr || !userData?.user?.email) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 })
  }
  const email = userData.user.email.toLowerCase()

  // Look up affiliate by email
  const { data: affiliate, error: affErr } = await supabaseAdmin
    .from('affiliates')
    .select('id, full_name, email, country, audience_size, website, promotion_plan, ref_code, status, created_at')
    .ilike('email', email)
    .maybeSingle()

  if (affErr) {
    console.error('[api/affiliate/me-authed] lookup failed:', affErr)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
  if (!affiliate) {
    // Signed in to Supabase, but no affiliate record matches this email.
    // Could be a typo or someone who hasn't applied yet.
    return NextResponse.json({
      error: 'No affiliate account found for this email. Apply first at /affiliate.',
    }, { status: 404 })
  }
  if (affiliate.status === 'rejected') {
    return NextResponse.json({ error: 'This affiliate account was not approved.' }, { status: 403 })
  }

  const { data: referrals } = await supabaseAdmin
    .from('referrals')
    .select('id, client_name, client_email, invoice_amount, commission_rate, commission_amount, status, created_at')
    .eq('ref_code', affiliate.ref_code)
    .order('created_at', { ascending: false })

  return NextResponse.json({
    affiliate,
    referrals: referrals || [],
  })
}
