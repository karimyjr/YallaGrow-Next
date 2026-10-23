// Admin API — affiliate_resource_items table CRUD via service role
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { requireAdmin } from '@/lib/admin-auth'

// GET ?resource_id=xxx — list items for a single resource
export async function GET(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  const { searchParams } = new URL(req.url)
  const resourceId = searchParams.get('resource_id')
  if (!resourceId) {
    return NextResponse.json({ error: 'resource_id required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('affiliate_resource_items')
    .select('*')
    .eq('resource_id', resourceId)
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data || [] })
}

// POST — insert a new item (text, file, or link)
export async function POST(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  try {
    const body = await req.json()
    const required = ['resource_id', 'type']
    for (const k of required) {
      if (!body[k]) return NextResponse.json({ error: `${k} required` }, { status: 400 })
    }
    if (!['text', 'file', 'link'].includes(body.type)) {
      return NextResponse.json({ error: 'type must be text, file, or link' }, { status: 400 })
    }

    const row = {
      resource_id: body.resource_id,
      type: body.type,
      title: body.title || '',
      content: body.content || null,
      url: body.url || null,
      file_size: body.file_size || null,
      sort_order: body.sort_order ?? 0,
    }

    const { error } = await supabaseAdmin.from('affiliate_resource_items').insert(row)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// PATCH — update an item (partial)
export async function PATCH(req: NextRequest) {
  const err = requireAdmin(req)
  if (err) return err

  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const allowed: Record<string, unknown> = {}
    for (const k of ['title', 'content', 'url', 'file_size', 'sort_order', 'type']) {
      if (k in updates) allowed[k] = (updates as Record<string, unknown>)[k]
    }

    const { error } = await supabaseAdmin
      .from('affiliate_resource_items')
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
    .from('affiliate_resource_items')
    .delete()
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
