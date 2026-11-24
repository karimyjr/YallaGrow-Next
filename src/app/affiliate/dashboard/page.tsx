'use client'
// Affiliate Overview — the dashboard landing page.
// Shows KPI tiles, the referral-link card, and a 5-row teaser of the
// most recent referrals. The full table lives on /referrals.

import Link from 'next/link'
import { useAffiliate, statusColor } from '@/components/affiliate/AffiliateContext'
import { Kpi, CodeTile, PageHeader, SectionTitle, StatusPill, pillButton } from '@/components/affiliate/AffiliateUI'

export default function AffiliateOverviewPage() {
  const { affiliate, referrals, refresh } = useAffiliate()

  const totalPending = referrals.filter(r => r.status === 'pending').reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const totalPaid    = referrals.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const totalEarned  = totalPending + totalPaid

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yallagrow.net'
  const referralLink = `${siteUrl}/?ref=${affiliate.ref_code}`
  const firstName = affiliate.full_name.split(' ')[0]

  // Teaser — most recent 5 referrals. Full list on /affiliate/dashboard/referrals.
  const recent = [...referrals]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome, ${firstName}`}
        subtitle={`${referrals.length} referral${referrals.length === 1 ? '' : 's'} logged · Status: `}
        right={<button onClick={refresh} style={pillButton}>Refresh</button>}
      />
      {/* Status inline color — kept outside PageHeader so the color stays live */}
      <div style={{ marginTop: '-18px', marginBottom: '26px', paddingLeft: '2px', fontSize: '0.84rem', color: 'var(--text-dim)' }}>
        <span style={{ color: statusColor(affiliate.status), fontWeight: 600, textTransform: 'capitalize' }}>{affiliate.status}</span>
      </div>

      {/* KPI tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <Kpi label="Total earned"    value={`$${totalEarned.toFixed(2)}`}  sub={`${referrals.length} referral${referrals.length === 1 ? '' : 's'}`} color="#10a1db" />
        <Kpi label="Pending payout"  value={`$${totalPending.toFixed(2)}`} sub={`${referrals.filter(r => r.status === 'pending').length} pending`}   color="#f59e0b" />
        <Kpi label="Already paid"    value={`$${totalPaid.toFixed(2)}`}    sub={`${referrals.filter(r => r.status === 'paid').length} paid`}         color="#22c55e" />
        <CodeTile code={affiliate.ref_code} />
      </div>

      {/* Referral link */}
      <div style={{
        padding: '18px 20px',
        background: 'linear-gradient(135deg, rgba(16,161,219,0.14), rgba(141,92,255,0.06) 60%, rgba(16,161,219,0.04))',
        border: '1px solid rgba(16,161,219,0.28)',
        borderRadius: '14px',
        marginBottom: '28px',
        boxShadow: '0 10px 30px rgba(1,32,76,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}>
        <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.8px', color: 'var(--sky)', marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--sky)', boxShadow: '0 0 8px var(--sky)' }} />
          Your referral link
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            readOnly
            value={referralLink}
            onClick={e => (e.target as HTMLInputElement).select()}
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '11px 14px',
              color: 'var(--white)',
              flex: 1,
              minWidth: '240px',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
          <button
            type="button"
            className="btn-primary"
            onClick={() => { navigator.clipboard.writeText(referralLink).catch(() => {}) }}
            style={{ fontSize: '0.8rem', padding: '10px 18px' }}
          >
            Copy link
          </button>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '10px 0 0' }}>
          Share this link with businesses. When they buy a package, the referral is credited to your code.
        </p>
      </div>

      {/* Recent referrals teaser */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px', gap: '12px', flexWrap: 'wrap' }}>
        <SectionTitle title="Recent referrals" subtitle={`Latest ${Math.min(recent.length, 5)} of ${referrals.length}`} />
        <Link href="/affiliate/dashboard/referrals" style={{ fontSize: '0.78rem', color: 'var(--sky)', textDecoration: 'none', fontWeight: 600 }}>
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: '14px',
          color: 'var(--text-dim)',
          fontSize: '0.86rem',
        }}>
          No referrals yet. Share your link to start earning.
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
                  {['Client', 'Commission', 'Status', 'Date'].map(h => (
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
                {recent.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < recent.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                    <td style={{ padding: '14px 18px', fontSize: '0.84rem', color: 'var(--white)', fontWeight: 500 }}>{r.client_name}</td>
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
