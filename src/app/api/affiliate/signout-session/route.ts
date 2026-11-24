// POST /api/affiliate/signout-session
// Deletes the session row and clears the cookie.
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

const SESSION_COOKIE = 'yg_aff_session'

export async function POST(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (token) {
    await supabaseAdmin.from('affiliate_sessions').delete().eq('token', token)
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set({ name: SESSION_COOKIE, value: '', maxAge: 0, path: '/' })
  return res
}
