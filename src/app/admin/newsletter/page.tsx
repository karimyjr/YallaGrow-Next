'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/ui/Toast'

interface Subscriber {
  id: string
  email: string
  source: string
  confirmed: boolean
  subscribed_at: string
}

export default function AdminNewsletterPage() {
  const { showToast } = useToast()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [search, setSearch] = useState('')

  const load = useCallback(async () => {
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false })
    if (data) setSubscribers(data)
  }, [])

  useEffect(() => { load() }, [load])

  const del = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    showToast('Subscriber removed', 'info')
    load()
  }

  const exportCSV = () => {
    const csv = ['Email,Source,Confirmed,Subscribed At']
    filtered.forEach(s => {
      csv.push(`${s.email},${s.source},${s.confirmed ? 'yes' : 'no'},${s.subscribed_at}`)
    })
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = subscribers.filter(s =>
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.source?.toLowerCase().includes(search.toLowerCase())
  )

  const bySource = subscribers.reduce((acc, s) => {
    acc[s.source] = (acc[s.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)', marginBottom: '4px' }}>📬 Newsletter Subscribers</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{subscribers.length} total subscribers</p>
        </div>
        <button onClick={exportCSV} className="btn-primary">📥 Export CSV</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>Total</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--white)' }}>{subscribers.length}</div>
        </div>
        {Object.entries(bySource).map(([src, count]) => (
          <div key={src} style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '6px' }}>{src}</div>
            <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.6rem', color: 'var(--sky)' }}>{count}</div>
          </div>
        ))}
      </div>

      <input
        placeholder="🔍 Search by email or source..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          background: 'rgba(249,253,254,0.03)', border: '1px solid var(--glass-border)',
          borderRadius: '10px', padding: '11px 16px', color: 'var(--white)',
          width: '100%', maxWidth: '400px', marginBottom: '20px',
          fontFamily: 'Inter,sans-serif', fontSize: '0.85rem', outline: 'none',
        }}
      />

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
          {subscribers.length === 0 ? 'No subscribers yet.' : 'No matches found.'}
        </div>
      ) : (
        <div style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Email', 'Source', 'Subscribed', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '13px 20px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-dim)', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(249,253,254,0.03)' }}>
                    <td style={{ padding: '14px 20px', fontSize: '0.85rem', color: 'var(--white)' }}>{s.email}</td>
                    <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'var(--sky)', textTransform: 'capitalize' }}>{s.source}</td>
                    <td style={{ padding: '14px 20px', fontSize: '0.78rem', color: 'rgba(249,253,254,0.6)' }}>{new Date(s.subscribed_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <button onClick={() => del(s.id)} style={{ background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--glass-border)', padding: '5px 10px', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
