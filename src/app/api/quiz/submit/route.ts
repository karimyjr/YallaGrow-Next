// Public endpoint: captures a completed "Find My Plan" quiz with contact
// info right before we send the visitor off to the booking URL.
// Writes via anon key — works whether or not RLS is on (needs an insert
// policy for anon on quiz_submissions once RLS is enabled).

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate once at module load — don't throw at request time
if (!url || !anonKey) {
  console.warn('[api/quiz/submit] Missing Supabase env vars')
}

const supabase = createClient(url || '', anonKey || '', {
  auth: { persistSession: false, autoRefreshToken: false },
})

const ALLOWED_BUSINESS = new Set(['local', 'startup', 'ecommerce', 'service', 'personal'])
const ALLOWED_GOAL     = new Set(['awareness', 'leads', 'sales', 'presence', 'scale'])
const ALLOWED_STATE    = new Set(['none', 'inconsistent', 'active', 'scaling'])
const ALLOWED_INV      = new Set(['handoff', 'collab', 'guided'])
const ALLOWED_BUDGET   = new Set(['low', 'mid', 'high', 'unsure'])
const ALLOWED_PLAN     = new Set(['launch', 'grow', 'dominate'])

function clean(v: unknown, allow?: Set<string>): string | null {
  if (typeof v !== 'string') return null
  const s = v.trim()
  if (!s) return null
  if (allow && !allow.has(s)) return null
  return s
}

function cleanArray(v: unknown): string[] {
  if (!Array.isArray(v)) return []
  return v.filter(x => typeof x === 'string' && x.length < 60).slice(0, 20)
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
  const whatsapp = String(body.whatsapp || '').trim().slice(0, 40) || null

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  const row = {
    name,
    email,
    whatsapp,
    business_type:    clean(body.business_type, ALLOWED_BUSINESS),
    goal:             clean(body.goal, ALLOWED_GOAL),
    current_state:    clean(body.current_state, ALLOWED_STATE),
    services:         cleanArray(body.services),
    involvement:      clean(body.involvement, ALLOWED_INV),
    budget:           clean(body.budget, ALLOWED_BUDGET),
    recommended_plan: clean(body.recommended_plan, ALLOWED_PLAN),
    addons:           cleanArray(body.addons),
    booked_call:      Boolean(body.booked_call),
  }

  const { error } = await supabase.from('quiz_submissions').insert(row)
  if (error) {
    console.error('[api/quiz/submit] insert failed:', error)
    return NextResponse.json({ error: 'Could not save your answers. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
