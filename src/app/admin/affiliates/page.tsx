'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface Affiliate {
  id: string
  full_name: string
  email: string
  ref_code: string
  status: string
  website: string
  country: string
  created_at: string
}

interface Referral {
  id: string
  ref_code: string
  client_name: string
  client_email: string
  invoice_amount: number
  commission_rate: number
  commission_amount: number
  status: string
  created_at: string
}

interface Resource {
  id: string
  slug: string
  title: string
  description: string
  icon: string
  cta_text: string
  enabled: boolean
  sort_order: number
}

interface ResourceItem {
  id: string
  resource_id: string
  type: 'text' | 'file' | 'link'
  title: string
  content: string
  url: string
  file_size: string
  sort_order: number
}

export default function AdminAffiliatesPage() {
  const [tab, setTab] = useState<'members' | 'referrals' | 'resources'>('members')
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [search, setSearch] = useState('')
  const [editingResource, setEditingResource] = useState<Resource | null>(null)

  // Referral form state
  const [refCode, setRefCode] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [invoice, setInvoice] = useState('')
  const [rate, setRate] = useState(30)

  const loadAll = useCallback(async () => {
    const [a, r, res] = await Promise.all([
      supabase.from('affiliates').select('*').order('created_at', { ascending: false }),
      supabase.from('referrals').select('*').order('created_at', { ascending: false }),
      supabase.from('affiliate_resources').select('*').order('sort_order'),
    ])
    if (a.data) setAffiliates(a.data)
    if (r.data) setReferrals(r.data)
    if (res.data) setResources(res.data)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // === MEMBERS ACTIONS ===
  const updateAffiliateStatus = async (id: string, status: string) => {
    await supabase.from('affiliates').update({ status }).eq('id', id)
    loadAll()
  }
  const deleteAffiliate = async (id: string) => {
    if (!confirm('Permanently delete this affiliate?')) return
    await supabase.from('affiliates').delete().eq('id', id)
    loadAll()
  }

  // === REFERRAL ACTIONS ===
  const logReferral = async () => {
    if (!refCode || !clientName || !invoice) { alert('Fill in ref code, client name, and invoice amount.'); return }
    const commission = (Number(invoice) * rate) / 100
    await supabase.from('referrals').insert({
      ref_code: refCode.toUpperCase(),
      client_name: clientName,
      client_email: clientEmail,
      invoice_amount: Number(invoice),
      commission_rate: rate,
      commission_amount: commission,
      status: 'pending',
    })
    setRefCode(''); setClientName(''); setClientEmail(''); setInvoice(''); setRate(30)
    loadAll()
    alert(`Referral logged! Commission: $${commission.toFixed(2)}`)
  }
  const updateReferralStatus = async (id: string, status: string) => {
    await supabase.from('referrals').update({ status }).eq('id', id)
    loadAll()
  }

  // === RESOURCE ACTIONS ===
  const toggleResource = async (id: string, enabled: boolean) => {
    await supabase.from('affiliate_resources').update({ enabled: !enabled }).eq('id', id)
    loadAll()
  }
  const addResource = async () => {
    const title = prompt('Resource title (e.g. "Case Studies"):')
    if (!title) return
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const icon = prompt('Emoji icon (e.g. 📊):') || '📄'
    const { data } = await supabase.from('affiliate_resources').insert({
      title, slug, icon, sort_order: resources.length + 1,
    }).select().single()
    if (data) setEditingResource(data)
    loadAll()
  }
  const deleteResource = async (id: string) => {
    if (!confirm('Delete this resource and all its content?')) return
    await supabase.from('affiliate_resources').delete().eq('id', id)
    loadAll()
    setEditingResource(null)
  }

  const filteredAffiliates = affiliates.filter(a =>
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase()) ||
    a.ref_code?.toLowerCase().includes(search.toLowerCase())
  )

  // If editing a resource, show editor
  if (editingResource) {
    return <ResourceEditor resource={editingResource} onClose={() => { setEditingResource(null); loadAll() }} onDelete={() => deleteResource(editingResource.id)} />
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '8px' }}>🤝 Affiliate Program</h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Manage members, referrals, and marketing resources.</p>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--glass-border)', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[
          { id: 'members', label: '👥 Members', count: affiliates.length },
          { id: 'referrals', label: '📊 Referrals', count: referrals.length },
          { id: 'resources', label: '🎓 Marketing Resources', count: resources.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as 'members' | 'referrals' | 'resources')} style={{
            background: tab === t.id ? 'rgba(16,161,219,0.08)' : 'transparent',
            border: 'none',
            borderBottom: tab === t.id ? '2px solid var(--sky)' : '2px solid transparent',
            padding: '12px 20px', cursor: 'pointer',
            color: tab === t.id ? 'var(--sky)' : 'var(--text-muted)',
            fontSize: '0.88rem', fontWeight: 600, fontFamily: 'Inter,sans-serif',
            marginBottom: '-1px',
          }}>
            {t.label} <span style={{ opacity: 0.6, fontSize: '0.75rem' }}>({t.count})</span>
          </button>
        ))}
      </div>

      {/* MEMBERS TAB */}
      {tab === 'members' && (
        <>
          <input placeholder="🔍 Search by name, email, or code..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '11px 16px', color: 'var(--white)', width: '100%', maxWidth: '400px', marginBottom: '20px', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredAffiliates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>No affiliates yet.</div>
            ) : filteredAffiliates.map(a => (
              <div key={a.id} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <strong style={{ color: 'var(--white)', fontSize: '0.92rem' }}>{a.full_name}</strong>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>· {a.email}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    Code: <strong style={{ color: 'var(--sky)' }}>{a.ref_code}</strong>
                    {a.country && <> · {a.country}</>}
                    {a.created_at && <> · {new Date(a.created_at).toLocaleDateString()}</>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {a.status === 'pending' && (
                    <>
                      <button onClick={() => updateAffiliateStatus(a.id, 'active')} style={btnGreen}>Approve</button>
                      <button onClick={() => updateAffiliateStatus(a.id, 'rejected')} style={btnRed}>Reject</button>
                    </>
                  )}
                  {a.status === 'active' && <><span style={statusActive}>active</span><button onClick={() => updateAffiliateStatus(a.id, 'suspended')} style={btnRed}>Suspend</button></>}
                  {a.status === 'suspended' && <><span style={statusSuspended}>suspended</span><button onClick={() => updateAffiliateStatus(a.id, 'active')} style={btnGreen}>Reactivate</button></>}
                  {a.status === 'rejected' && <span style={statusRejected}>rejected</span>}
                  <button onClick={() => deleteAffiliate(a.id)} style={btnDelete}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* REFERRALS TAB */}
      {tab === 'referrals' && (
        <>
          <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '16px' }}>Log a Referral Manually</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input placeholder="Affiliate Ref Code *" value={refCode} onChange={e => setRefCode(e.target.value.toUpperCase())} style={inputStyle} />
              <input placeholder="Client Name *" value={clientName} onChange={e => setClientName(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <input placeholder="Client Email (optional)" type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={inputStyle} />
              <input placeholder="First Invoice Amount ($) *" type="number" value={invoice} onChange={e => setInvoice(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Commission Rate</div>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
              {[20, 25, 30, 35, 40].map(r => (
                <button key={r} onClick={() => setRate(r)} style={{ background: rate === r ? 'var(--sky)' : 'transparent', color: rate === r ? 'var(--dark)' : 'var(--text-muted)', border: '1px solid ' + (rate === r ? 'var(--sky)' : 'var(--glass-border)'), padding: '6px 14px', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>{r}%</button>
              ))}
            </div>
            {invoice && (
              <div style={{ background: 'rgba(16,161,219,0.05)', border: '1px solid rgba(16,161,219,0.15)', borderRadius: '10px', padding: '10px 14px', marginBottom: '12px', fontSize: '0.8rem', color: 'var(--sky)' }}>
                Estimated commission: <strong>${((Number(invoice) * rate) / 100).toFixed(2)}</strong>
              </div>
            )}
            <button onClick={logReferral} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Log Referral & Calculate Commission</button>
          </div>

          <h3 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--white)', marginBottom: '12px' }}>All Referrals ({referrals.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {referrals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>No referrals logged yet.</div>
            ) : referrals.map(r => (
              <div key={r.id} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ color: 'var(--white)', fontSize: '0.88rem', fontWeight: 500 }}>{r.client_name} <span style={{ color: 'var(--sky)' }}>({r.ref_code})</span></div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    ${r.invoice_amount} × {r.commission_rate}% = <strong style={{ color: 'var(--sky)' }}>${Number(r.commission_amount).toFixed(2)}</strong> · {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', letterSpacing: '1px', ...(r.status === 'pending' ? { background: 'rgba(255,193,7,0.1)', color: '#ffc107' } : r.status === 'approved' ? { background: 'rgba(16,219,100,0.1)', color: '#16db64' } : r.status === 'paid' ? { background: 'rgba(16,161,219,0.1)', color: '#10a1db' } : { background: 'rgba(255,77,77,0.1)', color: '#ff4d4d' }) }}>{r.status}</span>
                  {r.status === 'pending' && <><button onClick={() => updateReferralStatus(r.id, 'approved')} style={btnGreen}>Approve</button><button onClick={() => updateReferralStatus(r.id, 'rejected')} style={btnRed}>Reject</button></>}
                  {r.status === 'approved' && <button onClick={() => updateReferralStatus(r.id, 'paid')} style={btnGreen}>Mark Paid</button>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* RESOURCES TAB */}
      {tab === 'resources' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Manage what affiliates see under &quot;Marketing Resources&quot; on their dashboard.</p>
            <button onClick={addResource} className="btn-primary">+ Add Resource</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {resources.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>No resources yet. Add one to get started.</div>
            ) : resources.map(r => (
              <div key={r.id} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', opacity: r.enabled ? 1 : 0.5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '1.8rem' }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'var(--white)', fontSize: '0.92rem', fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '2px' }}>Slug: <code style={{ color: 'var(--sky)' }}>{r.slug}</code></div>
                    {r.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{r.description}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => toggleResource(r.id, r.enabled)} style={r.enabled ? statusActive : statusSuspended}>{r.enabled ? 'Enabled' : 'Disabled'}</button>
                  <button onClick={() => setEditingResource(r)} style={btnPrimary}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// =====================================================
// RESOURCE EDITOR (opens when clicking "Edit" on a resource)
// =====================================================
function ResourceEditor({ resource, onClose, onDelete }: { resource: Resource; onClose: () => void; onDelete: () => void }) {
  const [meta, setMeta] = useState(resource)
  const [items, setItems] = useState<ResourceItem[]>([])
  const [uploading, setUploading] = useState(false)

  const loadItems = useCallback(async () => {
    const { data } = await supabase.from('affiliate_resource_items').select('*').eq('resource_id', resource.id).order('sort_order')
    if (data) setItems(data)
  }, [resource.id])

  useEffect(() => { loadItems() }, [loadItems])

  const saveMetadata = async () => {
    await supabase.from('affiliate_resources').update({
      title: meta.title, description: meta.description, icon: meta.icon, cta_text: meta.cta_text, slug: meta.slug,
    }).eq('id', resource.id)
    alert('Saved!')
  }

  const addTextBlock = async () => {
    await supabase.from('affiliate_resource_items').insert({
      resource_id: resource.id, type: 'text', title: 'New Text Block', content: 'Write your content here...', sort_order: items.length,
    })
    loadItems()
  }

  const addLink = async () => {
    const title = prompt('Link title:')
    if (!title) return
    const url = prompt('URL:')
    if (!url) return
    await supabase.from('affiliate_resource_items').insert({
      resource_id: resource.id, type: 'link', title, url, sort_order: items.length,
    })
    loadItems()
  }

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${resource.slug}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('affiliate-resources').upload(path, file)
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('affiliate-resources').getPublicUrl(path)
    const sizeKB = file.size / 1024
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB.toFixed(0)} KB`
    await supabase.from('affiliate_resource_items').insert({
      resource_id: resource.id, type: 'file', title: file.name, url: publicUrl, file_size: sizeStr, sort_order: items.length,
    })
    setUploading(false)
    loadItems()
    e.target.value = ''
  }

  const updateItem = async (id: string, updates: Partial<ResourceItem>) => {
    await supabase.from('affiliate_resource_items').update(updates).eq('id', id)
    loadItems()
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this content block?')) return
    const item = items.find(i => i.id === id)
    if (item?.type === 'file' && item.url) {
      const path = item.url.split('/affiliate-resources/')[1]
      if (path) await supabase.storage.from('affiliate-resources').remove([path])
    }
    await supabase.from('affiliate_resource_items').delete().eq('id', id)
    loadItems()
  }

  const moveItem = async (id: string, direction: -1 | 1) => {
    const idx = items.findIndex(i => i.id === id)
    const swapIdx = idx + direction
    if (swapIdx < 0 || swapIdx >= items.length) return
    await supabase.from('affiliate_resource_items').update({ sort_order: items[swapIdx].sort_order }).eq('id', items[idx].id)
    await supabase.from('affiliate_resource_items').update({ sort_order: items[idx].sort_order }).eq('id', items[swapIdx].id)
    loadItems()
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--sky)', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '20px' }}>← Back to Resources</button>

      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.4rem', color: 'var(--white)', marginBottom: '20px' }}>Editing: {meta.title}</h2>

      {/* Metadata section */}
      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '0.85rem', color: 'var(--white)', marginBottom: '14px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '10px', marginBottom: '10px' }}>
          <input placeholder="Icon" value={meta.icon} onChange={e => setMeta({ ...meta, icon: e.target.value })} style={{ ...inputStyle, textAlign: 'center', fontSize: '1.5rem' }} />
          <input placeholder="Title" value={meta.title} onChange={e => setMeta({ ...meta, title: e.target.value })} style={inputStyle} />
        </div>
        <input placeholder="Slug (URL path)" value={meta.slug} onChange={e => setMeta({ ...meta, slug: e.target.value })} style={{ ...inputStyle, marginBottom: '10px' }} />
        <textarea placeholder="Description (shown on tile)" value={meta.description || ''} onChange={e => setMeta({ ...meta, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: 'vertical', marginBottom: '10px' }} />
        <input placeholder="CTA text (e.g. View Templates)" value={meta.cta_text || ''} onChange={e => setMeta({ ...meta, cta_text: e.target.value })} style={{ ...inputStyle, marginBottom: '14px' }} />
        <button onClick={saveMetadata} className="btn-primary">Save Details</button>
      </div>

      {/* Content items */}
      <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h3 style={{ fontSize: '0.85rem', color: 'var(--white)', margin: 0, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Content Blocks</h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={addTextBlock} style={btnPrimary}>+ Text</button>
            <label style={{ ...btnPrimary, cursor: uploading ? 'wait' : 'pointer', display: 'inline-block' }}>
              {uploading ? 'Uploading...' : '+ File'}
              <input type="file" onChange={uploadFile} disabled={uploading} style={{ display: 'none' }} />
            </label>
            <button onClick={addLink} style={btnPrimary}>+ Link</button>
          </div>
        </div>

        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '30px 0', fontSize: '0.85rem' }}>No content yet. Add a text block, file, or link.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {items.map((item, idx) => (
              <div key={item.id} style={{ background: 'rgba(249,253,254,0.02)', border: '1px solid var(--glass-border)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '4px', background: item.type === 'text' ? 'rgba(16,161,219,0.1)' : item.type === 'file' ? 'rgba(16,219,100,0.1)' : 'rgba(106,70,217,0.1)', color: item.type === 'text' ? 'var(--sky)' : item.type === 'file' ? '#16db64' : 'var(--purple)' }}>{item.type}</span>
                    <input value={item.title || ''} onChange={e => updateItem(item.id, { title: e.target.value })} placeholder="Title..." style={{ ...inputStyle, padding: '6px 10px', fontSize: '0.85rem', fontWeight: 600 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => moveItem(item.id, -1)} disabled={idx === 0} style={{ ...btnSmall, opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => moveItem(item.id, 1)} disabled={idx === items.length - 1} style={{ ...btnSmall, opacity: idx === items.length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => deleteItem(item.id)} style={btnDelete}>🗑</button>
                  </div>
                </div>
                {item.type === 'text' && (
                  <textarea value={item.content || ''} onChange={e => updateItem(item.id, { content: e.target.value })} rows={4} placeholder="Content..." style={{ ...inputStyle, resize: 'vertical' }} />
                )}
                {item.type === 'file' && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                    📎 <a href={item.url} target="_blank" rel="noopener" style={{ color: 'var(--sky)' }}>{item.url}</a>
                    {item.file_size && <span style={{ marginLeft: '10px', color: 'var(--text-dim)' }}>({item.file_size})</span>}
                  </div>
                )}
                {item.type === 'link' && (
                  <input value={item.url || ''} onChange={e => updateItem(item.id, { url: e.target.value })} placeholder="https://..." style={inputStyle} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div style={{ background: 'rgba(255,77,77,0.03)', border: '1px solid rgba(255,77,77,0.15)', borderRadius: '14px', padding: '20px' }}>
        <h3 style={{ fontSize: '0.8rem', color: '#ff4d4d', margin: '0 0 8px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase' }}>Danger Zone</h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Permanently delete this resource and all its content. Cannot be undone.</p>
        <button onClick={onDelete} style={{ background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>Delete Resource</button>
      </div>
    </div>
  )
}

// === Shared styles ===
const inputStyle: React.CSSProperties = { background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--white)', fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none', width: '100%' }
const btnPrimary: React.CSSProperties = { background: 'var(--sky)', color: 'var(--dark)', border: 'none', padding: '7px 14px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }
const btnGreen: React.CSSProperties = { background: 'rgba(16,219,100,0.1)', color: '#16db64', border: '1px solid rgba(16,219,100,0.3)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }
const btnRed: React.CSSProperties = { background: 'rgba(255,77,77,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }
const btnDelete: React.CSSProperties = { background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--glass-border)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }
const btnSmall: React.CSSProperties = { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }
const statusActive: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', letterSpacing: '1px', background: 'rgba(16,219,100,0.1)', color: '#16db64', border: 'none' }
const statusSuspended: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', letterSpacing: '1px', background: 'rgba(255,193,7,0.1)', color: '#ffc107', border: 'none' }
const statusRejected: React.CSSProperties = { fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', letterSpacing: '1px', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d' }
