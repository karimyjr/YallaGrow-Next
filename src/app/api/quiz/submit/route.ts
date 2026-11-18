// Public endpoint: captures a completed "Find My Plan" quiz with contact
// info right before we send the visitor off to the booking URL.
//
// Uses the service-role client so RLS can't block us. Safe because this
// endpoint only INSERTS validated, allow-listed values into one table —
// it never reads, updates, or deletes. The validation below means a
// tampered payload turns into nulls, not junk.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

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
  const whatsapp = String(body.whatsapp || '').trim().slice(0, 40)

  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }
  // WhatsApp required — need at least 6 digits so we can reach the lead.
  const whatsappDigits = whatsapp.replace(/\D/g, '')
  if (whatsappDigits.length < 6) {
    return NextResponse.json({ error: 'A valid WhatsApp number is required.' }, { status: 400 })
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

  const { error } = await supabaseAdmin.from('quiz_submissions').insert(row)

  if (error) {
    // Surface the real Supabase error so it's diagnosable from the UI.
    // Common causes:
    //  - relation "public.quiz_submissions" does not exist → run the SQL
    //    migration at supabase/quiz-submissions-table.sql
    //  - SUPABASE_SERVICE_ROLE_KEY not set in Vercel → set it in env vars
    console.error('[api/quiz/submit] insert failed:', error)
    const hint =
      /does not exist/i.test(error.message)
        ? 'The quiz_submissions table does not exist yet. Run the SQL migration in Supabase first.'
        : /row-level security|RLS/i.test(error.message)
          ? 'Row-level security is blocking the insert. The service-role key may not be set in Vercel env vars.'
          : error.message
    return NextResponse.json({ error: hint, raw: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
