// Admin API — affiliate_resources table CRUD via service role
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  const { data, error } = await supabaseAdmin
    .from('affiliate_resources')
    .select('*')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resources: data || [] })
}

// Create a new resource
export async function POST(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  try {
    const { title, slug, icon, sort_order } = await req.json()
    if (!title || !slug) {
      return NextResponse.json({ error: 'title and slug required' }, { status: 400 })
    }
    const { data, error } = await supabaseAdmin
      .from('affiliate_resources')
      .insert({ title, slug, icon: icon || 'document', sort_order: sort_order ?? 0 })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ resource: data })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// Update a resource (metadata + toggle enabled)
export async function PATCH(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    // Whitelist updateable fields
    const allowed: Record<string, unknown> = {}
    for (const k of ['title', 'slug', 'icon', 'description', 'cta_text', 'enabled', 'sort_order']) {
      if (k in updates) allowed[k] = (updates as Record<string, unknown>)[k]
    }

    const { error } = await supabaseAdmin
      .from('affiliate_resources')
      .update(allowed)
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('affiliate_resources')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
