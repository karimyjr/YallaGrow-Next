// POST /api/affiliate/verify-otp
// Body: { email, code }
// - Looks up most recent unused, unexpired code for the email
// - Compares sha256 hashes
// - Max 5 wrong attempts per code (invalidates the code on attempt 5)
// - On success: creates affiliate_sessions row + sets HTTP-only cookie
//   good for 7 days

import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'

const MAX_ATTEMPTS = 5
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
export const SESSION_COOKIE = 'yg_aff_session'

export async function POST(req: NextRequest) {
  let body: { email?: string; code?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const email = String(body.email || '').trim().toLowerCase()
  const code = String(body.code || '').trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }
  if (!/^\d{4}$/.test(code)) {
    return NextResponse.json({ error: 'Enter the 4-digit code.' }, { status: 400 })
  }

  // Grab the most recent unused code for this email
  const { data: otp } = await supabaseAdmin
    .from('affiliate_otp_codes')
    .select('id, code_hash, attempts, used, expires_at')
    .eq('email', email)
    .eq('used', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!otp) {
    return NextResponse.json({ error: 'No active code. Request a new one.' }, { status: 400 })
  }
  if (new Date(otp.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 })
  }
  if (otp.attempts >= MAX_ATTEMPTS) {
    // Belt + suspenders — should already be marked used below once hit.
    return NextResponse.json({ error: 'Too many wrong attempts. Request a new code.' }, { status: 429 })
  }

  const hash = sha256(code)
  if (hash !== otp.code_hash) {
    const newAttempts = otp.attempts + 1
    const update: Record<string, unknown> = { attempts: newAttempts }
    if (newAttempts >= MAX_ATTEMPTS) update.used = true
    await supabaseAdmin.from('affiliate_otp_codes').update(update).eq('id', otp.id)
    const remaining = MAX_ATTEMPTS - newAttempts
    if (remaining <= 0) {
      return NextResponse.json({ error: 'Too many wrong attempts. Request a new code.' }, { status: 429 })
    }
    return NextResponse.json({ error: `Wrong code. ${remaining} attempt${remaining === 1 ? '' : 's'} left.` }, { status: 400 })
  }

  // Burn the code so it can't be reused
  await supabaseAdmin.from('affiliate_otp_codes').update({ used: true }).eq('id', otp.id)

  // Find the affiliate
  const { data: affiliate } = await supabaseAdmin
    .from('affiliates')
    .select('id, status')
    .ilike('email', email)
    .maybeSingle()
  if (!affiliate) {
    return NextResponse.json({ error: 'No affiliate account found for this email.' }, { status: 404 })
  }
  if (affiliate.status === 'rejected') {
    return NextResponse.json({ error: 'This account is not approved.' }, { status: 403 })
  }

  // Create session
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString()
  const { error: sessErr } = await supabaseAdmin.from('affiliate_sessions').insert({
    token,
    affiliate_id: affiliate.id,
    email,
    expires_at: expiresAt,
  })
  if (sessErr) {
    console.error('[verify-otp] session insert failed:', sessErr)
    return NextResponse.json({ error: 'Could not start session.' }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000, // seconds
  })
  return res
}

function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex')
}
