// Admin API — referrals table CRUD via service role (bypasses RLS)
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  const { data, error } = await supabaseAdmin
    .from('referrals')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ referrals: data || [] })
}

// Log a new referral
export async function POST(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  try {
    const body = await req.json()
    const required = ['ref_code', 'client_name', 'invoice_amount', 'commission_rate'] as const
    for (const k of required) {
      if (body[k] === undefined || body[k] === '') {
        return NextResponse.json({ error: `${k} required` }, { status: 400 })
      }
    }
    const row = {
      ref_code: String(body.ref_code).toUpperCase(),
      client_name: body.client_name,
      client_email: body.client_email || null,
      invoice_amount: Number(body.invoice_amount),
      commission_rate: Number(body.commission_rate),
      commission_amount: (Number(body.invoice_amount) * Number(body.commission_rate)) / 100,
      status: body.status || 'pending',
    }
    const { error } = await supabaseAdmin.from('referrals').insert(row)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, commission: row.commission_amount })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  try {
    const { id, status } = await req.json()
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status required' }, { status: 400 })
    }
    const { error } = await supabaseAdmin.from('referrals').update({ status }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
