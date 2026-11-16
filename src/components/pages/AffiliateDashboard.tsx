'use client'
// Affiliate self-service dashboard.
// - Not logged in → login form (email + ref_code)
// - Logged in → KPIs (pending $ / paid $ / clicks referral link) +
//   referral table from /api/affiliate/me.
// Session kept in sessionStorage so it survives tab navigation but
// not a browser restart. No Supabase writes from this page.

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Affiliate {
  id: string
  full_name: string
  email: string
  country?: string
  ref_code: string
  status: string
  promotion_plan?: string
}

interface Referral {
  id: string
  client_name: string
  client_email: string | null
  invoice_amount: number
  commission_rate: number
  commission_amount: number
  status: string
  created_at: string
}

const SESSION_KEY = 'yg_affiliate_session'
const SITE_URL = (typeof window !== 'undefined' ? window.location.origin : 'https://yallagrow.net')

export default function AffiliateDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])

  // Login form state
  const [email, setEmail] = useState('')
  const [refCode, setRefCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchMe = useCallback(async (emailArg: string, codeArg: string) => {
    const r = await fetch('/api/affiliate/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailArg, ref_code: codeArg }),
    })
    const data = await r.json()
    if (!r.ok) throw new Error(data.error || 'Could not load dashboard')
    return data as { affiliate: Affiliate; referrals: Referral[] }
  }, [])

  // On mount, try to restore session
  useEffect(() => {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) { setLoading(false); return }
    try {
      const saved = JSON.parse(raw) as { email: string; ref_code: string }
      fetchMe(saved.email, saved.ref_code)
        .then(data => { setAffiliate(data.affiliate); setReferrals(data.referrals) })
        .catch(() => sessionStorage.removeItem(SESSION_KEY))
        .finally(() => setLoading(false))
    } catch {
      sessionStorage.removeItem(SESSION_KEY)
      setLoading(false)
    }
  }, [fetchMe])

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const data = await fetchMe(email, refCode)
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email, ref_code: refCode.toUpperCase() }))
      setAffiliate(data.affiliate)
      setReferrals(data.referrals)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const signOut = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setAffiliate(null)
    setReferrals([])
    setEmail(''); setRefCode('')
  }

  const refresh = async () => {
    if (!affiliate) return
    try {
      const data = await fetchMe(affiliate.email, affiliate.ref_code)
      setReferrals(data.referrals)
    } catch { /* keep current data */ }
  }

  if (loading) {
    return (
      <Shell>
        <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>Loading dashboard…</div>
      </Shell>
    )
  }

  // ─────────── LOGIN FORM ───────────
  if (!affiliate) {
    return (
      <Shell>
        <div style={{ maxWidth: '420px', margin: '80px auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              Affiliate Dashboard
            </h1>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-dim)', margin: 0 }}>
              Sign in with the email you applied with and your referral code.
            </p>
          </div>

          <form onSubmit={signIn} style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />

            <label style={{ ...labelStyle, marginTop: '14px' }}>Referral code</label>
            <input
              required
              value={refCode}
              onChange={e => setRefCode(e.target.value.toUpperCase())}
              placeholder="e.g. YG12AB"
              style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: '1px' }}
            />

            {error && (
              <div style={{
                marginTop: '14px',
                padding: '10px 12px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                color: '#ff8585',
                fontSize: '0.78rem',
              }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{ marginTop: '18px', width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '18px' }}>
            Not an affiliate yet? <Link href="/affiliate" style={{ color: 'var(--sky)', textDecoration: 'none' }}>Apply to join →</Link>
          </p>
        </div>
      </Shell>
    )
  }

  // ─────────── DASHBOARD ───────────
  const totalPending = referrals.filter(r => r.status === 'pending').reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const totalPaid = referrals.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.commission_amount || 0), 0)
  const totalEarned = totalPending + totalPaid
  const referralLink = `${SITE_URL}/?ref=${affiliate.ref_code}`

  return (
    <Shell>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap', marginBottom: '26px' }}>
          <div>
            <div style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--sky)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>Dashboard</div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.7rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.5px', margin: 0 }}>
              Welcome, {affiliate.full_name.split(' ')[0]}
            </h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>
              {referrals.length} referral{referrals.length === 1 ? '' : 's'} logged · Status: <span style={{ color: statusColor(affiliate.status) }}>{affiliate.status}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={refresh} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '7px 14px' }}>Refresh</button>
            <button onClick={signOut} className="btn-secondary" style={{ fontSize: '0.74rem', padding: '7px 14px' }}>Sign out</button>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px', marginBottom: '22px' }}>
          <Kpi label="Total earned" value={`$${totalEarned.toFixed(2)}`} sub={`${referrals.length} referrals`} color="#10a1db" />
          <Kpi label="Pending payout" value={`$${totalPending.toFixed(2)}`} sub={`${referrals.filter(r => r.status === 'pending').length} pending`} color="#f59e0b" />
          <Kpi label="Already paid" value={`$${totalPaid.toFixed(2)}`} sub={`${referrals.filter(r => r.status === 'paid').length} paid`} color="#22c55e" />
          <Kpi label="Your code" value={affiliate.ref_code} sub="Share to earn" color="#8d5cff" />
        </div>

        {/* Share link */}
        <div style={{
          padding: '16px 18px',
          background: 'linear-gradient(180deg, rgba(16,161,219,0.08), rgba(16,161,219,0.02))',
          border: '1px solid rgba(16,161,219,0.2)',
          borderRadius: '12px',
          marginBottom: '26px',
        }}>
          <div style={{ fontSize: '0.64rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--sky)', marginBottom: '8px' }}>Your referral link</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <input
              readOnly
              value={referralLink}
              onClick={e => (e.target as HTMLInputElement).select()}
              style={{ ...inputStyle, flex: 1, minWidth: '240px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem' }}
            />
            <button
              className="btn-primary"
              onClick={() => {
                navigator.clipboard.writeText(referralLink).catch(() => {})
              }}
              style={{ fontSize: '0.78rem', padding: '9px 16px' }}
            >
              Copy link
            </button>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', margin: '10px 0 0' }}>
            Share this link with businesses. When they buy a package, the referral is credited to your code and appears below.
          </p>
        </div>

        {/* Referrals */}
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.3px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ display: 'inline-block', width: '3px', height: '14px', background: 'var(--sky)', borderRadius: '2px' }} />
            Your referrals
          </h2>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', margin: '4px 0 0' }}>Every referral logged against your code. Statuses updated by YallaGrow admin.</p>
        </div>

        {referrals.length === 0 ? (
          <div style={{
            padding: '36px 20px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            border: '1px dashed rgba(255,255,255,0.1)',
            borderRadius: '12px',
            color: 'var(--text-dim)',
            fontSize: '0.86rem',
          }}>
            No referrals yet. Share your link to start earning.
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Client', 'Invoice', 'Rate', 'Commission', 'Status', 'Date'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                        color: 'var(--text-dim)',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '14px 16px', fontSize: '0.82rem', color: 'var(--white)' }}>{r.client_name}</td>
                      <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>${Number(r.invoice_amount).toFixed(2)}</td>
                      <td style={{ padding: '14px 16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.commission_rate}%</td>
                      <td style={{ padding: '14px 16px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--sky)' }}>${Number(r.commission_amount).toFixed(2)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '0.64rem',
                          fontWeight: 700,
                          color: statusColor(r.status),
                          background: `${statusColor(r.status)}18`,
                          border: `1px solid ${statusColor(r.status)}44`,
                          padding: '3px 8px',
                          borderRadius: '5px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}>{r.status}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '0.74rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                        {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p style={{ marginTop: '20px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
          Payout questions? Message us on WhatsApp at <a href="https://wa.me/96176302159" style={{ color: 'var(--sky)', textDecoration: 'none' }}>+961 76 302 159</a>.
        </p>
      </div>
    </Shell>
  )
}

/* ─────────── Pieces ─────────── */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark2)' }}>
      {/* Simple topbar */}
      <div style={{ padding: '14px 4%', background: 'rgba(6,12,20,0.95)', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', color: 'var(--white)', textDecoration: 'none' }}>
          Yalla<em style={{ color: 'var(--sky)', fontStyle: 'normal' }}>Grow</em>
        </Link>
        <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--sky)', background: 'rgba(16,161,219,0.1)', padding: '3px 10px', borderRadius: '6px' }}>Affiliate</span>
      </div>
      {children}
    </div>
  )
}

function Kpi({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      padding: '16px 18px',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      boxShadow: `0 10px 28px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px ${color}33`,
    }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-dim)', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sub}</div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '1px',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(249,253,254,0.03)',
  border: '1px solid var(--glass-border)',
  borderRadius: '10px',
  padding: '11px 14px',
  color: 'var(--white)',
  width: '100%',
  fontFamily: 'Inter,sans-serif',
  fontSize: '0.86rem',
  outline: 'none',
}

function statusColor(s: string): string {
  switch (s) {
    case 'paid': return '#22c55e'
    case 'pending': return '#f59e0b'
    case 'approved': return '#10a1db'
    case 'rejected': return '#ef4444'
    case 'cancelled': return '#ef4444'
    default: return '#9ca3af'
  }
}
