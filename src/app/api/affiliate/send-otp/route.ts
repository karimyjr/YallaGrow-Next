// POST /api/affiliate/send-otp
// Body: { email }
// - Verifies email belongs to an affiliate (so we don't spam randoms)
// - Rate-limits to 3 sends/hour per email (DoS protection, plus
//   bounded email cost even on free SMTP)
// - Generates a 4-digit code, stores sha256(code), 10-min TTL
// - Emails the plaintext code to the affiliate via Resend

import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomInt } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendOtpEmail } from '@/lib/email'

const SEND_WINDOW_MS = 60 * 60 * 1000  // 1 hour
const MAX_SENDS_PER_WINDOW = 3
const CODE_TTL_MS = 10 * 60 * 1000     // 10 minutes

export async function POST(req: NextRequest) {
  let body: { email?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }

  const email = String(body.email || '').trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  // Must be a real affiliate — don't send codes to random addresses.
  const { data: aff } = await supabaseAdmin
    .from('affiliates')
    .select('id, status')
    .ilike('email', email)
    .maybeSingle()

  if (!aff) {
    // Same 200 shape as success so we don't reveal which emails are affiliates.
    return NextResponse.json({ ok: true })
  }
  if (aff.status === 'rejected') {
    return NextResponse.json({ error: 'This account is not approved.' }, { status: 403 })
  }

  // Rate limit — count recent sends for this email
  const windowStart = new Date(Date.now() - SEND_WINDOW_MS).toISOString()
  const { count: recentSends } = await supabaseAdmin
    .from('affiliate_otp_codes')
    .select('id', { count: 'exact', head: true })
    .eq('email', email)
    .gte('created_at', windowStart)

  if ((recentSends || 0) >= MAX_SENDS_PER_WINDOW) {
    return NextResponse.json({
      error: `Too many login attempts. Wait an hour and try again, or WhatsApp us at +961 76 302 159.`,
    }, { status: 429 })
  }

  // Generate 4-digit code (cryptographically random, leading zeros ok)
  const code = String(randomInt(0, 10000)).padStart(4, '0')
  const codeHash = sha256(code)
  const expiresAt = new Date(Date.now() + CODE_TTL_MS).toISOString()

  // Invalidate previous unused codes for this email (one active at a time)
  await supabaseAdmin
    .from('affiliate_otp_codes')
    .update({ used: true })
    .eq('email', email)
    .eq('used', false)

  const { error: insErr } = await supabaseAdmin.from('affiliate_otp_codes').insert({
    email,
    code_hash: codeHash,
    expires_at: expiresAt,
  })
  if (insErr) {
    console.error('[send-otp] insert failed:', insErr)
    return NextResponse.json({ error: 'Could not create login code. Please try again.' }, { status: 500 })
  }

  const emailResult = await sendOtpEmail(email, code)
  if (!emailResult.ok) {
    return NextResponse.json({ error: `Could not send the code: ${emailResult.error}` }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

function sha256(s: string): string {
  return createHash('sha256').update(s).digest('hex')
}
