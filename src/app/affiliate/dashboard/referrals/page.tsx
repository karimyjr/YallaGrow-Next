'use client'
// Full referrals table — client-side filter + search.
// Data lives in AffiliateContext, fetched once by the dashboard layout.

import { useMemo, useState } from 'react'
import { useAffiliate } from '@/components/affiliate/AffiliateContext'
import { PageHeader, StatusPill, pillButton } from '@/components/affiliate/AffiliateUI'

type StatusFilter = 'all' | 'pending' | 'approved' | 'paid'

export default function AffiliateReferralsPage() {
  const { referrals, refresh } = useAffiliate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return referrals
      .filter(r => status === 'all' || r.status === status)
      .filter(r => !q || r.client_name.toLowerCase().includes(q) || (r.client_email || '').toLowerCase().includes(q))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [referrals, query, status])

  return (
    <>
      <PageHeader
        eyebrow="Referrals"
        title="All referrals"
        subtitle={`${filtered.length} of ${referrals.length} shown`}
        right={<button onClick={refresh} style={pillButton}>Refresh</button>}
      />

      {/* Filters row */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="search"
          placeholder="Search name or email…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1, minWidth: '220px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            padding: '9px 14px',
            color: 'var(--white)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.82rem',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: '4px', padding: '3px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
          {(['all', 'pending', 'approved', 'paid'] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              style={{
                padding: '6px 11px',
                borderRadius: '7px',
                fontSize: '0.72rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                background: status === s
                  ? 'linear-gradient(180deg, rgba(16,161,219,0.2), rgba(16,161,219,0.08))'
                  : 'transparent',
                border: status === s ? '1px solid rgba(16,161,219,0.3)' : '1px solid transparent',
                color: status === s ? 'var(--white)' : 'var(--text-muted)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          padding: '48px 20px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: '14px',
          color: 'var(--text-dim)',
          fontSize: '0.86rem',
        }}>
          {referrals.length === 0 ? 'No referrals yet. Share your link to start earning.' : 'No referrals match the current filter.'}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          overflow: 'hidden',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Client', 'Invoice', 'Rate', 'Commission', 'Status', 'Date'].map(h => (
                    <th key={h} style={{
                      padding: '14px 18px', fontSize: '0.6rem', fontWeight: 700,
                      letterSpacing: '1.8px', textTransform: 'uppercase',
                      color: 'var(--text-dim)', textAlign: 'left',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.2)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                    <td style={{ padding: '14px 18px', fontSize: '0.84rem', color: 'var(--white)', fontWeight: 500 }}>{r.client_name}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>${Number(r.invoice_amount).toFixed(2)}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.commission_rate}%</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', fontWeight: 700, color: 'var(--sky)' }}>${Number(r.commission_amount).toFixed(2)}</td>
                    <td style={{ padding: '14px 18px' }}><StatusPill status={r.status} /></td>
                    <td style={{ padding: '14px 18px', fontSize: '0.74rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
