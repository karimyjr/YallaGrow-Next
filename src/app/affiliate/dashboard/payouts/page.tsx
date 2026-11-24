'use client'
// Payouts — summary of pending/paid commissions and payout-request link.
// No separate payouts table exists in Supabase yet, so "paid history" is
// derived from referrals where status='paid'. When a real payouts table
// lands, swap this section for its data.

import { useAffiliate } from '@/components/affiliate/AffiliateContext'
import { Kpi, PageHeader, SectionTitle, StatusPill } from '@/components/affiliate/AffiliateUI'

const MIN_PAYOUT = 25  // USD — adjust once business decides the real minimum

export default function AffiliatePayoutsPage() {
  const { referrals } = useAffiliate()

  const pending = referrals.filter(r => r.status === 'pending' || r.status === 'approved')
  const paid    = referrals.filter(r => r.status === 'paid')

  const pendingAmount = pending.reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const paidAmount    = paid.reduce((s, r) => s + Number(r.commission_amount || 0), 0)

  const canRequest = pendingAmount >= MIN_PAYOUT
  const payoutRequestMessage =
    `Hi Karim, I'd like to request my payout.%0A%0APending: $${pendingAmount.toFixed(2)}%0APaid-to-date: $${paidAmount.toFixed(2)}`
  const whatsappLink = `https://wa.me/96176302159?text=${payoutRequestMessage}`

  return (
    <>
      <PageHeader
        eyebrow="Payouts"
        title="Your payouts"
        subtitle="Monthly payouts via OMT / Whish / PayPal. Minimum $25 pending."
      />

      {/* Summary tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', marginBottom: '26px' }}>
        <Kpi label="Ready to pay out"  value={`$${pendingAmount.toFixed(2)}`} sub={`${pending.length} referral${pending.length === 1 ? '' : 's'}`} color="#f59e0b" />
        <Kpi label="Total paid"        value={`$${paidAmount.toFixed(2)}`}   sub={`${paid.length} payment${paid.length === 1 ? '' : 's'}`}       color="#22c55e" />
        <Kpi label="Minimum"           value={`$${MIN_PAYOUT.toFixed(2)}`}   sub="To request a payout"                                            color="#10a1db" />
      </div>

      {/* Request payout CTA */}
      <div style={{
        padding: '22px',
        background: canRequest
          ? 'linear-gradient(135deg, rgba(34,197,94,0.14), rgba(16,161,219,0.06))'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        border: canRequest ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        marginBottom: '28px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
      }}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '4px' }}>
            {canRequest ? 'You can request a payout now' : `${(MIN_PAYOUT - pendingAmount).toFixed(2)} away from the minimum`}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
            Message Karim on WhatsApp with your preferred method (OMT, Whish Money, or PayPal) and the account details. Payouts land within 3 business days.
          </div>
        </div>
        <a
          href={canRequest ? whatsappLink : undefined}
          target="_blank"
          rel="noopener noreferrer"
          className={canRequest ? 'btn-primary' : ''}
          aria-disabled={!canRequest}
          style={{
            pointerEvents: canRequest ? 'auto' : 'none',
            opacity: canRequest ? 1 : 0.5,
            fontSize: '0.82rem',
            padding: '11px 20px',
            ...(canRequest ? {} : {
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)',
              borderRadius: '10px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }),
          }}
        >
          Request payout →
        </a>
      </div>

      {/* Paid history */}
      <SectionTitle title="Paid history" subtitle={paid.length === 0 ? 'No payouts yet.' : `${paid.length} paid commission${paid.length === 1 ? '' : 's'}`} />

      {paid.length === 0 ? (
        <div style={{
          padding: '36px 20px', textAlign: 'center',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: '14px',
          color: 'var(--text-dim)', fontSize: '0.86rem',
        }}>
          Once a referral is marked paid by YallaGrow admin, it shows up here.
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          overflow: 'hidden',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Client', 'Amount', 'Status', 'Paid on'].map(h => (
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
                {paid.map((r, i) => (
                  <tr key={r.id} style={{ borderBottom: i < paid.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                    <td style={{ padding: '14px 18px', fontSize: '0.84rem', color: 'var(--white)', fontWeight: 500 }}>{r.client_name}</td>
                    <td style={{ padding: '14px 18px', fontSize: '0.86rem', fontWeight: 700, color: '#22c55e' }}>${Number(r.commission_amount).toFixed(2)}</td>
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
