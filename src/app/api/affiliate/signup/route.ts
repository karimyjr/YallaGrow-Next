// Public affiliate signup endpoint — service-role insert so it works
// whether or not RLS is enabled on the affiliates table. Generates a
// unique ref_code per application. Status starts as "pending" until
// Karim approves in the admin panel.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// Generate an 8-character alphanumeric ref code. Collision chance over
// 100k affiliates is ~0.03%; a conflict just loops.
function generateRefCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let out = ''
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

async function uniqueRefCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateRefCode()
    const { data } = await supabaseAdmin
      .from('affiliates')
      .select('id')
      .eq('ref_code', code)
      .limit(1)
    if (!data || data.length === 0) return code
  }
  // Should be statistically impossible to reach here
  return generateRefCode() + Date.now().toString(36).slice(-2).toUpperCase()
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const name = String(body.name || '').trim().slice(0, 120)
  const email = String(body.email || '').trim().toLowerCase().slice(0, 160)
  const whatsapp = String(body.whatsapp || '').trim().slice(0, 40)
  const instagram = String(body.instagram || '').trim().slice(0, 80) || null
  const website = String(body.website || '').trim().slice(0, 200) || null
  const audience = String(body.audience || '').trim().slice(0, 40) || null
  const plan = String(body.plan || '').trim().slice(0, 500) || null

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }
  if (whatsapp.replace(/\D/g, '').length < 6) {
    return NextResponse.json({ error: 'A valid WhatsApp number is required.' }, { status: 400 })
  }

  // One account per email
  const { data: existing } = await supabaseAdmin
    .from('affiliates')
    .select('id, status')
    .ilike('email', email)
    .limit(1)
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'This email already has an application on file. Sign in with your referral code instead.' }, { status: 409 })
  }

  const ref_code = await uniqueRefCode()

  // Match the schema the existing public form inserts into — the
  // "website" column holds a combined social/web string historically.
  const combinedWeb = [instagram, website].filter(Boolean).join(' | ') || null

  const { error } = await supabaseAdmin.from('affiliates').insert({
    full_name: name,
    email,
    // some schemas have a "country" column from the legacy form; keep null
    country: null,
    audience_size: audience,
    website: combinedWeb,
    promotion_plan: plan,
    whatsapp,
    ref_code,
    status: 'pending',
  })

  if (error) {
    console.error('[api/affiliate/signup] insert failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, ref_code })
}
