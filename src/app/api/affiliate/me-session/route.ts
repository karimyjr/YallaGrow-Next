// GET /api/affiliate/me-session
// Reads the yg_aff_session cookie, looks up the session, returns the
// affiliate's profile + referrals. Also bumps last_seen_at.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const SESSION_COOKIE = 'yg_aff_session'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: session } = await supabaseAdmin
    .from('affiliate_sessions')
    .select('affiliate_id, email, expires_at')
    .eq('token', token)
    .maybeSingle()
  if (!session) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  if (new Date(session.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 })
  }

  // Touch last_seen_at (fire and forget)
  supabaseAdmin
    .from('affiliate_sessions')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('token', token)
    .then(() => {}, () => {})

  const { data: affiliate, error: affErr } = await supabaseAdmin
    .from('affiliates')
    .select('id, full_name, email, country, audience_size, website, promotion_plan, ref_code, status, created_at')
    .eq('id', session.affiliate_id)
    .maybeSingle()
  if (affErr || !affiliate) {
    return NextResponse.json({ error: 'Affiliate not found.' }, { status: 404 })
  }

  const { data: referrals } = await supabaseAdmin
    .from('referrals')
    .select('id, client_name, client_email, invoice_amount, commission_rate, commission_amount, status, created_at')
    .eq('ref_code', affiliate.ref_code)
    .order('created_at', { ascending: false })

  return NextResponse.json({ affiliate, referrals: referrals || [] })
}
