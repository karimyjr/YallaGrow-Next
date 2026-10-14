'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'
import { Icon } from '@/components/ui/Icons'

interface PackageSubmission {
  id: string
  name: string
  email: string
  whatsapp: string
  static_posts: number
  carousels: number
  reels: number
  marketing_type: string
  meta_budget: number
  tiktok_budget: number
  website_tier: string
  website_budget: number
  consultancy_url: string
  addons: string[]
  estimated_monthly: number
  status: string
  notes: string
  created_at: string
}

interface JobApplication {
  id: string
  name: string
  email: string
  phone: string
  role: string
  portfolio: string
  linkedin: string
  message: string
  status: string
  created_at: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
}

// Inline icon helper for list items
function Line({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
      <Icon name={icon as any} size={14} color="var(--text-dim)" />
      <span>{children}</span>
    </div>
  )
}

export default function AdminSubmissionsPage() {
  const { showToast } = useToast()
  const [tab, setTab] = useState<'packages' | 'jobs' | 'contacts'>('packages')
  const [packages, setPackages] = useState<PackageSubmission[]>([])
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [p, j, c] = await Promise.all([
      supabase.from('package_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('job_applications').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
    ])
    if (p.data) setPackages(p.data)
    if (j.data) setJobs(j.data)
    if (c.data) setContacts(c.data)
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (table: string, id: string, status: string) => {
    await supabase.from(table).update({ status }).eq('id', id)
    showToast('Status updated', 'success')
    load()
  }

  const del = async (table: string, id: string, name: string) => {
    if (!confirm(`Delete submission from ${name}?`)) return
    await supabase.from(table).delete().eq('id', id)
    showToast('Submission deleted', 'info')
    load()
  }

  const counts = {
    packages: packages.filter(p => p.status === 'new').length,
    jobs: jobs.filter(j => j.status === 'new').length,
    contacts: contacts.filter(c => c.status === 'new').length,
  }

  const filterFn = (obj: PackageSubmission | JobApplication | ContactSubmission) => {
    const q = search.toLowerCase()
    return obj.name?.toLowerCase().includes(q) || obj.email?.toLowerCase().includes(q)
  }

  const statusColor: Record<string, string> = {
    new: '#10a1db', contacted: '#a78bfa', reviewing: '#a78bfa',
    closed: '#16db64', won: '#16db64', hired: '#16db64', replied: '#16db64',
    lost: '#ff4d4d', rejected: '#ff4d4d', interview: '#ffc107',
  }
  const statusBg: Record<string, string> = {
    new: 'rgba(16,161,219,0.1)', contacted: 'rgba(167,139,250,0.1)', reviewing: 'rgba(167,139,250,0.1)',
    closed: 'rgba(16,219,100,0.1)', won: 'rgba(16,219,100,0.1)', hired: 'rgba(16,219,100,0.1)', replied: 'rgba(16,219,100,0.1)',
    lost: 'rgba(255,77,77,0.1)', rejected: 'rgba(255,77,77,0.1)', interview: 'rgba(255,193,7,0.1)',
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Icon name="clipboard" size={22} />
          Form Submissions
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>All incoming leads and applications.</p>
      </div>

      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--glass-border)', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'packages', icon: 'package', label: 'Package Requests', count: packages.length, newCount: counts.packages },
          { id: 'jobs', icon: 'briefcase', label: 'Job Applications', count: jobs.length, newCount: counts.jobs },
          { id: 'contacts', icon: 'chat', label: 'Contact Messages', count: contacts.length, newCount: counts.contacts },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as 'packages' | 'jobs' | 'contacts')} style={{
            background: tab === t.id ? 'rgba(16,161,219,0.08)' : 'transparent',
            border: 'none',
            borderBottom: tab === t.id ? '2px solid var(--sky)' : '2px solid transparent',
            padding: '12px 18px', cursor: 'pointer',
            color: tab === t.id ? 'var(--sky)' : 'var(--text-muted)',
            fontSize: '0.85rem', fontWeight: 600,
            marginBottom: '-1px', position: 'relative',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}>
            <Icon name={t.icon as any} size={14} />
            {t.label} <span style={{ opacity: 0.6, fontSize: '0.72rem' }}>({t.count})</span>
            {t.newCount > 0 && (
              <span style={{ marginLeft: '6px', background: '#ff4d4d', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '100px' }}>{t.newCount} new</span>
            )}
          </button>
        ))}
      </div>

      <input
        placeholder="Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)',
          borderRadius: '10px', padding: '11px 16px', color: 'var(--white)',
          width: '100%', maxWidth: '400px', marginBottom: '20px',
          fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none',
        }}
      />

      {/* PACKAGE SUBMISSIONS */}
      {tab === 'packages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {packages.filter(filterFn).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>No package requests yet.</div>
          ) : packages.filter(filterFn).map(p => (
            <div key={p.id} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <strong style={{ color: 'var(--white)', fontSize: '0.92rem' }}>{p.name}</strong>
                    <span style={{ color: 'var(--sky)', fontSize: '0.85rem', fontWeight: 700 }}>${p.estimated_monthly}/mo</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {p.email} · {new Date(p.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', background: statusBg[p.status] || 'transparent', color: statusColor[p.status] || 'var(--text-dim)', border: `1px solid ${statusColor[p.status]}40` }}>{p.status}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{expanded === p.id ? '−' : '+'}</span>
                </div>
              </div>

              {expanded === p.id && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Contact</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(249,253,254,0.75)', lineHeight: 1.8 }}>
                      <Line icon="mail"><a href={`mailto:${p.email}`} style={{ color: 'var(--sky)' }}>{p.email}</a></Line>
                      {p.whatsapp && <Line icon="chat"><a href={`https://wa.me/${p.whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener" style={{ color: 'var(--sky)' }}>{p.whatsapp}</a></Line>}
                    </div>
                  </div>

                  <div style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Package Details</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(249,253,254,0.75)', lineHeight: 1.8 }}>
                      {p.static_posts > 0 && <Line icon="camera">Static posts: <strong>{p.static_posts}/mo</strong></Line>}
                      {p.carousels > 0 && <Line icon="palette">Carousels: <strong>{p.carousels}/mo</strong></Line>}
                      {p.reels > 0 && <Line icon="film">Reels: <strong>{p.reels}/mo</strong></Line>}
                      {p.marketing_type && <Line icon="chart-up">Marketing: <strong>{p.marketing_type}</strong></Line>}
                      {p.meta_budget > 0 && <Line icon="dollar">Meta ad budget: <strong>${p.meta_budget}/mo</strong></Line>}
                      {p.tiktok_budget > 0 && <Line icon="music">TikTok ad budget: <strong>${p.tiktok_budget}/mo</strong></Line>}
                      {p.website_tier && p.website_tier !== 'none' && <Line icon="globe">Website: <strong>{p.website_tier}</strong>{p.website_budget > 0 && ` ($${p.website_budget})`}</Line>}
                      {p.consultancy_url && <Line icon="search">Audit URL: <a href={p.consultancy_url} target="_blank" rel="noopener" style={{ color: 'var(--sky)' }}>{p.consultancy_url}</a></Line>}
                      {p.addons && p.addons.length > 0 && <div style={{ marginTop: '4px' }}>Add-ons: <strong>{p.addons.join(', ')}</strong></div>}
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon name="dollar" size={16} color="var(--sky)" />
                        Total: <strong style={{ color: 'var(--sky)' }}>${p.estimated_monthly}/mo</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '16px 0 0', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['new', 'contacted', 'won', 'lost'].map(s => (
                      <button key={s} onClick={() => updateStatus('package_submissions', p.id, s)} style={{
                        background: p.status === s ? statusBg[s] : 'transparent',
                        color: p.status === s ? statusColor[s] : 'var(--text-muted)',
                        border: `1px solid ${p.status === s ? statusColor[s] : 'var(--glass-border)'}`,
                        padding: '5px 12px', borderRadius: '6px',
                        fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}>{s}</button>
                    ))}
                    <button onClick={() => del('package_submissions', p.id, p.name)} style={{ marginLeft: 'auto', background: 'transparent', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.25)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="trash" size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* JOB APPLICATIONS */}
      {tab === 'jobs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {jobs.filter(filterFn).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>No job applications yet.</div>
          ) : jobs.filter(filterFn).map(j => (
            <div key={j.id} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpanded(expanded === j.id ? null : j.id)}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <strong style={{ color: 'var(--white)', fontSize: '0.92rem' }}>{j.name}</strong>
                    <span style={{ color: 'var(--sky)', fontSize: '0.75rem' }}>applying: {j.role}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {j.email} · {new Date(j.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', background: statusBg[j.status] || 'transparent', color: statusColor[j.status] || 'var(--text-dim)', border: `1px solid ${statusColor[j.status]}40` }}>{j.status}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{expanded === j.id ? '−' : '+'}</span>
                </div>
              </div>

              {expanded === j.id && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '16px 0', fontSize: '0.82rem', color: 'rgba(249,253,254,0.75)', lineHeight: 1.9 }}>
                    <Line icon="mail"><a href={`mailto:${j.email}`} style={{ color: 'var(--sky)' }}>{j.email}</a></Line>
                    {j.phone && <Line icon="chat"><a href={`https://wa.me/${j.phone.replace(/[^\d]/g, '')}`} target="_blank" rel="noopener" style={{ color: 'var(--sky)' }}>{j.phone}</a></Line>}
                    {j.portfolio && <Line icon="folder">Portfolio: <a href={j.portfolio} target="_blank" rel="noopener" style={{ color: 'var(--sky)', wordBreak: 'break-all' }}>{j.portfolio}</a></Line>}
                    {j.linkedin && <Line icon="link">LinkedIn: <a href={j.linkedin} target="_blank" rel="noopener" style={{ color: 'var(--sky)', wordBreak: 'break-all' }}>{j.linkedin}</a></Line>}
                  </div>

                  {j.message && (
                    <div style={{ padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Message</div>
                      <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px 14px', fontSize: '0.82rem', color: 'rgba(249,253,254,0.85)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{j.message}</div>
                    </div>
                  )}

                  <div style={{ padding: '16px 0 0', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['new', 'reviewing', 'interview', 'hired', 'rejected'].map(s => (
                      <button key={s} onClick={() => updateStatus('job_applications', j.id, s)} style={{
                        background: j.status === s ? statusBg[s] : 'transparent',
                        color: j.status === s ? statusColor[s] : 'var(--text-muted)',
                        border: `1px solid ${j.status === s ? statusColor[s] : 'var(--glass-border)'}`,
                        padding: '5px 12px', borderRadius: '6px',
                        fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}>{s}</button>
                    ))}
                    <button onClick={() => del('job_applications', j.id, j.name)} style={{ marginLeft: 'auto', background: 'transparent', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.25)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="trash" size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CONTACT MESSAGES */}
      {tab === 'contacts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {contacts.filter(filterFn).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>No contact messages yet.</div>
          ) : contacts.filter(filterFn).map(c => (
            <div key={c.id} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', cursor: 'pointer' }} onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <strong style={{ color: 'var(--white)', fontSize: '0.92rem' }}>{c.name}</strong>
                    {c.subject && <span style={{ color: 'var(--sky)', fontSize: '0.75rem' }}>{c.subject}</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {c.email} · {new Date(c.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', padding: '3px 10px', borderRadius: '100px', background: statusBg[c.status] || 'transparent', color: statusColor[c.status] || 'var(--text-dim)', border: `1px solid ${statusColor[c.status]}40` }}>{c.status}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>{expanded === c.id ? '−' : '+'}</span>
                </div>
              </div>

              {expanded === c.id && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '16px 0' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '14px 16px', fontSize: '0.88rem', color: 'rgba(249,253,254,0.85)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{c.message}</div>
                  </div>

                  <div style={{ padding: '16px 0 0', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <a href={`mailto:${c.email}?subject=Re: ${c.subject || 'Your message'}`} style={{ background: 'var(--sky)', color: 'var(--dark)', padding: '5px 12px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="mail" size={13} />
                      Reply
                    </a>
                    {['new', 'replied', 'closed'].map(s => (
                      <button key={s} onClick={() => updateStatus('contact_submissions', c.id, s)} style={{
                        background: c.status === s ? statusBg[s] : 'transparent',
                        color: c.status === s ? statusColor[s] : 'var(--text-muted)',
                        border: `1px solid ${c.status === s ? statusColor[s] : 'var(--glass-border)'}`,
                        padding: '5px 12px', borderRadius: '6px',
                        fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}>{s}</button>
                    ))}
                    <button onClick={() => del('contact_submissions', c.id, c.name)} style={{ marginLeft: 'auto', background: 'transparent', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.25)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Icon name="trash" size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
